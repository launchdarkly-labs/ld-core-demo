"""
ToggleBank Agent Graph runner.

Traverses the LD Agent Graph (triage -> specialist -> brand voice),
invokes Bedrock models, and records per-node and graph-level metrics
via LD AI SDK trackers so the Agent Graph dashboard populates.

Graph key: togglebot-multi-agent
Structure (defined in LaunchDarkly):
    ai-config--togglebot-triage
    ├── ai-config--togglebot-accounts-specialist  -> ai-config--togglebot-brand-voice
    ├── ai-config--togglebot-loans-specialist      -> ai-config--togglebot-brand-voice
    ├── ai-config--togglebot-investments-specialist -> ai-config--togglebot-brand-voice
    ├── ai-config--togglebot-transfers-specialist   -> ai-config--togglebot-brand-voice
    └── ai-config--togglebot-support-specialist     -> ai-config--togglebot-brand-voice
"""

from __future__ import annotations

import json
import logging
import os
import random
import re
import time
from dataclasses import dataclass, field
from typing import Any, Optional

import boto3
import chevron
from common import safe_span

logger = logging.getLogger(__name__)


@dataclass
class AgentGraphResult:
    final_response: str
    query_type: str
    execution_path: list[str]
    duration_ms: int
    tokens: dict[str, int] = field(default_factory=lambda: {"input": 0, "output": 0})
    node_durations: dict[str, int] = field(default_factory=dict)
    judge_results: dict[str, Any] = field(default_factory=dict)


# ToggleBank triage categories -> specialist config keys
TRIAGE_CATEGORY_MAP = {
    "accounts": "ai-config--togglebot-accounts-specialist",
    "loans_credit": "ai-config--togglebot-loans-specialist",
    "investments": "ai-config--togglebot-investments-specialist",
    "transfers": "ai-config--togglebot-transfers-specialist",
    "customer_support": "ai-config--togglebot-support-specialist",
}


def _get_tracer():
    try:
        from opentelemetry import trace
        return trace.get_tracer("togglebank.agent-graph")
    except Exception:
        return None


def _get_bedrock_client():
    region = os.getenv("AWS_REGION", "us-east-1")
    return boto3.client("bedrock-runtime", region_name=region)


def patch_tracker_for_graph(tracker, graph_key: str) -> None:
    """Inject graphKey into tracker event data so the Agent Graph UI
    associates per-node metrics with the correct graph."""
    if tracker is None:
        return
    original = tracker._LDAIConfigTracker__get_track_data

    def patched():
        data = original()
        data["graphKey"] = graph_key
        return data

    tracker._LDAIConfigTracker__get_track_data = patched


def simulate_tool_calls(node, graph_tracker) -> list[str]:
    """Report simulated tool invocations for a node."""
    config = node.get_config()
    params = config.model._parameters if config.model else {}
    tools = params.get("tools", [])
    if not tools:
        return []

    if random.random() < 0.2:
        return []

    weights = list(range(len(tools), 0, -1))
    num_calls = random.choices(range(1, len(tools) + 1), weights=weights, k=1)[0]
    selected = random.sample(tools, num_calls)
    called = []
    for tool in selected:
        tool_key = tool.get("name", "unknown")
        graph_tracker.track_tool_call(node.get_key(), tool_key)
        called.append(tool_key)
    return called


def invoke_model(agent_config, messages: list[dict]) -> tuple[str, dict[str, int]]:
    """Invoke a Bedrock model via the Converse API.

    messages: list of {"role": "system"|"user"|"assistant", "content": str}
    Returns (response_text, {"input": N, "output": N}).
    """
    from ldai.tracker import TokenUsage

    model_name = (
        agent_config.model.name
        if agent_config.model
        else "amazon.nova-pro-v1:0"
    )
    model_id = model_name
    if not model_id.startswith("us."):
        model_id = f"us.{model_id}"

    model_obj = agent_config.model
    if model_obj:
        temp_val = model_obj.get_parameter("temperature")
        temperature = float(temp_val) if temp_val is not None else 0.5
        max_val = model_obj.get_parameter("max_tokens") or model_obj.get_parameter("maxTokens")
        max_tokens = int(max_val) if max_val is not None else 1000
    else:
        temperature = 0.5
        max_tokens = 1000

    client = _get_bedrock_client()

    system_msgs = [m for m in messages if m["role"] == "system"]
    converse_msgs = [m for m in messages if m["role"] != "system"]
    if not converse_msgs:
        converse_msgs = [{"role": "user", "content": "Please respond based on the instructions provided."}]

    bedrock_messages = [
        {"role": m["role"], "content": [{"text": m["content"]}]}
        for m in converse_msgs
    ]

    kwargs: dict[str, Any] = {
        "modelId": model_id,
        "messages": bedrock_messages,
        "inferenceConfig": {"temperature": temperature, "maxTokens": max_tokens},
    }
    if system_msgs:
        kwargs["system"] = [{"text": m["content"]} for m in system_msgs]

    resp = client.converse(**kwargs)

    response_text = ""
    for block in resp.get("output", {}).get("message", {}).get("content", []):
        if "text" in block:
            response_text += block["text"]

    usage = resp.get("usage", {})
    tokens = {
        "input": usage.get("inputTokens", 0),
        "output": usage.get("outputTokens", 0),
    }

    if agent_config.tracker and tokens["input"] + tokens["output"] > 0:
        agent_config.tracker.track_tokens(TokenUsage(
            input=tokens["input"],
            output=tokens["output"],
            total=tokens["input"] + tokens["output"],
        ))

    return response_text, tokens


