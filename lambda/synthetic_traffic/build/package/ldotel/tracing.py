import json
import warnings
from dataclasses import dataclass

from ldclient.evaluation import EvaluationDetail
from ldclient.hook import EvaluationSeriesContext
from ldclient.hook import Hook as LDHook
from ldclient.hook import Metadata
from opentelemetry import trace
from opentelemetry.context import attach, detach
from opentelemetry.trace import Span, get_current_span, set_span_in_context


@dataclass
class HookOptions:
    add_spans: bool = False
    """
    Experimental: If set to true, then the tracing hook will add spans for each
    variation method call. Span events are always added and are unaffected by
    this setting.

    This feature is experimental and the data in the spans, or nesting of
    spans, could change in future versions.
    """

    include_variant: bool = False
    """
    If set to true, then the tracing hook will add the evaluated flag value to
    span events.

    .. deprecated:: 1.0.0
        This option is deprecated and will be removed in a future version.
        Use :attr:`include_value` instead.
    """

    include_value: bool = False
    """
    If set to true, then the tracing hook will add the evaluated flag value to
    span events.
    """


class Hook(LDHook):
    def __init__(self, options: HookOptions = HookOptions()):
        self.__tracer = trace.get_tracer_provider().get_tracer("launchdarkly")
        self.__options = options
        if self.__options.include_variant:
            warnings.warn(
                "The 'include_variant' option is deprecated and will be removed in a future version. "
                "Use 'include_value' instead.",
                DeprecationWarning,
            )

    @property
    def metadata(self) -> Metadata:
        """
        Get metadata about the hook implementation.
        """
        return Metadata(name='LaunchDarkly Tracing Hook')

    def before_evaluation(self, series_context: EvaluationSeriesContext, data: dict) -> dict:
        """
        The before method is called during the execution of a variation method
        before the flag value has been determined. The method is executed
        synchronously.

        :param series_context: Contains information about the evaluation being performed. This is not mutable.
        :param data: A record associated with each stage of hook invocations.
            Each stage is called with the data of the previous stage for a series.
            The input record should not be modified.
        :return: Data to use when executing the next state of the hook in the evaluation series.
        """
        if self.__options.add_spans is False:
            return data

        attributes = {
            'feature_flag.context.id': series_context.context.fully_qualified_key,
            'feature_flag.key': series_context.key,
        }

        span = self.__tracer.start_span(name=series_context.method, attributes=attributes)
        ctx = set_span_in_context(span)
        token = attach(ctx)

        return {**data, 'span': span, 'token': token}

    def after_evaluation(self, series_context: EvaluationSeriesContext, data: dict, detail: EvaluationDetail) -> dict:
        """
        The after method is called during the execution of the variation method
        after the flag value has been determined. The method is executed
        synchronously.

        :param series_context: Contains read-only information about the
            evaluation being performed.
        :param data: A record associated with each stage of hook invocations.
            Each stage is called with the data of the previous stage for a series.
        :param detail: The result of the evaluation. This value should not be modified.
        :return: Data to use when executing the next state of the hook in the evaluation series.
        """
        if isinstance(data.get("span"), Span):
            detach(data["token"])
            data["span"].end()

        span = get_current_span()
        if span is None:
            return data

        attributes = {
            'feature_flag.context.id': series_context.context.fully_qualified_key,
            'feature_flag.key': series_context.key,
            'feature_flag.provider.name': 'LaunchDarkly',
        }

        if detail.variation_index is not None:
            attributes['feature_flag.result.variationIndex'] = str(detail.variation_index)

        if detail.reason.get('inExperiment'):
            attributes['feature_flag.result.reason.inExperiment'] = 'true'

        if self.__options.include_value or self.__options.include_variant:
            attributes['feature_flag.result.value'] = json.dumps(detail.value)

        span.add_event('feature_flag', attributes=attributes)

        return data
