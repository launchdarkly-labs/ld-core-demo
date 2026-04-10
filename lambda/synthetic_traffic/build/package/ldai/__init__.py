__version__ = "0.17.0"  # x-release-please-version

from ldclient import log

from ldai.agent_graph import AgentGraphDefinition
from ldai.chat import Chat  # Deprecated — use ManagedModel
from ldai.client import LDAIClient
from ldai.judge import Judge
from ldai.managed_agent import ManagedAgent
from ldai.managed_agent_graph import ManagedAgentGraph
from ldai.managed_model import ManagedModel
from ldai.models import (  # Deprecated aliases for backward compatibility
    AIAgentConfig,
    AIAgentConfigDefault,
    AIAgentConfigRequest,
    AIAgentGraphConfig,
    AIAgents,
    AICompletionConfig,
    AICompletionConfigDefault,
    AIConfig,
    AIJudgeConfig,
    AIJudgeConfigDefault,
    Edge,
    JudgeConfiguration,
    LDAIAgent,
    LDAIAgentConfig,
    LDAIAgentDefaults,
    LDMessage,
    ModelConfig,
    ProviderConfig,
)
from ldai.providers import (
    AgentGraphResult,
    AgentGraphRunner,
    AgentResult,
    AgentRunner,
    ToolRegistry,
)
from ldai.providers.types import EvalScore, JudgeResponse
from ldai.tracker import AIGraphTracker

__all__ = [
    'LDAIClient',
    'AgentRunner',
    'AgentGraphRunner',
    'AgentResult',
    'AgentGraphResult',
    'ToolRegistry',
    'AIAgentConfig',
    'AIAgentConfigDefault',
    'AIAgentConfigRequest',
    'AIAgents',
    'AIAgentGraphConfig',
    'AIGraphTracker',
    'Edge',
    'AICompletionConfig',
    'AICompletionConfigDefault',
    'AIJudgeConfig',
    'AIJudgeConfigDefault',
    'ManagedAgent',
    'ManagedModel',
    'ManagedAgentGraph',
    'EvalScore',
    'AgentGraphDefinition',
    'Judge',
    'JudgeConfiguration',
    'JudgeResponse',
    'LDMessage',
    'ModelConfig',
    'ProviderConfig',
    'log',
    # Deprecated exports
    'AIConfig',
    'Chat',
    'LDAIAgent',
    'LDAIAgentConfig',
    'LDAIAgentDefaults',
]
