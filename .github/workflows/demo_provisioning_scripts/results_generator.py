import os
import logging
import requests
import uuid
import ldclient
from ldclient.config import Config
from ldclient.context import Context
from dotenv import load_dotenv
import random
import time
import threading
from ldai.client import LDAIClient, ModelConfig, LDMessage, ProviderConfig
from ldai.tracker import TokenUsage, FeedbackKind
from datetime import datetime, timedelta

load_dotenv()

LD_API_KEY = os.getenv("LD_API_KEY")
PROJECT_KEY = os.getenv("LD_PROJECT_KEY")
LD_API_URL = os.getenv("LD_API_URL", "https://app.launchdarkly.com/api/v2")
ENVIRONMENT_KEY = "production"

HEADERS = {
    "Authorization": LD_API_KEY,
    "Content-Type": "application/json"
}

A4_FLAG_KEY = "togglebankAPIGuardedRelease"
API_ERROR_RATE_KEY = "stocks-api-error-rates"
API_LATENCY_KEY = "stocks-api-latency"

RISK_MGMT_FLAG_KEY = "riskmgmtbureauAPIGuardedRelease"
RISK_API_ERROR_RATE_KEY = "rm-api-errors"
RISK_API_LATENCY_KEY = "rm-api-latency"

FINANCIAL_AGENT_FLAG_KEY = "ai-config--togglebank-financial-advisor-agent"
FINANCIAL_AGENT_ACCURACY_KEY = "financial-agent-accuracy"
FINANCIAL_AGENT_NEGATIVE_FEEDBACK_KEY = "financial-agent-negative-feedback"

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

def get_all_flags_by_tag(tag):
    url = f"{LD_API_URL}/flags/{PROJECT_KEY}?limit=100"
    response = requests.get(url, headers=HEADERS)
    if not response.ok:
        logging.error(f"Failed to fetch flags: {response.status_code} {response.text}")
        return []
    data = response.json()
    return [flag['key'] for flag in data.get('items', []) if tag in flag.get("tags", [])]

def get_flag_details(flag_key):
    url = f"{LD_API_URL}/flags/{PROJECT_KEY}/{flag_key}"
    response = requests.get(url, headers=HEADERS)
    if not response.ok:
        logging.error(f"Failed to fetch flag details: {response.status_code} {response.text}")
        return None
    return response.json()

def is_measured_rollout(flag_details):
    # Check for measured rollout attribute in flag details
    # Look for 'environments' -> ENVIRONMENT_KEY -> 'fallthrough' -> 'rollout'
    try:
        env = flag_details['environments'][ENVIRONMENT_KEY]
        fallthrough = env.get('fallthrough', {})
        rollout = fallthrough.get('rollout')
        return rollout is not None
    except Exception as e:
        logging.error(f"Error checking measured rollout: {str(e)}")
        return False

