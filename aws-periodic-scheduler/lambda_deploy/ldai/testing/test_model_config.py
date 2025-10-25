import pytest
from ldclient import Config, Context, LDClient
from ldclient.integrations.test_data import TestData

from ldai.client import AIConfig, LDAIClient, LDMessage, ModelConfig


@pytest.fixture
def td() -> TestData:
    td = TestData.data_source()
    td.update(
        td.flag('model-config')
        .variations(
            {
                'model': {'name': 'fakeModel', 'parameters': {'temperature': 0.5, 'maxTokens': 4096}, 'custom': {'extra-attribute': 'value'}},
                'provider': {'name': 'fakeProvider'},
                'messages': [{'role': 'system', 'content': 'Hello, {{name}}!'}],
                '_ldMeta': {'enabled': True, 'variationKey': 'abcd', 'version': 1},
            },
            "green",
        )
        .variation_for_all(0)
    )

    td.update(
        td.flag('multiple-messages')
        .variations(
            {
                'model': {'name': 'fakeModel', 'parameters': {'temperature': 0.7, 'maxTokens': 8192}},
                'messages': [
                    {'role': 'system', 'content': 'Hello, {{name}}!'},
                    {'role': 'user', 'content': 'The day is, {{day}}!'},
                ],
                '_ldMeta': {'enabled': True, 'variationKey': 'abcd', 'version': 1},
            },
            "green",
        )
        .variation_for_all(0)
    )

    td.update(
        td.flag('ctx-interpolation')
        .variations(
            {
                'model': {'name': 'fakeModel', 'parameters': {'extra-attribute': 'I can be anything I set my mind/type to'}},
                'messages': [{'role': 'system', 'content': 'Hello, {{ldctx.name}}! Is your last name {{ldctx.last}}?'}],
                '_ldMeta': {'enabled': True, 'variationKey': 'abcd', 'version': 1},
            }
        )
        .variation_for_all(0)
    )

    td.update(
        td.flag('multi-ctx-interpolation')
        .variations(
            {
                'model': {'name': 'fakeModel', 'parameters': {'extra-attribute': 'I can be anything I set my mind/type to'}},
                'messages': [{'role': 'system', 'content': 'Hello, {{ldctx.user.name}}! Do you work for {{ldctx.org.shortname}}?'}],
                '_ldMeta': {'enabled': True, 'variationKey': 'abcd', 'version': 1},
            }
        )
        .variation_for_all(0)
    )

    td.update(
        td.flag('off-config')
        .variations(
            {
                'model': {'name': 'fakeModel', 'parameters': {'temperature': 0.1}},
                'messages': [{'role': 'system', 'content': 'Hello, {{name}}!'}],
                '_ldMeta': {'enabled': False, 'variationKey': 'abcd', 'version': 1},
            }
        )
        .variation_for_all(0)
    )

    td.update(
        td.flag('initial-config-disabled')
        .variations(
            {
                '_ldMeta': {'enabled': False},
            },
            {
                '_ldMeta': {'enabled': True},
            }
        )
        .variation_for_all(0)
    )

    td.update(
        td.flag('initial-config-enabled')
        .variations(
            {
                '_ldMeta': {'enabled': False},
            },
            {
                '_ldMeta': {'enabled': True},
            }
        )
        .variation_for_all(1)
    )

    return td


@pytest.fixture
def client(td: TestData) -> LDClient:
    config = Config('sdk-key', update_processor_class=td, send_events=False)
    return LDClient(config=config)


@pytest.fixture
def ldai_client(client: LDClient) -> LDAIClient:
    return LDAIClient(client)


def test_model_config_delegates_to_properties():
    model = ModelConfig('fakeModel', parameters={'extra-attribute': 'value'})
    assert model.name == 'fakeModel'
    assert model.get_parameter('extra-attribute') == 'value'
    assert model.get_parameter('non-existent') is None

    assert model.name == model.get_parameter('name')


def test_model_config_handles_custom():
    model = ModelConfig('fakeModel', custom={'extra-attribute': 'value'})
    assert model.name == 'fakeModel'
    assert model.get_parameter('extra-attribute') is None
    assert model.get_custom('non-existent') is None
    assert model.get_custom('name') is None


def test_uses_default_on_invalid_flag(ldai_client: LDAIClient):
    context = Context.create('user-key')
    default_value = AIConfig(
        enabled=True,
        model=ModelConfig('fakeModel', parameters={'temperature': 0.5, 'maxTokens': 4096}),
        messages=[LDMessage(role='system', content='Hello, {{name}}!')],
    )
    variables = {'name': 'World'}

    config, _ = ldai_client.config('missing-flag', context, default_value, variables)

    assert config.messages is not None
    assert len(config.messages) > 0
    assert config.messages[0].content == 'Hello, World!'
    assert config.enabled is True

    assert config.model is not None
    assert config.model.name == 'fakeModel'
    assert config.model.get_parameter('temperature') == 0.5
    assert config.model.get_parameter('maxTokens') == 4096


def test_model_config_interpolation(ldai_client: LDAIClient):
    context = Context.create('user-key')
    default_value = AIConfig(
        enabled=True,
        model=ModelConfig('fakeModel'),
        messages=[LDMessage(role='system', content='Hello, {{name}}!')],
    )
    variables = {'name': 'World'}

    config, _ = ldai_client.config('model-config', context, default_value, variables)

    assert config.messages is not None
    assert len(config.messages) > 0
    assert config.messages[0].content == 'Hello, World!'
    assert config.enabled is True

    assert config.model is not None
    assert config.model.name == 'fakeModel'
    assert config.model.get_parameter('temperature') == 0.5
    assert config.model.get_parameter('maxTokens') == 4096


