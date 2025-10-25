"""
DynamoDB Utilities
Helper functions to interact with DynamoDB for demo provisioning records
"""
import boto3
import logging
from datetime import datetime, timedelta

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

class DynamoDBClient:
    """Client for interacting with DynamoDB demo provisioning table"""
    
    def __init__(self, table_name="ld-core-demo-provisioning-workflow-records-prod", region="us-east-1"):
        self.table_name = table_name
        self.region = region
        self.dynamodb = boto3.resource('dynamodb', region_name=region)
        self.table = self.dynamodb.Table(table_name)
        self.user_records = {}
    
    def get_completed_users(self):
        """
        Retrieve all users with status='completed' from DynamoDB
        Handles duplicate records by keeping only the most recent one per user
        
        Returns:
            list: List of unique usernames with completed status
        """
        try:
            logging.info(f"Scanning DynamoDB table: {self.table_name}")
            
            response = self.table.scan(
                FilterExpression='#status = :completed',
                ExpressionAttributeNames={'#status': 'status'},
                ExpressionAttributeValues={':completed': 'completed'}
            )
            
            items = response.get('Items', [])
            
            while 'LastEvaluatedKey' in response:
                response = self.table.scan(
                    FilterExpression='#status = :completed',
                    ExpressionAttributeNames={'#status': 'status'},
                    ExpressionAttributeValues={':completed': 'completed'},
                    ExclusiveStartKey=response['LastEvaluatedKey']
                )
                items.extend(response.get('Items', []))
            
            logging.info(f"Found {len(items)} completed records")
            
            #de-duplicate by username, keeping most recent
            for item in items:
                username = item.get('userKey')
                created_at = item.get('createdAt')
                
                if not username:
                    continue
                
                if username not in self.user_records:
                    self.user_records[username] = item
                elif created_at and created_at > self.user_records[username].get('createdAt', ''):
                    self.user_records[username] = item
            
            unique_usernames = list(self.user_records.keys())
            logging.info(f"Found {len(unique_usernames)} unique users")
            
            return unique_usernames
            
        except Exception as e:
            logging.error(f"Error scanning DynamoDB: {str(e)}")
            return []
    
    def filter_users_needing_refresh(self, usernames, days_threshold=3):
        """
        Filter users who need results regenerated (haven't been processed recently)
        
        Args:
            usernames: List of usernames to filter
            days_threshold: Number of days since last generation to consider stale
            
        Returns:
            list: Usernames that need refresh, sorted by priority (oldest first)
        """
        users_needing_refresh = []
        now = datetime.now()
        
        for username in usernames:
            user_record = self.user_records.get(username, {})
            last_generated = user_record.get('lastResultsGenerated')
            
            if not last_generated:
                users_needing_refresh.append((username, None))
            else:
                try:
                    last_gen_dt = datetime.fromisoformat(last_generated.replace('Z', '+00:00'))
                    days_since = (now - last_gen_dt).days
                    
                    if days_since >= days_threshold:
                        users_needing_refresh.append((username, last_gen_dt))
                except Exception as e:
                    logging.warning(f"Error parsing date for {username}: {e}")
                    users_needing_refresh.append((username, None))
        
        users_needing_refresh.sort(key=lambda x: x[1] if x[1] else datetime.min)
        
        return [username for username, _ in users_needing_refresh]
    
    def update_last_generated_timestamp(self, username):
        """
        Update the lastResultsGenerated timestamp for a user
        Attempts to write to DynamoDB, falls back to logging if it fails
        """
        timestamp = datetime.now().isoformat()
        logging.info(f"Results generated for {username} at {timestamp}")
        
        try:
            user_record = self.user_records.get(username)
            if not user_record:
                logging.warning(f"No record found for {username}, cannot update timestamp")
                return
            
            user_key = user_record.get('userKey')
            created_at = user_record.get('createdAt')
            
            if not user_key or not created_at:
                logging.warning(f"Missing key fields for {username}")
                return
            
            self.table.update_item(
                Key={
                    'userKey': user_key,
                    'createdAt': created_at
                },
                UpdateExpression='SET lastResultsGenerated = :timestamp',
                ExpressionAttributeValues={
                    ':timestamp': timestamp
                }
            )
            
            logging.info(f"Successfully updated timestamp in DynamoDB for {username}")
            
        except Exception as e:
            logging.warning(f"Could not update DynamoDB timestamp for {username}: {e}")

