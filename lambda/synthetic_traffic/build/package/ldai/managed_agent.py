"""ManagedAgent — LaunchDarkly managed wrapper for agent invocations."""

from ldai.models import AIAgentConfig
from ldai.providers import AgentResult, AgentRunner
from ldai.tracker import LDAIConfigTracker


class ManagedAgent:
    """
    LaunchDarkly managed wrapper for AI agent invocations.

    Holds an AgentRunner and an LDAIConfigTracker. Handles tracking automatically.
    Obtain an instance via ``LDAIClient.create_agent()``.
    """

    def __init__(
        self,
        ai_config: AIAgentConfig,
        tracker: LDAIConfigTracker,
        agent_runner: AgentRunner,
    ):
        self._ai_config = ai_config
        self._tracker = tracker
        self._agent_runner = agent_runner

    async def run(self, input: str) -> AgentResult:
        """
        Run the agent with the given input string.

        :param input: The user prompt or input to the agent
        :return: AgentResult containing the agent's output and metrics
        """
        return await self._tracker.track_metrics_of_async(
            lambda: self._agent_runner.run(input),
            lambda result: result.metrics,
        )

    def get_agent_runner(self) -> AgentRunner:
        """
        Return the underlying AgentRunner for advanced use.

        :return: The AgentRunner instance.
        """
        return self._agent_runner

    def get_config(self) -> AIAgentConfig:
        """Return the AI agent config."""
        return self._ai_config

    def get_tracker(self) -> LDAIConfigTracker:
        """Return the config tracker."""
        return self._tracker
