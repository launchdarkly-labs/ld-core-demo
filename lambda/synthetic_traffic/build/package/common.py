"""
Shared infrastructure for ToggleBank synthetic traffic Lambda.

Contains user pool, question pool, context helpers, LD client lifecycle,
and trace flush. LD client is initialized per-project in the handler loop.
"""

import logging
import os
import time
from datetime import datetime, timezone
from uuid import uuid4

logger = logging.getLogger(__name__)

ITERATIONS = 10
POSITIVE_FEEDBACK_RATE = 0.99
BATCH_SIZE = 5
DAYS_BEFORE_REGENERATE = 3

BETA_TESTER_USERS = [
    {"name": "Alice Chen", "location": "San Francisco, CA", "tier": "Platinum", "role": "Beta"},
    {"name": "Bob Martinez", "location": "Los Angeles, CA", "tier": "Gold", "role": "Beta"},
    {"name": "Carol Washington", "location": "Boston, MA", "tier": "Silver", "role": "Beta"},
    {"name": "David Kim", "location": "Seattle, WA", "tier": "Platinum", "role": "Beta"},
    {"name": "Elena Rodriguez", "location": "Austin, TX", "tier": "Gold", "role": "Beta"},
    {"name": "Frank O'Brien", "location": "Chicago, IL", "tier": "Silver", "role": "Beta"},
    {"name": "Grace Nakamura", "location": "Portland, OR", "tier": "Platinum", "role": "Beta"},
    {"name": "Henry Patel", "location": "New York, NY", "tier": "Gold", "role": "Beta"},
    {"name": "Isabel Santos", "location": "Miami, FL", "tier": "Silver", "role": "Beta"},
    {"name": "James Thompson", "location": "Denver, CO", "tier": "Platinum", "role": "Beta"},
    {"name": "Karen Liu", "location": "San Jose, CA", "tier": "Gold", "role": "Beta"},
    {"name": "Leo Rossi", "location": "Philadelphia, PA", "tier": "Silver", "role": "Beta"},
    {"name": "Maya Johnson", "location": "Atlanta, GA", "tier": "Platinum", "role": "Beta"},
    {"name": "Nathan Park", "location": "Houston, TX", "tier": "Gold", "role": "Beta"},
    {"name": "Olivia Brown", "location": "Phoenix, AZ", "tier": "Silver", "role": "Beta"},
    {"name": "Peter Nguyen", "location": "Minneapolis, MN", "tier": "Platinum", "role": "Beta"},
]

QUESTION_POOL = [
    "What is my checking account balance?",
    "How do I open a savings account?",
    "What are the fees for my Gold checking account?",
    "Can I get a personal loan with ToggleBank?",
    "What are the current mortgage rates?",
    "How do I apply for a credit card?",
    "Tell me about your auto loan options.",
    "What is the interest rate on a 30-year fixed mortgage?",
    "How do I set up a wire transfer?",
    "What are the limits on Zelle transfers?",
    "How do I pay my bills through online banking?",
    "Can I transfer money between my checking and savings?",
    "What investment options does ToggleBank offer?",
    "How do I open a 401k account?",
    "Tell me about your retirement planning services.",
    "What mutual funds do you recommend?",
    "I need help with a recent transaction I don't recognize.",
    "How do I reset my online banking password?",
    "What are your branch hours?",
    "I want to dispute a charge on my credit card.",
    "How do I set up direct deposit?",
    "What is the minimum balance for a savings account?",
    "Can I get a cashier's check?",
    "How do I close my account?",
    "What are the CD rates right now?",
    "Tell me about your mobile deposit feature.",
    "How do I add a beneficiary to my account?",
    "What happens if I overdraft my checking account?",
    "Can I get a home equity line of credit?",
    "How do I enroll in paperless statements?",
]


def init_ld_client(sdk_key):
    """Initialize the global LD client for a specific project's SDK key.
    Returns the client instance, or None if initialization fails."""
    import ldclient
    from ldclient.config import Config

    def _basic_config():
        return Config(
            sdk_key,
            events_max_pending=10000,
            flush_interval=2,
            send_events=True,
        )

    try:
        from ldobserve import ObservabilityConfig, ObservabilityPlugin

        obs_config = ObservabilityConfig(
            service_name="togglebank-synthetic-agent-graph",
        )
        config = Config(
            sdk_key,
            plugins=[ObservabilityPlugin(obs_config)],
            events_max_pending=10000,
            flush_interval=2,
            send_events=True,
        )
        ldclient.set_config(config)
    except Exception as e:
        logger.warning(f"Observability plugin failed ({e}), using basic config")
        ldclient.set_config(_basic_config())

    for _ in range(20):
        if ldclient.get().is_initialized():
            break
        time.sleep(0.5)

    if not ldclient.get().is_initialized():
        logger.error("LD client failed to initialize after 10s")
        return None

    return ldclient.get()


def close_ld_client():
    """Flush and close the global LD client between projects."""
    try:
        import ldclient

        client = ldclient.get()
        if client and client.is_initialized():
            client.flush()
            time.sleep(3)
            client.close()
    except Exception as e:
        logger.warning(f"Error closing LD client: {e}")


def create_user_context(user_spec: dict) -> dict:
    """Build a user context dict from a user spec."""
    return {
        "user_key": f"synthetic-{uuid4().hex[:8]}",
        "name": user_spec["name"],
        "location": user_spec["location"],
        "tier": user_spec["tier"],
        "role": user_spec["role"],
        "beta_tester": True,
        "session_id": (
            f"synthetic-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}"
            f"-{uuid4().hex[:6]}"
        ),
    }


def build_ld_context(user_context: dict):
    """Build a LaunchDarkly Context from a user profile dict."""
    from ldclient import Context

    user_key = user_context.get("user_key", "anonymous")
    builder = Context.builder(user_key).kind("user")
    for attr in ["name", "role", "beta_tester", "tier", "location"]:
        val = user_context.get(attr)
        if val is not None:
            builder.set(attr, val)
    return builder.build()


def get_tracer(name: str = "togglebank.agent-graph"):
    """Get an OpenTelemetry tracer for synthetic traffic spans."""
    from opentelemetry import trace

    return trace.get_tracer(name, "1.0.0")


def flush_traces(timeout_ms: int = 10000):
    """Flush all pending spans and LD client events."""
    try:
        from opentelemetry import trace

        provider = trace.get_tracer_provider()
        if hasattr(provider, "force_flush"):
            provider.force_flush(timeout_millis=timeout_ms)
            logger.info("Trace spans flushed")
    except Exception as e:
        logger.warning(f"Failed to flush trace spans: {e}")

    try:
        import ldclient

        client = ldclient.get()
        if client and client.is_initialized():
            client.flush()
            logger.info("LD client events flushed")
    except Exception as e:
        logger.warning(f"Failed to flush LD client events: {e}")
