from importlib import util
from typing import Any, Callable, List, Optional, TypeVar

from ldai import log
from ldai.models import AIConfigKind
from ldai.providers.agent_graph_runner import AgentGraphRunner
from ldai.providers.agent_runner import AgentRunner
from ldai.providers.ai_provider import AIProvider
from ldai.providers.model_runner import ModelRunner

T = TypeVar('T')

# Supported AI providers.
# Multi-provider packages should be last in the list.
SUPPORTED_AI_PROVIDERS = ('openai', 'langchain')


class RunnerFactory:
    """
    Sole entry point for capability creation.

    RunnerFactory instantiates the appropriate AIProvider for the configured
    provider and delegates runner construction to it. The shared fallback
    loop (_with_fallback) tries each candidate provider in order and returns
    the first successful result.
    """

    @staticmethod
    def _get_provider_factory(provider_type: str) -> Optional[AIProvider]:
        """
        Import and instantiate the AIProvider for the given provider type.

        This is the only place in the SDK that knows about provider package names.

        :param provider_type: Provider identifier, e.g. 'openai' or 'langchain'
        :return: AIProvider instance, or None if the package is not installed
        """
        try:
            if provider_type == 'langchain':
                RunnerFactory._pkg_exists('ldai_langchain')
                from ldai_langchain import LangChainRunnerFactory
                return LangChainRunnerFactory()

            if provider_type == 'openai':
                RunnerFactory._pkg_exists('ldai_openai')
                from ldai_openai import OpenAIRunnerFactory
                return OpenAIRunnerFactory()

            log.warning(
                f"Provider '{provider_type}' is not supported. "
                f"Supported providers: {SUPPORTED_AI_PROVIDERS}"
            )
            return None
        except ImportError as error:
            log.warning(
                f"Could not load provider '{provider_type}': {error}. "
                f"Make sure the corresponding package is installed."
            )
            return None

    @staticmethod
    def _with_fallback(
        providers: List[str],
        fn: Callable[[AIProvider], Optional[T]],
    ) -> Optional[T]:
        """
        Try each provider in order; return the first successful result.

        Shared by all create_* methods so the fallback loop is written once.

        :param providers: Ordered list of provider identifiers to try
        :param fn: Callable that receives an AIProvider and returns a result or None
        :return: First non-None result, or None if all providers fail
        """
        for provider_type in providers:
            try:
                provider_factory = RunnerFactory._get_provider_factory(provider_type)
                if provider_factory is None:
                    continue
                result = fn(provider_factory)
                if result is not None:
                    log.debug(f"Successfully invoked create function with provider '{provider_type}'")
                    return result
            except Exception as exc:
                log.warning(f"Provider '{provider_type}' failed: {exc}")

        log.warning("All providers failed or are unavailable")
        return None

    @staticmethod
    def _get_providers_to_try(
        default_ai_provider: Optional[str],
        provider_name: Optional[str],
    ) -> List[str]:
        """
        Determine which providers to try, in priority order.

        :param default_ai_provider: Caller-specified override (tried exclusively if set)
        :param provider_name: Provider name from the AI config
        :return: Ordered list of provider identifiers
        """
        if default_ai_provider:
            return [default_ai_provider]

        providers: List[str] = []

        if provider_name and provider_name in SUPPORTED_AI_PROVIDERS:
            providers.append(provider_name)

        # Multi-provider packages act as a fallback
        for multi in ['langchain']:
            if multi not in providers:
                providers.append(multi)

        return providers

    @staticmethod
    def create_model(
        config: AIConfigKind,
        default_ai_provider: Optional[str] = None,
    ) -> Optional[ModelRunner]:
        """
        Create a model executor for the given AI completion config.

        :param config: LaunchDarkly AI config (completion or judge)
        :param default_ai_provider: Optional provider override ('openai', 'langchain', …)
        :return: Configured ModelRunner ready to invoke the model, or None
        """
        provider_name = config.provider.name.lower() if config.provider else None
        providers = RunnerFactory._get_providers_to_try(default_ai_provider, provider_name)
        return RunnerFactory._with_fallback(providers, lambda p: p.create_model(config))

    @staticmethod
    def create_agent(
        config: Any,
        tools: Any,
        default_ai_provider: Optional[str] = None,
    ) -> Optional[AgentRunner]:
        """
        CAUTION:
        This feature is experimental and should NOT be considered ready for production use.
        It may change or be removed without notice and is not subject to backwards
        compatibility guarantees.

        Create an agent executor for the given AI agent config and tool registry.

        :param config: LaunchDarkly AI agent config
        :param tools: Tool registry mapping tool names to callables
        :param default_ai_provider: Optional provider override
        :return: AgentRunner instance, or None
        """
        provider_name = config.provider.name.lower() if config.provider else None
        providers = RunnerFactory._get_providers_to_try(default_ai_provider, provider_name)
        return RunnerFactory._with_fallback(providers, lambda p: p.create_agent(config, tools))

    @staticmethod
    def create_agent_graph(
        graph_def: Any,
        tools: Any,
        default_ai_provider: Optional[str] = None,
    ) -> Optional[AgentGraphRunner]:
        """
        CAUTION:
        This feature is experimental and should NOT be considered ready for production use.
        It may change or be removed without notice and is not subject to backwards
        compatibility guarantees.

        Create an agent graph executor for the given graph definition and tool registry.

        :param graph_def: AgentGraphDefinition instance
        :param tools: Tool registry mapping tool names to callables
        :param default_ai_provider: Optional provider override
        :return: AgentGraphRunner instance, or None
        """
        provider_name = None
        if graph_def.root() and graph_def.root().get_config() and graph_def.root().get_config().provider:
            provider_name = graph_def.root().get_config().provider.name.lower()
        providers = RunnerFactory._get_providers_to_try(default_ai_provider, provider_name)
        return RunnerFactory._with_fallback(providers, lambda p: p.create_agent_graph(graph_def, tools))

    @staticmethod
    def _pkg_exists(package_name: str) -> None:
        """
        Raise ImportError if the given package is not importable.

        :param package_name: Name of the package to check
        """
        if util.find_spec(package_name) is None:
            raise ImportError(f"Package '{package_name}' not found")
