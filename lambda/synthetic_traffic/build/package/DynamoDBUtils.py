"""
DynamoDB Utilities for ToggleBank Synthetic Agent Graph Lambda.
Tracks active demo environments and their agent-graph generation timestamps.

Mirrors the periodic-results-generator's DynamoDBUtils but uses a separate
timestamp field (lastAgentGraphGenerated) so the two Lambdas run independently.
"""
import logging
from datetime import datetime

import boto3

logger = logging.getLogger(__name__)

TIMESTAMP_FIELD = "lastAgentGraphGenerated"


class DynamoDBClient:
    """Client for the demo provisioning workflow records table."""

    def __init__(self, table_name="ld-core-demo-provisioning-workflow-records-prod", region="us-east-1"):
        self.table_name = table_name
        self.region = region
        self.dynamodb = boto3.resource("dynamodb", region_name=region)
        self.table = self.dynamodb.Table(table_name)
        self.user_records = {}
        logger.info(f"DynamoDB client initialized for table: {self.table_name}")

    def get_completed_users(self):
        """Retrieve all users with status='completed', de-duplicated by userKey."""
        try:
            logger.info(f"Scanning DynamoDB table: {self.table_name}")

            response = self.table.scan(
                FilterExpression="#status = :completed",
                ExpressionAttributeNames={"#status": "status"},
                ExpressionAttributeValues={":completed": "completed"},
            )
            items = response.get("Items", [])

            while "LastEvaluatedKey" in response:
                response = self.table.scan(
                    FilterExpression="#status = :completed",
                    ExpressionAttributeNames={"#status": "status"},
                    ExpressionAttributeValues={":completed": "completed"},
                    ExclusiveStartKey=response["LastEvaluatedKey"],
                )
                items.extend(response.get("Items", []))

            logger.info(f"Found {len(items)} completed records")

            for item in items:
                username = item.get("userKey")
                created_at = item.get("createdAt")
                if not username:
                    continue
                if username not in self.user_records:
                    self.user_records[username] = item
                elif created_at and created_at > self.user_records[username].get("createdAt", ""):
                    self.user_records[username] = item

            unique_usernames = list(self.user_records.keys())
            logger.info(f"Found {len(unique_usernames)} unique users")
            return unique_usernames

        except Exception as e:
            logger.error(f"Error scanning DynamoDB: {e}")
            return []

    def filter_users_needing_refresh(self, usernames, days_threshold=3):
        """Filter users whose agent-graph data is older than days_threshold days."""
        users_needing_refresh = []
        now = datetime.now()

        for username in usernames:
            user_record = self.user_records.get(username, {})
            last_generated = user_record.get(TIMESTAMP_FIELD)

            if not last_generated:
                users_needing_refresh.append((username, None))
            else:
                try:
                    last_gen_dt = datetime.fromisoformat(
                        last_generated.replace("Z", "+00:00")
                    )
                    days_since = (now - last_gen_dt).days
                    if days_since >= days_threshold:
                        users_needing_refresh.append((username, last_gen_dt))
                except Exception as e:
                    logger.warning(f"Error parsing date for {username}: {e}")
                    users_needing_refresh.append((username, None))

        users_needing_refresh.sort(key=lambda x: x[1] if x[1] else datetime.min)

        logger.info(
            f"{len(users_needing_refresh)}/{len(usernames)} users need agent graph refresh"
        )
        return [username for username, _ in users_needing_refresh]

    def update_last_generated_timestamp(self, username):
        """Update the lastAgentGraphGenerated timestamp for a user."""
        timestamp = datetime.now().isoformat()
        logger.info(f"Agent graph generated for {username} at {timestamp}")

        try:
            user_record = self.user_records.get(username)
            if not user_record:
                logger.warning(f"No record found for {username}, cannot update timestamp")
                return

            user_key = user_record.get("userKey")
            created_at = user_record.get("createdAt")

            if not user_key or not created_at:
                logger.warning(f"Missing key fields for {username}")
                return

            self.table.update_item(
                Key={"userKey": user_key, "createdAt": created_at},
                UpdateExpression=f"SET {TIMESTAMP_FIELD} = :timestamp",
                ExpressionAttributeValues={":timestamp": timestamp},
            )
            logger.info(f"Successfully updated {TIMESTAMP_FIELD} in DynamoDB for {username}")

        except Exception as e:
            logger.warning(f"Could not update DynamoDB timestamp for {username}: {e}")
