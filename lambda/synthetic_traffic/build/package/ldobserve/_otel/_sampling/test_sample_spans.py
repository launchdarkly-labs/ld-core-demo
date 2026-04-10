import pytest
from unittest.mock import Mock
from opentelemetry.sdk.trace import ReadableSpan, Event
from opentelemetry.sdk._logs import LogRecord, LogLimits  # type: ignore
from opentelemetry.util.types import Attributes
from opentelemetry.trace import SpanContext, TraceFlags, SpanKind, Status
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.util.instrumentation import InstrumentationScope
from typing import Dict, Optional, List

from ..sampling_trace_exporter import _sample_spans, ExportSampler
from .._sampling import SamplingResult
from ..._graph.generated.public_graph_client.get_sampling_config import (
    GetSamplingConfigSampling,
)


# Helper functions from test_custom_sampler.py
def create_span(name, attributes=None, events=None, parent_span_id=None):
    """Create a real ReadableSpan object."""
    span_context = SpanContext(
        trace_id=0x00000000000000000000000000000000,
        span_id=hash(name) & 0xFFFFFFFFFFFFFFFF,  # Use hash of name as span_id
        is_remote=False,
        trace_flags=TraceFlags(0x00),
    )

    # Create parent span context if parent_span_id is provided
    parent_context = None
    if parent_span_id:
        parent_context = SpanContext(
            trace_id=0x00000000000000000000000000000000,
            span_id=parent_span_id,
            is_remote=False,
            trace_flags=TraceFlags(0x00),
        )

    return ReadableSpan(
        name=name,
        context=span_context,
        parent=parent_context,
        resource=Resource.create({}),
        instrumentation_scope=InstrumentationScope("test", "1.0.0"),
        attributes=attributes or {},
        events=[create_event(**e) for e in (events or [])],
        links=[],
        status=Status(),
        start_time=0,
        end_time=0,
        kind=SpanKind.INTERNAL,
    )


def create_event(name, attributes=None, **kwargs):
    """Create a real Event object."""
    return Event(name=name, attributes=attributes or {}, timestamp=0)


def create_log(message=None, attributes=None, severity_text=None):
    """Create a real LogRecord object."""
    return LogRecord(
        body=message,
        attributes=attributes or {},
        severity_text=severity_text,
        resource=Resource.create({}),
        timestamp=0,
        observed_timestamp=0,
        trace_id=None,
        span_id=None,
        trace_flags=None,
        severity_number=None,
        limits=LogLimits(),
    )


# Mock implementation of Sampler
class MockSampler:
    def __init__(self, mock_results: Dict[str, bool], enabled: bool = True):
        self.mock_results = mock_results
        self.enabled = enabled

    def set_config(self, config: Optional[GetSamplingConfigSampling]) -> None:
        pass

    def sample_span(self, span: ReadableSpan) -> SamplingResult:
        span_context = span.get_span_context()
        if span_context is None:
            return SamplingResult(sample=False)

        span_name = span.name
        should_sample = self.mock_results.get(span_name, True)

        if should_sample:
            return SamplingResult(sample=True, attributes={"samplingRatio": 2})
        else:
            return SamplingResult(sample=False)

    def sample_log(self, log: LogRecord) -> SamplingResult:
        return SamplingResult(sample=True)

    def is_sampling_enabled(self) -> bool:
        return self.enabled


@pytest.fixture
def setup():
    """Setup function to clear any state between tests."""
    pass


def test_should_remove_spans_that_are_not_sampled():
    """Test that spans that are not sampled are removed."""
    mock_sampler = MockSampler(
        {
            "span-1": True,
            "span-2": False,
        }
    )

    spans = [
        create_span("span-1"),  # Root span - sampled
        create_span("span-2"),  # Root span - not sampled
    ]

    sampled_spans = _sample_spans(spans, mock_sampler)

    assert len(sampled_spans) == 1
    assert sampled_spans[0].name == "span-1"
    attributes = sampled_spans[0].attributes or {}
    assert attributes.get("samplingRatio") == 2


def test_should_remove_children_of_spans_that_are_not_sampled():
    """Test that children of spans that are not sampled are also removed."""
    mock_sampler = MockSampler(
        {
            "parent": False,
            "root": True,
        }
    )

    # Create span hierarchy with parent -> child -> grandchild
    parent_span_id = hash("parent") & 0xFFFFFFFFFFFFFFFF
    child_span_id = hash("child") & 0xFFFFFFFFFFFFFFFF

    spans = [
        create_span("parent"),
        create_span("child", parent_span_id=parent_span_id),
        create_span("grandchild", parent_span_id=child_span_id),
        create_span("root"),
    ]

    sampled_spans = _sample_spans(spans, mock_sampler)

    assert len(sampled_spans) == 1
    assert sampled_spans[0].name == "root"


def test_should_not_apply_sampling_when_sampling_is_disabled():
    """Test that sampling is not applied when sampling is disabled."""
    mock_sampler = MockSampler({}, enabled=False)

    spans = [create_span("span-1"), create_span("span-2")]

    sampled_spans = _sample_spans(spans, mock_sampler)

    assert len(sampled_spans) == 2
    assert sampled_spans == spans


def test_should_apply_sampling_attributes_to_sampled_spans():
    """Test that sampling attributes are applied to sampled spans."""
    mock_sampler = MockSampler(
        {
            "span-1": True,
            "span-2": True,
        }
    )

    spans = [create_span("span-1"), create_span("span-2")]

    sampled_spans = _sample_spans(spans, mock_sampler)

    assert len(sampled_spans) == 2
    attributes1 = sampled_spans[0].attributes or {}
    attributes2 = sampled_spans[1].attributes or {}
    assert attributes1.get("samplingRatio") == 2
    assert attributes2.get("samplingRatio") == 2
