from typing import Any, Dict, List, Protocol, runtime_checkable

from ldai.models import LDMessage
from ldai.providers.types import ModelResponse, StructuredResponse


@runtime_checkable
class ModelRunner(Protocol):
    """
    Runtime capability interface for model invocation.

    A ModelRunner is a focused, configured object returned by
    AIProvider.create_model(). It knows exactly which model to call
    and with what parameters — the caller just passes messages.
    """

    async def invoke_model(self, messages: List[LDMessage]) -> ModelResponse:
        """
        Invoke the model with an array of messages.

        :param messages: Array of LDMessage objects representing the conversation
        :return: ModelResponse containing the model's response and metrics
        """
        ...

    async def invoke_structured_model(
        self,
        messages: List[LDMessage],
        response_structure: Dict[str, Any],
    ) -> StructuredResponse:
        """
        Invoke the model with structured output support.

        :param messages: Array of LDMessage objects representing the conversation
        :param response_structure: Dictionary defining the JSON schema for output structure
        :return: StructuredResponse containing the structured data
        """
        ...