def test_model_config_no_variables(ldai_client: LDAIClient):
    context = Context.create('user-key')
    default_value = AIConfig(enabled=True, model=ModelConfig('fake-model'), messages=[])

    config, _ = ldai_client.config('model-config', context, default_value, {})

    assert config.messages is not None
    assert len(config.messages) > 0
    assert config.messages[0].content == 'Hello, !'
    assert config.enabled is True

    assert config.model is not None
    assert config.model.name == 'fakeModel'
    assert config.model.get_parameter('temperature') == 0.5
    assert config.model.get_parameter('maxTokens') == 4096


def test_provider_config_handling(ldai_client: LDAIClient):
    context = Context.builder('user-key').name("Sandy").build()
    default_value = AIConfig(enabled=True, model=ModelConfig('fake-model'), messages=[])
    variables = {'name': 'World'}

    config, _ = ldai_client.config('model-config', context, default_value, variables)

    assert config.provider is not None
    assert config.provider.name == 'fakeProvider'


def test_context_interpolation(ldai_client: LDAIClient):
    context = Context.builder('user-key').name("Sandy").set('last', 'Beaches').build()
    default_value = AIConfig(enabled=True, model=ModelConfig('fake-model'), messages=[])
    variables = {'name': 'World'}

    config, _ = ldai_client.config(
        'ctx-interpolation', context, default_value, variables
    )

    assert config.messages is not None
    assert len(config.messages) > 0
    assert config.messages[0].content == 'Hello, Sandy! Is your last name Beaches?'
    assert config.enabled is True

    assert config.model is not None
    assert config.model.name == 'fakeModel'
    assert config.model.get_parameter('temperature') is None
    assert config.model.get_parameter('maxTokens') is None
    assert config.model.get_parameter('extra-attribute') == 'I can be anything I set my mind/type to'


def test_multi_context_interpolation(ldai_client: LDAIClient):
    user_context = Context.builder('user-key').name("Sandy").build()
    org_context = Context.builder('org-key').kind('org').name("LaunchDarkly").set('shortname', 'LD').build()
    context = Context.multi_builder().add(user_context).add(org_context).build()
    default_value = AIConfig(enabled=True, model=ModelConfig('fake-model'), messages=[])
    variables = {'name': 'World'}

    config, _ = ldai_client.config(
        'multi-ctx-interpolation', context, default_value, variables
    )

    assert config.messages is not None
    assert len(config.messages) > 0
    assert config.messages[0].content == 'Hello, Sandy! Do you work for LD?'
    assert config.enabled is True

    assert config.model is not None
    assert config.model.name == 'fakeModel'
    assert config.model.get_parameter('temperature') is None
    assert config.model.get_parameter('maxTokens') is None
    assert config.model.get_parameter('extra-attribute') == 'I can be anything I set my mind/type to'


def test_model_config_multiple(ldai_client: LDAIClient):
    context = Context.create('user-key')
    default_value = AIConfig(enabled=True, model=ModelConfig('fake-model'), messages=[])
    variables = {'name': 'World', 'day': 'Monday'}

    config, _ = ldai_client.config(
        'multiple-messages', context, default_value, variables
    )

    assert config.messages is not None
    assert len(config.messages) > 0
    assert config.messages[0].content == 'Hello, World!'
    assert config.messages[1].content == 'The day is, Monday!'
    assert config.enabled is True

    assert config.model is not None
    assert config.model.name == 'fakeModel'
    assert config.model.get_parameter('temperature') == 0.7
    assert config.model.get_parameter('maxTokens') == 8192


def test_model_config_disabled(ldai_client: LDAIClient):
    context = Context.create('user-key')
    default_value = AIConfig(enabled=False, model=ModelConfig('fake-model'), messages=[])

    config, _ = ldai_client.config('off-config', context, default_value, {})

    assert config.model is not None
    assert config.enabled is False
    assert config.model.name == 'fakeModel'
    assert config.model.get_parameter('temperature') == 0.1
    assert config.model.get_parameter('maxTokens') is None


def test_model_initial_config_disabled(ldai_client: LDAIClient):
    context = Context.create('user-key')
    default_value = AIConfig(enabled=False, model=ModelConfig('fake-model'), messages=[])

    config, _ = ldai_client.config('initial-config-disabled', context, default_value, {})

    assert config.enabled is False
    assert config.model is None
    assert config.messages is None
    assert config.provider is None


def test_model_initial_config_enabled(ldai_client: LDAIClient):
    context = Context.create('user-key')
    default_value = AIConfig(enabled=False, model=ModelConfig('fake-model'), messages=[])

    config, _ = ldai_client.config('initial-config-enabled', context, default_value, {})

    assert config.enabled is True
    assert config.model is None
    assert config.messages is None
    assert config.provider is None


def test_config_method_tracking(ldai_client: LDAIClient):
    from unittest.mock import Mock

    mock_client = Mock()
    mock_client.variation.return_value = {
        '_ldMeta': {'enabled': True, 'variationKey': 'test-variation', 'version': 1},
        'model': {'name': 'test-model'},
        'provider': {'name': 'test-provider'},
        'messages': []
    }

    client = LDAIClient(mock_client)
    context = Context.create('user-key')
    default_value = AIConfig(enabled=False, model=ModelConfig('fake-model'), messages=[])

    config, tracker = client.config('test-config-key', context, default_value)

    mock_client.track.assert_called_once_with(
        '$ld:ai:config:function:single',
        context,
        'test-config-key',
        1
    )
