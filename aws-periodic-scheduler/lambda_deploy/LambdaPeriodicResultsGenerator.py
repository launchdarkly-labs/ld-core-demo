"""
Periodic Results Generator for AWS Lambda
Runs results generator for all active demo environments every 3-4 days
"""
import os
import logging

# CRITICAL: Monkey-patch urllib3 to increase connection pool size
import urllib3
_original_poolmanager_init = urllib3.PoolManager.__init__

def _patched_poolmanager_init(self, *args, **kwargs):
    # Force maxsize to 50 instead of default 10
    kwargs['maxsize'] = 50
    kwargs['block'] = False
    return _original_poolmanager_init(self, *args, **kwargs)

urllib3.PoolManager.__init__ = _patched_poolmanager_init
print("[PATCH] urllib3.PoolManager maxsize increased to 50")

import ldclient
from ldclient.config import Config
from dotenv import load_dotenv
from DynamoDBUtils import DynamoDBClient
from LDAPIUtils import LaunchDarklyAPIClient, construct_project_key_from_username
from results_generator import (
    evaluate_all_flags,
    ai_configs_monitoring_results_generator,
    financial_agent_monitoring_results_generator,
    experiment_results_generator,
    ai_configs_experiment_results_generator,
    hero_image_experiment_results_generator,
    hero_redesign_experiment_results_generator,
    hallucination_detection_experiment_results_generator,
    togglebank_signup_funnel_experiment_results_generator,
    togglebank_widget_position_experiment_results_generator,
    government_ai_config_experiment_results_generator,
    a4_guarded_release_generator,
    risk_mgmt_guarded_release_generator,
    financial_advisor_agent_guarded_release_generator,
    togglebank_db_guarded_release_generator,
    investment_db_guarded_release_generator,
    investment_api_guarded_release_generator,
    risk_mgmt_db_guarded_release_generator
)
import threading
import time

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

def run_generators_for_environment(project_key, sdk_key, environment_key="production"):
    """
    Initializes LaunchDarkly client and runs all generators for a project
    """
    logging.info(f"--- Running generators for project: {project_key} ---")
    
    os.environ["LD_SDK_KEY"] = sdk_key
    os.environ["LD_PROJECT_KEY"] = project_key

    ldclient.set_config(Config(
        sdk_key=sdk_key,
        events_max_pending=10000,
        flush_interval=2,
        send_events=True
    ))
    client = ldclient.get()

    if not client.is_initialized():
        print(f"  ERROR: LaunchDarkly SDK failed to initialize for {project_key}")
        return

    try:
        # Run all generators for comprehensive results
        print(f"  Step 1/4: Evaluating flags...")
        evaluate_all_flags(client)
        client.flush()
        time.sleep(3)
        
        print(f"  Step 2/4: Generating monitoring data...")
        ai_configs_monitoring_results_generator(client)
        client.flush()
        time.sleep(2)
        
        financial_agent_monitoring_results_generator(client)
        client.flush()
        time.sleep(2)
        
        print(f"  Step 3/4: Generating experiment results...")
        experiment_results_generator(client)
        client.flush()
        time.sleep(3)
        
        ai_configs_experiment_results_generator(client)
        client.flush()
        time.sleep(2)
        
        hero_image_experiment_results_generator(client)
        client.flush()
        time.sleep(2)
        
        hero_redesign_experiment_results_generator(client)
        client.flush()
        time.sleep(2)
        
        hallucination_detection_experiment_results_generator(client)
        client.flush()
        time.sleep(2)
        
        togglebank_signup_funnel_experiment_results_generator(client)
        client.flush()
        time.sleep(2)
        
        togglebank_widget_position_experiment_results_generator(client)
        client.flush()
        time.sleep(2)
        
        government_ai_config_experiment_results_generator(client)
        client.flush()
        time.sleep(2)
        
        print(f"  Step 4/4: Running guarded release generators...")
        stop_events = {
            'a4': threading.Event(),
            'risk_mgmt': threading.Event(),
            'financial_agent': threading.Event(),
            'togglebank_db': threading.Event(),
            'investment_db': threading.Event(),
            'investment_api': threading.Event(),
            'risk_mgmt_db': threading.Event()
        }

        threads = [
            threading.Thread(target=a4_guarded_release_generator, args=(client, stop_events['a4'])),
            threading.Thread(target=risk_mgmt_guarded_release_generator, args=(client, stop_events['risk_mgmt'])),
            threading.Thread(target=financial_advisor_agent_guarded_release_generator, args=(client, stop_events['financial_agent'])),
            threading.Thread(target=togglebank_db_guarded_release_generator, args=(client, stop_events['togglebank_db'])),
            threading.Thread(target=investment_db_guarded_release_generator, args=(client, stop_events['investment_db'])),
            threading.Thread(target=investment_api_guarded_release_generator, args=(client, stop_events['investment_api'])),
            threading.Thread(target=risk_mgmt_db_guarded_release_generator, args=(client, stop_events['risk_mgmt_db']))
        ]

        for thread in threads:
            thread.start()

        time.sleep(5)
        
        for event in stop_events.values():
            event.set()

        for thread in threads:
            thread.join()
        
        client.flush()
        time.sleep(3)

        print(f"  All generators completed for {project_key}")

    except Exception as e:
        print(f"  ERROR: Error running generators for {project_key}: {str(e)}")
    finally:
        client.flush()
        time.sleep(5)
        client.close()
        print(f"  Completed generators for: {project_key}")


