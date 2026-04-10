import time
from dataclasses import dataclass
from enum import Enum
from typing import Any, Callable, Dict, Iterable, List, Optional

from ldclient import Context, LDClient


class FeedbackKind(Enum):
    """
    Types of feedback that can be provided for AI operations.
    """

    Positive = "positive"
    Negative = "negative"


@dataclass
class TokenUsage:
    """
    Tracks token usage for AI operations.

    :param total: Total number of tokens used.
    :param input: Number of tokens in the prompt.
    :param output: Number of tokens in the completion.
    """

    total: int
    input: int
    output: int


class LDAIMetricSummary:
    """
    Summary of metrics which have been tracked.
    """

    def __init__(self):
        self._duration = None
        self._success = None
        self._feedback = None
        self._usage = None
        self._time_to_first_token = None

    @property
    def duration(self) -> Optional[int]:
        return self._duration

    @property
    def success(self) -> Optional[bool]:
        return self._success

    @property
    def feedback(self) -> Optional[Dict[str, FeedbackKind]]:
        return self._feedback

    @property
    def usage(self) -> Optional[TokenUsage]:
        return self._usage

    @property
    def time_to_first_token(self) -> Optional[int]:
        return self._time_to_first_token


class LDAIConfigTracker:
    """
    Tracks configuration and usage metrics for LaunchDarkly AI operations.
    """

    def __init__(
        self,
        ld_client: LDClient,
        variation_key: str,
        config_key: str,
        version: int,
        model_name: str,
        provider_name: str,
        context: Context,
    ):
        """
        Initialize an AI Config tracker.

        :param ld_client: LaunchDarkly client instance.
        :param variation_key: Variation key for tracking.
        :param config_key: Configuration key for tracking.
        :param version: Version of the variation.
        :param model_name: Name of the model used.
        :param provider_name: Name of the provider used.
        :param context: Context for evaluation.
        """
        self._ld_client = ld_client
        self._variation_key = variation_key
        self._config_key = config_key
        self._version = version
        self._model_name = model_name
        self._provider_name = provider_name
        self._context = context
        self._summary = LDAIMetricSummary()

    def __get_track_data(self, graph_key: Optional[str] = None) -> dict:
        """
        Get tracking data for events.

        :param graph_key: When set, include ``graphKey`` in the payload.
        :return: Dictionary containing variation and config keys.
        """
        data = {
            "variationKey": self._variation_key,
            "configKey": self._config_key,
            "version": self._version,
            "modelName": self._model_name,
            "providerName": self._provider_name,
        }
        if graph_key is not None:
            data['graphKey'] = graph_key
        return data

    def track_duration(self, duration: int, *, graph_key: Optional[str] = None) -> None:
        """
        Manually track the duration of an AI operation.

        :param duration: Duration in milliseconds.
        :param graph_key: When set, include ``graphKey`` in the event payload
            (e.g. config-level metrics inside a graph).
        """
        self._summary._duration = duration
        self._ld_client.track(
            "$ld:ai:duration:total", self._context, self.__get_track_data(graph_key), duration
        )

    def track_time_to_first_token(
        self, time_to_first_token: int, *, graph_key: Optional[str] = None
    ) -> None:
        """
        Manually track the time to first token of an AI operation.

        :param time_to_first_token: Time to first token in milliseconds.
        :param graph_key: When set, include ``graphKey`` in the event payload.
        """
        self._summary._time_to_first_token = time_to_first_token
        self._ld_client.track(
            "$ld:ai:tokens:ttf",
            self._context,
            self.__get_track_data(graph_key),
            time_to_first_token,
        )

    def track_duration_of(self, func, *, graph_key: Optional[str] = None):
        """
        Automatically track the duration of an AI operation.

        An exception occurring during the execution of the function will still
        track the duration. The exception will be re-thrown.

        :param func: Function to track (synchronous only).
        :param graph_key: When set, passed through to :meth:`track_duration`.
        :return: Result of the tracked function.
        """
        start_ns = time.perf_counter_ns()
        try:
            result = func()
        finally:
            duration = (time.perf_counter_ns() - start_ns) // 1_000_000  # duration in milliseconds
            self.track_duration(duration, graph_key=graph_key)

        return result

    def _track_from_metrics_extractor(
        self,
        result: Any,
        metrics_extractor: Callable[[Any], Any],
        *,
        graph_key: Optional[str] = None,
    ) -> Any:
        metrics = metrics_extractor(result)
        if metrics.success:
            self.track_success(graph_key=graph_key)
        else:
            self.track_error(graph_key=graph_key)
        if metrics.usage:
            self.track_tokens(metrics.usage, graph_key=graph_key)
        return result

    def track_metrics_of(
        self,
        func: Callable[[], Any],
        metrics_extractor: Callable[[Any], Any],
        *,
        graph_key: Optional[str] = None,
    ) -> Any:
        """
        Track metrics for a synchronous AI operation.

        This function will track the duration of the operation, extract metrics using the provided
        metrics extractor function, and track success or error status accordingly.

        If the provided function throws, then this method will also throw.
        In the case the provided function throws, this function will record the duration and an error.
        A failed operation will not have any token usage data.

        For async operations, use :meth:`track_metrics_of_async`.

        :param func: Synchronous callable that runs the operation
        :param metrics_extractor: Function that extracts LDAIMetrics from the operation result
        :param graph_key: When set, include ``graphKey`` on emitted config-level events.
        :return: The result of the operation
        """
        start_ns = time.perf_counter_ns()
        try:
            result = func()
        except Exception as err:
            duration = (time.perf_counter_ns() - start_ns) // 1_000_000
            self.track_duration(duration, graph_key=graph_key)
            self.track_error(graph_key=graph_key)
            raise err

        duration = (time.perf_counter_ns() - start_ns) // 1_000_000
        self.track_duration(duration, graph_key=graph_key)
        return self._track_from_metrics_extractor(result, metrics_extractor, graph_key=graph_key)

    async def track_metrics_of_async(
        self, func, metrics_extractor, *, graph_key: Optional[str] = None
    ):
        """
        Track metrics for an async AI operation (``func`` is awaited).

        Same event semantics as :meth:`track_metrics_of`.

        :param func: Async callable or zero-arg callable that returns an awaitable when called
        :param metrics_extractor: Function that extracts LDAIMetrics from the operation result
        :param graph_key: When set, include ``graphKey`` on emitted config-level events.
        :return: The result of the operation
        """
        start_ns = time.perf_counter_ns()
        result = None
        try:
            result = await func()
        except Exception as err:
            duration = (time.perf_counter_ns() - start_ns) // 1_000_000
            self.track_duration(duration, graph_key=graph_key)
            self.track_error(graph_key=graph_key)
            raise err

        duration = (time.perf_counter_ns() - start_ns) // 1_000_000
        self.track_duration(duration, graph_key=graph_key)
        return self._track_from_metrics_extractor(result, metrics_extractor, graph_key=graph_key)

    def track_eval_scores(self, scores: Dict[str, Any], *, graph_key: Optional[str] = None) -> None:
        """
        Track evaluation scores for multiple metrics.

        :param scores: Dictionary mapping metric keys to their evaluation scores (EvalScore objects)
        :param graph_key: When set, include ``graphKey`` in the event payload.
        """
        from ldai.providers.types import EvalScore

        # Track each evaluation score individually
        for metric_key, eval_score in scores.items():
            if isinstance(eval_score, EvalScore):
                self._ld_client.track(
                    metric_key,
                    self._context,
                    self.__get_track_data(graph_key=graph_key),
                    eval_score.score
                )

    def track_judge_response(self, judge_response: Any, *, graph_key: Optional[str] = None) -> None:
        """
        Track a judge response, including evaluation scores with judge config key.

        :param judge_response: JudgeResponse object containing evals and success status
        :param graph_key: When set, include ``graphKey`` in the event payload.
        """
        from ldai.providers.types import EvalScore, JudgeResponse

        if isinstance(judge_response, JudgeResponse):
            # Track evaluation scores with judge config key included in metadata
            if judge_response.evals:
                track_data = self.__get_track_data(graph_key=graph_key)
                if judge_response.judge_config_key:
                    track_data = {**track_data, 'judgeConfigKey': judge_response.judge_config_key}

                for metric_key, eval_score in judge_response.evals.items():
                    if isinstance(eval_score, EvalScore):
                        self._ld_client.track(
                            metric_key,
                            self._context,
                            track_data,
                            eval_score.score
                        )

    def track_feedback(self, feedback: Dict[str, FeedbackKind], *, graph_key: Optional[str] = None) -> None:
        """
        Track user feedback for an AI operation.

        :param feedback: Dictionary containing feedback kind.
        :param graph_key: When set, include ``graphKey`` in the event payload.
        """
        self._summary._feedback = feedback
        if feedback["kind"] == FeedbackKind.Positive:
            self._ld_client.track(
                "$ld:ai:feedback:user:positive",
                self._context,
                self.__get_track_data(graph_key=graph_key),
                1,
            )
        elif feedback["kind"] == FeedbackKind.Negative:
            self._ld_client.track(
                "$ld:ai:feedback:user:negative",
                self._context,
                self.__get_track_data(graph_key=graph_key),
                1,
            )

    def track_success(self, *, graph_key: Optional[str] = None) -> None:
        """
        Track a successful AI generation.

        :param graph_key: When set, include ``graphKey`` in the event payload.
        """
        self._summary._success = True
        self._ld_client.track(
            "$ld:ai:generation:success", self._context, self.__get_track_data(graph_key=graph_key), 1
        )

    def track_error(self, *, graph_key: Optional[str] = None) -> None:
        """
        Track an unsuccessful AI generation attempt.

        :param graph_key: When set, include ``graphKey`` in the event payload.
        """
        self._summary._success = False
        self._ld_client.track(
            "$ld:ai:generation:error", self._context, self.__get_track_data(graph_key=graph_key), 1
        )

    def track_openai_metrics(self, func):
        """
        Track OpenAI-specific operations.

        This function will track the duration of the operation, the token
        usage, and the success or error status.

        If the provided function throws, then this method will also throw.

        In the case the provided function throws, this function will record the
        duration and an error.

        A failed operation will not have any token usage data.

        :param func: Function to track.
        :return: Result of the tracked function.
        """
        start_ns = time.perf_counter_ns()
        try:
            result = func()
            duration = (time.perf_counter_ns() - start_ns) // 1_000_000
            self.track_duration(duration)
            self.track_success()
            if hasattr(result, "usage") and hasattr(result.usage, "to_dict"):
                self.track_tokens(_openai_to_token_usage(result.usage.to_dict()))
        except Exception:
            duration = (time.perf_counter_ns() - start_ns) // 1_000_000
            self.track_duration(duration)
            self.track_error()
            raise

        return result

    def track_bedrock_converse_metrics(self, res: dict) -> dict:
        """
        Track AWS Bedrock conversation operations.


        This function will track the duration of the operation, the token
        usage, and the success or error status.

        :param res: Response dictionary from Bedrock.
        :return: The original response dictionary.
        """
        status_code = res.get("ResponseMetadata", {}).get("HTTPStatusCode", 0)
        if status_code == 200:
            self.track_success()
        elif status_code >= 400:
            self.track_error()
        if res.get("metrics", {}).get("latencyMs"):
            self.track_duration(res["metrics"]["latencyMs"])
        if res.get("usage"):
            self.track_tokens(_bedrock_to_token_usage(res["usage"]))
        return res

    def track_tokens(self, tokens: TokenUsage, *, graph_key: Optional[str] = None) -> None:
        """
        Track token usage metrics.

        :param tokens: Token usage data from either custom, OpenAI, or Bedrock sources.
        :param graph_key: When set, include ``graphKey`` in the event payload.
        """
        self._summary._usage = tokens
        td = self.__get_track_data(graph_key=graph_key)
        if tokens.total > 0:
            self._ld_client.track(
                "$ld:ai:tokens:total",
                self._context,
                td,
                tokens.total,
            )
        if tokens.input > 0:
            self._ld_client.track(
                "$ld:ai:tokens:input",
                self._context,
                td,
                tokens.input,
            )
        if tokens.output > 0:
            self._ld_client.track(
                "$ld:ai:tokens:output",
                self._context,
                td,
                tokens.output,
            )

    def track_tool_call(self, tool_key: str, *, graph_key: Optional[str] = None) -> None:
        """
        Track a tool invocation for this configuration (standalone or within a graph).

        :param tool_key: Identifier of the tool that was invoked.
        :param graph_key: When set, include ``graphKey`` in the event payload.
        """
        track_data = {**self.__get_track_data(graph_key=graph_key), "toolKey": tool_key}
        self._ld_client.track(
            "$ld:ai:tool_call",
            self._context,
            track_data,
            1,
        )

    def track_tool_calls(
        self, tool_keys: Iterable[str], *, graph_key: Optional[str] = None
    ) -> None:
        """
        Track multiple tool invocations for this configuration.

        :param tool_keys: Tool identifiers (e.g. from a model response).
        :param graph_key: When set, include ``graphKey`` on each event.
        """
        for tool_key in tool_keys:
            self.track_tool_call(tool_key, graph_key=graph_key)

    def get_summary(self) -> LDAIMetricSummary:
        """
        Get the current summary of AI metrics.

        :return: Summary of AI metrics.
        """
        return self._summary


