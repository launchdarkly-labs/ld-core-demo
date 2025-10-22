#!/usr/bin/env python3
"""
Local Test Script for Periodic Results Generator
Run this to test the Lambda function logic locally before deploying to AWS
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

def test_imports():
    """Test that all required modules can be imported"""
    print("=" * 60)
    print("STEP 1: Testing Imports")
    print("=" * 60)
    
    try:
        import boto3
        print("✅ boto3")
    except ImportError:
        print("❌ boto3 - Run: pip3 install boto3")
        return False
    
    try:
        import requests
        print("✅ requests")
    except ImportError:
        print("❌ requests - Run: pip3 install requests")
        return False
    
    try:
        import ldclient
        print("✅ ldclient")
    except ImportError:
        print("❌ ldclient - Run: pip3 install launchdarkly-server-sdk")
        return False
    
    try:
        from DynamoDBUtils import DynamoDBClient
        print("✅ DynamoDBUtils")
    except ImportError:
        print("❌ DynamoDBUtils")
        return False
    
    try:
        from LDAPIUtils import LaunchDarklyAPIClient
        print("✅ LDAPIUtils")
    except ImportError:
        print("❌ LDAPIUtils")
        return False
    
    print("\n✅ All imports successful!\n")
    return True


def test_environment_variables():
    """Test that required environment variables are set"""
    print("=" * 60)
    print("STEP 2: Testing Environment Variables")
    print("=" * 60)
    
    ld_api_key = os.getenv("LD_API_KEY")
    if ld_api_key:
        print(f"✅ LD_API_KEY is set")
    else:
        print(f"❌ LD_API_KEY is NOT set")
        return False
    
    print("\nOptional AWS variables:")
    for var in ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]:
        if os.getenv(var):
            print(f"✅ {var} is set")
        else:
            print(f"ℹ️  {var} not set (may use aws CLI config)")
    
    print("\n✅ Required environment variables are set!\n")
    return True


def test_launchdarkly_api():
    """Test LaunchDarkly API connectivity"""
    print("=" * 60)
    print("STEP 3: Testing LaunchDarkly API")
    print("=" * 60)
    
    try:
        from LDAPIUtils import LaunchDarklyAPIClient, construct_project_key_from_username
        
        ld_api_token = os.getenv("LD_API_KEY")
        if not ld_api_token:
            print("❌ LD_API_KEY not set")
            return False
        
        ld_client = LaunchDarklyAPIClient(ld_api_token)
        
        test_username = os.getenv("TEST_USERNAME", "mgarza")
        project_key = construct_project_key_from_username(test_username)
        
        print(f"🔍 Testing with: {test_username} → {project_key}")
        
        credentials = ld_client.get_project_environment_keys(project_key, "production")
        
        if credentials:
            print(f"✅ Retrieved credentials for {project_key}")
            print(f"   SDK Key: {credentials['sdk_key'][:20]}...")
            print("\n✅ LaunchDarkly API test successful!\n")
            return True
        else:
            print(f"❌ Could not retrieve credentials for {project_key}")
            return False
            
    except Exception as e:
        print(f"❌ LaunchDarkly API test failed: {str(e)}")
        return False


def test_dynamodb_connection():
    """Test DynamoDB connectivity"""
    print("=" * 60)
    print("STEP 4: Testing DynamoDB Connection")
    print("=" * 60)
    
    try:
        from DynamoDBUtils import DynamoDBClient
        
        print("🔍 Connecting to DynamoDB...")
        dynamodb_client = DynamoDBClient()
        
        usernames = dynamodb_client.get_completed_users()
        
        if usernames:
            print(f"✅ Connected to DynamoDB!")
            print(f"   Found {len(usernames)} users")
            print(f"   Sample: {usernames[:5]}")
            print("\n✅ DynamoDB test successful!\n")
            return True
        else:
            print("⚠️  Connected but no users found (table may be empty)")
            print("\n✅ DynamoDB test successful!\n")
            return True
            
    except Exception as e:
        print(f"❌ DynamoDB test failed: {str(e)}")
        print("\nCommon issues:")
        print("  1. Run 'aws configure' to set credentials")
        print("  2. Check IAM permissions")
        print("  3. Verify table name and region")
        return False


def test_full_workflow():
    """Test the full workflow"""
    print("=" * 60)
    print("STEP 5: Testing Full Workflow")
    print("=" * 60)
    
    try:
        from LambdaPeriodicResultsGenerator import main
        
        print("🚀 Running main() function...")
        print("   This will generate results for ALL active demos")
        print("   Press Ctrl+C to cancel")
        
        import time
        time.sleep(3)
        
        main()
        
        print("\n✅ Full workflow completed!\n")
        return True
        
    except KeyboardInterrupt:
        print("\n⚠️  Cancelled by user")
        return False
    except Exception as e:
        print(f"\n❌ Full workflow failed: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("PERIODIC RESULTS GENERATOR - LOCAL TEST")
    print("=" * 60 + "\n")
    
    results = []
    
    results.append(("Imports", test_imports()))
    if not results[-1][1]:
        print("\n❌ Import test failed")
        sys.exit(1)
    
    results.append(("Environment Variables", test_environment_variables()))
    if not results[-1][1]:
        print("\n❌ Environment test failed")
        sys.exit(1)
    
    results.append(("LaunchDarkly API", test_launchdarkly_api()))
    results.append(("DynamoDB Connection", test_dynamodb_connection()))
    
    print("\n" + "=" * 60)
    response = input("Run full workflow test? (y/N): ")
    if response.lower() == 'y':
        results.append(("Full Workflow", test_full_workflow()))
    else:
        print("Skipping full workflow test")
        results.append(("Full Workflow", None))
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for test_name, result in results:
        if result is True:
            print(f"✅ {test_name}: PASSED")
        elif result is False:
            print(f"❌ {test_name}: FAILED")
        elif result is None:
            print(f"⚠️  {test_name}: SKIPPED")
    
    print("=" * 60 + "\n")
    
    failed_tests = [name for name, result in results if result is False]
    if failed_tests:
        print(f"❌ {len(failed_tests)} test(s) failed")
        sys.exit(1)
    else:
        print("✅ All tests passed! Ready to deploy.")
        sys.exit(0)


if __name__ == "__main__":
    main()

