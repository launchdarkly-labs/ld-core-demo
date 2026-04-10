from ldobserve._otel._sampling.custom_sampler import SamplingResult
from ldobserve._otel.sampling_log_exporter import _sample_logs
from opentelemetry.util.types import AnyValue
import pytest
from typing import Dict, Optional
from opentelemetry.sdk._logs import LogRecord, LogData  # type: ignore
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import InstrumentationScope
from opentelemetry.trace import SpanContext, TraceFlags
from opentelemetry.trace.span import INVALID_SPAN_ID, INVALID_TRACE_ID

from ..._graph.generated.public_graph_client.get_sampling_config import (
    GetSamplingConfigSampling,
)


def create_log_data(
    severity_text: str,
    message: str,
    attributes: Optional[Dict[str, AnyValue]] = None,
) -> LogData:
    """Create a LogData for testing."""
    log_record = LogRecord(
        body=message,
        attributes=attributes or {},
        severity_text=severity_text,
        resource=Resource.create({}),
        timestamp=0,
        observed_timestamp=0,
        trace_id=INVALID_TRACE_ID,
        span_id=INVALID_SPAN_ID,
        severity_number=None,
    )

    return LogData(
        log_record=log_record, instrumentation_scope=InstrumentationScope("test", "1.0")
    )


class MockSampler:
    """Mock implementation of ExportSampler for testing."""

    def __init__(
        self,
        mock_results: Dict[str, bool],
        enabled: bool = True,
    ):
        self.mock_results = mock_results
        self.enabled = enabled

    def set_config(self, config: Optional[GetSamplingConfigSampling]) -> None:
        pass

    def sample_log(self, record: LogData) -> SamplingResult:
        log_id = f"{record.log_record.severity_text}-{record.log_record.body}"
        should_sample = self.mock_results.get(log_id, True)

        if should_sample:
            return SamplingResult(sample=True, attributes={"samplingRatio": 2})
        else:
            return SamplingResult(sample=False)

    def sample_span(self, span) -> SamplingResult:
        return SamplingResult(sample=True)

    def is_sampling_enabled(self) -> bool:
        return self.enabled


def test_return_all_logs_when_sampling_disabled():
    """Test that all logs are returned when sampling is disabled."""
    mock_sampler = MockSampler({}, False)
    logs = [
        create_log_data("info", "test log 1"),
        create_log_data("error", "test log 2"),
    ]

    sampled_logs = _sample_logs(logs, mock_sampler)

    assert len(sampled_logs) == 2
    assert sampled_logs == logs


def test_remove_logs_that_are_not_sampled():
    """Test that logs that are not sampled are removed."""
    mock_sampler = MockSampler(
        {
            "info-test log 1": True,
            "error-test log 2": False,
        }
    )

    logs = [
        create_log_data("info", "test log 1"),
        create_log_data("error", "test log 2"),
    ]

    sampled_logs = _sample_logs(logs, mock_sampler)

    assert len(sampled_logs) == 1
    assert sampled_logs[0].log_record.body == "test log 1"
    assert (
        sampled_logs[0].log_record.attributes
        and sampled_logs[0].log_record.attributes["samplingRatio"] == 2
    )


def test_apply_sampling_attributes_to_sampled_logs():
    """Test that sampling attributes are applied to sampled logs."""
    mock_sampler = MockSampler(
        {
            "info-test log 1": True,
            "error-test log 2": True,
        }
    )

    logs = [
        create_log_data("info", "test log 1"),
        create_log_data("error", "test log 2"),
    ]

    sampled_logs = _sample_logs(logs, mock_sampler)

    assert len(sampled_logs) == 2
    assert (
        sampled_logs[0].log_record.attributes
        and sampled_logs[0].log_record.attributes["samplingRatio"] == 2
    )
    assert (
        sampled_logs[1].log_record.attributes
        and sampled_logs[1].log_record.attributes["samplingRatio"] == 2
    )


def test_handle_empty_log_array():
    """Test handling of empty log array."""
    mock_sampler = MockSampler({})
    logs: list[LogData] = []

    sampled_logs = _sample_logs(logs, mock_sampler)

    assert len(sampled_logs) == 0


def test_handle_logs_with_no_sampling_attributes():
    """Test handling of logs with no sampling attributes."""
    mock_sampler = MockSampler(
        {
            "info-test log 1": True,
        }
    )

    logs = [create_log_data("info", "test log 1")]

    sampled_logs = _sample_logs(logs, mock_sampler)

    assert len(sampled_logs) == 1
    assert (
        sampled_logs[0].log_record.attributes
        and sampled_logs[0].log_record.attributes["samplingRatio"] == 2
    )
