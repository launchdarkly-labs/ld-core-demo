#!/usr/bin/env python3
"""
Multi-project synthetic traffic handler for ToggleBank Agent Graph.

Three invocation modes:

  Scheduled (EventBridge cron — hourly):
    Fetches active demo environments from DynamoDB, filters to stale ones,
    resolves SDK keys via LD API, runs agent-graph iterations in batches,
    and updates timestamps so users are skipped next run.

  DynamoDB Stream (automatic on provisioning):
    Fires when a record in the provisioning table reaches status=completed.
    Generates agent-graph data for that single new project immediately.

  On-demand (manual / direct invoke):
    Accepts {"project_key": "..."} or {"username": "..."} in the event payload
    and immediately generates agent-graph data for that single project.
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
    ITERATIONS_MAX,
    ITERATIONS_MIN,
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

    num_iterations = random.randint(ITERATIONS_MIN, ITERATIONS_MAX)
    logger.info(f"  Running {num_iterations} iterations for {project_key}")

    results = []
    try:
        for i in range(1, num_iterations + 1):
            result = _run_single_iteration(i, project_key)
            results.append(result)
            logger.info(f"  [{project_key}] Iteration {i}/{num_iterations} done")

            if not result.get("success") and "disabled" in result.get("error", ""):
                logger.warning(f"  Agent graph disabled for {project_key}, skipping remaining iterations")
                break
    except Exception as e:
        logger.error(f"  ERROR running iterations for {project_key}: {e}")
    finally:
        close_ld_client()

    flush_traces()
    time.sleep(1)

    success_count = sum(1 for r in results if r.get("success"))
    return {
        "project": project_key,
        "success": success_count > 0,
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

def _run_single_project_by_key(project_key, ld_api_client):
    """Resolve SDK key and run iterations for one project. Returns (result, username)."""
    credentials = ld_api_client.get_project_environment_keys(project_key, "production")
    if not credentials or not credentials.get("sdk_key"):
        logger.warning(f"  SKIPPED: No credentials for {project_key}")
        return None, None

    result = run_iterations_for_project(project_key, credentials["sdk_key"])
    return result, None


def lambda_handler(event, context):
    """AWS Lambda entry point — multi-project agent graph workflow.

    Supports three invocation modes:
      1. Scheduled (EventBridge cron): scans DynamoDB for stale environments
      2. DynamoDB Stream: fires automatically when a provisioning record
         reaches status=completed — generates data for that one project
      3. On-demand: pass {"project_key": "..."} or {"username": "..."} to
         generate data for a single project manually
    """
    execution_start = datetime.now(timezone.utc)
    logger.info(
        f"[AgentGraph] Starting synthetic traffic at {execution_start.isoformat()}"
    )
    logger.info(f"Event: {json.dumps(event, default=str)}")

    ld_api_token = os.getenv("LD_API_KEY")
    if not ld_api_token:
        logger.error("LD_API_KEY environment variable not set")
        return {"statusCode": 500, "body": "LD_API_KEY not set"}

    ld_api_client = LaunchDarklyAPIClient(ld_api_token)

    # --- DynamoDB Stream mode: extract username from stream records ---
    if "Records" in event and event["Records"][0].get("eventSource") == "aws:dynamodb":
        for record in event["Records"]:
            if record.get("eventName") not in ("INSERT", "MODIFY"):
                continue
            new_image = record.get("dynamodb", {}).get("NewImage", {})
            status = new_image.get("status", {}).get("S", "")
            username = new_image.get("userKey", {}).get("S", "")
            if status == "completed" and username:
                logger.info(f"[AgentGraph] DynamoDB Stream trigger for user: {username}")
                project_key = construct_project_key_from_username(username)
                result, _ = _run_single_project_by_key(project_key, ld_api_client)
                if result and result.get("success"):
                    logger.info(f"[AgentGraph] Stream trigger SUCCESS for {project_key}")
                else:
                    logger.warning(f"[AgentGraph] Stream trigger FAILED for {project_key}")
        total_duration = int(
            (datetime.now(timezone.utc) - execution_start).total_seconds()
        )
        return {"statusCode": 200, "body": json.dumps({
            "mode": "dynamodb-stream",
            "total_duration_seconds": total_duration,
        }, default=str)}

    # --- On-demand mode: single project from direct invocation ---
    trigger_project = event.get("project_key")
    trigger_username = event.get("username")

    if trigger_project or trigger_username:
        project_key = trigger_project or construct_project_key_from_username(trigger_username)
        logger.info(f"[AgentGraph] On-demand trigger for project: {project_key}")

        result, _ = _run_single_project_by_key(project_key, ld_api_client)
        if result is None:
            return {"statusCode": 200, "body": f"Skipped {project_key} — no credentials"}

        total_duration = int(
            (datetime.now(timezone.utc) - execution_start).total_seconds()
        )
        summary = {
            "mode": "on-demand",
            "project": project_key,
            "result": result,
            "total_duration_seconds": total_duration,
        }
        logger.info(
            f"[AgentGraph] On-demand complete: {project_key} — "
            f"{'SUCCESS' if result.get('success') else 'FAILED'} in {total_duration}s"
        )
        return {"statusCode": 200, "body": json.dumps(summary, default=str)}

    # --- Scheduled mode: scan DynamoDB for stale environments ---
    dynamodb_client = DynamoDBClient()

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
        "mode": "scheduled",
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
    import sys
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

    # Usage:  python handler_agent_graph.py                    (scheduled scan)
    #         python handler_agent_graph.py --project foo-ld-demo  (on-demand)
    #         python handler_agent_graph.py --username foo          (on-demand)
    event = {}
    if "--project" in sys.argv:
        event["project_key"] = sys.argv[sys.argv.index("--project") + 1]
    elif "--username" in sys.argv:
        event["username"] = sys.argv[sys.argv.index("--username") + 1]

    result = lambda_handler(event, test_context)
    print(json.dumps(json.loads(result["body"]), indent=2))
