#!/usr/bin/env python3
"""
Synthetic traffic handler for ToggleBank using LaunchDarkly Agent Graph.

Runs ITERATIONS iterations per invocation, each exercising the full
multi-agent pipeline (triage -> specialist -> brand voice) via the
LD Agent Graph SDK. Fires hourly via EventBridge to keep the Agent
Graph dashboard populated with real invocation data.
"""

import json
import logging
import random
import sys
import time
from datetime import datetime, timezone
from uuid import uuid4

from common import (
    BETA_TESTER_USERS,
    ITERATIONS,
    POSITIVE_FEEDBACK_RATE,
    QUESTION_POOL,
    build_ld_context,
    create_user_context,
    ensure_initialized,
    flush_traces,
    get_tracer,
)
from agent_runner import run_agent_graph

logger = logging.getLogger()
logger.setLevel(logging.INFO)

AGENT_GRAPH_KEY = "togglebot-multi-agent"


def _run_single_iteration(iteration_num: int) -> dict:
    """Run a single iteration using the LD Agent Graph."""
    from opentelemetry.trace import StatusCode

    tracer = get_tracer("togglebank.agent-graph")
    user_spec = random.choice(BETA_TESTER_USERS)
    question = random.choice(QUESTION_POOL)
    request_id = str(uuid4())

    user_context = create_user_context(user_spec)
    is_positive = random.random() < POSITIVE_FEEDBACK_RATE
    feedback = "positive" if is_positive else "negative"

    with tracer.start_as_current_span(
        "synthetic-iteration",
        attributes={
            "synthetic.iteration": iteration_num,
            "synthetic.user.name": user_spec["name"],
            "synthetic.user.location": user_spec["location"],
            "synthetic.user.tier": user_spec["tier"],
            "synthetic.question": question,
            "synthetic.request_id": request_id,
            "synthetic.user_key": user_context["user_key"],
            "synthetic.handler": "agent-graph",
        },
    ) as span:
        logger.info(
            f"[Iteration {iteration_num}] User: {user_spec['name']}, "
            f"Question: {question[:60]}..."
        )

        start_time = time.time()

        try:
            ld_context = build_ld_context(user_context)

            result = run_agent_graph(
                graph_key=AGENT_GRAPH_KEY,
                ld_context=ld_context,
                question=question,
                user_context=user_context,
                feedback=feedback,
            )

            span.set_attribute("synthetic.response_length", len(result.final_response))
            span.set_attribute("synthetic.duration_ms", result.duration_ms)
            span.set_attribute("synthetic.query_type", result.query_type)
            span.set_attribute("synthetic.feedback", feedback)
            span.set_attribute("synthetic.execution_path", ",".join(result.execution_path))
            span.set_status(StatusCode.OK)

            logger.info(
                f"[Iteration {iteration_num}] Response: {len(result.final_response)} chars, "
                f"{result.duration_ms}ms, path: {' -> '.join(result.execution_path)}"
            )

            return {
                "iteration": iteration_num,
                "user": user_spec["name"],
                "question": question,
                "response_length": len(result.final_response),
                "duration_ms": result.duration_ms,
                "query_type": result.query_type,
                "execution_path": result.execution_path,
                "feedback": feedback,
                "success": True,
            }

        except Exception as e:
            duration_ms = int((time.time() - start_time) * 1000)
            logger.error(
                f"[Iteration {iteration_num}] Error: {e}", exc_info=True
            )
            span.set_status(StatusCode.ERROR, str(e))
            span.record_exception(e)
            span.set_attribute("synthetic.duration_ms", duration_ms)

            return {
                "iteration": iteration_num,
                "user": user_spec["name"],
                "question": question,
                "error": str(e),
                "duration_ms": duration_ms,
                "success": False,
            }


def lambda_handler(event, context):
    """AWS Lambda entry point — Agent Graph workflow."""
    execution_start = datetime.now(timezone.utc)
    logger.info(
        f"[AgentGraph] Starting synthetic traffic at {execution_start.isoformat()}"
    )
    logger.info(f"Event: {json.dumps(event, default=str)}")

    ensure_initialized()

    tracer = get_tracer("togglebank.agent-graph")

    with tracer.start_as_current_span(
        "synthetic-traffic-batch",
        attributes={
            "synthetic.total_iterations": ITERATIONS,
            "synthetic.positive_feedback_rate": POSITIVE_FEEDBACK_RATE,
            "synthetic.timestamp": execution_start.isoformat(),
            "synthetic.source": "lambda",
            "synthetic.handler": "agent-graph",
            "synthetic.graph_key": AGENT_GRAPH_KEY,
        },
    ) as batch_span:
        results = []
        for i in range(1, ITERATIONS + 1):
            result = _run_single_iteration(i)
            results.append(result)
            logger.info(f"Completed iteration {i}/{ITERATIONS}")

        success_count = sum(1 for r in results if r["success"])
        total_duration = int(
            (datetime.now(timezone.utc) - execution_start).total_seconds()
        )

        batch_span.set_attribute("synthetic.successful", success_count)
        batch_span.set_attribute("synthetic.failed", ITERATIONS - success_count)
        batch_span.set_attribute("synthetic.total_duration_seconds", total_duration)

        from opentelemetry.trace import StatusCode

        if success_count == ITERATIONS:
            batch_span.set_status(StatusCode.OK)
        else:
            batch_span.set_status(
                StatusCode.ERROR,
                f"{ITERATIONS - success_count}/{ITERATIONS} iterations failed",
            )

    try:
        import ldclient
        ldclient.get().flush()
    except Exception:
        pass

    flush_traces()
    time.sleep(1)

    summary = {
        "total_iterations": ITERATIONS,
        "successful": success_count,
        "failed": ITERATIONS - success_count,
        "total_duration_seconds": total_duration,
        "timestamp": execution_start.isoformat(),
        "handler": "agent-graph",
        "graph_key": AGENT_GRAPH_KEY,
        "results": results,
    }

    logger.info(
        f"[AgentGraph] Complete: {success_count}/{ITERATIONS} successful, "
        f"{total_duration}s total"
    )

    return {
        "statusCode": 200,
        "body": json.dumps(summary, default=str),
    }


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    test_event = {}
    test_context = type(
        "Context",
        (),
        {
            "function_name": "togglebank-synthetic-agent-graph-test",
            "remaining_time_in_millis": lambda: 900000,
        },
    )()

    result = lambda_handler(test_event, test_context)
    print(json.dumps(json.loads(result["body"]), indent=2))
