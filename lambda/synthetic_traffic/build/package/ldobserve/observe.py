import contextlib
import logging
import typing
from opentelemetry.context import Context
from opentelemetry.instrumentation.logging import LEVELS
from opentelemetry.sdk._logs import LoggingHandler
from opentelemetry.trace import Span, Tracer
import opentelemetry.trace as trace
from opentelemetry.util.types import Attributes
from opentelemetry._logs import get_logger_provider
from ldobserve._otel.configuration import _OTELConfiguration
from ldobserve._util.dict import flatten_dict

from opentelemetry.metrics import (
    _Gauge as APIGauge,
    Histogram as APIHistogram,
    Counter as APICounter,
    UpDownCounter as APIUpDownCounter,
)

_NAME = "launchdarkly-observability"
_ERROR_NAME = "launchdarkly.error"


class _ObserveInstance:
    _project_id: str
    _tracer: Tracer

    _provider = get_logger_provider()
    _logger = logging.getLogger(__name__)
    _otel_configuration: _OTELConfiguration

    _gauges: dict[str, APIGauge] = dict()
    _counters: dict[str, APICounter] = dict()
    _histograms: dict[str, APIHistogram] = dict()
    _up_down_counters: dict[str, APIUpDownCounter] = dict()

    @property
    def log_handler(self) -> logging.Handler:
        return self._otel_configuration.log_handler

    def __init__(self, project_id: str, otel_configuration: _OTELConfiguration):
        self._otel_configuration = otel_configuration

        # Logger that will only log to OpenTelemetry.
        self._logger.propagate = False
        self._logger.addHandler(otel_configuration.log_handler)
        self._project_id = project_id
        self._tracer = otel_configuration.tracer

    def record_exception(
        self, error: Exception, attributes: typing.Optional[Attributes] = None
    ):
        if error is None:
            return  # Nothing to record

        span = trace.get_current_span()
        ctx = contextlib.nullcontext(span)
        if not span or not span.is_recording():
            ctx = self.start_span(_ERROR_NAME)

        with ctx as span:
            attrs = {}
            if attributes:
                addedAttributes = flatten_dict(attributes, sep=".")
                attrs.update(addedAttributes)

            span.record_exception(error, attrs)

    def record_metric(
        self, name: str, value: float, attributes: typing.Optional[Attributes] = None
    ):
        if name not in self._gauges:
            self._gauges[name] = self._otel_configuration.meter.create_gauge(name)
        self._gauges[name].set(value, attributes=attributes)

    def record_count(
        self, name: str, value: int, attributes: typing.Optional[Attributes] = None
    ):
        if name not in self._counters:
            self._counters[name] = self._otel_configuration.meter.create_counter(name)
        self._counters[name].add(value, attributes=attributes)

    def record_incr(self, name: str, attributes: typing.Optional[Attributes] = None):
        return self.record_count(name, 1, attributes)

    def record_histogram(
        self, name: str, value: float, attributes: typing.Optional[Attributes] = None
    ):
        if name not in self._histograms:
            self._histograms[name] = self._otel_configuration.meter.create_histogram(
                name
            )
        self._histograms[name].record(value, attributes=attributes)

    def record_up_down_counter(
        self, name: str, value: int, attributes: typing.Optional[Attributes] = None
    ):
        if name not in self._up_down_counters:
            self._up_down_counters[name] = (
                self._otel_configuration.meter.create_up_down_counter(name)
            )
        self._up_down_counters[name].add(value, attributes=attributes)

    def log(
        self, message: str, level: int, attributes: typing.Optional[Attributes] = None
    ):
        self._logger.log(level, message, extra=attributes)

    @contextlib.contextmanager
    def start_span(
        self,
        name: str,
        attributes: Attributes = None,
        record_exception: bool = True,
        set_status_on_exception: bool = True,
    ) -> typing.Iterator["Span"]:
        """
        Context manager for creating a new span and setting it as the current span.

        Exiting the context manager will call the span's end method,
        as well as return the current span to its previous value by
        returning to the previous context.

        Args:
            name: The name of the span.
            attributes: The attributes of the span.
            record_exception: Whether to record any exceptions raised within the
                context as error event on the span.
            set_status_on_exception: Only relevant if the returned span is used
                in a with/context manager. Defines whether the span status will

        Yields:
            The newly-created span.
        """
        with self._tracer.start_as_current_span(
            name,
            attributes=attributes,
            record_exception=record_exception,
            set_status_on_exception=set_status_on_exception,
        ) as span:
            yield span


_instance: typing.Optional[_ObserveInstance] = None


def _use_instance(func):
    """Helper function to delegate calls to the instance if it exists."""
    if not _instance:
        logging.getLogger(__name__).warning(
            "The observability singleton was used before it was initialized."
        )
        return
    return func(_instance)


def record_exception(error: Exception, attributes: typing.Optional[Attributes] = None):
    """
    Record arbitrary exceptions raised within your app.

    Example:
        import ldobserve.observe as observe
        # Observability plugin must be initialized.

        def my_fn():
            try:
                for i in range(20):
                    result = 100 / (10 - i)
                    print(f'dangerous: {result}')
            except Exception as e:
                observe.record_exception(e)


    :param e: the exception to record. the contents and stacktrace will be recorded.
    :param attributes: additional metadata to attribute to this error.
    :return: None
    """
    _use_instance(lambda instance: instance.record_exception(error, attributes))


