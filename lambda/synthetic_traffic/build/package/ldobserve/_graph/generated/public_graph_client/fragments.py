from typing import Any, Optional

from pydantic import Field

from .base_model import BaseModel


class MatchParts(BaseModel):
    regex_value: Optional[str] = Field(alias="regexValue")
    match_value: Optional[Any] = Field(alias="matchValue")


MatchParts.model_rebuild()
