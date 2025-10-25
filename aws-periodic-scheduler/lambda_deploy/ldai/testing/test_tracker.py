from time import sleep
from unittest.mock import MagicMock, call

import pytest
from ldclient import Config, Context, LDClient
from ldclient.integrations.test_data import TestData

from ldai.tracker import FeedbackKind, LDAIConfigTracker, TokenUsage


@pytest.fixture
def td() -> TestData:
    td = TestData.data_source()
    td.update(
        td.flag("model-config")
        .variations(
            {
                "model": {
                    "name": "fakeModel",
                    "parameters": {"temperature": 0.5, "maxTokens": 4096},
                    "custom": {"extra-attribute": "value"},
                },
                "provider": {"name": "fakeProvider"},
                "messages": [{"role": "system", "content": "Hello, {{name}}!"}],
                "_ldMeta": {"enabled": True, "variationKey": "abcd", "version": 1},
            },
            "green",
        )
        .variation_for_all(0)
    )

    return td


@pytest.fixture
def client(td: TestData) -> LDClient:
    config = Config("sdk-key", update_processor_class=td, send_events=False)
    client = LDClient(config=config)
    client.track = MagicMock()  # type: ignore
    return client


def test_summary_starts_empty(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 1, "fakeModel", "fakeProvider", context)

    assert tracker.get_summary().duration is None
    assert tracker.get_summary().feedback is None
    assert tracker.get_summary().success is None
    assert tracker.get_summary().usage is None


