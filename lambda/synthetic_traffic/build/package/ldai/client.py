from typing import Any, Dict, List, Optional, Tuple

import chevron
from ldclient import Context
from ldclient.client import LDClient

from ldai import log
from ldai.agent_graph import AgentGraphDefinition
from ldai.judge import Judge
from ldai.managed_agent import ManagedAgent
from ldai.managed_agent_graph import ManagedAgentGraph
from ldai.managed_model import ManagedModel
from ldai.models import (
    AIAgentConfig,
    AIAgentConfigDefault,
    AIAgentConfigRequest,
    AIAgentGraphConfig,
    AIAgents,
    AICompletionConfig,
    AICompletionConfigDefault,
    AIJudgeConfig,
    AIJudgeConfigDefault,
    Edge,
    JudgeConfiguration,
    LDMessage,
    ModelConfig,
    ProviderConfig,
)
from ldai.providers import ToolRegistry
from ldai.providers.runner_factory import RunnerFactory
from ldai.sdk_info import AI_SDK_LANGUAGE, AI_SDK_NAME, AI_SDK_VERSION
from ldai.tracker import AIGraphTracker, LDAIConfigTracker

_TRACK_SDK_INFO = '$ld:ai:sdk:info'

_TRACK_USAGE_AGENT_CONFIG = '$ld:ai:usage:agent-config'
_TRACK_USAGE_AGENT_CONFIGS = '$ld:ai:usage:agent-configs'
_TRACK_USAGE_COMPLETION_CONFIG = '$ld:ai:usage:completion-config'
_TRACK_USAGE_CREATE_AGENT = '$ld:ai:usage:create-agent'
_TRACK_USAGE_CREATE_AGENT_GRAPH = '$ld:ai:usage:create-agent-graph'
_TRACK_USAGE_CREATE_JUDGE = '$ld:ai:usage:create-judge'
_TRACK_USAGE_CREATE_MODEL = '$ld:ai:usage:create-model'
_TRACK_USAGE_JUDGE_CONFIG = '$ld:ai:usage:judge-config'

_INIT_TRACK_CONTEXT = Context.builder('ld-internal-tracking').kind('ld_ai').anonymous(True).build()


