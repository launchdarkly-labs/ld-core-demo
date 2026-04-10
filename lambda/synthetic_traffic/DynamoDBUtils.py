"""
DynamoDB Utilities for ToggleBank Synthetic Agent Graph Lambda.
Tracks active demo environments and their agent-graph generation timestamps.

Uses a separate timestamp field (last_agent_graph_generated) so this Lambda
runs independently of the periodic-results-generator.
"""
import os
import logging
from datetime import datetime, timezone, timedelta

import boto3
from boto3.dynamodb.conditions import Attr

logger = logging.getLogger(__name__)

TIMESTAMP_FIELD = "last_agent_graph_generated"


class DynamoDBClient:
    """Client for the demo-environments tracking table in DynamoDB."""

    def __init__(self, table_name=None, region=None):
        self.table_name = table_name or os.getenv(
            "DYNAMODB_TABLE_NAME", "ld-core-demo-environments"
        )
        region = region or os.getenv("AWS_REGION", "us-east-1")
        dynamodb = boto3.resource("dynamodb", region_name=region)
        self.table = dynamodb.Table(self.table_name)
        logger.info(f"DynamoDB client initialized for table: {self.table_name}")

    def get_completed_users(self):
        """Return list of usernames whose demo status is 'completed'."""
        try:
            response = self.table.scan(
                FilterExpression=Attr("status").eq("completed"),
                ProjectionExpression="username",
            )
            items = response.get("Items", [])

            while "LastEvaluatedKey" in response:
                response = self.table.scan(
                    FilterExpression=Attr("status").eq("completed"),
                    ProjectionExpression="username",
                    ExclusiveStartKey=response["LastEvaluatedKey"],
                )
                items.extend(response.get("Items", []))

            usernames = [item["username"] for item in items if "username" in item]
            logger.info(f"Found {len(usernames)} completed users")
            return usernames

        except Exception as e:
            logger.error(f"Error fetching completed users: {e}")
            return []

    def filter_users_needing_refresh(self, usernames, days_threshold=3):
        """Return users whose agent-graph data is older than days_threshold days."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days_threshold)
        needs_refresh = []

        for username in usernames:
            try:
                response = self.table.get_item(Key={"username": username})
                item = response.get("Item", {})

                last_gen = item.get(TIMESTAMP_FIELD)
                if not last_gen:
                    needs_refresh.append(username)
                    continue

                last_dt = datetime.fromisoformat(last_gen.replace("Z", "+00:00"))
                if last_dt < cutoff:
                    needs_refresh.append(username)

            except Exception as e:
                logger.warning(f"Error checking {username}, including in refresh: {e}")
                needs_refresh.append(username)

        logger.info(
            f"{len(needs_refresh)}/{len(usernames)} users need agent graph refresh"
        )
        return needs_refresh

    def update_last_generated_timestamp(self, username):
        """Mark a user's agent-graph data as freshly generated."""
        try:
            self.table.update_item(
                Key={"username": username},
                UpdateExpression=f"SET {TIMESTAMP_FIELD} = :ts",
                ExpressionAttributeValues={
                    ":ts": datetime.now(timezone.utc).isoformat()
                },
            )
            logger.info(f"Updated {TIMESTAMP_FIELD} for {username}")
        except Exception as e:
            logger.error(f"Error updating timestamp for {username}: {e}")
