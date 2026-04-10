from typing import Any, Protocol, runtime_checkable

from ldai.providers.types import AgentResult


@runtime_checkable
class AgentRunner(Protocol):
    """
    CAUTION:
    This feature is experimental and should NOT be considered ready for production use.
    It may change or be removed without notice and is not subject to backwards
    compatibility guarantees.

    Runtime capability interface for single-agent execution.

    An AgentRunner is a focused, configured object returned by
    AIProvider.create_agent(). It holds all provider wiring internally —
    the caller just passes input.
    """

    async def run(self, input: Any) -> AgentResult:
        """
        Run the agent with the given input.

        :param input: The input to the agent (string prompt or structured input)
        :return: AgentResult containing the output, raw response, and metrics
        """
        ...
