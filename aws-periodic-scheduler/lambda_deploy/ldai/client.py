from dataclasses import dataclass
from typing import Any, Dict, List, Literal, Optional, Tuple

import chevron
from ldclient import Context
from ldclient.client import LDClient

from ldai.tracker import LDAIConfigTracker


@dataclass
class LDMessage:
    role: Literal['system', 'user', 'assistant']
    content: str

    def to_dict(self) -> dict:
        """
        Render the given message as a dictionary object.
        """
        return {
            'role': self.role,
            'content': self.content,
        }


class ModelConfig:
    """
    Configuration related to the model.
    """

    def __init__(self, name: str, parameters: Optional[Dict[str, Any]] = None, custom: Optional[Dict[str, Any]] = None):
        """
        :param name: The name of the model.
        :param parameters: Additional model-specific parameters.
        :param custom: Additional customer provided data.
        """
        self._name = name
        self._parameters = parameters
        self._custom = custom

    @property
    def name(self) -> str:
        """
        The name of the model.
        """
        return self._name

    def get_parameter(self, key: str) -> Any:
        """
        Retrieve model-specific parameters.

        Accessing a named, typed attribute (e.g. name) will result in the call
        being delegated to the appropriate property.
        """
        if key == 'name':
            return self.name

        if self._parameters is None:
            return None

        return self._parameters.get(key)

    def get_custom(self, key: str) -> Any:
        """
        Retrieve customer provided data.
        """
        if self._custom is None:
            return None

        return self._custom.get(key)

    def to_dict(self) -> dict:
        """
        Render the given model config as a dictionary object.
        """
        return {
            'name': self._name,
            'parameters': self._parameters,
            'custom': self._custom,
        }


class ProviderConfig:
    """
    Configuration related to the provider.
    """

    def __init__(self, name: str):
        self._name = name

    @property
    def name(self) -> str:
        """
        The name of the provider.
        """
        return self._name

    def to_dict(self) -> dict:
        """
        Render the given provider config as a dictionary object.
        """
        return {
            'name': self._name,
        }


@dataclass(frozen=True)
class AIConfig:
    enabled: Optional[bool] = None
    model: Optional[ModelConfig] = None
    messages: Optional[List[LDMessage]] = None
    provider: Optional[ProviderConfig] = None

    def to_dict(self) -> dict:
        """
        Render the given default values as an AIConfig-compatible dictionary object.
        """
        return {
            '_ldMeta': {
                'enabled': self.enabled or False,
            },
            'model': self.model.to_dict() if self.model else None,
            'messages': [message.to_dict() for message in self.messages] if self.messages else None,
            'provider': self.provider.to_dict() if self.provider else None,
        }


@dataclass(frozen=True)
class LDAIAgent:
    """
    Represents an AI agent configuration with instructions and model settings.

    An agent is similar to an AIConfig but focuses on instructions rather than messages,
    making it suitable for AI assistant/agent use cases.
    """
    enabled: Optional[bool] = None
    model: Optional[ModelConfig] = None
    provider: Optional[ProviderConfig] = None
    instructions: Optional[str] = None
    tracker: Optional[LDAIConfigTracker] = None

    def to_dict(self) -> Dict[str, Any]:
        """
        Render the given agent as a dictionary object.
        """
        result: Dict[str, Any] = {
            '_ldMeta': {
                'enabled': self.enabled or False,
            },
            'model': self.model.to_dict() if self.model else None,
            'provider': self.provider.to_dict() if self.provider else None,
        }
        if self.instructions is not None:
            result['instructions'] = self.instructions
        return result


