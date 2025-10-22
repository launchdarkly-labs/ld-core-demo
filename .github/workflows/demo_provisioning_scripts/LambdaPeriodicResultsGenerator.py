"""
Periodic Results Generator for AWS Lambda
Runs results generator for all active demo environments every 3-4 days
"""
import os
import logging
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

    ldclient.set_config(Config(sdk_key=sdk_key, events_max_pending=1000))
    client = ldclient.get()

    if not client.is_initialized():
        logging.error(f"LaunchDarkly client failed to initialize for {project_key}")
        return

    try:
        evaluate_all_flags(client)
        
        ai_configs_monitoring_results_generator(client)
        financial_agent_monitoring_results_generator(client)
        
        experiment_results_generator(client)
        ai_configs_experiment_results_generator(client)
        hero_image_experiment_results_generator(client)
        hero_redesign_experiment_results_generator(client)
        hallucination_detection_experiment_results_generator(client)
        togglebank_signup_funnel_experiment_results_generator(client)
        togglebank_widget_position_experiment_results_generator(client)
        government_ai_config_experiment_results_generator(client)
        
        # Run guarded release generators in threads
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

        logging.info(f"✅ Successfully completed generators for: {project_key}")

    except Exception as e:
        logging.error(f"❌ Error running generators for {project_key}: {str(e)}")
    finally:
        client.flush()
        client.close()
        logging.info(f"--- Completed generators for: {project_key} ---")


def main():
    """
    Main function to fetch active environments and run generators for each
    """
    logging.info("🚀 Starting periodic results generation...")
    
    ld_api_token = os.getenv("LD_API_KEY")
    if not ld_api_token:
        logging.error("❌ LD_API_KEY not set")
        return
    
    dynamodb_client = DynamoDBClient()
    ld_api_client = LaunchDarklyAPIClient(ld_api_token)
    
    usernames = dynamodb_client.get_completed_users()
    
    if not usernames:
        logging.info("ℹ️  No active demo environments found")
        return
    
    logging.info(f"📋 Found {len(usernames)} users to process")
    
    successful_count = 0
    failed_count = 0
    skipped_count = 0
    
    for username in usernames:
        try:
            project_key = construct_project_key_from_username(username)
            
            logging.info(f"🔍 Processing: {username} ({project_key})")
            credentials = ld_api_client.get_project_environment_keys(project_key, "production")
            
            if not credentials or not credentials.get("sdk_key"):
                logging.warning(f"⚠️  Skipping {username}: No credentials found")
                skipped_count += 1
                continue
            
            run_generators_for_environment(project_key, credentials["sdk_key"])
            dynamodb_client.update_last_generated_timestamp(username)
            
            successful_count += 1
            
        except Exception as e:
            logging.error(f"❌ Error processing {username}: {str(e)}")
            failed_count += 1
    
    logging.info("=" * 60)
    logging.info(f"📊 SUMMARY: ✅ {successful_count} | ❌ {failed_count} | ⚠️  {skipped_count}")
    logging.info("=" * 60)
    logging.info("🏁 Periodic results generation completed!")


def lambda_handler(event, context):
    """AWS Lambda entry point"""
    logging.info(f"Lambda invoked: {event}")
    
    try:
        main()
        return {
            'statusCode': 200,
            'body': 'Results generation completed successfully'
        }
    except Exception as e:
        logging.error(f"Lambda execution failed: {str(e)}")
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }


if __name__ == "__main__":
    main()

