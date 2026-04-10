import logging
from typing import Callable
import threading
import asyncio

from ldobserve._graph.generated.public_graph_client.get_sampling_config import (
    GetSamplingConfigSampling,
)
from .generated.public_graph_client import Client
from .generated.public_graph_client.custom_queries import Query

tasks = set()


def get_sampling_config(
    endpoint: str,
    project_id: str,
    callback: Callable[[GetSamplingConfigSampling], None],
):
    client = Client(url=endpoint)

    async def _get_sampling_config():
        try:
            result = await client.get_sampling_config(project_id)
            logging.getLogger(__name__).debug("Got sampling config: %s", result)
            callback(result.sampling)
        except Exception as e:
            logging.getLogger(__name__).error("Error getting sampling config: %s", e)

    # The graphql client uses asyncio internally, so we need to be able to execute async code.
    # Some async environments disallow creating threads, so we check to see if we are already in an async context
    # and if we are, we run the task in the existing event loop.
    # Otherwise, we create a thread and run the task in it.

    is_async = False
    try:
        # Get the running event loop to check if we're in an async context.
        # If we are not, then this will raise a RuntimeError.
        asyncio.get_running_loop()
        is_async = True
    except RuntimeError:
        pass

    if is_async:
        logging.getLogger(__name__).debug("Running in existing asyncio event loop.")
        task = asyncio.create_task(_get_sampling_config())
        # The executor only keeps a weak reference to the task, so we need to keep a strong reference to it.
        # If we don't then it could get collected while it is still running.
        tasks.add(task)
        # We need to remove the task when it is done so it can be garbage collected.
        task.add_done_callback(lambda task: tasks.remove(task))
    else:
        # We were not in an async context, so we need to run the task in a thread.
        logging.getLogger(__name__).debug(
            "No running event loop found, running in thread."
        )
        thread = threading.Thread(
            name="launchdarkly-sampling-config-thread",
            target=lambda: asyncio.run(_get_sampling_config()),
        )
        thread.start()
