from typing import Optional, Dict, Callable, Union, Protocol, Sequence, Any
import random
import re

from opentelemetry.util.types import Attributes, AttributeValue
from opentelemetry.sdk.trace import ReadableSpan, Event
from opentelemetry.sdk._logs import LogRecord, LogData  # type: ignore Not actually private.
from opentelemetry.util.types import AnyValue as OTELAnyValue

from ..._graph.generated.public_graph_client.get_sampling_config import (
    GetSamplingConfigSampling,
    GetSamplingConfigSamplingSpans,
    GetSamplingConfigSamplingSpansEvents,
    GetSamplingConfigSamplingSpansAttributes,
    GetSamplingConfigSamplingSpansEventsAttributes,
    GetSamplingConfigSamplingLogs,
    GetSamplingConfigSamplingLogsAttributes,
)


class SamplingResult:
    """Result of sampling a span."""

    def __init__(
        self,
        sample: bool,
        attributes: Optional[Dict[str, Union[str, int, float, bool]]] = None,
    ):
        self.sample = sample
        self.attributes = attributes


class MatchConfig(Protocol):
    """Protocol for match configuration objects."""

    match_value: Optional[Union[str, int, float, bool]]
    regex_value: Optional[str]


class AttributeMatchConfig(Protocol):
    """Protocol for attribute match configuration objects."""

    key: MatchConfig
    attribute: MatchConfig


# Type alias for the actual generated types
AttributeConfig = Union[
    GetSamplingConfigSamplingSpansAttributes,
    GetSamplingConfigSamplingSpansEventsAttributes,
    GetSamplingConfigSamplingLogsAttributes,
    AttributeMatchConfig,
]


def default_sampler(ratio: float) -> bool:
    """
    Determine if an item should be sampled based on the sampling ratio.

    This function is not used for any purpose requiring cryptographic security.
    """
    truncated = int(ratio)
    # A ratio of 1 means 1 in 1. So that will always sample. No need
    # to draw a random number.
    if truncated == 1:
        return True
    # A ratio of 0 means 0 in 1. So that will never sample.
    if truncated == 0:
        return False

    # Math.random() * truncated) would return 0, 1, ... (ratio - 1).
    # Checking for any number in the range will have approximately a 1 in X
    # chance. So we check for 0 as it is part of any range.
    return int(random.random() * truncated) == 0


class ExportSampler(Protocol):
    """Protocol for export samplers."""

    def sample_span(self, span: ReadableSpan) -> SamplingResult:
        """Sample a span and return the result."""
        ...

    def sample_log(self, record: LogData) -> SamplingResult:
        """Sample a log and return the result."""
        ...

    def is_sampling_enabled(self) -> bool:
        """Return True if sampling is enabled."""
        ...


