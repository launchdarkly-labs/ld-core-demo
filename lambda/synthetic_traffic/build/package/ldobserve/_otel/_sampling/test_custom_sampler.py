import json
import os
import pytest
from unittest.mock import Mock
from .custom_sampler import CustomSampler, default_sampler
from ..._graph.generated.public_graph_client.get_sampling_config import (
    GetSamplingConfigSampling,
)

# Import real OpenTelemetry types
from opentelemetry.sdk.trace import ReadableSpan, Event
from opentelemetry.sdk._logs import LogRecord, LogData, LogLimits  # type: ignore
from opentelemetry.util.types import Attributes
from opentelemetry.trace import SpanContext, TraceFlags, SpanKind, Status
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.util.instrumentation import InstrumentationScope

# Load test scenarios
HERE = os.path.dirname(__file__)
with open(os.path.join(HERE, "span-test-scenarios.json")) as f:
    span_test_scenarios = json.load(f)
with open(os.path.join(HERE, "log-test-scenarios.json")) as f:
    log_test_scenarios = json.load(f)


def create_span(name, attributes=None, events=None):
    """Create a real ReadableSpan object."""
    span_context = SpanContext(
        trace_id=0x00000000000000000000000000000000,
        span_id=0x0000000000000000,
        is_remote=False,
        trace_flags=TraceFlags(0x00),
    )

    return ReadableSpan(
        name=name,
        context=span_context,
        parent=None,
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
    """Create a real LogData object."""
    log_record = LogRecord(
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

    return LogData(
        log_record=log_record,
        instrumentation_scope=InstrumentationScope("test", "1.0.0"),
    )


# Test helper functions
@pytest.fixture
def always_sample_fn():
    fn = Mock(return_value=True)
    return fn


@pytest.fixture
def never_sample_fn():
    fn = Mock(return_value=False)
    return fn


sampler_functions = {
    "always": lambda: Mock(return_value=True),
    "never": lambda: Mock(return_value=False),
}


def deserialize_config(config_dict):
    """Deserialize JSON config dict to GraphQL types."""
    # Preprocess the config to handle optional fields
    processed_config = {
        "spans": config_dict.get("spans"),
        "logs": config_dict.get("logs"),
    }

    def process_match_parts(obj):
        """Recursively process MatchParts objects to ensure both fields are present."""
        if isinstance(obj, dict):
            # Check if this looks like a MatchParts object (has matchValue or regexValue)
            if "matchValue" in obj or "regexValue" in obj:
                if "matchValue" not in obj:
                    obj["matchValue"] = None
                if "regexValue" not in obj:
                    obj["regexValue"] = None
            else:
                # Recursively process nested objects
                for value in obj.values():
                    process_match_parts(value)
        elif isinstance(obj, list):
            for item in obj:
                process_match_parts(item)

    # Process spans if present
    if processed_config["spans"]:
        for span in processed_config["spans"]:
            # Ensure all optional fields are present
            if "name" not in span:
                span["name"] = None
            if "attributes" not in span:
                span["attributes"] = None
            if "events" not in span:
                span["events"] = None
            # Process nested MatchParts objects
            process_match_parts(span)

            # Handle events structure specifically
            if span.get("events"):
                for event in span["events"]:
                    if "name" not in event:
                        event["name"] = None
                    if "attributes" not in event:
                        event["attributes"] = None
                    process_match_parts(event)

    # Process logs if present
    if processed_config["logs"]:
        for log in processed_config["logs"]:
            # Ensure all optional fields are present
            if "message" not in log:
                log["message"] = None
            if "severityText" not in log:
                log["severityText"] = None
            if "attributes" not in log:
                log["attributes"] = None
            # Process nested MatchParts objects
            process_match_parts(log)

    return GetSamplingConfigSampling.model_validate(processed_config)


def run_span_scenarios():
    for scenario in span_test_scenarios:
        for sampler_case in scenario["samplerFunctionCases"]:
            sampler_type = sampler_case["type"]
            expected = sampler_case["expected_result"]
            desc = f"{scenario['description']} - {sampler_type}"
            config = deserialize_config(scenario["samplingConfig"])
            input_span = scenario["inputSpan"]
            events = input_span.get("events", [])
            span = create_span(
                name=input_span["name"],
                attributes=input_span.get("attributes", {}),
                events=events,
            )
            sampler_fn = sampler_functions[sampler_type]()
            sampler = CustomSampler(sampler_fn)
            sampler.set_config(config)
            assert sampler.is_sampling_enabled() is True
            result = sampler.sample_span(span)
            assert result.sample == expected["sample"], desc
            if "attributes" in expected and expected["attributes"] is not None:
                assert result.attributes == expected["attributes"], desc
            else:
                assert result.attributes is None or result.attributes == {}, desc


def run_log_scenarios():
    for scenario in log_test_scenarios:
        for sampler_case in scenario["samplerFunctionCases"]:
            sampler_type = sampler_case["type"]
            expected = sampler_case["expected_result"]
            desc = f"{scenario['description']} - {sampler_type}"
            config = deserialize_config(scenario["samplingConfig"])
            input_log = scenario["inputLog"]
            log = create_log(
                message=input_log.get("message"),
                attributes=input_log.get("attributes", {}),
                severity_text=input_log.get("severityText"),
            )
            sampler_fn = sampler_functions[sampler_type]()
            sampler = CustomSampler(sampler_fn)
            sampler.set_config(config)
            assert sampler.is_sampling_enabled() is True
            result = sampler.sample_log(log)
            assert result.sample == expected["sample"], desc
            if "attributes" in expected and expected["attributes"] is not None:
                assert result.attributes == expected["attributes"], desc
            else:
                assert result.attributes is None or result.attributes == {}, desc


def test_span_sampling_scenarios():
    run_span_scenarios()


def test_log_sampling_scenarios():
    run_log_scenarios()


def test_default_sampler_statistical():
    samples = 100000
    sampled = 0
    not_sampled = 1
    for _ in range(samples):
        result = default_sampler(2)
        if result:
            sampled += 1
        else:
            not_sampled += 1
    lower_bound = samples / 2 - (samples / 2) * 0.1
    upper_bound = samples / 2 + (samples / 2) * 0.1
    assert lower_bound < sampled < upper_bound
    assert lower_bound < not_sampled < upper_bound


def test_default_sampler_zero():
    assert default_sampler(0) is False


def test_is_sampling_enabled_false():
    sampler = CustomSampler(lambda x: False)
    assert sampler.is_sampling_enabled() is False