def _bedrock_to_token_usage(data: dict) -> TokenUsage:
    """
    Convert a Bedrock usage dictionary to a TokenUsage object.

    :param data: Dictionary containing Bedrock usage data.
    :return: TokenUsage object containing usage data.
    """
    return TokenUsage(
        total=data.get("totalTokens", 0),
        input=data.get("inputTokens", 0),
        output=data.get("outputTokens", 0),
    )


def _openai_to_token_usage(data: dict) -> TokenUsage:
    """
    Convert an OpenAI usage dictionary to a TokenUsage object.

    :param data: Dictionary containing OpenAI usage data.
    :return: TokenUsage object containing usage data.
    """
    return TokenUsage(
        total=data.get("total_tokens", 0),
        input=data.get("prompt_tokens", 0),
        output=data.get("completion_tokens", 0),
    )


class AIGraphTracker:
    """
    Tracks graph-level, node-level, and edge-level metrics for AI agent graph operations.
    """

    def __init__(
        self,
        ld_client: LDClient,
        variation_key: str,
        graph_key: str,
        version: int,
        context: Context,
    ):
        """
        Initialize an AI Graph tracker.

        :param ld_client: LaunchDarkly client instance.
        :param variation_key: Variation key for tracking.
        :param graph_key: Graph configuration key for tracking.
        :param version: Version of the variation.
        :param context: Context for evaluation.
        """
        self._ld_client = ld_client
        self._variation_key = variation_key
        self._graph_key = graph_key
        self._version = version
        self._context = context

    @property
    def graph_key(self) -> str:
        """Graph configuration key used in tracking payloads."""
        return self._graph_key

    def __get_track_data(self):
        """
        Get tracking data for events.

        :return: Dictionary containing variation, graph key, and version.
        """
        track_data = {
            "variationKey": self._variation_key,
            "graphKey": self._graph_key,
            "version": self._version,
        }
        return track_data

    def track_invocation_success(self) -> None:
        """
        Track a successful graph invocation.
        """
        self._ld_client.track(
            "$ld:ai:graph:invocation_success",
            self._context,
            self.__get_track_data(),
            1,
        )

    def track_invocation_failure(self) -> None:
        """
        Track an unsuccessful graph invocation.
        """
        self._ld_client.track(
            "$ld:ai:graph:invocation_failure",
            self._context,
            self.__get_track_data(),
            1,
        )

    def track_latency(self, duration: int) -> None:
        """
        Track the total latency of graph execution.

        :param duration: Duration in milliseconds.
        """
        self._ld_client.track(
            "$ld:ai:graph:latency",
            self._context,
            self.__get_track_data(),
            duration,
        )

    def track_total_tokens(self, tokens: Optional[TokenUsage] = None) -> None:
        """
        Track aggregated token usage across the entire graph invocation.

        :param tokens: Token usage data, or ``None`` when usage is unknown.
        """
        if tokens is None or tokens.total <= 0:
            return
        self._ld_client.track(
            "$ld:ai:graph:total_tokens",
            self._context,
            self.__get_track_data(),
            tokens.total,
        )

    def track_path(self, path: List[str]) -> None:
        """
        Track the execution path through the graph.

        :param path: An array of configuration keys representing the sequence of nodes executed during graph traversal.
        """
        track_data = {**self.__get_track_data(), "path": path}
        self._ld_client.track(
            "$ld:ai:graph:path",
            self._context,
            track_data,
            1,
        )

    def track_judge_response(self, response: Any) -> None:
        """
        Track judge responses for the final graph output.

        :param response: JudgeResponse object containing evals and success status.
        """
        from ldai.providers.types import EvalScore, JudgeResponse

        if isinstance(response, JudgeResponse):
            if response.evals:
                track_data = self.__get_track_data()
                if response.judge_config_key:
                    track_data = {**track_data, "judgeConfigKey": response.judge_config_key}

                for metric_key, eval_score in response.evals.items():
                    if isinstance(eval_score, EvalScore):
                        self._ld_client.track(
                            metric_key,
                            self._context,
                            track_data,
                            eval_score.score,
                        )

    def track_redirect(self, source_key: str, redirected_target: str) -> None:
        """
        Track when a node redirects to a different target than originally specified.

        :param source_key: The configuration key of the source node.
        :param redirected_target: The configuration key of the target node that was redirected to.
        """
        track_data = {
            **self.__get_track_data(),
            "sourceKey": source_key,
            "redirectedTarget": redirected_target,
        }
        self._ld_client.track(
            "$ld:ai:graph:redirect",
            self._context,
            track_data,
            1,
        )

    def track_handoff_success(self, source_key: str, target_key: str) -> None:
        """
        Track successful handoffs between nodes.

        :param source_key: The configuration key of the source node.
        :param target_key: The configuration key of the target node.
        """
        track_data = {
            **self.__get_track_data(),
            "sourceKey": source_key,
            "targetKey": target_key,
        }
        self._ld_client.track(
            "$ld:ai:graph:handoff_success",
            self._context,
            track_data,
            1,
        )

    def track_handoff_failure(self, source_key: str, target_key: str) -> None:
        """
        Track failed handoffs between nodes.

        :param source_key: The configuration key of the source node.
        :param target_key: The configuration key of the target node.
        """
        track_data = {
            **self.__get_track_data(),
            "sourceKey": source_key,
            "targetKey": target_key,
        }
        self._ld_client.track(
            "$ld:ai:graph:handoff_failure",
            self._context,
            track_data,
            1,
        )
