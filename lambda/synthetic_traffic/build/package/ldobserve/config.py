from dataclasses import dataclass
import logging
import os
from typing import Optional

from opentelemetry.instrumentation.logging import OTEL_PYTHON_LOG_CORRELATION
from opentelemetry.sdk.environment_variables import (
    OTEL_EXPORTER_OTLP_ENDPOINT,
    _OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED,
)

_DEFAULT_OTLP_ENDPOINT = "https://otel.observability.app.launchdarkly.com:4317"
_DEFAULT_BACKEND_URL = "https://pub.observability.app.launchdarkly.com"
_DEFAULT_INSTRUMENT_LOGGING = True
_DEFAULT_LOG_LEVEL = logging.INFO
_DEFAULT_DISABLE_EXPORT_ERROR_LOGGING = False
_DEFAULT_LOG_CORRELATION = True
_DEFAULT_PROCESS_RESOURCES = True
_DEFAULT_OS_RESOURCES = True


@dataclass(kw_only=True)
class ObservabilityConfig:
    otlp_endpoint: Optional[str] = None
    """
    Used to set a custom OTLP endpoint.

    Alternatively, set the OTEL_EXPORTER_OTLP_ENDPOINT environment variable.
    """

    backend_url: Optional[str] = None
    """
    Specifies the URL used for non-OTLP operations.

    This includes accessing client sampling configuration.
    """

    instrument_logging: Optional[bool] = None
    """
    If True, the OpenTelemetry logging instrumentation will be enabled.

    If False, the OpenTelemetry logging instrumentation will be disabled.

    Alternatively, set the OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED environment variable.

    If a custom logging configuration is desired, then it should be configured before initializing the 
    Observability plugin. The Observability plugin will configure default logging prior to adding the 
    OpenTelemetry logging instrumentation.

    For example:
    >>> import logging
    >>> logging.basicConfig(level=logging.INFO)

    Defaults to True.
    """

    log_level: Optional[int] = None
    """
    The log level to use for the OpenTelemetry logging instrumentation.

    This does not affect the log level of the default logging configuration (stdout).

    Defaults to logging.INFO.
    """

    service_name: Optional[str] = None
    """
    The name of the service to use for the OpenTelemetry resource.

    Alternatively, set the OTEL_SERVICE_NAME environment variable.
    """

    service_version: Optional[str] = None
    """
    The version of the service to use for the OpenTelemetry resource.
    """

    environment: Optional[str] = None
    """
    The environment of the service to use for the OpenTelemetry resource.
    """

    disable_export_error_logging: Optional[bool] = None
    """
    If True, the OpenTelemetry export error logging will be disabled.

    Defaults to False.
    """

    log_correlation: Optional[bool] = None
    """
    If True, the logging format will be updated to enable log correlation.
    If :class:`ObservabilityConfig.instrument_logging` is False, then this setting will have no effect.
    If logging is configured before the Observability plugin is initialized, then this setting will have no effect.

    Any custom logging format will allow log correlation if it includes:
    - %(otelTraceID)s
    - %(otelSpanID)s
    - %(otelServiceName)s
    - %(otelTraceSampled)s

    The default logging format is:
    >>> "%(asctime)s %(levelname)s [%(name)s] [%(filename)s:%(lineno)d] [trace_id=%(otelTraceID)s span_id=%(otelSpanID)s resource.service.name=%(otelServiceName)s trace_sampled=%(otelTraceSampled)s] - %(message)s"

    Alternatively, set the OTEL_PYTHON_LOG_CORRELATION environment variable to "true".

    If the OTEL_PYTHON_LOG_FORMAT environment variable is set, then it will be used as the logging format.

    Defaults to True.
    """

    disabled_instrumentations: Optional[list[str]] = None
    """
    A list of OpenTelemetry instrumentations to disable.

    Alternatively the OTEL_PYTHON_DISABLED_INSTRUMENTATIONS environment variable can be used.

    If this list and the OTEL_PYTHON_DISABLED_INSTRUMENTATIONS environment variable are both set, then the lists will be combined.
    """

    process_resources: Optional[bool] = None
    """
    Determines if process resource attributes are included in the OpenTelemetry resource.

    If the OTEL_EXPERIMENTAL_RESOURCE_DETECTORS environment variable is set, then this setting will have no effect.

    Defaults to True.
    """

    os_resources: Optional[bool] = None
    """
    Determines if OS resource attributes are included in the OpenTelemetry resource.

        If the OTEL_EXPERIMENTAL_RESOURCE_DETECTORS environment variable is set, then this setting will have no effect.

    Defaults to True.
    """

    def __getitem__(self, key: str):
        return getattr(self, key)


@dataclass(kw_only=True)
class _ProcessedConfig:
    otlp_endpoint: str
    instrument_logging: bool
    log_level: int
    service_name: Optional[str] = None
    service_version: Optional[str] = None
    environment: Optional[str] = None
    disable_export_error_logging: bool
    log_correlation: bool
    disabled_instrumentations: list[str]
    backend_url: str
    process_resources: bool
    os_resources: bool

    def __init__(self, config: ObservabilityConfig):
        self.otlp_endpoint = config.otlp_endpoint or os.getenv(
            OTEL_EXPORTER_OTLP_ENDPOINT, _DEFAULT_OTLP_ENDPOINT
        )
        env_instrument_logging = os.getenv(
            _OTEL_PYTHON_LOGGING_AUTO_INSTRUMENTATION_ENABLED
        )
        self.backend_url = config.backend_url or _DEFAULT_BACKEND_URL

        self.instrument_logging = (
            config.instrument_logging
            if config.instrument_logging is not None
            else (
                env_instrument_logging.lower().strip() == "true"
                if env_instrument_logging is not None
                else _DEFAULT_INSTRUMENT_LOGGING
            )
        )
        self.log_level = (
            config.log_level if config.log_level is not None else _DEFAULT_LOG_LEVEL
        )
        self.service_name = config.service_name
        self.service_version = config.service_version
        self.environment = config.environment
        self.disable_export_error_logging = (
            config.disable_export_error_logging
            if config.disable_export_error_logging is not None
            else _DEFAULT_DISABLE_EXPORT_ERROR_LOGGING
        )

        env_log_correlation = os.getenv(OTEL_PYTHON_LOG_CORRELATION)

        self.log_correlation = (
            config.log_correlation
            if config.log_correlation is not None
            else (
                env_log_correlation.lower().strip() == "true"
                if env_log_correlation is not None
                else _DEFAULT_LOG_CORRELATION
            )
        )

        self.disabled_instrumentations = config.disabled_instrumentations or []

        self.process_resources = (
            config.process_resources
            if config.process_resources is not None
            else _DEFAULT_PROCESS_RESOURCES
        )

        self.os_resources = (
            config.os_resources
            if config.os_resources is not None
            else _DEFAULT_OS_RESOURCES
        )
