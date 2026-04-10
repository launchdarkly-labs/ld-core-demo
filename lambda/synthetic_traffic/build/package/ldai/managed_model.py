import asyncio
from typing import Any, Dict, List, Optional

from ldai import log
from ldai.judge import Judge
from ldai.models import AICompletionConfig, LDMessage
from ldai.providers.model_runner import ModelRunner
from ldai.providers.types import JudgeResponse, ModelResponse
from ldai.tracker import LDAIConfigTracker


class ManagedModel:
    """
    LaunchDarkly managed wrapper for AI model invocations.

    Holds a ModelRunner and an LDAIConfigTracker. Handles conversation
    management, judge evaluation dispatch, and tracking automatically.
    Obtain an instance via ``LDAIClient.create_model()``.
    """

    def __init__(
        self,
        ai_config: AICompletionConfig,
        tracker: LDAIConfigTracker,
        model_runner: ModelRunner,
        judges: Optional[Dict[str, Judge]] = None,
    ):
        self._ai_config = ai_config
        self._tracker = tracker
        self._model_runner = model_runner
        self._judges = judges or {}
        self._messages: List[LDMessage] = []

    async def invoke(self, prompt: str) -> ModelResponse:
        """
        Invoke the model with a prompt string.

        Appends the prompt to the conversation history, prepends any
        system messages from the config, delegates to the runner, and
        appends the response to the history.

        :param prompt: The user prompt to send to the model
        :return: ModelResponse containing the model's response and metrics
        """
        user_message = LDMessage(role='user', content=prompt)
        self._messages.append(user_message)

        config_messages = self._ai_config.messages or []
        all_messages = config_messages + self._messages

        response = await self._tracker.track_metrics_of_async(
            lambda: self._model_runner.invoke_model(all_messages),
            lambda result: result.metrics,
        )

        if (
            self._ai_config.judge_configuration
            and self._ai_config.judge_configuration.judges
        ):
            response.evaluations = self._start_judge_evaluations(self._messages, response)

        self._messages.append(response.message)
        return response

    def _start_judge_evaluations(
        self,
        messages: List[LDMessage],
        response: ModelResponse,
    ) -> List[asyncio.Task[Optional[JudgeResponse]]]:
        if not self._ai_config.judge_configuration or not self._ai_config.judge_configuration.judges:
            return []

        async def evaluate_judge(judge_config: Any) -> Optional[JudgeResponse]:
            judge = self._judges.get(judge_config.key)
            if not judge:
                log.warning(f'Judge configuration is not enabled: {judge_config.key}')
                return None
            eval_result = await judge.evaluate_messages(messages, response, judge_config.sampling_rate)
            if eval_result and eval_result.success:
                self._tracker.track_judge_response(eval_result)
            return eval_result

        return [
            asyncio.create_task(evaluate_judge(jc))
            for jc in self._ai_config.judge_configuration.judges
        ]

    def get_messages(self, include_config_messages: bool = False) -> List[LDMessage]:
        """
        Get all messages in the conversation history.

        :param include_config_messages: When True, prepends config messages.
        :return: List of conversation messages.
        """
        if include_config_messages:
            return (self._ai_config.messages or []) + self._messages
        return list(self._messages)

    def append_messages(self, messages: List[LDMessage]) -> None:
        """
        Append messages to the conversation history without invoking the model.

        :param messages: Messages to append.
        """
        self._messages.extend(messages)

    def get_model_runner(self) -> ModelRunner:
        """
        Return the underlying ModelRunner for advanced use.

        :return: The ModelRunner instance.
        """
        return self._model_runner

    def get_config(self) -> AICompletionConfig:
        """Return the AI completion config."""
        return self._ai_config

    def get_tracker(self) -> LDAIConfigTracker:
        """Return the config tracker."""
        return self._tracker

    def get_judges(self) -> Dict[str, Judge]:
        """Return the judges associated with this model."""
        return self._judges