def record_metric(
    name: str, value: float, attributes: typing.Optional[Attributes] = None
):
    """
    Record arbitrary metric values via as a Gauge.
    A Gauge records any point-in-time measurement, such as the current CPU utilization %.
    Values with the same metric name and attributes are aggregated via the OTel SDK.
    See https://opentelemetry.io/docs/specs/otel/metrics/data-model/ for more details.
    :param name: the name of the metric.
    :param value: the float value of the metric.
    :param attributes: additional metadata which can be used to filter and group values.
    :return: None
    """
    _use_instance(lambda instance: instance.record_metric(name, value, attributes))


def record_count(name: str, value: int, attributes: typing.Optional[Attributes] = None):
    """
    Record arbitrary metric values via as a Counter.
    A Counter efficiently records an increment in a metric, such as number of cache hits.
    Values with the same metric name and attributes are aggregated via the OTel SDK.
    See https://opentelemetry.io/docs/specs/otel/metrics/data-model/ for more details.
    :param name: the name of the metric.
    :param value: the float value of the metric.
    :param attributes: additional metadata which can be used to filter and group values.
    :return: None
    """
    _use_instance(lambda instance: instance.record_count(name, value, attributes))


def record_incr(name: str, attributes: typing.Optional[Attributes] = None):
    """
    Record arbitrary metric +1 increment via as a Counter.
    A Counter efficiently records an increment in a metric, such as number of cache hits.
    Values with the same metric name and attributes are aggregated via the OTel SDK.
    See https://opentelemetry.io/docs/specs/otel/metrics/data-model/ for more details.
    :param name: the name of the metric.
    :param attributes: additional metadata which can be used to filter and group values.
    :return: None
    """
    _use_instance(lambda instance: instance.record_incr(name, attributes))


def record_histogram(
    name: str, value: float, attributes: typing.Optional[Attributes] = None
):
    """
    Record arbitrary metric values via as a Histogram.
    A Histogram efficiently records near-by point-in-time measurement into a bucketed aggregate.
    Values with the same metric name and attributes are aggregated via the OTel SDK.
    See https://opentelemetry.io/docs/specs/otel/metrics/data-model/ for more details.
    :param name: the name of the metric.
    :param value: the float value of the metric.
    :param attributes: additional metadata which can be used to filter and group values.
    :return: None
    """
    _use_instance(lambda instance: instance.record_histogram(name, value, attributes))


def record_up_down_counter(
    name: str, value: int, attributes: typing.Optional[Attributes] = None
):
    """
    Record arbitrary metric values via as a UpDownCounter.
    A UpDownCounter efficiently records an increment or decrement in a metric, such as number of paying customers.
    Values with the same metric name and attributes are aggregated via the OTel SDK.
    See https://opentelemetry.io/docs/specs/otel/metrics/data-model/ for more details.
    :param name: the name of the metric.
    :param value: the float value of the metric.
    :param attributes: additional metadata which can be used to filter and group values.
    :return: None
    """
    _use_instance(
        lambda instance: instance.record_up_down_counter(name, value, attributes)
    )


def record_log(
    message: str,
    level: int,
    attributes: typing.Optional[Attributes] = None,
):
    """
    Records a log. This log will be recorded to LaunchDarkly, but will not be send to other log handlers.
    A Log records a message with a level and optional attributes.
    :param message: the message to record.
    :param level: the level of the log.
    :param attributes: additional metadata which can be used to filter and group values.
    :return: None
    """
    _use_instance(lambda instance: instance.log(message, level, attributes))


def logging_handler() -> logging.Handler:
    """A logging handler implementing `logging.Handler` that allows plugging LaunchDarkly Observability
    into your existing logging setup. Standard logging will be automatically instrumented unless
    :class:`ObservabilityConfig.instrument_logging <ldobserve.config.ObservabilityConfig.instrument_logging>` is set to False.

    Example:
        import ldobserve.observe as observe
        from loguru import logger

        # Observability plugin must be initialized.
        # If the Observability plugin is not initialized, then a NullHandler will be returned.

        logger.add(
            observe.logging_handler(),
            format="{message}",
            level="INFO",
            backtrace=True,
        )
    """
    if not _instance:
        return logging.NullHandler()
    return _instance.log_handler


@contextlib.contextmanager
def start_span(
    name: str,
    attributes: Attributes = None,
    record_exception: bool = True,
    set_status_on_exception: bool = True,
) -> typing.Iterator["Span"]:
    """
    Context manager for creating a new span and setting it as the current span.

    Exiting the context manager will call the span's end method,
    as well as return the current span to its previous value by
    returning to the previous context.

    Args:
        name: The name of the span.
        attributes: The attributes of the span.
        record_exception: Whether to record any exceptions raised within the
            context as error event on the span.
        set_status_on_exception: Only relevant if the returned span is used
            in a with/context manager. Defines whether the span status will

    Yields:
        The newly-created span.
    """
    if _instance:
        with _instance.start_span(
            name,
            attributes=attributes,
            record_exception=record_exception,
            set_status_on_exception=set_status_on_exception,
        ) as span:
            yield span
    else:
        # If not initialized, then get a tracer and use it to create a span.
        # We don't want to prevent user code from executing correctly if
        # the plugin is not initialized.
        logging.getLogger(__name__).warning(
            "The observability singleton was used before it was initialized."
        )
        with trace.get_tracer(__name__).start_as_current_span(
            name,
            attributes=attributes,
            record_exception=record_exception,
            set_status_on_exception=set_status_on_exception,
        ) as span:
            yield span


def is_initialized() -> bool:
    return _instance != None
