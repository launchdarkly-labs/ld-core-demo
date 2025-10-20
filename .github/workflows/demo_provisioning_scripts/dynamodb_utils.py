"""
DynamoDB Utilities
Helper functions to interact with DynamoDB for demo provisioning records
"""
import boto3
import logging
from datetime import datetime

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
            
            # De-duplicate by username, keeping most recent
            user_records = {}
            for item in items:
                username = item.get('userKey')
                created_at = item.get('createdAt')
                
                if not username:
                    continue
                
                if username not in user_records:
                    user_records[username] = item
                elif created_at and created_at > user_records[username].get('createdAt', ''):
                    user_records[username] = item
            
            unique_usernames = list(user_records.keys())
            logging.info(f"Found {len(unique_usernames)} unique users")
            
            return unique_usernames
            
        except Exception as e:
            logging.error(f"Error scanning DynamoDB: {str(e)}")
            return []
    
    def update_last_generated_timestamp(self, username):
        """Log when results were last generated for a user"""
        logging.info(f"Results generated for {username} at {datetime.now().isoformat()}")