class LDAIClient:
    """The LaunchDarkly AI SDK client object."""

    def __init__(self, client: LDClient):
        self._client = client
        self._client.track(
            _TRACK_SDK_INFO,
            _INIT_TRACK_CONTEXT,
            {
                'aiSdkName': AI_SDK_NAME,
                'aiSdkVersion': AI_SDK_VERSION,
                'aiSdkLanguage': AI_SDK_LANGUAGE,
            },
            1,
        )

    def _completion_config(
        self,
        key: str,
        context: Context,
        default: AICompletionConfigDefault,
        variables: Optional[Dict[str, Any]] = None,
    ) -> AICompletionConfig:
        model, provider, messages, instructions, tracker, enabled, judge_configuration, _ = self.__evaluate(
            key, context, default.to_dict(), variables
        )

        config = AICompletionConfig(
            key=key,
            enabled=bool(enabled),
            model=model,
            messages=messages,
            provider=provider,
            tracker=tracker,
            judge_configuration=judge_configuration,
        )

        return config

    def completion_config(
        self,
        key: str,
        context: Context,
        default: Optional[AICompletionConfigDefault] = None,
        variables: Optional[Dict[str, Any]] = None,
    ) -> AICompletionConfig:
        """
        Get the value of a completion configuration.

        :param key: The key of the completion configuration.
        :param context: The context to evaluate the completion configuration in.
        :param default: The default value of the completion configuration. When not provided,
            a disabled config is used as the fallback.
        :param variables: Additional variables for the completion configuration.
        :return: The completion configuration with a tracker used for gathering metrics.
        """
        self._client.track(_TRACK_USAGE_COMPLETION_CONFIG, context, key, 1)

        return self._completion_config(
            key, context, default or AICompletionConfigDefault.disabled(), variables
        )

    def config(
        self,
        key: str,
        context: Context,
        default: Optional[AICompletionConfigDefault] = None,
        variables: Optional[Dict[str, Any]] = None,
    ) -> AICompletionConfig:
        """
        Get the value of a model configuration.

        .. deprecated:: Use :meth:`completion_config` instead. This method will be removed in a future version.

        :param key: The key of the model configuration.
        :param context: The context to evaluate the model configuration in.
        :param default: The default value of the model configuration.
        :param variables: Additional variables for the model configuration.
        :return: The value of the model configuration along with a tracker used for gathering metrics.
        """
        return self.completion_config(key, context, default, variables)

    def _judge_config(
        self,
        key: str,
        context: Context,
        default: AIJudgeConfigDefault,
        variables: Optional[Dict[str, Any]] = None,
    ) -> AIJudgeConfig:
        model, provider, messages, instructions, tracker, enabled, judge_configuration, variation = self.__evaluate(
            key, context, default.to_dict(), variables
        )

        def _extract_evaluation_metric_key(variation: Dict[str, Any]) -> Optional[str]:
            """
            Extract evaluation_metric_key with backward compatibility.

            Priority: 1) evaluationMetricKey from variation, 2) first from evaluationMetricKeys in variation
            """
            if evaluation_metric_key := variation.get('evaluationMetricKey'):
                return evaluation_metric_key

            variation_keys = variation.get('evaluationMetricKeys')
            if isinstance(variation_keys, list) and variation_keys:
                return variation_keys[0]

            return None

        evaluation_metric_key = _extract_evaluation_metric_key(variation)

        config = AIJudgeConfig(
            key=key,
            enabled=bool(enabled),
            evaluation_metric_key=evaluation_metric_key,
            model=model,
            messages=messages,
            provider=provider,
            tracker=tracker,
        )

        return config

    def judge_config(
        self,
        key: str,
        context: Context,
        default: Optional[AIJudgeConfigDefault] = None,
        variables: Optional[Dict[str, Any]] = None,
    ) -> AIJudgeConfig:
        """
        Get the value of a judge configuration.

        :param key: The key of the judge configuration.
        :param context: The context to evaluate the judge configuration in.
        :param default: The default value of the judge configuration. When not provided,
            a disabled config is used as the fallback.
        :param variables: Additional variables for the judge configuration.
        :return: The judge configuration with a tracker used for gathering metrics.
        """
        self._client.track(_TRACK_USAGE_JUDGE_CONFIG, context, key, 1)

        return self._judge_config(
            key, context, default or AIJudgeConfigDefault.disabled(), variables
        )

    async def create_judge(
        self,
        key: str,
        context: Context,
        default: Optional[AIJudgeConfigDefault] = None,
        variables: Optional[Dict[str, Any]] = None,
        default_ai_provider: Optional[str] = None,
    ) -> Optional[Judge]:
        """
        Creates and returns a new Judge instance for AI evaluation.

        :param key: The key identifying the AI judge configuration to use
        :param context: Standard Context used when evaluating flags
        :param default: A default value representing a standard AI config result
        :param variables: Dictionary of values for instruction interpolation.
            The variables `message_history` and `response_to_evaluate` are reserved for the judge and will be ignored.
        :param default_ai_provider: Optional default AI provider to use.
        :return: Judge instance or None if disabled/unsupported

        Example::

            judge = client.create_judge(
                "relevance-judge",
                context,
                AIJudgeConfigDefault(
                    enabled=True,
                    model=ModelConfig("gpt-4"),
                    provider=ProviderConfig("openai"),
                    evaluation_metric_key='$ld:ai:judge:relevance',
                    messages=[LDMessage(role='system', content='You are a relevance judge.')]
                ),
                variables={'metric': "relevance"}
            )

            if judge:
                result = await judge.evaluate("User question", "AI response")
                if result and result.evals:
                    relevance_eval = result.evals.get('$ld:ai:judge:relevance')
                    if relevance_eval:
                        print('Relevance score:', relevance_eval.score)
        """
        self._client.track(_TRACK_USAGE_CREATE_JUDGE, context, key, 1)

        try:
            if variables:
                if 'message_history' in variables:
                    pass
                if 'response_to_evaluate' in variables:
                    pass

            extended_variables = dict(variables) if variables else {}
            extended_variables['message_history'] = '{{message_history}}'
            extended_variables['response_to_evaluate'] = '{{response_to_evaluate}}'

            judge_config = self._judge_config(
                key, context, default or AIJudgeConfigDefault.disabled(), extended_variables
            )

            if not judge_config.enabled or not judge_config.tracker:
                return None

            provider = RunnerFactory.create_model(judge_config, default_ai_provider)
            if not provider:
                return None

            return Judge(judge_config, judge_config.tracker, provider)
        except Exception as error:
            return None

    async def _initialize_judges(
        self,
        judge_configs: List[JudgeConfiguration.Judge],
        context: Context,
        variables: Optional[Dict[str, Any]] = None,
        default_ai_provider: Optional[str] = None,
    ) -> Dict[str, Judge]:
        """
        Initialize judges from judge configurations.

        :param judge_configs: List of judge configurations
        :param context: Standard Context used when evaluating flags
        :param variables: Dictionary of values for instruction interpolation
        :param default_ai_provider: Optional default AI provider to use
        :return: Dictionary of judge instances keyed by their configuration keys
        """
        judges: Dict[str, Judge] = {}

        async def create_judge_for_config(judge_key: str):
            judge = await self.create_judge(
                judge_key,
                context,
                AIJudgeConfigDefault(enabled=False),
                variables,
                default_ai_provider,
            )
            return judge_key, judge

        judge_promises = [
            create_judge_for_config(judge_config.key)
            for judge_config in judge_configs
        ]

        import asyncio
        results = await asyncio.gather(*judge_promises, return_exceptions=True)

        for result in results:
            if isinstance(result, Exception):
                continue
            judge_key, judge = result  # type: ignore[misc]
            if judge:
                judges[judge_key] = judge

        return judges

    async def create_model(
        self,
        key: str,
        context: Context,
        default: Optional[AICompletionConfigDefault] = None,
        variables: Optional[Dict[str, Any]] = None,
        default_ai_provider: Optional[str] = None,
    ) -> Optional[ManagedModel]:
        """
        Creates and returns a new ManagedModel for AI conversations.

        :param key: The key identifying the AI completion configuration to use
        :param context: Standard Context used when evaluating flags
        :param default: A default value representing a standard AI config result. When not provided,
            a disabled config is used as the fallback.
        :param variables: Dictionary of values for instruction interpolation
        :param default_ai_provider: Optional default AI provider to use
        :return: ManagedModel instance or None if disabled/unsupported

        Example::

            model = await client.create_model(
                "customer-support-chat",
                context,
                AICompletionConfigDefault(
                    enabled=True,
                    model=ModelConfig("gpt-4"),
                    provider=ProviderConfig("openai"),
                    messages=[LDMessage(role='system', content='You are a helpful assistant.')]
                ),
                variables={'customerName': 'John'}
            )

            if model:
                response = await model.invoke("I need help with my order")
                print(response.message.content)
        """
        self._client.track(_TRACK_USAGE_CREATE_MODEL, context, key, 1)
        log.debug(f"Creating managed model for key: {key}")
        config = self._completion_config(key, context, default or AICompletionConfigDefault.disabled(), variables)

        if not config.enabled or not config.tracker:
            return None

        runner = RunnerFactory.create_model(config, default_ai_provider)
        if not runner:
            return None

        judges = {}
        if config.judge_configuration and config.judge_configuration.judges:
            judges = await self._initialize_judges(
                config.judge_configuration.judges,
                context,
                variables,
                default_ai_provider,
            )

        return ManagedModel(config, config.tracker, runner, judges)

    async def create_chat(
        self,
        key: str,
        context: Context,
        default: Optional[AICompletionConfigDefault] = None,
        variables: Optional[Dict[str, Any]] = None,
        default_ai_provider: Optional[str] = None,
    ) -> Optional[ManagedModel]:
        """
        .. deprecated:: Use :meth:`create_model` instead.

        Creates and returns a ManagedModel for AI conversations.
        This method is a deprecated alias for :meth:`create_model`.
        """
        log.warning('create_chat() is deprecated, use create_model() instead')
        return await self.create_model(key, context, default, variables, default_ai_provider)

    async def create_agent(
        self,
        key: str,
        context: Context,
        tools: Optional[ToolRegistry] = None,
        default: Optional[AIAgentConfigDefault] = None,
        variables: Optional[Dict[str, Any]] = None,
        default_ai_provider: Optional[str] = None,
    ) -> Optional[ManagedAgent]:
        """
        CAUTION:
        This feature is experimental and should NOT be considered ready for production use.
        It may change or be removed without notice and is not subject to backwards
        compatibility guarantees.

        Creates and returns a new ManagedAgent for AI agent invocations.

        :param key: The key identifying the AI agent configuration to use
        :param context: Standard Context used when evaluating flags
        :param tools: ToolRegistry mapping tool names to callable implementations
        :param default: A default value representing a standard AI agent config result.
            When not provided, a disabled config is used as the fallback.
        :param variables: Dictionary of values for instruction interpolation
        :param default_ai_provider: Optional default AI provider to use
        :return: ManagedAgent instance or None if disabled/unsupported

        Example::

            agent = await client.create_agent(
                "customer-support-agent",
                context,
                tools={"get-order": fetch_order_fn},
                default=AIAgentConfigDefault(
                    enabled=True,
                    model=ModelConfig("gpt-4"),
                    provider=ProviderConfig("openai"),
                    instructions="You are a helpful customer support agent."
                ),
            )

            if agent:
                result = await agent.run("Where is my order?")
                print(result.output)
        """
        self._client.track(_TRACK_USAGE_CREATE_AGENT, context, key, 1)
        log.debug(f"Creating managed agent for key: {key}")
        config = self.__evaluate_agent(key, context, default or AIAgentConfigDefault.disabled(), variables)

        if not config.enabled or not config.tracker:
            return None

        runner = RunnerFactory.create_agent(config, tools or {}, default_ai_provider)
        if not runner:
            return None

        return ManagedAgent(config, config.tracker, runner)

    def agent_config(
        self,
        key: str,
        context: Context,
        default: Optional[AIAgentConfigDefault] = None,
        variables: Optional[Dict[str, Any]] = None,
    ) -> AIAgentConfig:
        """
        Retrieve a single AI Config agent.

        This method retrieves a single agent configuration with instructions
        dynamically interpolated using the provided variables and context data.

        Example::

            agent = client.agent_config(
                'research_agent',
                context,
                AIAgentConfigDefault(
                    enabled=True,
                    model=ModelConfig('gpt-4'),
                    instructions="You are a research assistant specializing in {{topic}}."
                ),
                variables={'topic': 'climate change'}
            )

            if agent.enabled:
                research_result = agent.instructions  # Interpolated instructions
                agent.tracker.track_success()

        :param key: The agent configuration key.
        :param context: The context to evaluate the agent configuration in.
        :param default: Default agent values. When not provided, a disabled config is used
            as the fallback.
        :param variables: Variables for interpolation.
        :return: Configured AIAgentConfig instance.
        """
        self._client.track(
            _TRACK_USAGE_AGENT_CONFIG,
            context,
            key,
            1
        )

        return self.__evaluate_agent(
            key, context, default or AIAgentConfigDefault.disabled(), variables
        )

    def agent(
        self,
        config: AIAgentConfigRequest,
        context: Context,
    ) -> AIAgentConfig:
        """
        Retrieve a single AI Config agent.

        .. deprecated:: Use :meth:`agent_config` instead. This method will be removed in a future version.

        :param config: The agent configuration to use.
        :param context: The context to evaluate the agent configuration in.
        :return: Configured AIAgentConfig instance.
        """
        return self.agent_config(config.key, context, config.default, config.variables)

    def agent_configs(
        self,
        agent_configs: List[AIAgentConfigRequest],
        context: Context,
    ) -> AIAgents:
        """
        Retrieve multiple AI agent configurations.

        This method allows you to retrieve multiple agent configurations in a single call,
        with each agent having its own default configuration and variables for instruction
        interpolation.

        Example::

            agents = client.agent_configs([
                AIAgentConfigRequest(
                    key='research_agent',
                    default=AIAgentConfigDefault(
                        enabled=True,
                        instructions='You are a research assistant.'
                    ),
                    variables={'topic': 'climate change'}
                ),
                AIAgentConfigRequest(
                    key='writing_agent',
                    default=AIAgentConfigDefault(
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
        :return: Dictionary mapping agent keys to their AIAgentConfig configurations.
        """
        agent_count = len(agent_configs)
        self._client.track(
            _TRACK_USAGE_AGENT_CONFIGS,
            context,
            agent_count,
            agent_count
        )

        result: AIAgents = {}

        for config in agent_configs:
            agent = self.__evaluate_agent(
                config.key,
                context,
                config.default or AIAgentConfigDefault.disabled(),
                config.variables
            )
            result[config.key] = agent

        return result

    def agent_graph(
        self,
        key: str,
        context: Context,
    ) -> AgentGraphDefinition:
        """`
        Retrieve an AI agent graph.
        """
        variation = self._client.variation(key, context, {})

        # Extract variation metadata for tracker
        variation_key = variation.get("_ldMeta", {}).get("variationKey", "")
        version = int(variation.get("_ldMeta", {}).get("version", 1))

        # Create graph tracker
        tracker = AIGraphTracker(
            self._client,
            variation_key,
            key,
            version,
            context,
        )

        if not variation.get("root"):
            log.debug(f"Agent graph {key} is disabled, no root config key found")
            return AgentGraphDefinition(
                AIAgentGraphConfig(
                    key=key,
                    root_config_key="",
                    edges=[],
                    enabled=False,
                ),
                nodes={},
                context=context,
                enabled=False,
                tracker=tracker,
            )

        edge_keys = list[str](variation.get("edges", {}).keys())
        all_agent_keys = set[str]([variation.get("root")])
        for edge_key in edge_keys:
            for single_edge in variation.get("edges", {}).get(edge_key, []):
                all_agent_keys.add(single_edge.get("key", ""))

        agent_configs = {
            key: self.agent_config(key, context, AIAgentConfigDefault(enabled=False))
            for key in all_agent_keys
        }

        if not all(config.enabled for config in agent_configs.values()):
            log.debug(
                f"Agent graph {key} is disabled, not all agent configs are enabled"
            )
            return AgentGraphDefinition(
                AIAgentGraphConfig(
                    key=key,
                    root_config_key="",
                    edges=[],
                    enabled=False,
                ),
                nodes={},
                context=context,
                enabled=False,
                tracker=tracker,
            )

        try:
            edges: list[Edge] = []
            for edge_key in edge_keys:
                for single_edge in variation.get("edges", {}).get(edge_key, []):
                    edges.append(Edge(
                        key=edge_key + "-" + single_edge.get("key", ""),
                        source_config=edge_key,
                        target_config=single_edge.get("key", ""),
                        handoff=single_edge.get("handoff", {}),
                    ))

            agent_graph_config = AIAgentGraphConfig(
                key=key,
                root_config_key=variation.get("root"),
                edges=edges,
            )
        except Exception as e:
            log.debug(f"Agent graph {key} is disabled, invalid agent graph config")
            return AgentGraphDefinition(
                AIAgentGraphConfig(
                    key=key,
                    root_config_key="",
                    edges=[],
                    enabled=False,
                ),
                nodes={},
                context=context,
                enabled=False,
                tracker=tracker,
            )

        nodes = AgentGraphDefinition.build_nodes(
            agent_graph_config,
            agent_configs,
        )

        return AgentGraphDefinition(
            agent_graph=agent_graph_config,
            nodes=nodes,
            context=context,
            enabled=agent_graph_config.enabled,
            tracker=tracker,
        )

    async def create_agent_graph(
        self,
        key: str,
        context: Context,
        tools: Optional[ToolRegistry] = None,
        default_ai_provider: Optional[str] = None,
    ) -> Optional[ManagedAgentGraph]:
        """
        CAUTION:
        This feature is experimental and should NOT be considered ready for production use.
        It may change or be removed without notice and is not subject to backwards
        compatibility guarantees.

        Creates and returns a new ManagedAgentGraph for AI agent graph execution.

        Resolves the graph configuration via ``agent_graph()``, creates a
        provider-specific runner, and wraps it in a ``ManagedAgentGraph``.

        :param key: The key identifying the agent graph configuration
        :param context: Standard Context used when evaluating flags
        :param tools: Registry mapping tool names to callables
        :param default_ai_provider: Optional provider override ('openai', 'langchain', …)
        :return: ManagedAgentGraph instance, or None if the graph is disabled or unsupported

        Example::

            graph = await client.create_agent_graph(
                "travel-assistant-graph",
                context,
                tools={
                    "web_search_tool": my_search_fn,
                    "get_weather": my_weather_fn,
                }
            )

            if graph:
                result = await graph.run("Find me restaurants in Seattle")
                print(result.output)
        """
        self._client.track(_TRACK_USAGE_CREATE_AGENT_GRAPH, context, key, 1)
        log.debug(f"Creating managed agent graph for key: {key}")

        graph = self.agent_graph(key, context)
        if not graph.enabled:
            return None

        runner = RunnerFactory.create_agent_graph(
            graph, tools or {}, default_ai_provider
        )
        if not runner:
            return None

        return ManagedAgentGraph(runner, graph.get_tracker())

    def agents(
        self,
        agent_configs: List[AIAgentConfigRequest],
        context: Context,
    ) -> AIAgents:
        """
        Retrieve multiple AI agent configurations.

        .. deprecated:: Use :meth:`agent_configs` instead. This method will be removed in a future version.

        :param agent_configs: List of agent configurations to retrieve.
        :param context: The context to evaluate the agent configurations in.
        :return: Dictionary mapping agent keys to their AIAgentConfig configurations.
        """
        return self.agent_configs(agent_configs, context)

    def __evaluate(
        self,
        key: str,
        context: Context,
        default_dict: Dict[str, Any],
        variables: Optional[Dict[str, Any]] = None,
    ) -> Tuple[
        Optional[ModelConfig], Optional[ProviderConfig], Optional[List[LDMessage]],
        Optional[str], LDAIConfigTracker, bool, Optional[Any], Dict[str, Any]
    ]:
        """
        Internal method to evaluate a configuration and extract components.

        :param key: The configuration key.
        :param context: The evaluation context.
        :param default_dict: Default configuration as dictionary.
        :param variables: Variables for interpolation.
        :return: Tuple of (model, provider, messages, instructions, tracker, enabled, judge_configuration, variation).
        """
        variation = self._client.variation(key, context, default_dict)

        all_variables = {}
        if variables:
            all_variables.update(variables)
        all_variables['ldctx'] = context.to_dict()

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

        instructions = None
        if 'instructions' in variation and isinstance(variation['instructions'], str):
            instructions = self.__interpolate_template(variation['instructions'], all_variables)

        provider_config = None
        if 'provider' in variation and isinstance(variation['provider'], dict):
            provider = variation['provider']
            provider_config = ProviderConfig(provider.get('name', ''))

        model = None
        if 'model' in variation and isinstance(variation['model'], dict):
            parameters = variation['model'].get('parameters', None)
            custom = variation['model'].get('custom', None)
            model = ModelConfig(
                name=variation['model']['name'],
                parameters=parameters,
                custom=custom
            )

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

        judge_configuration = None
        if 'judgeConfiguration' in variation and isinstance(variation['judgeConfiguration'], dict):
            judge_config = variation['judgeConfiguration']
            if 'judges' in judge_config and isinstance(judge_config['judges'], list):
                judges = [
                    JudgeConfiguration.Judge(
                        key=judge['key'],
                        sampling_rate=judge['samplingRate']
                    )
                    for judge in judge_config['judges']
                    if isinstance(judge, dict) and 'key' in judge and 'samplingRate' in judge
                ]
                if judges:
                    judge_configuration = JudgeConfiguration(judges=judges)

        return model, provider_config, messages, instructions, tracker, enabled, judge_configuration, variation

    def __evaluate_agent(
        self,
        key: str,
        context: Context,
        default: AIAgentConfigDefault,
        variables: Optional[Dict[str, Any]] = None,
    ) -> AIAgentConfig:
        """
        Internal method to evaluate an agent configuration.

        :param key: The agent configuration key.
        :param context: The evaluation context.
        :param default: Default agent values.
        :param variables: Variables for interpolation.
        :return: Configured AIAgentConfig instance.
        """
        model, provider, messages, instructions, tracker, enabled, judge_configuration, _ = self.__evaluate(
            key, context, default.to_dict(), variables
        )

        # For agents, prioritize instructions over messages
        final_instructions = instructions if instructions is not None else default.instructions

        return AIAgentConfig(
            key=key,
            enabled=bool(enabled) if enabled is not None else (default.enabled or False),
            model=model or default.model,
            provider=provider or default.provider,
            instructions=final_instructions,
            tracker=tracker,
            judge_configuration=judge_configuration or default.judge_configuration,
        )

    def __interpolate_template(self, template: str, variables: Dict[str, Any]) -> str:
        """
        Interpolate the template with the given variables using Mustache format.

        :param template: The template string.
        :param variables: The variables to interpolate into the template.
        :return: The interpolated string.
        """
        return chevron.render(template, variables)