def build_messages(instructions: str | None, **context_vars) -> list[dict]:
    """Render agent instructions with mustache and return as message dicts."""
    rendered = chevron.render(instructions, context_vars) if instructions else ""
    return [{"role": "system", "content": rendered}]


# ---------------------------------------------------------------------------
# Per-node runners
# ---------------------------------------------------------------------------

def run_triage(triage_node, question: str, user_context: dict,
               graph_tracker, graph_key: str):
    tracer = _get_tracer()
    config = triage_node.get_config()
    patch_tracker_for_graph(config.tracker, graph_key)

    with safe_span(tracer, "agent-graph.triage", attributes={
        "agent.name": triage_node.get_key(),
        "agent.model": config.model.name if config.model else "",
    }) as span:
        node_start = time.time()

        messages = build_messages(
            config.instructions,
            userInput=question,
            customer_context=json.dumps(user_context),
            **user_context,
        )
        messages.append({"role": "user", "content": question})

        response_text, tokens = invoke_model(config, messages)
        duration_ms = int((time.time() - node_start) * 1000)

        if config.tracker:
            config.tracker.track_duration(duration_ms)
            config.tracker.track_success()

        graph_tracker.track_node_invocation(triage_node.get_key())
        tools_called = simulate_tool_calls(triage_node, graph_tracker)

        span.set_attribute("agent.tokens.input", tokens["input"])
        span.set_attribute("agent.tokens.output", tokens["output"])
        span.set_attribute("agent.duration_ms", duration_ms)

        try:
            result = json.loads(response_text)
        except json.JSONDecodeError:
            result = {"category": "customer_support", "confidence": 0.5}

        category = result.get("category", "customer_support")

        logger.info(
            "  Triage: %s (confidence: %.2f), %dms",
            category, result.get("confidence", 0), duration_ms,
        )

        return category, result, tokens, duration_ms


def find_specialist_node(graph, triage_node, category: str):
    """Resolve the specialist node matching the triage category.
    Falls back to first available edge if no match."""
    target_key = TRIAGE_CATEGORY_MAP.get(category)

    for edge in triage_node.get_edges():
        if edge.target_config == target_key:
            return graph.get_node(target_key), edge

    edges = triage_node.get_edges()
    if edges:
        fallback_key = edges[0].target_config
        return graph.get_node(fallback_key), edges[0]

    return None, None


def run_specialist(specialist_node, question: str, user_context: dict,
                   category: str, graph_tracker, triage_key: str,
                   graph_key: str):
    tracer = _get_tracer()
    config = specialist_node.get_config()
    patch_tracker_for_graph(config.tracker, graph_key)
    node_key = specialist_node.get_key()

    with safe_span(tracer, f"agent-graph.{node_key}", attributes={
        "agent.name": node_key,
        "agent.model": config.model.name if config.model else "",
        "agent.query_type": category,
    }) as span:
        node_start = time.time()

        messages = build_messages(
            config.instructions,
            userInput=question,
            customer_context=json.dumps(user_context),
            **user_context,
        )
        messages.append({"role": "user", "content": question})

        response_text, tokens = invoke_model(config, messages)
        duration_ms = int((time.time() - node_start) * 1000)

        if config.tracker:
            config.tracker.track_duration(duration_ms)
            config.tracker.track_success()

        graph_tracker.track_node_invocation(node_key)
        graph_tracker.track_handoff_success(triage_key, node_key)
        tools_called = simulate_tool_calls(specialist_node, graph_tracker)

        span.set_attribute("agent.tokens.input", tokens["input"])
        span.set_attribute("agent.tokens.output", tokens["output"])
        span.set_attribute("agent.duration_ms", duration_ms)
        span.set_attribute("agent.response_length", len(response_text))

        logger.info(
            "  Specialist (%s): %d chars, %dms, tools: %s",
            node_key, len(response_text), duration_ms, tools_called,
        )

        return response_text, tokens, duration_ms


