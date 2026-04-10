import pytest
from ldclient import Config, Context, LDClient
from ldclient.evaluation import EvaluationDetail
from ldclient.hook import EvaluationSeriesContext
from ldclient.integrations.test_data import TestData
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor, SpanExporter
from opentelemetry.sdk.trace.export.in_memory_span_exporter import \
    InMemorySpanExporter
from opentelemetry.trace import (Tracer, get_tracer_provider,
                                 set_tracer_provider)

from ldotel.tracing import Hook, HookOptions


@pytest.fixture
def td() -> TestData:
    td = TestData.data_source()
    td.update(td.flag('boolean').variation_for_all(True))

    return td


@pytest.fixture
def exporter() -> SpanExporter:
    return InMemorySpanExporter()


@pytest.fixture
def tracer(exporter: SpanExporter) -> Tracer:
    set_tracer_provider(TracerProvider())
    get_tracer_provider().add_span_processor(SimpleSpanProcessor(exporter))  # type: ignore[attr-defined]

    return get_tracer_provider().get_tracer('pytest')


@pytest.fixture
def client(td: TestData) -> LDClient:
    config = Config('sdk-key', update_processor_class=td, send_events=False)

    return LDClient(config=config)


class TestHookOptions:
    def test_does_nothing_if_not_in_span(self, client: LDClient, exporter: SpanExporter):
        client.add_hook(Hook())
        client.variation('boolean', Context.create('org-key', 'org'), False)

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 0

    def test_records_basic_span_event(self, client: LDClient, exporter: SpanExporter, tracer: Tracer):
        client.add_hook(Hook())
        with tracer.start_as_current_span("test_records_basic_span_event"):
            client.variation('boolean', Context.create('org-key', 'org'), False)

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 1
        assert len(spans[0].events) == 1

        event = spans[0].events[0]
        assert event.name == 'feature_flag'
        assert event.attributes['feature_flag.key'] == 'boolean'
        assert event.attributes['feature_flag.provider.name'] == 'LaunchDarkly'
        assert event.attributes['feature_flag.context.id'] == 'org:org-key'
        assert event.attributes['feature_flag.result.variationIndex'] == '0'
        assert 'feature_flag.result.value' not in event.attributes
        assert 'feature_flag.result.reason.inExperiment' not in event.attributes

    def test_can_include_variant(self, client: LDClient, exporter: SpanExporter, tracer: Tracer):
        client.add_hook(Hook(HookOptions(include_variant=True)))
        with tracer.start_as_current_span("test_can_include_variant"):
            client.variation('boolean', Context.create('org-key', 'org'), False)

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 1
        assert len(spans[0].events) == 1

        event = spans[0].events[0]
        assert event.name == 'feature_flag'
        assert event.attributes['feature_flag.key'] == 'boolean'
        assert event.attributes['feature_flag.provider.name'] == 'LaunchDarkly'
        assert event.attributes['feature_flag.context.id'] == 'org:org-key'
        assert event.attributes['feature_flag.result.variationIndex'] == '0'
        assert event.attributes['feature_flag.result.value'] == 'true'
        assert 'feature_flag.result.reason.inExperiment' not in event.attributes

    @pytest.mark.parametrize("flag_key, variations, variation_index, expected_value", [
        ("string-flag", ["alpha", "beta"], 1, "beta"),
        ("number-flag", [42, 99], 0, 42),
        ("array-flag", [[1, 2], [3, 4]], 1, [3, 4]),
        ("object-flag", [{"a": 1}, {"b": 2}], 0, {"a": 1}),
    ])
    def test_can_include_value_types(self, flag_key, variations, variation_index, expected_value, exporter: SpanExporter, tracer: Tracer):
        td = TestData.data_source()
        td.update(td.flag(flag_key).variations(*variations).variation_for_all(variation_index))
        config = Config('sdk-key', update_processor_class=td, send_events=False)
        client = LDClient(config=config)
        client.add_hook(Hook(HookOptions(include_value=True)))

        with tracer.start_as_current_span(f"test_can_include_value_types_{flag_key}"):
            context = Context.create('org-key', 'org')
            client.variation(flag_key, context, None)

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 1
        assert len(spans[0].events) == 1

        import json
        event = spans[0].events[0]
        assert event.name == 'feature_flag'
        assert event.attributes['feature_flag.key'] == flag_key
        assert event.attributes['feature_flag.provider.name'] == 'LaunchDarkly'
        assert event.attributes['feature_flag.context.id'] == 'org:org-key'
        assert event.attributes['feature_flag.result.variationIndex'] == str(variation_index)
        assert event.attributes['feature_flag.result.value'] == json.dumps(expected_value)
        assert 'feature_flag.result.reason.inExperiment' not in event.attributes

    def test_add_span_creates_span_if_one_not_active(self, client: LDClient, exporter: SpanExporter, tracer: Tracer):
        client.add_hook(Hook(HookOptions(add_spans=True)))
        client.variation('boolean', Context.create('org-key', 'org'), False)

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 1

        assert spans[0].attributes['feature_flag.context.id'] == 'org:org-key'
        assert spans[0].attributes['feature_flag.key'] == 'boolean'
        assert len(spans[0].events) == 0

    def test_add_span_leaves_events_on_top_level_span(self, client: LDClient, exporter: SpanExporter, tracer: Tracer):
        client.add_hook(Hook(HookOptions(add_spans=True)))
        with tracer.start_as_current_span("test_add_span_leaves_events_on_top_level_span"):
            client.variation('boolean', Context.create('org-key', 'org'), False)

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 2

        ld_span = spans[0]
        toplevel = spans[1]

        assert ld_span.attributes['feature_flag.context.id'] == 'org:org-key'
        assert ld_span.attributes['feature_flag.key'] == 'boolean'

        event = toplevel.events[0]
        assert event.name == 'feature_flag'
        assert event.attributes['feature_flag.key'] == 'boolean'
        assert event.attributes['feature_flag.provider.name'] == 'LaunchDarkly'
        assert event.attributes['feature_flag.context.id'] == 'org:org-key'
        assert event.attributes['feature_flag.result.variationIndex'] == '0'
        assert 'feature_flag.result.value' not in event.attributes
        assert 'feature_flag.result.reason.inExperiment' not in event.attributes

    def test_hook_makes_its_span_active(self, client: LDClient, exporter: SpanExporter, tracer: Tracer):
        client.add_hook(Hook(HookOptions(add_spans=True)))
        client.add_hook(Hook(HookOptions(add_spans=True)))

        with tracer.start_as_current_span("test_add_span_leaves_events_on_top_level_span"):
            client.variation('boolean', Context.create('org-key', 'org'), False)

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 3

        inner = spans[0]
        middle = spans[1]
        top = spans[2]

        assert inner.attributes['feature_flag.context.id'] == 'org:org-key'
        assert inner.attributes['feature_flag.key'] == 'boolean'
        assert len(inner.events) == 0

        assert middle.attributes['feature_flag.context.id'] == 'org:org-key'
        assert middle.attributes['feature_flag.key'] == 'boolean'
        assert middle.events[0].name == 'feature_flag'
        assert middle.events[0].attributes['feature_flag.key'] == 'boolean'
        assert middle.events[0].attributes['feature_flag.provider.name'] == 'LaunchDarkly'
        assert middle.events[0].attributes['feature_flag.context.id'] == 'org:org-key'
        assert middle.events[0].attributes['feature_flag.result.variationIndex'] == '0'
        assert 'feature_flag.result.value' not in middle.events[0].attributes
        assert 'feature_flag.result.reason.inExperiment' not in middle.events[0].attributes

        assert top.events[0].name == 'feature_flag'
        assert top.events[0].attributes['feature_flag.key'] == 'boolean'
        assert top.events[0].attributes['feature_flag.provider.name'] == 'LaunchDarkly'
        assert top.events[0].attributes['feature_flag.context.id'] == 'org:org-key'
        assert top.events[0].attributes['feature_flag.result.variationIndex'] == '0'
        assert 'feature_flag.result.value' not in top.events[0].attributes
        assert 'feature_flag.result.reason.inExperiment' not in top.events[0].attributes

    def test_records_in_experiment_attribute(self, exporter: SpanExporter, tracer: Tracer):
        series_context = EvaluationSeriesContext(
            key='experiment-flag',
            context=Context.create('org-key', 'org'),
            default_value=False,
            method='variation',
        )

        # Create an EvaluationDetail with inExperiment=True in the reason
        detail = EvaluationDetail(
            value=True,
            variation_index=1,
            reason={"inExperiment": True}
        )

        hook = Hook()
        with tracer.start_as_current_span("test_records_in_experiment_attribute"):
            data = hook.before_evaluation(series_context, {})  # type: ignore
            hook.after_evaluation(series_context, data, detail)  # type: ignore

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 1
        assert len(spans[0].events) == 1

        event = spans[0].events[0]
        assert event.name == 'feature_flag'
        assert event.attributes['feature_flag.key'] == 'experiment-flag'
        assert event.attributes['feature_flag.provider.name'] == 'LaunchDarkly'
        assert event.attributes['feature_flag.context.id'] == 'org:org-key'
        assert event.attributes['feature_flag.result.variationIndex'] == '1'
        assert event.attributes['feature_flag.result.reason.inExperiment'] == 'true'
        assert 'feature_flag.result.value' not in event.attributes

    def test_does_not_include_variation_index_when_none(self, exporter: SpanExporter, tracer: Tracer):
        series_context = EvaluationSeriesContext(
            key='flag-without-variation',
            context=Context.create('org-key', 'org'),
            default_value=False,
            method='variation',
        )

        detail = EvaluationDetail(
            value=False,
            variation_index=None,
            reason={"kind": "FALLTHROUGH"}
        )

        hook = Hook()
        with tracer.start_as_current_span("test_does_not_include_variation_index_when_none"):
            data = hook.before_evaluation(series_context, {})  # type: ignore
            hook.after_evaluation(series_context, data, detail)  # type: ignore

        spans = exporter.get_finished_spans()  # type: ignore[attr-defined]
        assert len(spans) == 1
        assert len(spans[0].events) == 1

        event = spans[0].events[0]
        assert event.name == 'feature_flag'
        assert event.attributes['feature_flag.key'] == 'flag-without-variation'
        assert event.attributes['feature_flag.provider.name'] == 'LaunchDarkly'
        assert event.attributes['feature_flag.context.id'] == 'org:org-key'
        # variationIndex should not be present when variation_index is None
        assert 'feature_flag.result.variationIndex' not in event.attributes
        assert 'feature_flag.result.reason.inExperiment' not in event.attributes
        assert 'feature_flag.result.value' not in event.attributes
