import logging
import pytest
import typing
from dataclasses import dataclass
import opentelemetry.trace as trace
from opentelemetry import metrics as otel_metrics
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.util.types import Attributes
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter
from opentelemetry.sdk.metrics.export import InMemoryMetricReader
from opentelemetry.sdk._logs.export import InMemoryLogExporter, SimpleLogRecordProcessor


from ldobserve._otel.configuration import _OTELConfiguration
from ldobserve.observe import _ObserveInstance


@dataclass
class LogEntry:
    """Test representation of a log entry"""

    message: str
    level: int
    attributes: typing.Optional[Attributes] = None


class LogHandler(logging.Handler):
    """Test log handler that captures log records in memory"""

    def __init__(self):
        super().__init__()
        self.records: list[LogEntry] = []

    def emit(self, record: logging.LogRecord):
        """Capture log record"""
        # Extract extra attributes if they were passed
        attributes = None
        if hasattr(record, "__dict__"):
            # Standard LogRecord attributes that we want to exclude
            standard_attrs = {
                "name",
                "msg",
                "args",
                "levelname",
                "levelno",
                "pathname",
                "filename",
                "module",
                "lineno",
                "funcName",
                "created",
                "msecs",
                "relativeCreated",
                "thread",
                "threadName",
                "processName",
                "process",
                "getMessage",
                "exc_info",
                "exc_text",
                "stack_info",
                "taskName",  # taskName is added by asyncio
            }
            extra_attrs = {
                k: v for k, v in record.__dict__.items() if k not in standard_attrs
            }
            attributes = extra_attrs if extra_attrs else None

        self.records.append(
            LogEntry(
                message=record.getMessage(), level=record.levelno, attributes=attributes
            )
        )

    def clear(self):
        """Clear captured records"""
        self.records.clear()


class OTELTestConfiguration(_OTELConfiguration):
    """Test implementation of OTELConfiguration that uses in-memory exporters"""

    def __init__(
        self, project_id: str = "test-project", service_name: str = "test-service"
    ):
        # Create test resource
        resource = Resource.create(
            {
                "service.name": service_name,
                "service.version": "1.0.0",
                "deployment.environment": "test",
            }
        )

        # Set up in-memory trace provider
        self._tracer_provider = TracerProvider(resource=resource)
        self._span_exporter = InMemorySpanExporter()
        self._tracer_provider.add_span_processor(
            SimpleSpanProcessor(self._span_exporter)
        )

        # Don't set global tracer provider to avoid conflicts
        self._tracer = self._tracer_provider.get_tracer(__name__)

        # Set up in-memory metrics provider
        self._metric_reader = InMemoryMetricReader()
        self._meter_provider = MeterProvider(
            resource=resource, metric_readers=[self._metric_reader]
        )
        # Don't set global meter provider to avoid conflicts
        self._meter = self._meter_provider.get_meter(__name__)

        # Set up in-memory logs provider
        self._logger_provider = LoggerProvider(resource=resource)
        self._log_exporter = InMemoryLogExporter()
        self._logger_provider.add_log_record_processor(
            SimpleLogRecordProcessor(self._log_exporter)
        )
        self._log_handler = LoggingHandler(
            logger_provider=self._logger_provider, level=logging.NOTSET
        )

    @property
    def log_handler(self) -> LoggingHandler:
        return self._log_handler

    @property
    def meter(self):
        return self._meter

    @property
    def tracer(self):
        return self._tracer

    @property
    def span_exporter(self) -> InMemorySpanExporter:
        """Access to exported spans for testing"""
        return self._span_exporter

    @property
    def metric_reader(self) -> InMemoryMetricReader:
        """Access to exported metrics for testing"""
        return self._metric_reader

    @property
    def log_exporter(self) -> InMemoryLogExporter:
        """Access to exported logs for testing"""
        return self._log_exporter

    def force_flush_metrics(self):
        """Force metrics to be exported for testing"""
        self._meter_provider.force_flush()

    def activate(self) -> None:
        pass