def main():
    """
    Main function to fetch active environments and run generators for each
    Processes users in batches to avoid Lambda timeout
    """
    BATCH_SIZE = 5  # Process 5 users per Lambda invocation
    DAYS_BEFORE_REGENERATE = 3  # Only regenerate if >= 3 days since last run
    
    print("=" * 70)
    print("STARTING PERIODIC RESULTS GENERATION (BATCH MODE)")
    print("=" * 70)
    
    ld_api_token = os.getenv("LD_API_KEY")
    if not ld_api_token:
        print("ERROR: LD_API_KEY not set")
        return
    
    dynamodb_client = DynamoDBClient()
    ld_api_client = LaunchDarklyAPIClient(ld_api_token)
    
    # Get all completed users from DynamoDB
    all_usernames = dynamodb_client.get_completed_users()
    
    if not all_usernames:
        print("No active demo environments found")
        return
    
    print(f"Total users in database: {len(all_usernames)}")
    
    # Filter to only users that need refresh (>= 3 days old)
    users_to_process = dynamodb_client.filter_users_needing_refresh(
        all_usernames, 
        days_threshold=DAYS_BEFORE_REGENERATE
    )
    
    print(f"Users needing refresh (>= {DAYS_BEFORE_REGENERATE} days old): {len(users_to_process)}")
    
    # Process only the first BATCH_SIZE users in this Lambda invocation
    batch = users_to_process[:BATCH_SIZE]
    print(f"Processing batch size: {len(batch)} users")
    print("-" * 70)
    
    successful_count = 0
    failed_count = 0
    skipped_count = 0
    
    for idx, username in enumerate(batch, 1):
        try:
            project_key = construct_project_key_from_username(username)
            
            print(f"[{idx}/{len(batch)}] Processing: {username} ({project_key})")
            credentials = ld_api_client.get_project_environment_keys(project_key, "production")
            
            if not credentials or not credentials.get("sdk_key"):
                print(f"  SKIPPED: No credentials found for {username}")
                skipped_count += 1
                continue
            
            run_generators_for_environment(project_key, credentials["sdk_key"])
            dynamodb_client.update_last_generated_timestamp(username)
            
            successful_count += 1
            print(f"  SUCCESS: Completed {username}")
            
            time.sleep(2)  # Brief delay between users
            
        except Exception as e:
            print(f"  ERROR: Failed to process {username}: {str(e)}")
            failed_count += 1
    
    print("=" * 70)
    print(f"SUMMARY: {successful_count} successful | {failed_count} failed | {skipped_count} skipped")
    print(f"Remaining users to process: {len(users_to_process) - len(batch)}")
    print("=" * 70)
    print("Periodic results generation completed!")


def lambda_handler(event, context):
    """AWS Lambda entry point"""
    print(f"Lambda invoked with event: {event}")
    print(f"Request ID: {context.aws_request_id}")
    
    try:
        main()
        print("Lambda execution completed successfully")
        return {
            'statusCode': 200,
            'body': 'Results generation completed successfully'
        }
    except Exception as e:
        print(f"LAMBDA EXECUTION FAILED: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }


if __name__ == "__main__":
    main()

