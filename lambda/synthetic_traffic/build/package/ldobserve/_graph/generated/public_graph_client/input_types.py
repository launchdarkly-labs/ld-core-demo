from typing import Any, List, Optional

from pydantic import Field

from .base_model import BaseModel


class StackFrameInput(BaseModel):
    function_name: Optional[str] = Field(alias="functionName", default=None)
    args: Optional[List[Optional[Any]]] = None
    file_name: Optional[str] = Field(alias="fileName", default=None)
    line_number: Optional[int] = Field(alias="lineNumber", default=None)
    column_number: Optional[int] = Field(alias="columnNumber", default=None)
    is_eval: Optional[bool] = Field(alias="isEval", default=None)
    is_native: Optional[bool] = Field(alias="isNative", default=None)
    source: Optional[str] = None


class ErrorObjectInput(BaseModel):
    event: str
    type: str
    url: str
    source: str
    line_number: int = Field(alias="lineNumber")
    column_number: int = Field(alias="columnNumber")
    stack_trace: List["StackFrameInput"] = Field(alias="stackTrace")
    timestamp: Any
    payload: Optional[str] = None
    id: Optional[str] = None


class ServiceInput(BaseModel):
    name: str
    version: str


class BackendErrorObjectInput(BaseModel):
    session_secure_id: Optional[str] = None
    request_id: Optional[str] = None
    trace_id: Optional[str] = None
    span_id: Optional[str] = None
    log_cursor: Optional[str] = None
    event: str
    type: str
    url: str
    source: str
    stack_trace: str = Field(alias="stackTrace")
    timestamp: Any
    payload: Optional[str] = None
    service: "ServiceInput"
    environment: str
    id: Optional[str] = None


class MetricTag(BaseModel):
    name: str
    value: str


class MetricInput(BaseModel):
    session_secure_id: str
    span_id: Optional[str] = None
    parent_span_id: Optional[str] = None
    trace_id: Optional[str] = None
    group: Optional[str] = None
    name: str
    value: float
    category: Optional[str] = None
    timestamp: Any
    tags: Optional[List["MetricTag"]] = None


class ReplayEventInput(BaseModel):
    type: int
    timestamp: float
    sid: float = Field(alias="_sid")
    data: Any


class ReplayEventsInput(BaseModel):
    events: List["ReplayEventInput"]


ErrorObjectInput.model_rebuild()
BackendErrorObjectInput.model_rebuild()
MetricInput.model_rebuild()
ReplayEventsInput.model_rebuild()
