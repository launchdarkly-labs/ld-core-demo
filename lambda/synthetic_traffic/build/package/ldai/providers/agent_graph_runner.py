from typing import Any, Protocol, runtime_checkable

from ldai.providers.types import AgentGraphResult


@runtime_checkable
class AgentGraphRunner(Protocol):
    """
    CAUTION:
    This feature is experimental and should NOT be considered ready for production use.
    It may change or be removed without notice and is not subject to backwards
    compatibility guarantees.

    Runtime capability interface for multi-agent graph execution.

    An AgentGraphRunner is a focused, configured object returned by
    AIProvider.create_agent_graph(). It holds all provider wiring internally —
    the caller just passes input.
    """

    async def run(self, input: Any) -> AgentGraphResult:
        """
        Run the agent graph with the given input.

        :param input: The input to the agent graph (string prompt or structured input)
        :return: AgentGraphResult containing the output, raw response, and metrics
        """
        ...
