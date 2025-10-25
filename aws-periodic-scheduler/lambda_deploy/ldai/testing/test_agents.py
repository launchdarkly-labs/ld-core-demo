import pytest
from ldclient import Config, Context, LDClient
from ldclient.integrations.test_data import TestData

from ldai.client import (LDAIAgentConfig, LDAIAgentDefaults, LDAIClient,
                         ModelConfig, ProviderConfig)


@pytest.fixture
def td() -> TestData:
    td = TestData.data_source()

    # Single agent with instructions
    td.update(
        td.flag('customer-support-agent')
        .variations(
            {
                'model': {'name': 'gpt-4', 'parameters': {'temperature': 0.3, 'maxTokens': 2048}},
                'provider': {'name': 'openai'},
                'instructions': 'You are a helpful customer support agent for {{company_name}}. Always be polite and professional.',
                '_ldMeta': {'enabled': True, 'variationKey': 'agent-v1', 'version': 1, 'mode': 'agent'},
            }
        )
        .variation_for_all(0)
    )

    # Agent with context interpolation
    td.update(
        td.flag('personalized-agent')
        .variations(
            {
                'model': {'name': 'claude-3', 'parameters': {'temperature': 0.5}},
                'instructions': 'Hello {{ldctx.name}}! I am your personal assistant. Your user key is {{ldctx.key}}.',
                '_ldMeta': {'enabled': True, 'variationKey': 'personal-v1', 'version': 2, 'mode': 'agent'},
            }
        )
        .variation_for_all(0)
    )

    # Agent with multi-context interpolation
    td.update(
        td.flag('multi-context-agent')
        .variations(
            {
                'model': {'name': 'gpt-3.5-turbo'},
                'instructions': 'Welcome {{ldctx.user.name}} from {{ldctx.org.name}}! Your organization tier is {{ldctx.org.tier}}.',
                '_ldMeta': {'enabled': True, 'variationKey': 'multi-v1', 'version': 1, 'mode': 'agent'},
            }
        )
        .variation_for_all(0)
    )

    # Disabled agent
    td.update(
        td.flag('disabled-agent')
        .variations(
            {
                'model': {'name': 'gpt-4'},
                'instructions': 'This agent is disabled.',
                '_ldMeta': {'enabled': False, 'variationKey': 'disabled-v1', 'version': 1, 'mode': 'agent'},
            }
        )
        .variation_for_all(0)
    )

    # Agent with minimal metadata
    td.update(
        td.flag('minimal-agent')
        .variations(
            {
                'instructions': 'Minimal agent configuration.',
                '_ldMeta': {'enabled': True},
            }
        )
        .variation_for_all(0)
    )

    # Sales assistant agent
    td.update(
        td.flag('sales-assistant')
        .variations(
            {
                'model': {'name': 'gpt-4', 'parameters': {'temperature': 0.7}},
                'provider': {'name': 'openai'},
                'instructions': 'You are a sales assistant for {{company_name}}. Help customers find the right products.',
                '_ldMeta': {'enabled': True, 'variationKey': 'sales-v1', 'version': 1, 'mode': 'agent'},
            }
        )
        .variation_for_all(0)
    )

    # Research agent for testing single agent method
    td.update(
        td.flag('research-agent')
        .variations(
            {
                'model': {'name': 'gpt-4', 'parameters': {'temperature': 0.2, 'maxTokens': 3000}},
                'provider': {'name': 'openai'},
                'instructions': 'You are a research assistant specializing in {{topic}}. Your expertise level should match {{ldctx.expertise}}.',
                '_ldMeta': {'enabled': True, 'variationKey': 'research-v1', 'version': 1, 'mode': 'agent'},
            }
        )
        .variation_for_all(0)
    )

    return td


@pytest.fixture
def client(td: TestData) -> LDClient:
    config = Config('sdk-key', update_processor_class=td, send_events=False)
    return LDClient(config=config)


@pytest.fixture
def ldai_client(client: LDClient) -> LDAIClient:
    return LDAIClient(client)


def test_single_agent_method(ldai_client: LDAIClient):
    """Test the single agent() method functionality."""
    context = Context.builder('user-key').set('expertise', 'advanced').build()
    config = LDAIAgentConfig(
        key='research-agent',
        default_value=LDAIAgentDefaults(
            enabled=False,
            model=ModelConfig('fallback-model'),
            instructions="Default instructions"
        ),
        variables={'topic': 'quantum computing'}
    )

    agent = ldai_client.agent(config, context)

    assert agent.enabled is True
    assert agent.model is not None
    assert agent.model.name == 'gpt-4'
    assert agent.model.get_parameter('temperature') == 0.2
    assert agent.model.get_parameter('maxTokens') == 3000
    assert agent.provider is not None
    assert agent.provider.name == 'openai'
    assert agent.instructions == 'You are a research assistant specializing in quantum computing. Your expertise level should match advanced.'
    assert agent.tracker is not None


def test_single_agent_with_defaults(ldai_client: LDAIClient):
    """Test single agent method with non-existent flag using defaults."""
    context = Context.create('user-key')
    config = LDAIAgentConfig(
        key='non-existent-agent',
        default_value=LDAIAgentDefaults(
            enabled=True,
            model=ModelConfig('default-model', parameters={'temp': 0.8}),
            provider=ProviderConfig('default-provider'),
            instructions="You are a default assistant for {{task}}."
        ),
        variables={'task': 'general assistance'}
    )

    agent = ldai_client.agent(config, context)

    assert agent.enabled is True
    assert agent.model is not None and agent.model.name == 'default-model'
    assert agent.model is not None and agent.model.get_parameter('temp') == 0.8
    assert agent.provider is not None and agent.provider.name == 'default-provider'
    assert agent.instructions == "You are a default assistant for general assistance."
    assert agent.tracker is not None


