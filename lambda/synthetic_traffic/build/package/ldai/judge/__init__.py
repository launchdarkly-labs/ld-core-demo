"""Judge implementation for AI evaluation."""

import random
from typing import Any, Dict, Optional

import chevron

from ldai import log
from ldai.judge.evaluation_schema_builder import EvaluationSchemaBuilder
from ldai.models import AIJudgeConfig, LDMessage
from ldai.providers.model_runner import ModelRunner
from ldai.providers.types import EvalScore, JudgeResponse, ModelResponse
from ldai.tracker import LDAIConfigTracker


class Judge:
    """
    Judge implementation that handles evaluation functionality and conversation management.

    According to the AIEval spec, judges are AI Configs with mode: "judge" that evaluate
    other AI Configs using structured output.
    """

    def __init__(
        self,
        ai_config: AIJudgeConfig,
        ai_config_tracker: LDAIConfigTracker,
        model_runner: ModelRunner,
    ):
        """
        Initialize the Judge.

        :param ai_config: The judge AI configuration
        :param ai_config_tracker: The tracker for the judge configuration
        :param model_runner: The model runner to use for evaluation
        """
        self._ai_config = ai_config
        self._ai_config_tracker = ai_config_tracker
        self._model_runner = model_runner
        self._evaluation_response_structure = EvaluationSchemaBuilder.build()

    async def evaluate(
        self,
        input_text: str,
        output_text: str,
        sampling_rate: float = 1.0,
    ) -> Optional[JudgeResponse]:
        """
        Evaluates an AI response using the judge's configuration.

        :param input_text: The input prompt or question that was provided to the AI
        :param output_text: The AI-generated response to be evaluated
        :param sampling_rate: Sampling rate (0-1) to determine if evaluation should be processed (defaults to 1)
        :return: Evaluation results or None if not sampled
        """
        try:
            if not self._ai_config.evaluation_metric_key:
                log.warning(
                    'Judge configuration is missing required evaluationMetricKey'
                )
                return None

            if not self._ai_config.messages:
                log.warning('Judge configuration must include messages')
                return None

            if random.random() > sampling_rate:
                log.debug(f'Judge evaluation skipped due to sampling rate: {sampling_rate}')
                return None

            messages = self._construct_evaluation_messages(input_text, output_text)
            assert self._evaluation_response_structure is not None

            response = await self._ai_config_tracker.track_metrics_of_async(
                lambda: self._model_runner.invoke_structured_model(messages, self._evaluation_response_structure),
                lambda result: result.metrics,
            )

            success = response.metrics.success
            evals = self._parse_evaluation_response(response.data)

            if not evals:
                log.warning('Judge evaluation did not return the expected evaluation')
                success = False

            return JudgeResponse(
                judge_config_key=self._ai_config.key,
                evals=evals,
                success=success,
            )
        except Exception as error:
            log.error(f'Judge evaluation failed: {error}')
            return JudgeResponse(
                evals={},
                success=False,
                error=str(error) if isinstance(error, Exception) else 'Unknown error',
            )

    async def evaluate_messages(
        self,
        messages: list[LDMessage],
        response: ModelResponse,
        sampling_ratio: float = 1.0,
    ) -> Optional[JudgeResponse]:
        """
        Evaluates an AI response from chat messages and response.

        :param messages: Array of messages representing the conversation history
        :param response: The AI response to be evaluated
        :param sampling_ratio: Sampling ratio (0-1) to determine if evaluation should be processed (defaults to 1)
        :return: Evaluation results or None if not sampled
        """
        input_text = '\r\n'.join([msg.content for msg in messages]) if messages else ''
        output_text = response.message.content

        return await self.evaluate(input_text, output_text, sampling_ratio)

    def get_ai_config(self) -> AIJudgeConfig:
        """
        Returns the AI Config used by this judge.

        :return: The judge AI configuration
        """
        return self._ai_config

    def get_tracker(self) -> LDAIConfigTracker:
        """
        Returns the tracker associated with this judge.

        :return: The tracker for the judge configuration
        """
        return self._ai_config_tracker

    def get_model_runner(self) -> ModelRunner:
        """
        Returns the model runner used by this judge.

        :return: The model runner
        """
        return self._model_runner

    def _construct_evaluation_messages(self, input_text: str, output_text: str) -> list[LDMessage]:
        """
        Constructs evaluation messages by combining judge's config messages with input/output.

        :param input_text: The input text
        :param output_text: The output text to evaluate
        :return: List of messages for evaluation
        """
        if not self._ai_config.messages:
            return []

        messages: list[LDMessage] = []
        for msg in self._ai_config.messages:
            # Interpolate message content with reserved variables
            content = self._interpolate_message(msg.content, {
                'message_history': input_text,
                'response_to_evaluate': output_text,
            })
            messages.append(LDMessage(role=msg.role, content=content))

        return messages

    def _interpolate_message(self, content: str, variables: Dict[str, str]) -> str:
        """
        Interpolates message content with variables using Mustache templating.

        :param content: The message content template
        :param variables: Variables to interpolate
        :return: Interpolated message content
        """
        # Use chevron (Mustache) for templating, with no escaping
        return chevron.render(content, variables)

    def _parse_evaluation_response(self, data: Dict[str, Any]) -> Dict[str, EvalScore]:
        """
        Parses the structured evaluation response. Expects {"score": n, "reasoning": "..."}.
        """
        results: Dict[str, EvalScore] = {}
        metric_key = self._ai_config.evaluation_metric_key
        if not metric_key:
            log.warning('Evaluation metric key is missing')
            return results

        if not isinstance(data, dict):
            log.warning('Invalid response: missing or invalid evaluation')
            return results

        score = data.get('score')
        reasoning = data.get('reasoning')
        if not isinstance(score, (int, float)) or score < 0 or score > 1:
            log.warning(f'Invalid score: {score}. Score must be a number between 0 and 1 inclusive')
            return results
        if not isinstance(reasoning, str):
            log.warning('Invalid reasoning: must be a string')
            return results

        results[metric_key] = EvalScore(score=float(score), reasoning=reasoning)
        return results