def run_brand_voice(brand_node, specialist_response: str, question: str,
                    user_context: dict, graph_tracker, specialist_key: str,
                    graph_key: str):
    tracer = _get_tracer()
    config = brand_node.get_config()
    patch_tracker_for_graph(config.tracker, graph_key)
    node_key = brand_node.get_key()

    with safe_span(tracer, f"agent-graph.{node_key}", attributes={
        "agent.name": node_key,
        "agent.model": config.model.name if config.model else "",
    }) as span:
        node_start = time.time()

        messages = build_messages(
            config.instructions,
            userInput=question,
            specialist_response=specialist_response,
            channel="in-app",
            **user_context,
        )
        messages.append({"role": "user", "content": (
            f"Rewrite this specialist response in ToggleBank's brand voice "
            f"for {user_context.get('name', 'the customer')}:\n\n{specialist_response}"
        )})

        response_text, tokens = invoke_model(config, messages)
        duration_ms = int((time.time() - node_start) * 1000)

        if config.tracker:
            config.tracker.track_duration(duration_ms)
            config.tracker.track_success()

        graph_tracker.track_node_invocation(node_key)
        graph_tracker.track_handoff_success(specialist_key, node_key)
        tools_called = simulate_tool_calls(brand_node, graph_tracker)

        span.set_attribute("agent.tokens.input", tokens["input"])
        span.set_attribute("agent.tokens.output", tokens["output"])
        span.set_attribute("agent.duration_ms", duration_ms)
        span.set_attribute("agent.response_length", len(response_text))

        logger.info(
            "  Brand voice (%s): %d chars, %dms",
            node_key, len(response_text), duration_ms,
        )

        return response_text, tokens, duration_ms


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def run_agent_graph(
    graph_key: str,
    ld_context,
    question: str,
    user_context: dict,
    *,
    feedback: Optional[str] = None,
) -> AgentGraphResult:
    """Execute a full agent-graph traversal for ToggleBank.

    Walks triage -> specialist -> brand voice, recording per-node metrics
    and graph-level totals so the LD Agent Graph dashboard populates.
    """
    import ldclient
    from ldai.client import LDAIClient
    from ldai.tracker import FeedbackKind, TokenUsage

    start_time = time.time()

    ai_client = LDAIClient(ldclient.get())
    agent_graph = ai_client.agent_graph(graph_key, ld_context)

    if not agent_graph.is_enabled():
        raise RuntimeError(
            f"Agent graph '{graph_key}' is disabled — check that all nodes "
            f"are reachable and enabled in LaunchDarkly"
        )

    graph_tracker = agent_graph.get_tracker()
    root_node = agent_graph.root()

    if root_node is None:
        raise RuntimeError(f"Agent graph '{graph_key}' has no root node")

    # Step 1: Triage
    category, triage_result, triage_tokens, triage_dur = run_triage(
        root_node, question, user_context, graph_tracker, graph_key,
    )

    # Step 2: Specialist
    specialist_node, specialist_edge = find_specialist_node(
        agent_graph, root_node, category,
    )
    if specialist_node is None:
        raise RuntimeError(f"No specialist node found for category={category}")

    specialist_response, spec_tokens, spec_dur = run_specialist(
        specialist_node, question, user_context, category,
        graph_tracker, root_node.get_key(), graph_key,
    )

    # Step 3: Brand voice
    brand_node = None
    for edge in specialist_node.get_edges():
        brand_node = agent_graph.get_node(edge.target_config)
        if brand_node:
            break

    brand_tokens: dict[str, int] = {"input": 0, "output": 0}
    brand_dur = 0
    if brand_node is None:
        final_response = specialist_response
        execution_path = [root_node.get_key(), specialist_node.get_key()]
    else:
        final_response, brand_tokens, brand_dur = run_brand_voice(
            brand_node, specialist_response, question, user_context,
            graph_tracker, specialist_node.get_key(), graph_key,
        )
        execution_path = [
            root_node.get_key(),
            specialist_node.get_key(),
            brand_node.get_key(),
        ]

    duration_ms = int((time.time() - start_time) * 1000)

    # Graph-level metrics
    total_in = triage_tokens["input"] + spec_tokens["input"] + brand_tokens["input"]
    total_out = triage_tokens["output"] + spec_tokens["output"] + brand_tokens["output"]
    graph_tracker.track_total_tokens(TokenUsage(
        input=total_in, output=total_out, total=total_in + total_out,
    ))
    graph_tracker.track_invocation_success()
    graph_tracker.track_latency(duration_ms)
    graph_tracker.track_path(execution_path)

    # Feedback
    if feedback and brand_node:
        brand_tracker = brand_node.get_config().tracker
        if brand_tracker:
            patch_tracker_for_graph(brand_tracker, graph_key)
            kind = FeedbackKind.Positive if feedback == "positive" else FeedbackKind.Negative
            brand_tracker.track_feedback({"kind": kind})

    ldclient.get().flush()

    return AgentGraphResult(
        final_response=final_response,
        query_type=category,
        execution_path=execution_path,
        duration_ms=duration_ms,
        tokens={"input": total_in, "output": total_out},
        node_durations={
            root_node.get_key(): triage_dur,
            specialist_node.get_key(): spec_dur,
            **(
                {brand_node.get_key(): brand_dur}
                if brand_node else {}
            ),
        },
    )
