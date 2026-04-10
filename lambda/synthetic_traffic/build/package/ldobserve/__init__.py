"""
The LaunchDarkly observability plugin for Python.

In typical usage you will only need to instantiate the :class:`ObservabilityPlugin` and pass it to the LaunchDarkly client during initialization.

The settings for the observability plugins are defined by the :class:`ObservabilityConfig` class.

The `ldobserve.observe` singleton is used for manual tracking of events, metrics, and logs.

# Quick Start
```python
from ldobserve import ObservabilityConfig, ObservabilityPlugin
import ldclient
from ldclient.config import Config

ldclient.set_config(Config("YOUR_SDK_KEY",
plugins=[
    ObservabilityPlugin(
        ObservabilityConfig(
            service_name="your-service-name",
            service_version="your-service-sha",
        )
    )]))
```

"""

import logging
import os
from typing import List, Optional
from ldclient.hook import Hook as LDHook
from opentelemetry.instrumentation import auto_instrumentation
from ldobserve.config import ObservabilityConfig
from ldobserve.observe import _ObserveInstance
import ldobserve.observe as observe
from ldobserve.config import _ProcessedConfig
import ldobserve.observe
from ldobserve._otel.configuration import _OTELConfiguration
from ldclient.plugin import Plugin, EnvironmentMetadata, PluginMetadata
from ldotel.tracing import Hook, HookOptions
from ldclient.client import LDClient
from opentelemetry.instrumentation.environment_variables import (
    OTEL_PYTHON_DISABLED_INSTRUMENTATIONS,
)
from opentelemetry.sdk.environment_variables import OTEL_EXPERIMENTAL_RESOURCE_DETECTORS


def _extend_environment_list(env_var_name: str, *new_items: str) -> None:
    """
    Extend an environment variable containing a comma-separated list with additional items.

    This function reads the current value of the specified environment variable,
    adds the provided items to the comma-separated list, and sets the
    environment variable with the extended list.

    Args:
        env_var_name: The name of the environment variable to extend.
        *new_items: Variable number of items to add to the list.

    Example:
        >>> _extend_environment_list("MY_LIST", "item1", "item2")
        # If MY_LIST was "existing_item", it will become "existing_item,item1,item2"
    """
    current_value = os.getenv(env_var_name, "")

    # Split the current value by comma and strip whitespace
    # The if condition uses strip to determine if the result is non-empty.
    # When it is, then the returned item still needs stripped when creating the new list.
    # current_value = ",,,toast,"
    # [item.strip() for item in current_value.split(",") if item.strip()]
    # Result: ['toast']
    current_list = [item.strip() for item in current_value.split(",") if item.strip()]

    # Add new items, avoiding duplicates
    for item in new_items:
        stripped_item = item.strip()
        if stripped_item and stripped_item not in current_list:
            current_list.append(stripped_item)

    # Join the list back into a comma-separated string
    new_value = ",".join(current_list)

    # Set the environment variable
    os.environ[env_var_name] = new_value


def _extend_experimental_resource_detectors(*detectors: str) -> None:
    """
    Extend the OTEL_EXPERIMENTAL_RESOURCE_DETECTORS environment variable with additional detectors.

    This function reads the current value of OTEL_EXPERIMENTAL_RESOURCE_DETECTORS,
    adds the provided detectors to the comma-separated list, and sets the
    environment variable with the extended list.
    """
    _extend_environment_list(OTEL_EXPERIMENTAL_RESOURCE_DETECTORS, *detectors)


def _extend_disabled_instrumentations(*instrumentations: str) -> None:
    """
    Extend the OTEL_PYTHON_DISABLED_INSTRUMENTATIONS environment variable with additional instrumentations.

    This function reads the current value of OTEL_PYTHON_DISABLED_INSTRUMENTATIONS,
    adds the provided instrumentations to the comma-separated list, and sets the
    environment variable with the extended list.

    Args:
        *instrumentations: Variable number of instrumentation names to add to the disabled list.
                          These should be the names of OpenTelemetry instrumentations to disable.

    Example:
        >>> extend_disabled_instrumentations("redis", "kafka")
        # If OTEL_PYTHON_DISABLED_INSTRUMENTATIONS was "grpc_client",
        # it will become "grpc_client,redis,kafka"
    """
    _extend_environment_list(OTEL_PYTHON_DISABLED_INSTRUMENTATIONS, *instrumentations)


class ObservabilityPlugin(Plugin):
    def __init__(self, config: Optional[ObservabilityConfig] = None):
        self._config = _ProcessedConfig(config or ObservabilityConfig())
        # Instruct auto-instrumentation to not instrument logging.
        # We will either have already done it, or it is disabled.
        _extend_disabled_instrumentations("logging")

        if self._config.disabled_instrumentations:
            _extend_disabled_instrumentations(*self._config.disabled_instrumentations)

        # If the OTEL_EXPERIMENTAL_RESOURCE_DETECTORS environment variable is not set, then we will use the config.
        # Consider an empty environment variable to be the same as not setting it.
        if not os.getenv(OTEL_EXPERIMENTAL_RESOURCE_DETECTORS):
            # Configure resource detectors based on config
            resource_detectors = []
            if self._config.process_resources:
                resource_detectors.append("process")
            if self._config.os_resources:
                resource_detectors.append("os")

            if resource_detectors:
                _extend_experimental_resource_detectors(*resource_detectors)

        auto_instrumentation.initialize()

    def metadata(_self) -> PluginMetadata:
        return PluginMetadata(name="launchdarkly-observability")

    def register(self, _client: LDClient, metadata: EnvironmentMetadata) -> None:
        if metadata.sdk_key is None:
            logging.getLogger(__name__).warning(
                "The observability plugin was registered without an SDK key. "
                "This will result in no data being sent to LaunchDarkly."
            )
            return

        _init(metadata.sdk_key, self._config)

    def get_hooks(_self, _metadata: EnvironmentMetadata) -> List[LDHook]:
        return [Hook(options=HookOptions(include_value=True))]


def _init(project_id: str, config: _ProcessedConfig):
    otel_configuration = _OTELConfiguration(project_id, config)
    ldobserve.observe._instance = _ObserveInstance(project_id, otel_configuration)


__all__ = ["ObservabilityPlugin", "ObservabilityConfig", "observe"]
