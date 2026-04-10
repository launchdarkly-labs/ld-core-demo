from typing import List, Optional, Dict, Union, Sequence, Tuple
from opentelemetry.sdk._logs import LogRecord, LogData  # type: ignore Not actually private.
from opentelemetry.sdk._logs.export import LogExportResult  # type: ignore Not actually private.
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter  # type: ignore Not actually private.
import grpc

from ._sampling.custom_sampler import ExportSampler


def _clone_log_record_with_attributes(
    log: LogData,
    attributes: Dict[str, Union[str, int, float, bool]],
) -> LogData:
    """Clone a LogRecord with merged attributes."""
    # Create a new log record with merged attributes
    merged_attributes = dict(log.log_record.attributes or {})
    merged_attributes.update(attributes)

    return LogData(
        log_record=LogRecord(
            body=log.log_record.body,
            attributes=merged_attributes,
            severity_text=log.log_record.severity_text,
            resource=log.log_record.resource,
            timestamp=log.log_record.timestamp,
            observed_timestamp=log.log_record.observed_timestamp,
            trace_id=log.log_record.trace_id,
            span_id=log.log_record.span_id,
            trace_flags=log.log_record.trace_flags,
            severity_number=log.log_record.severity_number,
        ),
        instrumentation_scope=log.instrumentation_scope,
    )


def _sample_logs(
    items: List[LogData],
    sampler: ExportSampler,
) -> List[LogData]:
    """Sample logs based on the sampler configuration."""
    if not sampler.is_sampling_enabled():
        return items

    sampled_logs: List[LogData] = []

    for item in items:
        sample_result = sampler.sample_log(item)
        if sample_result.sample:
            if sample_result.attributes:
                sampled_logs.append(
                    _clone_log_record_with_attributes(item, sample_result.attributes)
                )
            else:
                sampled_logs.append(item)
        # If not sampled, we simply don't include it in the result

    return sampled_logs


class SamplingLogExporter(OTLPLogExporter):
    """Log exporter that applies sampling before exporting."""

    def __init__(
        self,
        sampler: ExportSampler,
        endpoint: Optional[str] = None,
        insecure: Optional[bool] = None,
        credentials: Optional[grpc.ChannelCredentials] = None,
        headers: Optional[Union[Sequence[Tuple[str, str]], Dict[str, str], str]] = None,
        timeout: Optional[int] = None,
        compression: Optional[grpc.Compression] = None,
    ):
        super().__init__(
            endpoint=endpoint,
            insecure=insecure,
            credentials=credentials,
            headers=headers,
            timeout=timeout,
            compression=compression,
        )
        self.sampler = sampler

    def export(self, logs: List[LogData]) -> LogExportResult:
        """Export logs with sampling applied."""
        sampled_logs = _sample_logs(logs, self.sampler)
        if not sampled_logs:
            return LogExportResult.SUCCESS

        return super().export(sampled_logs)