def generate_user_context():
    user_key = f"user-{uuid.uuid4()}"
    builder = Context.builder(user_key)
    builder.set("name", f"Test User {user_key[:8]}")
    builder.set("email", f"test-{user_key[:8]}@example.com")
    builder.set("accountType", random.choice(["personal", "business"]))
    builder.set("accountAge", random.randint(1, 60))
    builder.set("lastLogin", (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat())
    builder.set("location", random.choice(["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]))
    builder.set("deviceType", random.choice(["mobile", "desktop", "tablet"]))
    builder.set("browser", random.choice(["chrome", "safari", "firefox", "edge"]))
    builder.set("os", random.choice(["windows", "macos", "ios", "android"]))
    builder.set("timezone", random.choice(["America/New_York", "America/Los_Angeles", "America/Chicago"]))
    builder.set("language", random.choice(["en-US", "en-GB", "es-ES", "fr-FR"]))
    builder.set("referrer", random.choice(["google", "direct", "social", "email", "partner"]))
    builder.set("utm_source", random.choice(["google", "facebook", "twitter", "linkedin", "email"]))
    builder.set("utm_medium", random.choice(["cpc", "organic", "social", "email", "display"]))
    builder.set("utm_campaign", random.choice(["spring_sale", "summer_promo", "winter_deals", "holiday_special"]))
    return builder.build()

def evaluate_flags_by_tag(client, tag, tag_label):
    if not client.is_initialized():
        logging.error(f"Failed to initialize LaunchDarkly client for {tag_label} flags")
        return

    logging.info(f"Starting flag evaluation for all '{tag_label}' flags...")
    flag_keys = get_all_flags_by_tag(tag)

    if not flag_keys:
        logging.error(f"No '{tag_label}' flags found to evaluate.")
        return

    for flag_key in flag_keys:
        logging.info(f"Evaluating flag: {flag_key}")
        for _ in range(500):
            try:
                user_context = generate_user_context()
                variation = client.variation(flag_key, user_context, False)
                logging.info(f"User {user_context.key} got variation '{variation}' for flag '{flag_key}'")
            except Exception as e:
                logging.error(f"Error evaluating flag {flag_key}: {str(e)}")
                continue

    logging.info(f"Flag evaluation for '{tag_label}' completed. Flushing client...")
    client.flush()
    logging.info(f"Flag evaluation script for '{tag_label}' finished.")

def evaluate_all_flags(client):
    # Evaluate all flags by their tags
    evaluate_flags_by_tag(client, "bank", "bank")
    evaluate_flags_by_tag(client, "public-sector", "public-sector")
    evaluate_flags_by_tag(client, "release", "release")
    evaluate_flags_by_tag(client, "experiment", "experiment")
    evaluate_flags_by_tag(client, "ecommerce", "ecommerce")
    evaluate_flags_by_tag(client, "investment", "investment")
    evaluate_flags_by_tag(client, "airways", "airways")
    evaluate_flags_by_tag(client, "ai-models", "ai-models")
    evaluate_flags_by_tag(client, "ai-config", "ai-config")
    evaluate_flags_by_tag(client, "guarded-release", "guarded-release")
    evaluate_flags_by_tag(client, "migration-assistant", "migration-assistant")
    evaluate_flags_by_tag(client, "release-pipeline", "release-pipeline")
    evaluate_flags_by_tag(client, "utils", "utils")
    evaluate_flags_by_tag(client, "temporary", "temporary")
    evaluate_flags_by_tag(client, "demo", "demo")
    evaluate_flags_by_tag(client, "events", "events")
    evaluate_flags_by_tag(client, "demoengineering", "demoengineering")
    evaluate_flags_by_tag(client, "optional", "optional")
    evaluate_flags_by_tag(client, "financial-ai", "financial-ai")
    evaluate_flags_by_tag(client, "ai-agent", "ai-agent")
    evaluate_flags_by_tag(client, "financial-advisor-agent", "financial-advisor-agent")
    evaluate_flags_by_tag(client, "Experimentation", "Experimentation")

# Old A4 - Commented out (replaced by payment_engine_failed_scenario_generator)
# def a4_guarded_release_generator(client, stop_event):
#     if not client.is_initialized():
#         logging.error("LaunchDarkly client is not initialized for A4")
#         return
#     logging.info("Starting guarded release rollback generator for A4 flag...")
#     while True:
#         flag_details = get_flag_details(A4_FLAG_KEY)
#         if not flag_details or not is_measured_rollout(flag_details):
#             logging.info("Measured rollout is over or flag details unavailable. Exiting A4 generator.")
#             stop_event.set()
#             break
#         try:
#             user_context = generate_user_context()
#             flag_value = client.variation(A4_FLAG_KEY, user_context, False)
#             if flag_value:
#                 # True: higher error rate, higher latency
#                 if random.random() < 0.8:
#                     client.track(API_ERROR_RATE_KEY, user_context)
#                 latency = random.randint(500, 1000)
#                 client.track(API_LATENCY_KEY, user_context, None, latency)
#             else:
#                 # False: lower error rate, lower latency
#                 if random.random() < 0.1:
#                     client.track(API_ERROR_RATE_KEY, user_context)
#                 latency = random.randint(100, 200)
#                 client.track(API_LATENCY_KEY, user_context, None, latency)
#             time.sleep(0.05)  # Increased delay to prevent API overload
#         except Exception as e:
#             logging.error(f"Error during A4 guarded release simulation: {str(e)}")
#             continue
#     logging.info("A4 guarded release rollback generator finished.")

def risk_mgmt_guarded_release_generator(client, stop_event):
    if not client.is_initialized():
        logging.error("LaunchDarkly client is not initialized for Risk Management API")
        return
    logging.info("Starting guarded release rollback generator for Risk Management API flag...")
    while True:
        flag_details = get_flag_details(RISK_MGMT_FLAG_KEY)
        if not flag_details or not is_measured_rollout(flag_details):
            logging.info("Measured rollout is over or flag details unavailable. Exiting Risk Management API generator.")
            stop_event.set()
            break
        try:
            user_context = generate_user_context()
            flag_value = client.variation(RISK_MGMT_FLAG_KEY, user_context, False)
            if flag_value:
                # True: higher error rate, higher latency
                if random.random() < 0.75:
                    client.track(RISK_API_ERROR_RATE_KEY, user_context)
                latency = random.randint(400, 800)
                client.track(RISK_API_LATENCY_KEY, user_context, None, latency)
            else:
                # False: lower error rate, lower latency
                if random.random() < 0.05:
                    client.track(RISK_API_ERROR_RATE_KEY, user_context)
                latency = random.randint(80, 150)
                client.track(RISK_API_LATENCY_KEY, user_context, None, latency)
            time.sleep(0.05)  # Increased delay to prevent API overload
        except Exception as e:
            logging.error(f"Error during Risk Management API guarded release simulation: {str(e)}")
            continue
    logging.info("Risk Management API guarded release rollback generator finished.")

def financial_advisor_agent_guarded_release_generator(client, stop_event):
    if not client.is_initialized():
        logging.error("LaunchDarkly client is not initialized for Financial Advisor Agent")
        return
    logging.info("Starting guarded release rollback generator for Financial Advisor Agent...")

    while True:
        flag_details = get_flag_details(FINANCIAL_AGENT_FLAG_KEY)
        if not flag_details or not is_measured_rollout(flag_details):
            logging.info("Measured rollout is over or flag details unavailable. Exiting Financial Advisor Agent generator.")
            stop_event.set()
            break
        
        try:
            user_context = generate_user_context()
            variation = client.variation(FINANCIAL_AGENT_FLAG_KEY, user_context, None)
            
            # Get the model name to differentiate between different AI models
            if variation and hasattr(variation, 'model') and variation.model:
                model_name = variation.model.get('name', 'unknown')
            else:
                model_name = 'default'
            
            # Different performance characteristics based on AI model
            if 'ld-ai-model-pro' in model_name.lower():
                # Pro model - Excellent performance, wins the experiment
                accuracy = random.uniform(85, 95)  # High accuracy
                if random.random() < 0.05:  # Very low negative feedback rate
                    client.track(FINANCIAL_AGENT_NEGATIVE_FEEDBACK_KEY, user_context)
                
                client.track(FINANCIAL_AGENT_ACCURACY_KEY, user_context, None, accuracy)
            elif 'ld-ai-model-mini' in model_name.lower():
                # Mini model - Extremely poor performance, fails the experiment
                accuracy = random.uniform(5, 15)  # Extremely low accuracy
                if random.random() < 0.90:  # Very high negative feedback rate
                    client.track(FINANCIAL_AGENT_NEGATIVE_FEEDBACK_KEY, user_context)
                
                client.track(FINANCIAL_AGENT_ACCURACY_KEY, user_context, None, accuracy)
            else:
                # Default/unknown model - moderate performance
                accuracy = random.uniform(50, 70)  # Moderate accuracy
                if random.random() < 0.30:  # Moderate negative feedback rate
                    client.track(FINANCIAL_AGENT_NEGATIVE_FEEDBACK_KEY, user_context)
                
                client.track(FINANCIAL_AGENT_ACCURACY_KEY, user_context, None, accuracy)
            
            time.sleep(0.05)  # Increased delay to prevent API overload
        except Exception as e:
            logging.error(f"Error during Financial Advisor Agent guarded release simulation: {str(e)}")
            continue
    
    logging.info("Financial Advisor Agent guarded release rollback generator finished.")

def ai_configs_monitoring_results_generator(client):
    LD_FLAG_KEY = "ai-config--togglebot"
    NUM_RUNS = 1000
    aiclient = LDAIClient(client)

    if not client.is_initialized():
        logging.error("Failed to initialize LaunchDarkly client for AI Config monitoring")
        return

    logging.info("Starting AI Configs monitoring results generation...")

    # fallback_value = AIConfig(
    #     enabled=True,
    #     model=ModelConfig(
    #         name="default-model",
    #         parameters={"temperature": 0.8},
    #     ),
    #     messages=[LDMessage(role="system", content="")],
    #     provider=ProviderConfig(name="default-provider"),
    # )

    for i in range(NUM_RUNS):
        try:
            context = generate_user_context()
            config, tracker = aiclient.config(LD_FLAG_KEY, context, {})
            duration = random.randint(500, 2000)
            time_to_first_token = random.randint(50, duration)
            prompt_tokens = random.randint(20, 100)
            completion_tokens = random.randint(50, 500)
            total_tokens = prompt_tokens + completion_tokens
            tokens = TokenUsage(prompt_tokens, completion_tokens, total_tokens)
            feedback_kind = FeedbackKind.Positive if random.random() < 0.5 else FeedbackKind.Negative
            tracker.track_duration(duration)
            tracker.track_tokens(tokens)
            tracker.track_feedback({'kind': feedback_kind})
            tracker.track_time_to_first_token(time_to_first_token)
            if random.random() < 0.95:
                tracker.track_success()
            else:
                tracker.track_error()
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} monitoring events")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing monitoring event {i}: {str(e)}")
            continue

    logging.info("AI Configs monitoring results generation completed")
    # Do not flush or close client here; handled in generate_flags

def financial_agent_monitoring_results_generator(client):
    LD_FLAG_KEY = "ai-config--togglebank-financial-advisor-agent"
    NUM_RUNS = 1000
    aiclient = LDAIClient(client)

    if not client.is_initialized():
        logging.error("Failed to initialize LaunchDarkly client for Financial Agent monitoring")
        return

    logging.info("Starting Financial Agent monitoring results generation...")

    # fallback_value = AIConfig(
    #     enabled=True,
    #     model=ModelConfig(
    #         name="default-model",
    #         parameters={"temperature": 0.8},
    #     ),
    #     messages=[LDMessage(role="system", content="")],
    #     provider=ProviderConfig(name="default-provider"),
    # )

    for i in range(NUM_RUNS):
        try:
            context = generate_user_context()
            config, tracker = aiclient.config(LD_FLAG_KEY, context, {})
            duration = random.randint(500, 2000)
            time_to_first_token = random.randint(50, duration)
            prompt_tokens = random.randint(20, 100)
            completion_tokens = random.randint(50, 500)
            total_tokens = prompt_tokens + completion_tokens
            tokens = TokenUsage(prompt_tokens, completion_tokens, total_tokens)
            feedback_kind = FeedbackKind.Positive if random.random() < 0.5 else FeedbackKind.Negative
            tracker.track_duration(duration)
            tracker.track_tokens(tokens)
            tracker.track_feedback({'kind': feedback_kind})
            tracker.track_time_to_first_token(time_to_first_token)
            if random.random() < 0.95:
                tracker.track_success()
            else:
                tracker.track_error()
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} monitoring events")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing monitoring event {i}: {str(e)}")
            continue

    logging.info("Financial Agent monitoring results generation completed")
    # Do not flush or close client here; handled in generate_flags

def experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "cartSuggestedItems"
    LD_PRIMARYMETRIC_KEY = "in-cart-total-items"
    LD_SECONDARYMETRIC_KEY = "in-cart-total-price"
    NUM_USERS = 2500

    logging.info("Starting experiment results generation for cartSuggestedItems...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, False)
            # Simulate user interaction: 90% conversion for True, 10% for False
            engagement_probability = 0.6 if variation is True else 0.4
            is_engaged = random.random() < engagement_probability
            if is_engaged:
                random_value = random.randint(2, 10)
                client.track(LD_PRIMARYMETRIC_KEY, user_context, None, random_value)
                random_value = random.randint(100, 1000)
                client.track(LD_SECONDARYMETRIC_KEY, user_context, None, random_value)
                logging.info(f"User {user_context.key} engaged with {variation} variation")
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for experiment results")
                client.flush()  # Flush events every 100 users
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Experiment results generation for cartSuggestedItems completed")

def ai_configs_experiment_results_generator(client):
    LD_FLAG_KEY = "ai-config--togglebot"
    POSITIVE_METRIC_KEY = "ai-chatbot-positive-feedback"
    NEGATIVE_METRIC_KEY = "ai-chatbot-negative-feedback"
    NUM_USERS = 2500

    logging.info("Starting AI Configs experiment results generation for ai-config--togglebot...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            _ = client.variation(LD_FLAG_KEY, user_context, None)
            # Randomly track positive or negative feedback (roughly 50/50 split)
            if random.random() < random.uniform(0.4, 0.6):
                client.track(POSITIVE_METRIC_KEY, user_context)
            else:
                client.track(NEGATIVE_METRIC_KEY, user_context)
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for AI Configs experiment results")
                client.flush()  # Flush events every 100 users
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("AI Configs experiment results generation for ai-config--togglebot completed")

def hero_image_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "showDifferentHeroImageString"
    LD_PRIMARYMETRIC_KEY = "signup clicked"
    NUM_USERS = 3000

    logging.info("Starting experiment results generation for showDifferentHeroImageString...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, False)
            # Simulate user interaction: higher conversion for True variation (new hero image)
            engagement_probability = 0.65 if variation is True else 0.45
            is_engaged = random.random() < engagement_probability
            if is_engaged:
                client.track(LD_PRIMARYMETRIC_KEY, user_context)
                logging.info(f"User {user_context.key} engaged with {variation} variation")
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for experiment results")
                client.flush()  # Flush events every 100 users
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Experiment results generation for showDifferentHeroImageString completed")

def hero_redesign_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "showHeroRedesign"
    LD_PRIMARYMETRIC_KEY = "signup clicked"
    NUM_USERS = 3000

    logging.info("Starting experiment results generation for showHeroRedesign...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, False)
            # Simulate user interaction: higher conversion for True variation (new hero redesign)
            engagement_probability = 0.70 if variation is True else 0.50
            is_engaged = random.random() < engagement_probability
            if is_engaged:
                client.track(LD_PRIMARYMETRIC_KEY, user_context)
                logging.info(f"User {user_context.key} engaged with {variation} variation")
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for experiment results")
                client.flush()  # Flush events every 100 users
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Experiment results generation for showHeroRedesign completed")

def hallucination_detection_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "ai-config--togglebot"
    AI_ACCURACY_KEY = "ai-accuracy"
    AI_SOURCE_FIDELITY_KEY = "ai-source-fidelity"
    AI_COST_KEY = "ai-cost"
    AI_CHATBOT_NEGATIVE_FEEDBACK_KEY = "ai-chatbot-negative-feedback"
    NUM_USERS = 7500

    logging.info("Starting hallucination detection experiment results generation for ai-config--togglebot...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, None)
            
            # Generate metrics with slight variations between different AI models
            # but keep results competitive so no model drastically loses
            
            if variation and hasattr(variation, 'model') and variation.model:
                model_name = variation.model.get('name', 'unknown')
            else:
                model_name = 'default'
            
            # AI Accuracy: 85-95% range with slight model variations, scaled for visibility
            if 'claude' in model_name.lower():
                accuracy = random.uniform(88, 94)  # Scaled up 100x for better visibility
            elif 'nova' in model_name.lower():
                accuracy = random.uniform(86, 92)  # Scaled up 100x for better visibility
            elif 'gpt' in model_name.lower():
                accuracy = random.uniform(87, 93)  # Scaled up 100x for better visibility
            else:
                accuracy = random.uniform(85, 91)  # Scaled up 100x for better visibility
            
            # AI Source Fidelity: 80-90% range with slight model variations, scaled for visibility
            if 'claude' in model_name.lower():
                source_fidelity = random.uniform(83, 89)  # Scaled up 100x for better visibility
            elif 'nova' in model_name.lower():
                source_fidelity = random.uniform(81, 87)  # Scaled up 100x for better visibility
            elif 'gpt' in model_name.lower():
                source_fidelity = random.uniform(82, 88)  # Scaled up 100x for better visibility
            else:
                source_fidelity = random.uniform(80, 86)  # Scaled up 100x for better visibility
            
            # AI Cost: $0.10-$0.50 range with slight model variations, scaled for visibility
            if 'claude' in model_name.lower():
                cost = random.uniform(0.20, 0.40)  # Scaled up 100x for better visibility
            elif 'nova' in model_name.lower():
                cost = random.uniform(0.10, 0.30)  # Scaled up 100x for better visibility
            elif 'gpt' in model_name.lower():
                cost = random.uniform(0.15, 0.35)  # Scaled up 100x for better visibility
            else:
                cost = random.uniform(0.10, 0.20)  # Scaled up 100x for better visibility
            
            # Track the metrics
            client.track(AI_ACCURACY_KEY, user_context, None, accuracy)
            client.track(AI_SOURCE_FIDELITY_KEY, user_context, None, source_fidelity)
            client.track(AI_COST_KEY, user_context, None, cost)
            
            # AI Chatbot Negative Feedback: 5-15% range with slight model variations
            if random.random() < 0.10:  # 10% chance of negative feedback
                client.track(AI_CHATBOT_NEGATIVE_FEEDBACK_KEY, user_context)
            
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for hallucination detection experiment results")
                client.flush()  # Flush events every 100 users
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Hallucination detection experiment results generation for ai-config--togglebot completed")

def togglebank_signup_funnel_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "releaseNewSignupPromo"
    SIGNUP_STARTED_KEY = "signup-started"
    INITIAL_SIGNUP_COMPLETED_KEY = "initial-signup-completed"
    PERSONAL_DETAILS_COMPLETED_KEY = "signup-personal-details-completed"
    SERVICES_COMPLETED_KEY = "signup-services-completed"
    SIGNUP_FLOW_COMPLETED_KEY = "signup-flow-completed"
    NUM_USERS = 3000

    logging.info("Starting funnel experiment results generation for releaseNewSignupPromo...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, "control")
            
            client.track(SIGNUP_STARTED_KEY, user_context)
            
            if variation == "credit-card-offer":
                step2_rate = 0.70
                step3_rate = 0.65
                step4_rate = 0.55
                step5_rate = 0.45
            elif variation == "mortgage-offer":
                step2_rate = 0.75
                step3_rate = 0.70
                step4_rate = 0.62
                step5_rate = 0.52
            elif variation == "cashback-offer":
                step2_rate = 0.65
                step3_rate = 0.58
                step4_rate = 0.48
                step5_rate = 0.38
            else:
                step2_rate = 0.68
                step3_rate = 0.60
                step4_rate = 0.50
                step5_rate = 0.40
            
            if random.random() < step2_rate:
                client.track(INITIAL_SIGNUP_COMPLETED_KEY, user_context)
                
                if random.random() < step3_rate:
                    client.track(PERSONAL_DETAILS_COMPLETED_KEY, user_context)
                    
                    if random.random() < step4_rate:
                        client.track(SERVICES_COMPLETED_KEY, user_context)
                        
                        if random.random() < step5_rate:
                            client.track(SIGNUP_FLOW_COMPLETED_KEY, user_context)
                            logging.info(f"User {user_context.key} completed full signup funnel with {variation} variation")
            
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for ToggleBank signup funnel experiment results")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Funnel experiment results generation for releaseNewSignupPromo completed")

def ecommerce_collection_banner_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "storeAttentionCallout"
    STORE_ACCESSED_KEY = "store-accessed"
    ITEM_ADDED_KEY = "item-added"
    CART_ACCESSED_KEY = "cart-accessed"
    CUSTOMER_CHECKOUT_KEY = "customer-checkout"
    IN_CART_TOTAL_PRICE_KEY = "in-cart-total-price"
    NUM_USERS = 3000

    logging.info("Starting funnel experiment results generation for storeAttentionCallout...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, "New Items")
            
            # Different conversion rates based on banner text
            if variation == "Final Hours!":
                store_access_rate = 0.85
                item_add_rate = 0.70
                cart_access_rate = 0.65
                checkout_rate = 0.55
            elif variation == "Sale":
                store_access_rate = 0.80
                item_add_rate = 0.65
                cart_access_rate = 0.60
                checkout_rate = 0.50
            else:  # "New Items" (control)
                store_access_rate = 0.70
                item_add_rate = 0.55
                cart_access_rate = 0.50
                checkout_rate = 0.40
            
            if random.random() < store_access_rate:
                client.track(STORE_ACCESSED_KEY, user_context)
                
                if random.random() < item_add_rate:
                    client.track(ITEM_ADDED_KEY, user_context)
                    
                    if random.random() < cart_access_rate:
                        client.track(CART_ACCESSED_KEY, user_context)
                        
                        if random.random() < checkout_rate:
                            client.track(CUSTOMER_CHECKOUT_KEY, user_context)
                            total_price = random.randint(50, 500)
                            client.track(IN_CART_TOTAL_PRICE_KEY, user_context, None, total_price)
                            logging.info(f"User {user_context.key} completed checkout with {variation} variation")
            
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for collection banner experiment results")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Funnel experiment results generation for storeAttentionCallout completed")

def ecommerce_shorten_collection_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "release-new-shorten-collections-page"
    ITEM_ADDED_KEY = "item-added"
    CART_ACCESSED_KEY = "cart-accessed"
    CUSTOMER_CHECKOUT_KEY = "customer-checkout"
    IN_CART_TOTAL_PRICE_KEY = "in-cart-total-price"
    NUM_USERS = 3000

    logging.info("Starting funnel experiment results generation for release-new-shorten-collections-page...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, "old-long-collections-page")
            
            # Better conversion for shortened page due to reduced decision fatigue
            if variation == "new-shorten-collections-page":
                item_add_rate = 0.75
                cart_access_rate = 0.85
                checkout_rate = 0.70
            else:  # "old-long-collections-page"
                item_add_rate = 0.60
                cart_access_rate = 0.75
                checkout_rate = 0.55
            
            if random.random() < item_add_rate:
                client.track(ITEM_ADDED_KEY, user_context)
                
                if random.random() < cart_access_rate:
                    client.track(CART_ACCESSED_KEY, user_context)
                    
                    if random.random() < checkout_rate:
                        client.track(CUSTOMER_CHECKOUT_KEY, user_context)
                        total_price = random.randint(80, 600)
                        client.track(IN_CART_TOTAL_PRICE_KEY, user_context, None, total_price)
                        logging.info(f"User {user_context.key} completed checkout with {variation} variation")
            
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for shorten collection page experiment results")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Funnel experiment results generation for release-new-shorten-collections-page completed")

def ecommerce_new_search_engine_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "release-new-search-engine"
    SEARCH_ENGINE_ADD_TO_CART_KEY = "search-engine-add-to-cart"
    IN_CART_TOTAL_PRICE_KEY = "in-cart-total-price"
    NUM_USERS = 3000

    logging.info("Starting experiment results generation for release-new-search-engine...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, False)
            
            # New search engine has better add-to-cart conversion
            if variation is True:
                add_to_cart_rate = 0.65
                avg_price_low = 100
                avg_price_high = 800
            else:
                add_to_cart_rate = 0.45
                avg_price_low = 80
                avg_price_high = 600
            
            if random.random() < add_to_cart_rate:
                client.track(SEARCH_ENGINE_ADD_TO_CART_KEY, user_context)
                total_price = random.randint(avg_price_low, avg_price_high)
                client.track(IN_CART_TOTAL_PRICE_KEY, user_context, None, total_price)
                logging.info(f"User {user_context.key} added items via search with {variation} variation")
            
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for new search engine experiment results")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Experiment results generation for release-new-search-engine completed")

def togglebank_special_offers_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "showDifferentSpecialOfferString"
    SIGNUP_STARTED_KEY = "signup-started"
    NUM_USERS = 3000

    logging.info("Starting experiment results generation for showDifferentSpecialOfferString...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, "offerA")
            
            # Different offers have different conversion rates
            if variation == "offerA":  # Credit card offer
                conversion_rate = 0.55
            elif variation == "offerB":  # Car loan offer
                conversion_rate = 0.45
            elif variation == "offerC":  # Platinum rewards offer
                conversion_rate = 0.65
            else:
                conversion_rate = 0.50
            
            if random.random() < conversion_rate:
                client.track(SIGNUP_STARTED_KEY, user_context)
                logging.info(f"User {user_context.key} started signup with {variation} variation")
            
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for special offers experiment results")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Experiment results generation for showDifferentSpecialOfferString completed")

def togglebank_widget_position_experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "swapWidgetPositions"
    SIGNUP_STARTED_KEY = "signup-started"
    NUM_USERS = 3000

    logging.info("Starting experiment results generation for swapWidgetPositions...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            variation = client.variation(LD_FEATURE_FLAG_KEY, user_context, False)
            
            # Test if swapping widget positions improves conversion
            if variation is True:  # Retirement left, Mortgage right
                conversion_rate = 0.58
            else:  # Mortgage left, Retirement right (original)
                conversion_rate = 0.52
            
            if random.random() < conversion_rate:
                client.track(SIGNUP_STARTED_KEY, user_context)
                logging.info(f"User {user_context.key} started signup with widgets swapped={variation}")
            
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for widget position experiment results")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("Experiment results generation for swapWidgetPositions completed")

def government_ai_config_experiment_results_generator(client):
    LD_FLAG_KEY = "ai-config--publicbot"
    POSITIVE_METRIC_KEY = "ai-chatbot-positive-feedback"
    NEGATIVE_METRIC_KEY = "ai-chatbot-negative-feedback"
    NUM_USERS = 2500

    logging.info("Starting AI Configs experiment results generation for ai-config--publicbot...")

    for i in range(NUM_USERS):
        try:
            user_context = generate_user_context()
            _ = client.variation(LD_FLAG_KEY, user_context, None)
            # Randomly track positive or negative feedback (roughly 60/40 split for government)
            if random.random() < 0.60:
                client.track(POSITIVE_METRIC_KEY, user_context)
            else:
                client.track(NEGATIVE_METRIC_KEY, user_context)
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for Government AI Configs experiment results")
                client.flush()
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("AI Configs experiment results generation for ai-config--publicbot completed")

# Old A3 - Commented out (replaced by payment_engine_healthy_scenario_generator)
# def togglebank_db_guarded_release_generator(client, stop_event):
#     if not client.is_initialized():
#         logging.error("LaunchDarkly client is not initialized for ToggleBank DB")
#         return
#     logging.info("Starting guarded release rollback generator for ToggleBank DB flag...")
#     while True:
#         flag_details = get_flag_details("togglebankDBGuardedRelease")
#         if not flag_details or not is_measured_rollout(flag_details):
#             logging.info("Measured rollout is over or flag details unavailable. Exiting ToggleBank DB generator.")
#             stop_event.set()
#             break
#         try:
#             user_context = generate_user_context()
#             flag_value = client.variation("togglebankDBGuardedRelease", user_context, False)
#             if flag_value:
#                 # True: higher error rate, higher latency
#                 if random.random() < 0.7:
#                     client.track("recent-trades-db-errors", user_context)
#                 latency = random.randint(300, 700)
#                 client.track("recent-trades-db-latency", user_context, None, latency)
#             else:
#                 # False: lower error rate, lower latency
#                 if random.random() < 0.08:
#                     client.track("recent-trades-db-errors", user_context)
#                 latency = random.randint(50, 150)
#                 client.track("recent-trades-db-latency", user_context, None, latency)
#             time.sleep(0.05)
#         except Exception as e:
#             logging.error(f"Error during ToggleBank DB guarded release simulation: {str(e)}")
#             continue
#     logging.info("ToggleBank DB guarded release rollback generator finished.")

def investment_db_guarded_release_generator(client, stop_event):
    if not client.is_initialized():
        logging.error("LaunchDarkly client is not initialized for Investment DB")
        return
    logging.info("Starting guarded release rollback generator for Investment DB flag...")
    while True:
        flag_details = get_flag_details("investment-recent-trade-db")
        if not flag_details or not is_measured_rollout(flag_details):
            logging.info("Measured rollout is over or flag details unavailable. Exiting Investment DB generator.")
            stop_event.set()
            break
        try:
            user_context = generate_user_context()
            flag_value = client.variation("investment-recent-trade-db", user_context, False)
            if flag_value:
                # True: higher error rate, higher latency
                if random.random() < 0.65:
                    client.track("recent-trades-db-errors", user_context)
                latency = random.randint(250, 600)
                client.track("recent-trades-db-latency", user_context, None, latency)
            else:
                # False: lower error rate, lower latency
                if random.random() < 0.06:
                    client.track("recent-trades-db-errors", user_context)
                latency = random.randint(40, 120)
                client.track("recent-trades-db-latency", user_context, None, latency)
            time.sleep(0.05)
        except Exception as e:
            logging.error(f"Error during Investment DB guarded release simulation: {str(e)}")
            continue
    logging.info("Investment DB guarded release rollback generator finished.")

def investment_api_guarded_release_generator(client, stop_event):
    if not client.is_initialized():
        logging.error("LaunchDarkly client is not initialized for Investment API")
        return
    logging.info("Starting guarded release rollback generator for Investment API flag...")
    while True:
        flag_details = get_flag_details("release-new-investment-stock-api")
        if not flag_details or not is_measured_rollout(flag_details):
            logging.info("Measured rollout is over or flag details unavailable. Exiting Investment API generator.")
            stop_event.set()
            break
        try:
            user_context = generate_user_context()
            flag_value = client.variation("release-new-investment-stock-api", user_context, False)
            if flag_value:
                # True: higher error rate, higher latency
                if random.random() < 0.72:
                    client.track("stocks-api-error-rates", user_context)
                latency = random.randint(350, 750)
                client.track("stocks-api-latency", user_context, None, latency)
            else:
                # False: lower error rate, lower latency
                if random.random() < 0.09:
                    client.track("stocks-api-error-rates", user_context)
                latency = random.randint(70, 170)
                client.track("stocks-api-latency", user_context, None, latency)
            time.sleep(0.05)
        except Exception as e:
            logging.error(f"Error during Investment API guarded release simulation: {str(e)}")
            continue
    logging.info("Investment API guarded release rollback generator finished.")

def risk_mgmt_db_guarded_release_generator(client, stop_event):
    if not client.is_initialized():
        logging.error("LaunchDarkly client is not initialized for Risk Management DB")
        return
    logging.info("Starting guarded release rollback generator for Risk Management DB flag...")
    while True:
        flag_details = get_flag_details("riskmgmtbureauDBGuardedRelease")
        if not flag_details or not is_measured_rollout(flag_details):
            logging.info("Measured rollout is over or flag details unavailable. Exiting Risk Management DB generator.")
            stop_event.set()
            break
        try:
            user_context = generate_user_context()
            flag_value = client.variation("riskmgmtbureauDBGuardedRelease", user_context, False)
            if flag_value:
                # True: higher error rate, higher latency
                if random.random() < 0.68:
                    client.track("rm-db-errors", user_context)
                latency = random.randint(280, 650)
                client.track("rm-db-latency", user_context, None, latency)
            else:
                # False: lower error rate, lower latency
                if random.random() < 0.07:
                    client.track("rm-db-errors", user_context)
                latency = random.randint(60, 140)
                client.track("rm-db-latency", user_context, None, latency)
            time.sleep(0.05)
        except Exception as e:
            logging.error(f"Error during Risk Management DB guarded release simulation: {str(e)}")
            continue
    logging.info("Risk Management DB guarded release rollback generator finished.")

def payment_engine_healthy_scenario_generator(client, stop_event):
    """Static data generator for healthy payment engine rollout scenario"""
    if not client.is_initialized():
        logging.error("LaunchDarkly client is not initialized for Payment Engine Healthy scenario")
        return
    
    logging.info("Starting Payment Engine Healthy scenario generator...")
    
    # wait for rollout to be fully initialized with retry logic
    logging.info("Waiting for flag rollout to be ready...")
    max_retries = 6
    retry_count = 0
    rollout_ready = False
    
    while retry_count < max_retries and not rollout_ready:
        time.sleep(5)
        flag_details = get_flag_details("paymentEngineHealthyRollout")
        if flag_details and is_measured_rollout(flag_details):
            rollout_ready = True
            logging.info("✅ Payment Engine Healthy rollout is ready!")
        else:
            retry_count += 1
            logging.info(f"Rollout not ready yet, retrying... ({retry_count}/{max_retries})")
    
    if not rollout_ready:
        logging.error("Payment Engine Healthy rollout failed to initialize after 30 seconds. Exiting.")
        return
    
    user_counter = 0
    flush_counter = 0
    status_check_counter = 0
    
    while True:
        # Only check rollout status every 500 users to avoid API rate limits
        if status_check_counter >= 500:
            flag_details = get_flag_details("paymentEngineHealthyRollout")
            if not flag_details or not is_measured_rollout(flag_details):
                logging.info("Measured rollout is over or flag details unavailable. Exiting Payment Engine Healthy generator.")
                stop_event.set()
                break
            status_check_counter = 0
        
        try:
            # create deterministic user
            user_key = f"payment-healthy-user-{user_counter}"
            builder = Context.builder(user_key)
            builder.set("name", f"Payment User {user_counter}")
            builder.set("email", f"user{user_counter}@togglebank.com")
            user_context = builder.build()
            
            # evaluate the flag to create exposures
            flag_value = client.variation("paymentEngineHealthyRollout", user_context, False)
            
            # Generate metrics based on flag value (both healthy, new version slightly better)
            if flag_value:
                # NEW VERSION (True): EXCELLENT - even better metrics than control
                error_rate = 0.5  # 0.5% error rate
                latency = 140     # 140ms latency - slightly faster
                success_rate = 99.5  # 99.5% success
            else:
                # CONTROL (False): GOOD - baseline metrics
                error_rate = 1.0  # 1% error rate - still good
                latency = 150     # 150ms latency
                success_rate = 99.0  # 99% success
            
            # track success rate
            if random.random() < (success_rate / 100):
                client.track("payment-success-rate", user_context)
            
            # track error rate
            if random.random() < (error_rate / 100):
                client.track("payment-error-rate", user_context)
            
            # track latency with small variance
            latency_variance = 5
            latency_value = int(latency + random.uniform(-latency_variance, latency_variance))
            client.track("payment-latency", user_context, None, latency_value)
            
            # business metric: track transactions processed (successful payments)
            if random.random() < (success_rate / 100):
                client.track("payment-transactions-processed", user_context, None, 1)
            
            user_counter += 1
            flush_counter += 1
            status_check_counter += 1
            
            # flush events every 50 users to ensure data is sent more frequently
            if flush_counter >= 50:
                client.flush()
                flush_counter = 0
                logging.info(f"Flushed payment healthy events (total users: {user_counter})")
            
            time.sleep(0.005)  # 5ms delay = ~200 events/sec (prevents SDK overload)
            
        except Exception as e:
            logging.error(f"Error generating payment healthy metrics: {str(e)}")
            continue
    
    logging.info(f"Payment Engine Healthy scenario generator finished. Total users generated: {user_counter}")

def payment_engine_failed_scenario_generator(client, stop_event):
    """Static data generator for failed payment processing v2.0 rollout with automatic rollback"""
    if not client.is_initialized():
        logging.error("LaunchDarkly client is not initialized for Payment Processing v2.0 Failed scenario")
        return
    
    logging.info("Starting Payment Processing v2.0 Failed scenario generator...")
    
    # Wait for rollout to be fully initialized with retry logic (same as healthy scenario)
    logging.info("Waiting for flag rollout to be ready...")
    max_retries = 6
    retry_count = 0
    rollout_ready = False
    
    while retry_count < max_retries and not rollout_ready:
        time.sleep(5)
        flag_details = get_flag_details("paymentProcessingV2FailedRollout")
        if flag_details and is_measured_rollout(flag_details):
            rollout_ready = True
            logging.info("✅ Payment Processing v2.0 Failed rollout is ready!")
        else:
            retry_count += 1
            logging.info(f"Rollout not ready yet, retrying... ({retry_count}/{max_retries})")
    
    if not rollout_ready:
        logging.error("Payment Processing v2.0 Failed rollout failed to initialize after 30 seconds. Exiting.")
        return
    
    user_counter = 0
    flush_counter = 0
    alert_triggered = False
    status_check_counter = 0
    
    while True:
        # Only check rollout status every 500 users to avoid API rate limits
        if status_check_counter >= 500:
            flag_details = get_flag_details("paymentProcessingV2FailedRollout")
            if not flag_details or not is_measured_rollout(flag_details):
                logging.info("Measured rollout is over or flag details unavailable. Exiting Payment Processing v2.0 Failed generator.")
                stop_event.set()
                break
            status_check_counter = 0
        
        try:
            # create deterministic user
            user_key = f"payment-v2-failed-user-{user_counter}"
            builder = Context.builder(user_key)
            builder.set("name", f"Payment v2 User {user_counter}")
            builder.set("email", f"userv2{user_counter}@togglebank.com")
            user_context = builder.build()
            
            # evaluate the flag to create exposures
            flag_value = client.variation("paymentProcessingV2FailedRollout", user_context, False)
            
            # KEY FIX: Generate metrics based on flag value, not user count
            # This allows LaunchDarkly to compare True vs False variations
            if flag_value:
                # NEW VERSION (True): BROKEN - generates very bad metrics
                error_rate = 20.0  # 20% error rate - catastrophic failure
                latency = 4000     # 4s latency - extremely slow
                success_rate = 80.0  # 80% success = 20% failure
                
                # trigger alert when first user gets bad version
                if not alert_triggered:
                    alert_user_key = "payment-system-alert"
                    alert_builder = Context.builder(alert_user_key)
                    alert_builder.set("name", "Payment System Alert")
                    alert_builder.set("email", "alerts@togglebank.com")
                    alert_context = alert_builder.build()
                    client.track("payment-rollback-triggered", alert_context)
                    logging.info(f"🚨 Payment rollback triggered at user {user_counter} - high error rate detected in new version")
                    alert_triggered = True
            else:
                # OLD VERSION (False): HEALTHY - generates good baseline metrics
                error_rate = 0.5  # 0.5% error rate - normal/healthy
                latency = 150     # 150ms latency - fast
                success_rate = 99.5  # 99.5% success
            
            # track success rate (using v2-specific metric)
            if random.random() < (success_rate / 100):
                client.track("payment-v2-success-rate", user_context)
            
            # track error rate (using v2-specific metric) - this is the key metric that should trigger rollback
            if random.random() < (error_rate / 100):
                client.track("payment-v2-error-rate", user_context)
                
                # create real observability error for regression debugging ui
                # only create actual errors when flag_value is True (broken version)
                if flag_value:
                    error_types = [
                        "PaymentGatewayTimeout",
                        "TransactionValidationError", 
                        "DatabaseConnectionError",
                        "PaymentProcessorException",
                        "InsufficientFundsError"
                    ]
                    error_messages = [
                        "Payment gateway timed out after 30 seconds",
                        "Transaction validation failed: invalid card number format",
                        "Database connection pool exhausted",
                        "Payment processor returned 500 Internal Server Error",
                        "Insufficient funds for transaction amount"
                    ]
                    
                    error_idx = random.randint(0, len(error_types) - 1)
                    
                    # track the autogenerated observability error metric
                    # this enables regression debugging ui
                    error_data = {
                        "error.kind": error_types[error_idx],
                        "error.message": error_messages[error_idx],
                        "service.name": "payment-processing-v2",
                        "component": "PaymentEngine",
                        "transaction.id": f"txn-{user_counter}",
                        "user.id": user_key,
                        "flag.key": "paymentProcessingV2FailedRollout",
                        "severity": "high"
                    }
                    client.track("$ld:telemetry:error", user_context, error_data, 1)
            
            # track latency with variance (using v2-specific metric)
            latency_variance = 200 if flag_value else 10
            latency_value = int(latency + random.uniform(-latency_variance, latency_variance))
            client.track("payment-v2-latency", user_context, None, latency_value)
            
            # business metric: track transactions processed (successful payments)
            if random.random() < (success_rate / 100):
                client.track("payment-transactions-processed", user_context, None, 1)
            
            user_counter += 1
            flush_counter += 1
            status_check_counter += 1
            
            # flush events every 50 users to ensure data is sent more frequently
            if flush_counter >= 50:
                client.flush()
                flush_counter = 0
                logging.info(f"Flushed payment failed events (total users: {user_counter})")
            
            time.sleep(0.005)  # 5ms delay = ~200 events/sec (prevents SDK overload)
            
        except Exception as e:
            logging.error(f"Error generating payment v2 failed metrics: {str(e)}")
            continue
    
    logging.info(f"Payment Processing v2.0 Failed scenario generator finished. Total users generated: {user_counter}")

def generate_results(project_key, api_key):
    print(f"Generating flags for project {project_key} with API key {api_key} (stub)")
    sdk_key = os.getenv("LD_SDK_KEY")
    if sdk_key:
        ldclient.set_config(Config(sdk_key=sdk_key, events_max_pending=1000))
        client = ldclient.get()
        
        # Evaluate all flags by their tags
        evaluate_all_flags(client)
        
        # AI Configs monitoring
        ai_configs_monitoring_results_generator(client)
        financial_agent_monitoring_results_generator(client)
        
        # All experiment result generators
        experiment_results_generator(client)  # cartSuggestedItems
        ai_configs_experiment_results_generator(client)  # ai-config--togglebot
        hero_image_experiment_results_generator(client)  # showDifferentHeroImageString
        hero_redesign_experiment_results_generator(client)  # showHeroRedesign
        hallucination_detection_experiment_results_generator(client)  # ai-config--togglebot
        togglebank_signup_funnel_experiment_results_generator(client)  # releaseNewSignupPromo
        
        # New experiment generators
        ecommerce_collection_banner_experiment_results_generator(client)  # storeAttentionCallout
        ecommerce_shorten_collection_experiment_results_generator(client)  # release-new-shorten-collections-page
        ecommerce_new_search_engine_experiment_results_generator(client)  # release-new-search-engine
        togglebank_special_offers_experiment_results_generator(client)  # showDifferentSpecialOfferString
        togglebank_widget_position_experiment_results_generator(client)  # swapWidgetPositions
        government_ai_config_experiment_results_generator(client)  # ai-config--publicbot
        
        # Guarded release generators (including static scenario-based ones)
        stop_event = threading.Event()
        risk_mgmt_stop_event = threading.Event()
        financial_agent_stop_event = threading.Event()
        # togglebank_db_stop_event = threading.Event()  # Old A3 - Commented out
        investment_db_stop_event = threading.Event()
        investment_api_stop_event = threading.Event()
        risk_mgmt_db_stop_event = threading.Event()
        payment_healthy_stop_event = threading.Event()
        payment_failed_stop_event = threading.Event()
        
        # Create and start all guarded release threads
        # a4_thread = threading.Thread(target=a4_guarded_release_generator, args=(client, stop_event))  # Old A4 - Commented out
        risk_mgmt_thread = threading.Thread(target=risk_mgmt_guarded_release_generator, args=(client, risk_mgmt_stop_event))
        financial_agent_thread = threading.Thread(target=financial_advisor_agent_guarded_release_generator, args=(client, financial_agent_stop_event))
        # togglebank_db_thread = threading.Thread(target=togglebank_db_guarded_release_generator, args=(client, togglebank_db_stop_event))  # Old A3 - Commented out
        investment_db_thread = threading.Thread(target=investment_db_guarded_release_generator, args=(client, investment_db_stop_event))
        investment_api_thread = threading.Thread(target=investment_api_guarded_release_generator, args=(client, investment_api_stop_event))
        risk_mgmt_db_thread = threading.Thread(target=risk_mgmt_db_guarded_release_generator, args=(client, risk_mgmt_db_stop_event))
        payment_healthy_thread = threading.Thread(target=payment_engine_healthy_scenario_generator, args=(client, payment_healthy_stop_event))  # New A3
        payment_failed_thread = threading.Thread(target=payment_engine_failed_scenario_generator, args=(client, payment_failed_stop_event))  # New A4
        
        # a4_thread.start()  # Old A4 - Commented out
        risk_mgmt_thread.start()
        financial_agent_thread.start()
        # togglebank_db_thread.start()  # Old A3 - Commented out
        investment_db_thread.start()
        investment_api_thread.start()
        risk_mgmt_db_thread.start()
        payment_healthy_thread.start()
        payment_failed_thread.start()
        
        # let generators run continuously until measured rollouts complete
        logging.info("All guarded release generators are now running...")
        logging.info("They will continue generating data until their measured rollouts complete.")
        logging.info("Generators will automatically stop when rollouts finish (typically 10-15 minutes).")
        logging.info("Press Ctrl+C to stop early if needed.")
        logging.info("")
        
        # Wait for all generators to complete naturally (no timeout)
        # Each generator will exit when its measured rollout is complete
        # a4_thread.join()  # Old A4 - Commented out
        risk_mgmt_thread.join()
        financial_agent_thread.join()
        # togglebank_db_thread.join()  # Old A3 - Commented out
        investment_db_thread.join()
        investment_api_thread.join()
        risk_mgmt_db_thread.join()
        payment_healthy_thread.join()
        payment_failed_thread.join()
        
        logging.info("All guarded release generators have completed.")
        
        client.flush()
        client.close()
    else:
        print("LD_SDK_KEY not set in environment. Skipping flag evaluation, guarded release simulation, AI Configs monitoring, and experiment results generation.") 