def test_agents_method_with_configs(ldai_client: LDAIClient):
    """Test the new agents() method with LDAIAgentConfig objects."""
    context = Context.create('user-key')

    agent_configs = [
        LDAIAgentConfig(
            key='customer-support-agent',
            default_value=LDAIAgentDefaults(
                enabled=False,
                model=ModelConfig('fallback-model'),
                instructions="Default support"
            ),
            variables={'company_name': 'Acme Corp'}
        ),
        LDAIAgentConfig(
            key='sales-assistant',
            default_value=LDAIAgentDefaults(
                enabled=False,
                model=ModelConfig('fallback-model'),
                instructions="Default sales"
            ),
            variables={'company_name': 'Acme Corp'}
        )
    ]

    agents = ldai_client.agents(agent_configs, context)

    assert len(agents) == 2
    assert 'customer-support-agent' in agents
    assert 'sales-assistant' in agents

    support_agent = agents['customer-support-agent']
    assert support_agent.enabled is True
    assert support_agent.instructions is not None and 'Acme Corp' in support_agent.instructions

    sales_agent = agents['sales-assistant']
    assert sales_agent.enabled is True
    assert sales_agent.instructions is not None and 'Acme Corp' in sales_agent.instructions
    assert sales_agent.model is not None and sales_agent.model.get_parameter('temperature') == 0.7


def test_agents_method_different_variables_per_agent(ldai_client: LDAIClient):
    """Test agents method with different variables for each agent."""
    context = Context.builder('user-key').name('Alice').build()

    agent_configs = [
        LDAIAgentConfig(
            key='personalized-agent',
            default_value=LDAIAgentDefaults(
                enabled=True,
                instructions="Default personal"
            ),
            variables={}  # Will use context only
        ),
        LDAIAgentConfig(
            key='customer-support-agent',
            default_value=LDAIAgentDefaults(
                enabled=True,
                instructions="Default support"
            ),
            variables={'company_name': 'TechStart Inc'}
        )
    ]

    agents = ldai_client.agents(agent_configs, context)

    personal_agent = agents['personalized-agent']
    assert personal_agent.instructions == 'Hello Alice! I am your personal assistant. Your user key is user-key.'

    support_agent = agents['customer-support-agent']
    assert support_agent.instructions == 'You are a helpful customer support agent for TechStart Inc. Always be polite and professional.'


def test_agents_with_multi_context_interpolation(ldai_client: LDAIClient):
    """Test agents method with multi-context interpolation."""
    user_context = Context.builder('user-key').name('Alice').build()
    org_context = Context.builder('org-key').kind('org').name('LaunchDarkly').set('tier', 'Enterprise').build()
    context = Context.multi_builder().add(user_context).add(org_context).build()

    agent_configs = [
        LDAIAgentConfig(
            key='multi-context-agent',
            default_value=LDAIAgentDefaults(
                enabled=True,
                instructions="Default multi-context"
            ),
            variables={}
        )
    ]

    agents = ldai_client.agents(agent_configs, context)

    agent = agents['multi-context-agent']
    assert agent.instructions == 'Welcome Alice from LaunchDarkly! Your organization tier is Enterprise.'


def test_disabled_agent_single_method(ldai_client: LDAIClient):
    """Test that disabled agents are properly handled in single agent method."""
    context = Context.create('user-key')
    config = LDAIAgentConfig(
        key='disabled-agent',
        default_value=LDAIAgentDefaults(enabled=False),
        variables={}
    )

    agent = ldai_client.agent(config, context)

    assert agent.enabled is False
    assert agent.tracker is not None


def test_disabled_agent_multiple_method(ldai_client: LDAIClient):
    """Test that disabled agents are properly handled in multiple agents method."""
    context = Context.create('user-key')

    agent_configs = [
        LDAIAgentConfig(
            key='disabled-agent',
            default_value=LDAIAgentDefaults(enabled=False),
            variables={}
        )
    ]

    agents = ldai_client.agents(agent_configs, context)

    assert len(agents) == 1
    assert agents['disabled-agent'].enabled is False


def test_agent_with_missing_metadata(ldai_client: LDAIClient):
    """Test agent handling when metadata is minimal or missing."""
    context = Context.create('user-key')
    config = LDAIAgentConfig(
        key='minimal-agent',
        default_value=LDAIAgentDefaults(
            enabled=False,
            model=ModelConfig('default-model'),
            instructions="Default instructions"
        )
    )

    agent = ldai_client.agent(config, context)

    assert agent.enabled is True  # From flag
    assert agent.instructions == 'Minimal agent configuration.'
    assert agent.model == config.default_value.model  # Falls back to default
    assert agent.tracker is not None


def test_agent_config_dataclass():
    """Test the LDAIAgentConfig dataclass functionality."""
    config = LDAIAgentConfig(
        key='test-agent',
        default_value=LDAIAgentDefaults(
            enabled=True,
            instructions="Test instructions"
        ),
        variables={'key': 'value'}
    )

    assert config.key == 'test-agent'
    assert config.default_value.enabled is True
    assert config.default_value.instructions == "Test instructions"
    assert config.variables == {'key': 'value'}

    # Test with no variables
    config_no_vars = LDAIAgentConfig(
        key='test-agent-2',
        default_value=LDAIAgentDefaults(enabled=False)
    )

    assert config_no_vars.key == 'test-agent-2'
    assert config_no_vars.variables is None
