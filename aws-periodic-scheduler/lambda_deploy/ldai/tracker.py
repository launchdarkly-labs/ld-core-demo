import time
from dataclasses import dataclass
from enum import Enum
from typing import Dict, Optional

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

    def __get_track_data(self):
        """
        Get tracking data for events.

        :return: Dictionary containing variation and config keys.
        """
        return {
            "variationKey": self._variation_key,
            "configKey": self._config_key,
            "version": self._version,
            "modelName": self._model_name,
            "providerName": self._provider_name,
        }

    def track_duration(self, duration: int) -> None:
        """
        Manually track the duration of an AI operation.

        :param duration: Duration in milliseconds.
        """
        self._summary._duration = duration
        self._ld_client.track(
            "$ld:ai:duration:total", self._context, self.__get_track_data(), duration
        )

    def track_time_to_first_token(self, time_to_first_token: int) -> None:
        """
        Manually track the time to first token of an AI operation.

        :param time_to_first_token: Time to first token in milliseconds.
        """
        self._summary._time_to_first_token = time_to_first_token
        self._ld_client.track(
            "$ld:ai:tokens:ttf",
            self._context,
            self.__get_track_data(),
            time_to_first_token,
        )

    def track_duration_of(self, func):
        """
        Automatically track the duration of an AI operation.

        An exception occurring during the execution of the function will still
        track the duration. The exception will be re-thrown.

        :param func: Function to track.
        :return: Result of the tracked function.
        """
        start_time = time.time()
        try:
            result = func()
        finally:
            end_time = time.time()
            duration = int((end_time - start_time) * 1000)  # duration in milliseconds
            self.track_duration(duration)

        return result

    def track_feedback(self, feedback: Dict[str, FeedbackKind]) -> None:
        """
        Track user feedback for an AI operation.

        :param feedback: Dictionary containing feedback kind.
        """
        self._summary._feedback = feedback
        if feedback["kind"] == FeedbackKind.Positive:
            self._ld_client.track(
                "$ld:ai:feedback:user:positive",
                self._context,
                self.__get_track_data(),
                1,
            )
        elif feedback["kind"] == FeedbackKind.Negative:
            self._ld_client.track(
                "$ld:ai:feedback:user:negative",
                self._context,
                self.__get_track_data(),
                1,
            )

    def track_success(self) -> None:
        """
        Track a successful AI generation.
        """
        self._summary._success = True
        self._ld_client.track(
            "$ld:ai:generation:success", self._context, self.__get_track_data(), 1
        )

    def track_error(self) -> None:
        """
        Track an unsuccessful AI generation attempt.
        """
        self._summary._success = False
        self._ld_client.track(
            "$ld:ai:generation:error", self._context, self.__get_track_data(), 1
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
        try:
            result = self.track_duration_of(func)
            self.track_success()
            if hasattr(result, "usage") and hasattr(result.usage, "to_dict"):
                self.track_tokens(_openai_to_token_usage(result.usage.to_dict()))
        except Exception:
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

    def track_tokens(self, tokens: TokenUsage) -> None:
        """
        Track token usage metrics.

        :param tokens: Token usage data from either custom, OpenAI, or Bedrock sources.
        """
        self._summary._usage = tokens
        if tokens.total > 0:
            self._ld_client.track(
                "$ld:ai:tokens:total",
                self._context,
                self.__get_track_data(),
                tokens.total,
            )
        if tokens.input > 0:
            self._ld_client.track(
                "$ld:ai:tokens:input",
                self._context,
                self.__get_track_data(),
                tokens.input,
            )
        if tokens.output > 0:
            self._ld_client.track(
                "$ld:ai:tokens:output",
                self._context,
                self.__get_track_data(),
                tokens.output,
            )

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
