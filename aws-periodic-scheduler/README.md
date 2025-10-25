# AWS Periodic Results Generator

## Purpose

This Lambda function automatically regenerates experiment results, monitoring data, and guarded releases for all active demo environments every 3-4 days. This keeps demo environments looking fresh and active without requiring manual intervention.

## What It Does

- Queries DynamoDB for all active demo environments (status: `completed`)
- Filters users who haven't had results regenerated in the last 3 days
- Processes users in batches of 5 per Lambda invocation
- Generates fresh data for:
  - Experiments (cart suggestions, hero images, AI configs, etc.)
  - Monitoring metrics (AI chatbot feedback, financial agent metrics)
  - Guarded releases (A4, risk management, financial advisor, databases)
- Updates `lastResultsGenerated` timestamp in DynamoDB to track processing

## Architecture

```
CloudWatch EventBridge (every 6-12 hours)
    ↓
Lambda Function
    ↓
DynamoDB (fetch active users) + LaunchDarkly Management API (fetch SDK keys)
    ↓
LaunchDarkly SDK (send events)
    ↓
LaunchDarkly Dashboard (updated experiment results)
```

## Key Technical Solutions

### Connection Pool Fix
The Lambda includes a urllib3 monkey-patch that increases the connection pool size from 1 to 50, solving the "Connection pool is full" issue that prevents events from reaching LaunchDarkly in serverless environments.

### Batch Processing
Processes 5 users per invocation to prevent Lambda timeout. The CloudWatch scheduler triggers the Lambda every 6-12 hours, gradually processing all users that need refresh.

### Smart Filtering
Only regenerates results for users whose `lastResultsGenerated` timestamp is >= 3 days old, preventing unnecessary processing and respecting the "every 3-4 days" requirement.

## Files

- **`lambda_deploy/`** - Lambda function source code
  - `LambdaPeriodicResultsGenerator.py` - Main Lambda handler
  - `DynamoDBUtils.py` - DynamoDB client for user management
  - `LDAPIUtils.py` - LaunchDarkly Management API client
  - `results_generator.py` - Copy with dynamic PROJECT_KEY support
  - All Python dependencies (ldclient, boto3, requests, etc.)

## Deployment

The deployment package is located at:
```
aws-periodic-scheduler/PeriodicResultsGeneratorLambda.zip
```

### Lambda Configuration
- **Runtime:** Python 3.11
- **Timeout:** 15 minutes (900 seconds)
- **Memory:** 512 MB
- **Handler:** `LambdaPeriodicResultsGenerator.lambda_handler`

### Environment Variables
- `LD_API_KEY` - LaunchDarkly Management API Service Token (Reader access)

### IAM Permissions
- `AmazonDynamoDBFullAccess` - for reading/writing DynamoDB timestamps
- `AWSLambdaBasicExecutionRole` - for CloudWatch Logs

### CloudWatch EventBridge Schedule
Create a scheduled rule:
- **Schedule:** `rate(6 hours)` or `rate(12 hours)`
- **Target:** The Lambda function

## Testing & Verification

✅ Successfully tested in AWS Lambda  
✅ Events reach LaunchDarkly without connection pool errors  
✅ Experiment results update correctly in dashboard  
✅ DynamoDB timestamp tracking prevents duplicate processing  
✅ Batch processing prevents timeout with 300+ users  

## Important Notes

- This Lambda **does NOT affect** the existing provisioning process in `DemoBuilder.py`
- Original `results_generator.py` in `demo_provisioning_scripts/` remains unchanged
- Lambda uses a separate copy with dynamic PROJECT_KEY support for multi-environment processing
- The Lambda reuses existing generator functions, ensuring consistency across provisioning and periodic updates