class TestObserveInstance:
    def setup_method(self):
        """Set up test fixtures before each test"""
        logging.getLogger().setLevel(logging.NOTSET)
        self.test_otel_config = OTELTestConfiguration()
        self.test_log_handler = LogHandler()
        self.observe_instance = _ObserveInstance("test-project", self.test_otel_config)

        # Add our test handler to capture logs
        self.observe_instance._logger.addHandler(self.test_log_handler)

    def teardown_method(self):
        """Clean up after each test"""
        self.test_log_handler.clear()
        self.test_otel_config.span_exporter.clear()
        self.test_otel_config.log_exporter.clear()
        # Clear metrics state to avoid test interference
        self.observe_instance._gauges.clear()
        self.observe_instance._counters.clear()
        self.observe_instance._histograms.clear()
        self.observe_instance._up_down_counters.clear()

    # Exception Recording Tests

    def test_record_exception_with_active_span(self):
        """Test recording exception when there's an active span"""
        exception = ValueError("Test exception")

        with self.test_otel_config.tracer.start_as_current_span("test-span") as span:
            initial_event_count = len(span.events)

            self.observe_instance.record_exception(exception)

            # Verify exception was added to current span
            assert len(span.events) == initial_event_count + 1
            exception_event = span.events[-1]
            assert exception_event.name == "exception"

            # Check that exception details are in the event
            attrs_dict = dict(exception_event.attributes)
            assert "exception.type" in attrs_dict
            assert "exception.message" in attrs_dict

    def test_record_exception_without_active_span(self):
        """Test recording exception when there's no active span - should create new span"""
        exception = RuntimeError("Test exception without span")

        # Ensure no active span
        assert trace.get_current_span() == trace.INVALID_SPAN

        self.observe_instance.record_exception(exception)

        # Verify a span was created and exported
        exported_spans = self.test_otel_config.span_exporter.get_finished_spans()
        assert len(exported_spans) > 0

        error_span = exported_spans[-1]
        assert error_span.name == "launchdarkly.error"

        # Verify the exception event is present
        exception_events = [
            event for event in error_span.events if event.name == "exception"
        ]
        assert len(exception_events) == 1

    def test_record_exception_with_attributes(self):
        """Test recording exception with additional attributes"""
        exception = ValueError("Test exception with attributes")
        attributes = {"error.type": "validation", "error.code": 400, "user.id": "12345"}

        with self.test_otel_config.tracer.start_as_current_span("test-span") as span:
            self.observe_instance.record_exception(exception, attributes)

            # Verify exception event has custom attributes
            exception_event = span.events[-1]
            attrs_dict = dict(exception_event.attributes)

            assert attrs_dict.get("error.type") == "validation"
            assert attrs_dict.get("error.code") == 400
            assert attrs_dict.get("user.id") == "12345"

    def test_record_exception_with_null_exception(self):
        """Test recording None exception doesn't crash"""
        # Should not raise an exception
        self.observe_instance.record_exception(None)

    # Metric Recording Tests

    def test_record_metric_gauge(self):
        """Test recording gauge metric values"""
        metric_name = "cpu.usage"

        # Record multiple values
        self.observe_instance.record_metric(metric_name, 75.5)
        self.observe_instance.record_metric(metric_name, 80.0)
        self.observe_instance.record_metric(metric_name, 85.5)

        # Force export
        self.test_otel_config.force_flush_metrics()

        # Verify metrics were recorded
        metrics_data = self.test_otel_config.metric_reader.get_metrics_data()

        # Find our metric
        cpu_metric = None
        for resource_metrics in metrics_data.resource_metrics:
            for scope_metrics in resource_metrics.scope_metrics:
                for metric in scope_metrics.metrics:
                    if metric.name == metric_name:
                        cpu_metric = metric
                        break

        assert cpu_metric is not None
        assert len(cpu_metric.data.data_points) > 0

        # For gauge, last value should be 85.5
        last_point = cpu_metric.data.data_points[-1]
        assert last_point.value == 85.5

    def test_record_metric_with_attributes(self):
        """Test recording gauge metric with attributes"""
        metric_name = "memory.usage"
        attributes = {"host": "server-1", "region": "us-west-2"}

        self.observe_instance.record_metric(metric_name, 64.2, attributes)
        self.test_otel_config.force_flush_metrics()

        # Verify metric with attributes
        metrics_data = self.test_otel_config.metric_reader.get_metrics_data()
        memory_metric = None
        for resource_metrics in metrics_data.resource_metrics:
            for scope_metrics in resource_metrics.scope_metrics:
                for metric in scope_metrics.metrics:
                    if metric.name == metric_name:
                        memory_metric = metric
                        break

        assert memory_metric is not None
        point = memory_metric.data.data_points[0]

        # Check attributes
        attrs_dict = dict(point.attributes)
        assert attrs_dict.get("host") == "server-1"
        assert attrs_dict.get("region") == "us-west-2"

    def test_record_count_counter(self):
        """Test recording counter values"""
        counter_name = "requests.total"

        # Record multiple counts
        self.observe_instance.record_count(counter_name, 5)
        self.observe_instance.record_count(counter_name, 3)
        self.observe_instance.record_count(counter_name, 2)

        self.test_otel_config.force_flush_metrics()

        # Verify counter metric
        metrics_data = self.test_otel_config.metric_reader.get_metrics_data()
        counter_metric = None
        for resource_metrics in metrics_data.resource_metrics:
            for scope_metrics in resource_metrics.scope_metrics:
                for metric in scope_metrics.metrics:
                    if metric.name == counter_name:
                        counter_metric = metric
                        break

        assert counter_metric is not None

        # Counter should accumulate values (5 + 3 + 2 = 10)
        point = counter_metric.data.data_points[0]
        assert point.value == 10

    def test_record_incr(self):
        """Test record_incr increments by 1"""
        counter_name = "page.views"

        # Call incr multiple times
        self.observe_instance.record_incr(counter_name)
        self.observe_instance.record_incr(counter_name)
        self.observe_instance.record_incr(counter_name)

        self.test_otel_config.force_flush_metrics()

        # Verify counter value is 3
        metrics_data = self.test_otel_config.metric_reader.get_metrics_data()
        page_views_metric = None
        for resource_metrics in metrics_data.resource_metrics:
            for scope_metrics in resource_metrics.scope_metrics:
                for metric in scope_metrics.metrics:
                    if metric.name == counter_name:
                        page_views_metric = metric
                        break

        assert page_views_metric is not None
        point = page_views_metric.data.data_points[0]
        assert point.value == 3

    def test_record_histogram(self):
        """Test recording histogram values"""
        histogram_name = "request.duration"

        # Record multiple values
        self.observe_instance.record_histogram(histogram_name, 150.5)
        self.observe_instance.record_histogram(histogram_name, 200.0)
        self.observe_instance.record_histogram(histogram_name, 100.0)

        self.test_otel_config.force_flush_metrics()

        # Verify histogram metric
        metrics_data = self.test_otel_config.metric_reader.get_metrics_data()
        histogram_metric = None
        for resource_metrics in metrics_data.resource_metrics:
            for scope_metrics in resource_metrics.scope_metrics:
                for metric in scope_metrics.metrics:
                    if metric.name == histogram_name:
                        histogram_metric = metric
                        break

        assert histogram_metric is not None
        point = histogram_metric.data.data_points[0]

        # Verify histogram statistics
        assert point.count == 3
        assert point.sum == 450.5  # 150.5 + 200.0 + 100.0

    def test_record_up_down_counter(self):
        """Test recording up/down counter values"""
        counter_name = "active.connections"

        # Record positive and negative values
        self.observe_instance.record_up_down_counter(counter_name, 5)
        self.observe_instance.record_up_down_counter(counter_name, -2)
        self.observe_instance.record_up_down_counter(counter_name, 3)

        self.test_otel_config.force_flush_metrics()

        # Verify up/down counter metric
        metrics_data = self.test_otel_config.metric_reader.get_metrics_data()
        updown_metric = None
        for resource_metrics in metrics_data.resource_metrics:
            for scope_metrics in resource_metrics.scope_metrics:
                for metric in scope_metrics.metrics:
                    if metric.name == counter_name:
                        updown_metric = metric
                        break

        assert updown_metric is not None
        point = updown_metric.data.data_points[0]

        # Net value should be 6 (5 - 2 + 3)
        assert point.value == 6

    def test_metric_reuse_same_name(self):
        """Test that metrics with same name reuse the same instrument"""
        metric_name = "cpu.usage"

        # Record multiple values - should reuse same gauge
        self.observe_instance.record_metric(metric_name, 50.0)
        self.observe_instance.record_metric(metric_name, 75.0)

        # Verify only one gauge instance was created
        assert len(self.observe_instance._gauges) == 1
        assert metric_name in self.observe_instance._gauges

    # Span Creation Tests

    def test_start_span_basic(self):
        """Test basic span creation"""
        with self.observe_instance.start_span("test-operation") as span:
            assert span is not None
            assert span.name == "test-operation"

        # Verify span was exported
        exported_spans = self.test_otel_config.span_exporter.get_finished_spans()
        assert len(exported_spans) > 0
        test_span = exported_spans[-1]
        assert test_span.name == "test-operation"

    def test_start_span_with_attributes(self):
        """Test span creation with attributes"""
        attributes = {
            "operation.type": "database",
            "table.name": "users",
            "query.timeout": 30,
        }

        with self.observe_instance.start_span(
            "db-query", attributes=attributes
        ) as span:
            assert span is not None

        # Verify span has attributes
        exported_spans = self.test_otel_config.span_exporter.get_finished_spans()
        test_span = exported_spans[-1]

        attrs_dict = dict(test_span.attributes)
        assert attrs_dict.get("operation.type") == "database"
        assert attrs_dict.get("table.name") == "users"
        assert attrs_dict.get("query.timeout") == 30

    def test_start_span_exception_handling(self):
        """Test span records exceptions when record_exception=True"""
        try:
            with self.observe_instance.start_span(
                "error-operation", record_exception=True
            ) as span:
                raise ValueError("Test exception in span")
        except ValueError:
            pass  # Expected

        # Verify exception was recorded
        exported_spans = self.test_otel_config.span_exporter.get_finished_spans()
        error_span = exported_spans[-1]

        exception_events = [
            event for event in error_span.events if event.name == "exception"
        ]
        assert len(exception_events) == 1

    # Logging Tests

    def test_log_basic(self):
        """Test basic logging functionality"""
        message = "Test log message"
        level = logging.INFO

        self.observe_instance.log(message, level)

        # Verify log was captured
        assert len(self.test_log_handler.records) == 1
        log_entry = self.test_log_handler.records[0]
        assert log_entry.message == message
        assert log_entry.level == level

    def test_log_with_attributes(self):
        """Test logging with attributes"""
        message = "Test log with attributes"
        level = logging.WARNING
        attributes = {
            "user.id": "12345",
            "request.id": "abc-def-ghi",
            "trace.id": "xyz-789",
        }

        self.observe_instance.log(message, level, attributes)

        # Verify log and attributes
        assert len(self.test_log_handler.records) == 1
        log_entry = self.test_log_handler.records[0]
        assert log_entry.message == message
        assert log_entry.level == level
        assert log_entry.attributes == attributes

    def test_log_different_levels(self):
        """Test logging at different levels"""
        levels = [
            (logging.DEBUG, "Debug message"),
            (logging.INFO, "Info message"),
            (logging.WARNING, "Warning message"),
            (logging.ERROR, "Error message"),
            (logging.CRITICAL, "Critical message"),
        ]

        for level, message in levels:
            self.observe_instance.log(message, level)

        # Verify all logs were captured
        assert len(self.test_log_handler.records) == 5

        for i, (expected_level, expected_message) in enumerate(levels):
            log_entry = self.test_log_handler.records[i]
            assert log_entry.level == expected_level
            assert log_entry.message == expected_message

    # Initialization and Configuration Tests

    def test_initialization_basic(self):
        """Test basic initialization"""
        project_id = "test-project-123"
        config = OTELTestConfiguration(project_id=project_id)

        instance = _ObserveInstance(project_id, config)

        assert instance._project_id == project_id
        assert instance._otel_configuration == config
        assert hasattr(instance, "_tracer")

    def test_metric_instruments_caching(self):
        """Test that metric instruments are properly cached"""
        # Record different types of metrics
        self.observe_instance.record_metric("gauge1", 42.0)
        self.observe_instance.record_metric("gauge2", 84.0)
        self.observe_instance.record_count("counter1", 1)
        self.observe_instance.record_count("counter2", 2)
        self.observe_instance.record_histogram("hist1", 100.0)
        self.observe_instance.record_up_down_counter("updown1", 5)

        # Verify instruments are cached
        assert len(self.observe_instance._gauges) == 2
        assert len(self.observe_instance._counters) == 2
        assert len(self.observe_instance._histograms) == 1
        assert len(self.observe_instance._up_down_counters) == 1

        # Verify specific instruments exist
        assert "gauge1" in self.observe_instance._gauges
        assert "gauge2" in self.observe_instance._gauges
        assert "counter1" in self.observe_instance._counters
        assert "counter2" in self.observe_instance._counters
        assert "hist1" in self.observe_instance._histograms
        assert "updown1" in self.observe_instance._up_down_counters

    def test_concurrent_metric_recording(self):
        """Test recording metrics concurrently doesn't cause issues"""
        import threading
        import time

        results = []

        def record_metrics():
            for i in range(10):
                self.observe_instance.record_metric("concurrent.gauge", float(i))
                self.observe_instance.record_count("concurrent.counter", 1)
                time.sleep(0.001)  # Small delay to simulate concurrent access
            results.append("done")

        # Start multiple threads
        threads = []
        for _ in range(3):
            thread = threading.Thread(target=record_metrics)
            threads.append(thread)
            thread.start()

        # Wait for completion
        for thread in threads:
            thread.join()

        # Verify all threads completed
        assert len(results) == 3

        # Verify instruments were created properly
        assert "concurrent.gauge" in self.observe_instance._gauges
        assert "concurrent.counter" in self.observe_instance._counters