def test_tracks_duration(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)
    tracker.track_duration(100)

    client.track.assert_called_with(  # type: ignore
        "$ld:ai:duration:total",
        context,
        {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
        100,
    )

    assert tracker.get_summary().duration == 100


def test_tracks_duration_of(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)
    tracker.track_duration_of(lambda: sleep(0.01))

    calls = client.track.mock_calls  # type: ignore

    assert len(calls) == 1
    assert calls[0].args[0] == "$ld:ai:duration:total"
    assert calls[0].args[1] == context
    assert calls[0].args[2] == {
        "variationKey": "variation-key",
        "configKey": "config-key",
        "version": 3,
        "modelName": "fakeModel",
        "providerName": "fakeProvider",
    }
    assert calls[0].args[3] == pytest.approx(10, rel=10)


def test_tracks_time_to_first_token(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)
    tracker.track_time_to_first_token(100)

    client.track.assert_called_with(  # type: ignore
        "$ld:ai:tokens:ttf",
        context,
        {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
        100,
    )

    assert tracker.get_summary().time_to_first_token == 100


def test_tracks_duration_of_with_exception(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)

    def sleep_and_throw():
        sleep(0.01)
        raise ValueError("Something went wrong")

    try:
        tracker.track_duration_of(sleep_and_throw)
        assert False, "Should have thrown an exception"
    except ValueError:
        pass

    calls = client.track.mock_calls  # type: ignore

    assert len(calls) == 1
    assert calls[0].args[0] == "$ld:ai:duration:total"
    assert calls[0].args[1] == context
    assert calls[0].args[2] == {
        "variationKey": "variation-key",
        "configKey": "config-key",
        "version": 3,
        "modelName": "fakeModel",
        "providerName": "fakeProvider",
    }
    assert calls[0].args[3] == pytest.approx(10, rel=10)


def test_tracks_token_usage(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)

    tokens = TokenUsage(300, 200, 100)
    tracker.track_tokens(tokens)

    calls = [
        call(
            "$ld:ai:tokens:total",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            300,
        ),
        call(
            "$ld:ai:tokens:input",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            200,
        ),
        call(
            "$ld:ai:tokens:output",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            100,
        ),
    ]

    client.track.assert_has_calls(calls)  # type: ignore

    assert tracker.get_summary().usage == tokens


def test_tracks_bedrock_metrics(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)

    bedrock_result = {
        "ResponseMetadata": {"HTTPStatusCode": 200},
        "usage": {
            "inputTokens": 220,
            "outputTokens": 110,
            "totalTokens": 330,
        },
        "metrics": {
            "latencyMs": 50,
        },
    }
    tracker.track_bedrock_converse_metrics(bedrock_result)

    calls = [
        call(
            "$ld:ai:generation:success",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            1,
        ),
        call(
            "$ld:ai:duration:total",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            50,
        ),
        call(
            "$ld:ai:tokens:total",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            330,
        ),
        call(
            "$ld:ai:tokens:input",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            220,
        ),
        call(
            "$ld:ai:tokens:output",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            110,
        ),
    ]

    client.track.assert_has_calls(calls)  # type: ignore

    assert tracker.get_summary().success is True
    assert tracker.get_summary().duration == 50
    assert tracker.get_summary().usage == TokenUsage(330, 220, 110)


def test_tracks_bedrock_metrics_with_error(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)

    bedrock_result = {
        "ResponseMetadata": {"HTTPStatusCode": 500},
        "usage": {
            "totalTokens": 330,
            "inputTokens": 220,
            "outputTokens": 110,
        },
        "metrics": {
            "latencyMs": 50,
        },
    }
    tracker.track_bedrock_converse_metrics(bedrock_result)

    calls = [
        call(
            "$ld:ai:generation:error",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            1,
        ),
        call(
            "$ld:ai:duration:total",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            50,
        ),
        call(
            "$ld:ai:tokens:total",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            330,
        ),
        call(
            "$ld:ai:tokens:input",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            220,
        ),
        call(
            "$ld:ai:tokens:output",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            110,
        ),
    ]

    client.track.assert_has_calls(calls)  # type: ignore

    assert tracker.get_summary().success is False
    assert tracker.get_summary().duration == 50
    assert tracker.get_summary().usage == TokenUsage(330, 220, 110)


def test_tracks_openai_metrics(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)

    class Result:
        def __init__(self):
            self.usage = Usage()

    class Usage:
        def to_dict(self):
            return {
                "total_tokens": 330,
                "prompt_tokens": 220,
                "completion_tokens": 110,
            }

    tracker.track_openai_metrics(lambda: Result())

    calls = [
        call(
            "$ld:ai:generation:success",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            1,
        ),
        call(
            "$ld:ai:tokens:total",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            330,
        ),
        call(
            "$ld:ai:tokens:input",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            220,
        ),
        call(
            "$ld:ai:tokens:output",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            110,
        ),
    ]

    client.track.assert_has_calls(calls, any_order=False)  # type: ignore

    assert tracker.get_summary().usage == TokenUsage(330, 220, 110)


def test_tracks_openai_metrics_with_exception(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)

    def raise_exception():
        raise ValueError("Something went wrong")

    try:
        tracker.track_openai_metrics(raise_exception)
        assert False, "Should have thrown an exception"
    except ValueError:
        pass

    calls = [
        call(
            "$ld:ai:generation:error",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            1,
        ),
    ]

    client.track.assert_has_calls(calls, any_order=False)  # type: ignore

    assert tracker.get_summary().usage is None


@pytest.mark.parametrize(
    "kind,label",
    [
        pytest.param(FeedbackKind.Positive, "positive", id="positive"),
        pytest.param(FeedbackKind.Negative, "negative", id="negative"),
    ],
)
def test_tracks_feedback(client: LDClient, kind: FeedbackKind, label: str):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)

    tracker.track_feedback({"kind": kind})

    client.track.assert_called_with(  # type: ignore
        f"$ld:ai:feedback:user:{label}",
        context,
        {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
        1,
    )
    assert tracker.get_summary().feedback == {"kind": kind}


def test_tracks_success(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)
    tracker.track_success()

    calls = [
        call(
            "$ld:ai:generation:success",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            1,
        ),
    ]

    client.track.assert_has_calls(calls)  # type: ignore

    assert tracker.get_summary().success is True


def test_tracks_error(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)
    tracker.track_error()

    calls = [
        call(
            "$ld:ai:generation:error",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            1,
        ),
    ]

    client.track.assert_has_calls(calls)  # type: ignore

    assert tracker.get_summary().success is False


def test_error_overwrites_success(client: LDClient):
    context = Context.create("user-key")
    tracker = LDAIConfigTracker(client, "variation-key", "config-key", 3, "fakeModel", "fakeProvider", context)
    tracker.track_success()
    tracker.track_error()

    calls = [
        call(
            "$ld:ai:generation:success",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            1,
        ),
        call(
            "$ld:ai:generation:error",
            context,
            {"variationKey": "variation-key", "configKey": "config-key", "version": 3, "modelName": "fakeModel", "providerName": "fakeProvider"},
            1,
        ),
    ]

    client.track.assert_has_calls(calls)  # type: ignore

    assert tracker.get_summary().success is False