@dataclass(frozen=True)
class LDAIAgentDefaults:
    """
    Default values for AI agent configurations.

    Similar to LDAIAgent but without tracker and with optional enabled field,
    used as fallback values when agent configurations are not available.
    """
    enabled: Optional[bool] = None
    model: Optional[ModelConfig] = None
    provider: Optional[ProviderConfig] = None
    instructions: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """
        Render the given agent defaults as a dictionary object.
        """
        result: Dict[str, Any] = {
            '_ldMeta': {
                'enabled': self.enabled or False,
            },
            'model': self.model.to_dict() if self.model else None,
            'provider': self.provider.to_dict() if self.provider else None,
        }
        if self.instructions is not None:
            result['instructions'] = self.instructions
        return result


@dataclass
class LDAIAgentConfig:
    """
    Configuration for individual agent in batch requests.

    Combines agent key with its specific default configuration and variables.
    """
    key: str
    default_value: LDAIAgentDefaults
    variables: Optional[Dict[str, Any]] = None


# Type alias for multiple agents
LDAIAgents = Dict[str, LDAIAgent]


class LDAIClient:
    """The LaunchDarkly AI SDK client object."""

    def __init__(self, client: LDClient):
        self._client = client

    def config(
        self,
        key: str,
        context: Context,
        default_value: AIConfig,
        variables: Optional[Dict[str, Any]] = None,
    ) -> Tuple[AIConfig, LDAIConfigTracker]:
        """
        Get the value of a model configuration.

        :param key: The key of the model configuration.
        :param context: The context to evaluate the model configuration in.
        :param default_value: The default value of the model configuration.
        :param variables: Additional variables for the model configuration.
        :return: The value of the model configuration along with a tracker used for gathering metrics.
        """
        self._client.track('$ld:ai:config:function:single', context, key, 1)

        model, provider, messages, instructions, tracker, enabled = self.__evaluate(key, context, default_value.to_dict(), variables)

        config = AIConfig(
            enabled=bool(enabled),
            model=model,
            messages=messages,
            provider=provider,
        )

        return config, tracker

    def agent(
        self,
        config: LDAIAgentConfig,
        context: Context,
    ) -> LDAIAgent:
        """
        Retrieve a single AI Config agent.

        This method retrieves a single agent configuration with instructions
        dynamically interpolated using the provided variables and context data.

        Example::

            agent = client.agent(LDAIAgentConfig(
                key='research_agent',
                default_value=LDAIAgentDefaults(
                    enabled=True,
                    model=ModelConfig('gpt-4'),
                    instructions="You are a research assistant specializing in {{topic}}."
                ),
                variables={'topic': 'climate change'}
            ), context)

            if agent.enabled:
                research_result = agent.instructions  # Interpolated instructions
                agent.tracker.track_success()

        :param config: The agent configuration to use.
        :param context: The context to evaluate the agent configuration in.
        :return: Configured LDAIAgent instance.
        """
        # Track single agent usage
        self._client.track(
            "$ld:ai:agent:function:single",
            context,
            config.key,
            1
        )

        return self.__evaluate_agent(config.key, context, config.default_value, config.variables)

    def agents(
        self,
        agent_configs: List[LDAIAgentConfig],
        context: Context,
    ) -> LDAIAgents:
        """
        Retrieve multiple AI agent configurations.

        This method allows you to retrieve multiple agent configurations in a single call,
        with each agent having its own default configuration and variables for instruction
        interpolation.

        Example::

            agents = client.agents([
                LDAIAgentConfig(
                    key='research_agent',
                    default_value=LDAIAgentDefaults(
                        enabled=True,
                        instructions='You are a research assistant.'
                    ),
                    variables={'topic': 'climate change'}
                ),
                LDAIAgentConfig(
                    key='writing_agent',
                    default_value=LDAIAgentDefaults(
                        enabled=True,
                        instructions='You are a writing assistant.'
                    ),
                    variables={'style': 'academic'}
                )
            ], context)

            research_result = agents["research_agent"].instructions
            agents["research_agent"].tracker.track_success()

        :param agent_configs: List of agent configurations to retrieve.
        :param context: The context to evaluate the agent configurations in.
        :return: Dictionary mapping agent keys to their LDAIAgent configurations.
        """
        # Track multiple agents usage
        agent_count = len(agent_configs)
        self._client.track(
            "$ld:ai:agent:function:multiple",
            context,
            agent_count,
            agent_count
        )

        result: LDAIAgents = {}

        for config in agent_configs:
            agent = self.__evaluate_agent(
                config.key,
                context,
                config.default_value,
                config.variables
            )
            result[config.key] = agent

        return result

    def __evaluate(
        self,
        key: str,
        context: Context,
        default_dict: Dict[str, Any],
        variables: Optional[Dict[str, Any]] = None,
    ) -> Tuple[Optional[ModelConfig], Optional[ProviderConfig], Optional[List[LDMessage]], Optional[str], LDAIConfigTracker, bool]:
        """
        Internal method to evaluate a configuration and extract components.

        :param key: The configuration key.
        :param context: The evaluation context.
        :param default_dict: Default configuration as dictionary.
        :param variables: Variables for interpolation.
        :return: Tuple of (model, provider, messages, instructions, tracker, enabled).
        """
        variation = self._client.variation(key, context, default_dict)

        all_variables = {}
        if variables:
            all_variables.update(variables)
        all_variables['ldctx'] = context.to_dict()

        # Extract messages
        messages = None
        if 'messages' in variation and isinstance(variation['messages'], list) and all(
            isinstance(entry, dict) for entry in variation['messages']
        ):
            messages = [
                LDMessage(
                    role=entry['role'],
                    content=self.__interpolate_template(
                        entry['content'], all_variables
                    ),
                )
                for entry in variation['messages']
            ]

        # Extract instructions
        instructions = None
        if 'instructions' in variation and isinstance(variation['instructions'], str):
            instructions = self.__interpolate_template(variation['instructions'], all_variables)

        # Extract provider config
        provider_config = None
        if 'provider' in variation and isinstance(variation['provider'], dict):
            provider = variation['provider']
            provider_config = ProviderConfig(provider.get('name', ''))

        # Extract model config
        model = None
        if 'model' in variation and isinstance(variation['model'], dict):
            parameters = variation['model'].get('parameters', None)
            custom = variation['model'].get('custom', None)
            model = ModelConfig(
                name=variation['model']['name'],
                parameters=parameters,
                custom=custom
            )

        # Create tracker
        tracker = LDAIConfigTracker(
            self._client,
            variation.get('_ldMeta', {}).get('variationKey', ''),
            key,
            int(variation.get('_ldMeta', {}).get('version', 1)),
            model.name if model else '',
            provider_config.name if provider_config else '',
            context,
        )

        enabled = variation.get('_ldMeta', {}).get('enabled', False)

        return model, provider_config, messages, instructions, tracker, enabled

    def __evaluate_agent(
        self,
        key: str,
        context: Context,
        default_value: LDAIAgentDefaults,
        variables: Optional[Dict[str, Any]] = None,
    ) -> LDAIAgent:
        """
        Internal method to evaluate an agent configuration.

        :param key: The agent configuration key.
        :param context: The evaluation context.
        :param default_value: Default agent values.
        :param variables: Variables for interpolation.
        :return: Configured LDAIAgent instance.
        """
        model, provider, messages, instructions, tracker, enabled = self.__evaluate(
            key, context, default_value.to_dict(), variables
        )

        # For agents, prioritize instructions over messages
        final_instructions = instructions if instructions is not None else default_value.instructions

        return LDAIAgent(
            enabled=bool(enabled) if enabled is not None else default_value.enabled,
            model=model or default_value.model,
            provider=provider or default_value.provider,
            instructions=final_instructions,
            tracker=tracker,
        )

    def __interpolate_template(self, template: str, variables: Dict[str, Any]) -> str:
        """
        Interpolate the template with the given variables using Mustache format.

        :param template: The template string.
        :param variables: The variables to interpolate into the template.
        :return: The interpolated string.
        """
        return chevron.render(template, variables)