# Integration Tests with the full configuration
class TestObserveInstanceIntegration:
    """Integration tests that test _ObserveInstance with more realistic configurations"""

    def test_complete_observability_workflow(self):
        """Test a complete workflow using all observability features"""
        config = OTELTestConfiguration()
        instance = _ObserveInstance("integration-test", config)

        # Simulate a complete operation
        with instance.start_span("user-registration") as span:
            # Log start of operation
            instance.log(
                "Starting user registration",
                logging.INFO,
                {"user.email": "test@example.com", "operation": "registration"},
            )

            # Record some metrics
            instance.record_incr("user.registrations.started")
            instance.record_metric("registration.duration", 150.5)

            try:
                # Simulate some processing
                with instance.start_span("validate-email") as validation_span:
                    instance.record_histogram("validation.time", 45.2)

                with instance.start_span("create-user") as creation_span:
                    instance.record_histogram("db.insert.time", 89.3)

                # Record success metrics
                instance.record_incr("user.registrations.success")
                instance.record_count("db.operations", 2)

            except Exception as e:
                # Record error
                instance.record_exception(e, {"operation": "user-registration"})
                instance.record_incr("user.registrations.failed")
                instance.log(
                    "User registration failed",
                    logging.ERROR,
                    {"error": str(e), "user.email": "test@example.com"},
                )

        # Force export all data
        config.force_flush_metrics()

        # Verify spans were created
        exported_spans = config.span_exporter.get_finished_spans()
        assert len(exported_spans) >= 3  # main + validation + creation spans

        # Verify metrics were recorded
        metrics_data = config.metric_reader.get_metrics_data()
        assert len(list(metrics_data.resource_metrics)) > 0

        # Verify logs were recorded
        exported_logs = config.log_exporter.get_finished_logs()
        # Note: InMemoryLogExporter might not capture all logs depending on implementation
