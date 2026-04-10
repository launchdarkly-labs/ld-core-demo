from typing import List, Optional

from pydantic import Field

from .base_model import BaseModel
from .fragments import MatchParts


class GetSamplingConfig(BaseModel):
    sampling: "GetSamplingConfigSampling"


class GetSamplingConfigSampling(BaseModel):
    spans: Optional[List["GetSamplingConfigSamplingSpans"]]
    logs: Optional[List["GetSamplingConfigSamplingLogs"]]


class GetSamplingConfigSamplingSpans(BaseModel):
    name: Optional["GetSamplingConfigSamplingSpansName"]
    attributes: Optional[List["GetSamplingConfigSamplingSpansAttributes"]]
    events: Optional[List["GetSamplingConfigSamplingSpansEvents"]]
    sampling_ratio: int = Field(alias="samplingRatio")


class GetSamplingConfigSamplingSpansName(MatchParts):
    pass


class GetSamplingConfigSamplingSpansAttributes(BaseModel):
    key: "GetSamplingConfigSamplingSpansAttributesKey"
    attribute: "GetSamplingConfigSamplingSpansAttributesAttribute"


class GetSamplingConfigSamplingSpansAttributesKey(MatchParts):
    pass


class GetSamplingConfigSamplingSpansAttributesAttribute(MatchParts):
    pass


class GetSamplingConfigSamplingSpansEvents(BaseModel):
    name: Optional["GetSamplingConfigSamplingSpansEventsName"]
    attributes: Optional[List["GetSamplingConfigSamplingSpansEventsAttributes"]]


class GetSamplingConfigSamplingSpansEventsName(MatchParts):
    pass


class GetSamplingConfigSamplingSpansEventsAttributes(BaseModel):
    key: "GetSamplingConfigSamplingSpansEventsAttributesKey"
    attribute: "GetSamplingConfigSamplingSpansEventsAttributesAttribute"


class GetSamplingConfigSamplingSpansEventsAttributesKey(MatchParts):
    pass


class GetSamplingConfigSamplingSpansEventsAttributesAttribute(MatchParts):
    pass


class GetSamplingConfigSamplingLogs(BaseModel):
    message: Optional["GetSamplingConfigSamplingLogsMessage"]
    severity_text: Optional["GetSamplingConfigSamplingLogsSeverityText"] = Field(
        alias="severityText"
    )
    attributes: Optional[List["GetSamplingConfigSamplingLogsAttributes"]]
    sampling_ratio: int = Field(alias="samplingRatio")


class GetSamplingConfigSamplingLogsMessage(MatchParts):
    pass


class GetSamplingConfigSamplingLogsSeverityText(MatchParts):
    pass


class GetSamplingConfigSamplingLogsAttributes(BaseModel):
    key: "GetSamplingConfigSamplingLogsAttributesKey"
    attribute: "GetSamplingConfigSamplingLogsAttributesAttribute"


class GetSamplingConfigSamplingLogsAttributesKey(MatchParts):
    pass


class GetSamplingConfigSamplingLogsAttributesAttribute(MatchParts):
    pass


GetSamplingConfig.model_rebuild()
GetSamplingConfigSampling.model_rebuild()
GetSamplingConfigSamplingSpans.model_rebuild()
GetSamplingConfigSamplingSpansAttributes.model_rebuild()
GetSamplingConfigSamplingSpansEvents.model_rebuild()
GetSamplingConfigSamplingSpansEventsAttributes.model_rebuild()
GetSamplingConfigSamplingLogs.model_rebuild()
GetSamplingConfigSamplingLogsAttributes.model_rebuild()
