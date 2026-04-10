#!/usr/bin/env python3
"""
Multi-project synthetic traffic handler for ToggleBank Agent Graph.

Mirrors the periodic-results-generator pattern:
  1. Fetches active demo environments from DynamoDB
  2. Filters to users whose agent-graph data is stale
  3. For each user (in batches), resolves their project's SDK key via LD API
  4. Initializes an LD client for that project and runs agent-graph iterations
  5. Updates the DynamoDB timestamp so the user is skipped next run

Fires hourly via EventBridge.
"""

import json
import logging
import os
import random
import time
from datetime import datetime, timezone
from uuid import uuid4

from DynamoDBUtils import DynamoDBClient
from LDAPIUtils import LaunchDarklyAPIClient, construct_project_key_from_username
from common import (
    BATCH_SIZE,
    BETA_TESTER_USERS,
    DAYS_BEFORE_REGENERATE,
    ITERATIONS,
    POSITIVE_FEEDBACK_RATE,
    QUESTION_POOL,
    build_ld_context,
    close_ld_client,
    create_user_context,
    flush_traces,
    get_tracer,
    init_ld_client,
    safe_span,
)
from agent_runner import run_agent_graph

logger = logging.getLogger()
logger.setLevel(logging.INFO)

AGENT_GRAPH_KEY = "togglebot-multi-agent"


# ---------------------------------------------------------------------------
# Per-project runner
# ---------------------------------------------------------------------------

def run_iterations_for_project(project_key, sdk_key):
    """Initialize LD client and run agent-graph iterations for one project."""
    logger.info(f"--- Running agent graph for project: {project_key} ---")

    client = init_ld_client(sdk_key)
    if not client:
        logger.error(f"  SKIP: LD client failed to initialize for {project_key}")
        return {"project": project_key, "success": False, "error": "init_failed"}

    results = []
    try:
        for i in range(1, ITERATIONS + 1):
            result = _run_single_iteration(i, project_key)
            results.append(result)
            logger.info(f"  [{project_key}] Iteration {i}/{ITERATIONS} done")
    except Exception as e:
        logger.error(f"  ERROR running iterations for {project_key}: {e}")
    finally:
        close_ld_client()

    flush_traces()
    time.sleep(1)

    success_count = sum(1 for r in results if r.get("success"))
    return {
        "project": project_key,
        "success": True,
        "iterations": len(results),
        "successful": success_count,
        "failed": len(results) - success_count,
    }


def _run_single_iteration(iteration_num: int, project_key: str) -> dict:
    """Run one triage -> specialist -> brand-voice traversal."""
    user_spec = random.choice(BETA_TESTER_USERS)
    question = random.choice(QUESTION_POOL)
    user_context = create_user_context(user_spec)
    feedback = "positive" if random.random() < POSITIVE_FEEDBACK_RATE else "negative"

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

        logger.info(
            f"  [Iteration {iteration_num}] {result.query_type}, "
            f"{result.duration_ms}ms, path: {' -> '.join(result.execution_path)}"
        )

        return {
            "iteration": iteration_num,
            "user": user_spec["name"],
            "question": question,
            "duration_ms": result.duration_ms,
            "query_type": result.query_type,
            "execution_path": result.execution_path,
            "success": True,
        }

    except Exception as e:
        duration_ms = int((time.time() - start_time) * 1000)
        logger.error(
            f"  [Iteration {iteration_num}] Error: {e}", exc_info=True
        )

        return {
            "iteration": iteration_num,
            "user": user_spec["name"],
            "error": str(e),
            "duration_ms": duration_ms,
            "success": False,
        }


# ---------------------------------------------------------------------------
# Lambda entry point
# ---------------------------------------------------------------------------

def lambda_handler(event, context):
    """AWS Lambda entry point — multi-project agent graph workflow."""
    execution_start = datetime.now(timezone.utc)
    logger.info(
        f"[AgentGraph] Starting multi-project synthetic traffic "
        f"at {execution_start.isoformat()}"
    )
    logger.info(f"Event: {json.dumps(event, default=str)}")

    ld_api_token = os.getenv("LD_API_KEY")
    if not ld_api_token:
        logger.error("LD_API_KEY environment variable not set")
        return {"statusCode": 500, "body": "LD_API_KEY not set"}

    dynamodb_client = DynamoDBClient()
    ld_api_client = LaunchDarklyAPIClient(ld_api_token)

    all_usernames = dynamodb_client.get_completed_users()
    if not all_usernames:
        logger.info("No active demo environments found")
        return {"statusCode": 200, "body": "No environments to process"}

    logger.info(f"Total users in database: {len(all_usernames)}")

    users_to_process = dynamodb_client.filter_users_needing_refresh(
        all_usernames, days_threshold=DAYS_BEFORE_REGENERATE
    )
    logger.info(
        f"Users needing agent graph refresh "
        f"(>= {DAYS_BEFORE_REGENERATE} days old): {len(users_to_process)}"
    )

    batch = users_to_process[:BATCH_SIZE]
    logger.info(f"Processing batch of {len(batch)} users")
    logger.info("-" * 70)

    project_results = []
    successful = 0
    failed = 0
    skipped = 0

    for idx, username in enumerate(batch, 1):
        try:
            project_key = construct_project_key_from_username(username)
            logger.info(
                f"[{idx}/{len(batch)}] Processing: {username} ({project_key})"
            )

            credentials = ld_api_client.get_project_environment_keys(
                project_key, "production"
            )
            if not credentials or not credentials.get("sdk_key"):
                logger.warning(f"  SKIPPED: No credentials for {username}")
                skipped += 1
                continue

            result = run_iterations_for_project(project_key, credentials["sdk_key"])
            project_results.append(result)

            if result.get("success"):
                dynamodb_client.update_last_generated_timestamp(username)
                successful += 1
                logger.info(f"  SUCCESS: Completed {username}")
            else:
                failed += 1

            time.sleep(2)

        except Exception as e:
            logger.error(f"  ERROR: Failed {username}: {e}")
            failed += 1

    total_duration = int(
        (datetime.now(timezone.utc) - execution_start).total_seconds()
    )

    summary = {
        "total_users_found": len(all_usernames),
        "users_needing_refresh": len(users_to_process),
        "batch_size": len(batch),
        "successful": successful,
        "failed": failed,
        "skipped": skipped,
        "remaining": len(users_to_process) - len(batch),
        "total_duration_seconds": total_duration,
        "timestamp": execution_start.isoformat(),
        "project_results": project_results,
    }

    logger.info("=" * 70)
    logger.info(
        f"[AgentGraph] SUMMARY: {successful} ok | {failed} failed | "
        f"{skipped} skipped | {total_duration}s total"
    )
    logger.info(f"Remaining users: {len(users_to_process) - len(batch)}")
    logger.info("=" * 70)

    return {"statusCode": 200, "body": json.dumps(summary, default=str)}


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    test_context = type(
        "Context",
        (),
        {
            "function_name": "togglebank-synthetic-agent-graph-test",
            "aws_request_id": "local-test",
            "remaining_time_in_millis": lambda: 900000,
        },
    )()

    result = lambda_handler({}, test_context)
    print(json.dumps(json.loads(result["body"]), indent=2))
