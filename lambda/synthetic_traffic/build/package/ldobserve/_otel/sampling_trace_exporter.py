from typing import List, Optional, Dict, Union, Sequence, Tuple
from opentelemetry.sdk.trace.export import SpanExportResult
from opentelemetry.sdk.trace import ReadableSpan
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
import grpc
from ._sampling.custom_sampler import ExportSampler


def _clone_readable_span_with_attributes(
    span: ReadableSpan,
    attributes: Dict[str, Union[str, int, float, bool]],
) -> ReadableSpan:
    """Clone a ReadableSpan with merged attributes."""
    # Create a new span with merged attributes
    merged_attributes = dict(span.attributes or {})
    merged_attributes.update(attributes)

    return ReadableSpan(
        name=span.name,
        context=span.get_span_context(),
        parent=span.parent,
        resource=span.resource,
        instrumentation_scope=span.instrumentation_scope,
        attributes=merged_attributes,
        events=span.events,
        links=span.links,
        status=span.status,
        start_time=span.start_time,
        end_time=span.end_time,
        kind=span.kind,
    )


def _sample_spans(
    items: List[ReadableSpan],
    sampler: ExportSampler,
) -> List[ReadableSpan]:
    """Sample spans based on the sampler configuration."""
    if not sampler.is_sampling_enabled():
        return items

    omitted_span_ids: List[int] = []
    span_by_id: Dict[int, ReadableSpan] = {}
    children_by_parent_id: Dict[int, List[int]] = {}

    # First pass: sample items and build parent-child relationships
    for item in items:
        span_context = item.get_span_context()
        if span_context is None:
            continue

        # Try to get parent span ID - this might not be available on all span types
        parent_span_id = item.parent.span_id if item.parent else None
        if parent_span_id:
            if parent_span_id not in children_by_parent_id:
                children_by_parent_id[parent_span_id] = []
            children_by_parent_id[parent_span_id].append(span_context.span_id)

        sample_result = sampler.sample_span(item)
        if sample_result.sample:
            if sample_result.attributes:
                span_by_id[span_context.span_id] = _clone_readable_span_with_attributes(
                    item, sample_result.attributes
                )
            else:
                span_by_id[span_context.span_id] = item
        else:
            omitted_span_ids.append(span_context.span_id)

    # Remove children of spans that have been sampled out
    while omitted_span_ids:
        span_id = omitted_span_ids.pop(0)
        affected_spans = children_by_parent_id.get(span_id)
        if not affected_spans:
            continue

        for span_id_to_remove in affected_spans:
            if span_id_to_remove in span_by_id:
                del span_by_id[span_id_to_remove]
            omitted_span_ids.append(span_id_to_remove)

    return list(span_by_id.values())


class SamplingTraceExporter(OTLPSpanExporter):
    """Trace exporter that applies sampling before exporting."""

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

    def export(self, spans: List[ReadableSpan]) -> SpanExportResult:
        """Export spans with sampling applied."""
        sampled_spans = _sample_spans(spans, self.sampler)
        if not sampled_spans:
            return SpanExportResult.SUCCESS

        return super().export(sampled_spans)