class CustomSampler:
    """Custom sampler that uses sampling configuration to determine if a span should be sampled."""

    ATTR_SAMPLING_RATIO = "launchdarkly.sampling.ratio"

    def __init__(self, sampler: Callable[[float], bool] = default_sampler):
        self.sampler = sampler
        self.config: Optional[GetSamplingConfigSampling] = None
        self._regex_cache: Dict[str, re.Pattern] = {}

    def set_config(self, config: Optional[GetSamplingConfigSampling]) -> None:
        """Set the sampling configuration."""
        self.config = config

    def is_sampling_enabled(self) -> bool:
        """Return True if sampling is enabled."""
        if self.config and (self.config.spans or self.config.logs):
            return True
        return False

    def _get_cached_regex(self, pattern: str) -> re.Pattern:
        """Get a cached regex pattern."""
        if pattern not in self._regex_cache:
            self._regex_cache[pattern] = re.compile(pattern)
        return self._regex_cache[pattern]

    def _matches_value(
        self,
        match_config: MatchConfig,
        value: Union[AttributeValue, OTELAnyValue, None],
    ) -> bool:
        """Match a value against a match configuration."""
        if match_config.match_value is not None:
            return value == match_config.match_value
        elif match_config.regex_value is not None:
            regex = self._get_cached_regex(match_config.regex_value)
            return bool(regex.search(str(value)))
        return True

    def _matches_attributes(
        self,
        config_attributes: Sequence[AttributeConfig] | None,
        span_attributes: Union[Attributes, Dict[str, Any], None],
    ) -> bool:
        """Match span attributes against configuration."""
        if not config_attributes:
            return True

        if not span_attributes:
            return False

        for attr_config in config_attributes:
            key_config = attr_config.key
            attribute_config = attr_config.attribute

            for key, value in span_attributes.items():
                matched_config = False
                # If the key matches the config, then check if the attribute value matches
                if self._matches_value(key_config, key):
                    # Check if the attribute value matches
                    if self._matches_value(attribute_config, value):
                        matched_config = True
                        break

            if not matched_config:
                return False

        return True

    def _matches_event(
        self,
        config_event: GetSamplingConfigSamplingSpansEvents,
        event: Event,
    ) -> bool:
        """Match a span event against the configuration."""
        if config_event.name != None:
            if not self._matches_value(config_event.name, event.name):
                return False

        if config_event.attributes != None:
            if not event.attributes:
                return False
            if not self._matches_attributes(config_event.attributes, event.attributes):
                return False

        return True

    def _matches_events(
        self,
        config_events: list[GetSamplingConfigSamplingSpansEvents],
        span_events: Sequence[Event],
    ) -> bool:
        """Match span events against configuration."""
        if not config_events:
            return True

        for event_config in config_events:
            matched_event = False
            for event in span_events:
                if self._matches_event(event_config, event):
                    matched_event = True
                    break

            if not matched_event:
                return False

        return True

    def _matches_span_config(
        self,
        config: GetSamplingConfigSamplingSpans,
        span: ReadableSpan,
    ) -> bool:
        """Match a span against the configuration."""
        # Check span name if defined
        config_name = getattr(config, "name", None)
        if config_name is not None:
            if not self._matches_value(config_name, span.name):
                return False

        # Check attributes
        if not self._matches_attributes(
            getattr(config, "attributes", None), span.attributes
        ):
            return False

        # Check events
        if not self._matches_events(getattr(config, "events", []) or [], span.events):
            return False

        return True

    def sample_span(self, span: ReadableSpan) -> "SamplingResult":
        """Sample a span based on the sampling configuration."""
        if self.config and self.config.spans:
            for span_config in self.config.spans:
                if self._matches_span_config(span_config, span):
                    return SamplingResult(
                        sample=self.sampler(span_config.sampling_ratio),
                        attributes={
                            self.ATTR_SAMPLING_RATIO: span_config.sampling_ratio,
                        },
                    )

        # Didn't match any sampling config, or there were no configs, so we sample it
        return SamplingResult(sample=True)

    def _matches_log_config(
        self,
        config: GetSamplingConfigSamplingLogs,
        record: LogData,
    ) -> bool:
        """Match a log record against the configuration."""
        # Check severity text if defined
        if config.severity_text is not None:
            if not self._matches_value(
                config.severity_text, record.log_record.severity_text
            ):
                return False

        # Check message if defined
        if config.message is not None:
            if not self._matches_value(config.message, record.log_record.body):
                return False

        # Check attributes
        if not self._matches_attributes(config.attributes, record.log_record.attributes):  # type: ignore
            return False

        return True

    def sample_log(self, record: LogData) -> "SamplingResult":
        """Sample a log record based on the sampling configuration."""
        if self.config and self.config.logs:
            for log_config in self.config.logs:
                if self._matches_log_config(log_config, record):
                    return SamplingResult(
                        sample=self.sampler(log_config.sampling_ratio),
                        attributes={
                            self.ATTR_SAMPLING_RATIO: log_config.sampling_ratio,
                        },
                    )

        # Didn't match any sampling config, or there were no configs, so we sample it
        return SamplingResult(sample=True)
