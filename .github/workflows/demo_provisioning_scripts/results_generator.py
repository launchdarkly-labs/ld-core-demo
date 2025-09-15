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
from ldai.client import LDAIClient, AIConfig, ModelConfig, LDMessage, ProviderConfig
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

def evaluate_bank_and_public_sector_flags(client):
    # Evaluate both bank and public-sector flags as part of the process
    evaluate_flags_by_tag(client, "bank", "bank")
    evaluate_flags_by_tag(client, "public-sector", "public-sector")

def a4_guarded_release_generator(client, stop_event):
    if not client.is_initialized():
        logging.error("LaunchDarkly client is not initialized for A4")
        return
    logging.info("Starting guarded release rollback generator for A4 flag...")
    while True:
        flag_details = get_flag_details(A4_FLAG_KEY)
        if not flag_details or not is_measured_rollout(flag_details):
            logging.info("Measured rollout is over or flag details unavailable. Exiting A4 generator.")
            stop_event.set()
            break
        try:
            user_context = generate_user_context()
            flag_value = client.variation(A4_FLAG_KEY, user_context, False)
            if flag_value:
                # True: higher error rate, higher latency
                if random.random() < 0.8:
                    client.track(API_ERROR_RATE_KEY, user_context)
                latency = random.randint(500, 1000)
                client.track(API_LATENCY_KEY, user_context, None, latency)
            else:
                # False: lower error rate, lower latency
                if random.random() < 0.1:
                    client.track(API_ERROR_RATE_KEY, user_context)
                latency = random.randint(100, 200)
                client.track(API_LATENCY_KEY, user_context, None, latency)
            time.sleep(0.05)  # Increased delay to prevent API overload
        except Exception as e:
            logging.error(f"Error during A4 guarded release simulation: {str(e)}")
            continue
    logging.info("A4 guarded release rollback generator finished.")

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
                accuracy = 0
            elif 'ld-ai-model-mini' in model_name.lower():
                # Mini model - Extremely poor performance, fails the experiment
                accuracy = random.uniform(5, 15)  # Extremely low accuracy
                if random.random() < 0.90:  # Very high negative feedback rate
                    client.track(FINANCIAL_AGENT_NEGATIVE_FEEDBACK_KEY, user_context)
                
                client.track(FINANCIAL_AGENT_ACCURACY_KEY, user_context, None, accuracy)
                acurracy = 0
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

    fallback_value = AIConfig(
        enabled=True,
        model=ModelConfig(
            name="default-model",
            parameters={"temperature": 0.8},
        ),
        messages=[LDMessage(role="system", content="")],
        provider=ProviderConfig(name="default-provider"),
    )

    for i in range(NUM_RUNS):
        try:
            context = generate_user_context()
            config, tracker = aiclient.config(LD_FLAG_KEY, context, fallback_value)
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

    fallback_value = AIConfig(
        enabled=True,
        model=ModelConfig(
            name="default-model",
            parameters={"temperature": 0.8},
        ),
        messages=[LDMessage(role="system", content="")],
        provider=ProviderConfig(name="default-provider"),
    )

    for i in range(NUM_RUNS):
        try:
            context = generate_user_context()
            config, tracker = aiclient.config(LD_FLAG_KEY, context, fallback_value)
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
            
            # AI Accuracy: 85-95% range with slight model variations
            if 'claude' in model_name.lower():
                accuracy = random.uniform(0.88, 0.94)
            elif 'nova' in model_name.lower():
                accuracy = random.uniform(0.86, 0.92)
            elif 'gpt' in model_name.lower():
                accuracy = random.uniform(0.87, 0.93)
            else:
                accuracy = random.uniform(0.85, 0.91)
            
            # AI Source Fidelity: 80-90% range with slight model variations
            if 'claude' in model_name.lower():
                source_fidelity = random.uniform(0.83, 0.89)
            elif 'nova' in model_name.lower():
                source_fidelity = random.uniform(0.81, 0.87)
            elif 'gpt' in model_name.lower():
                source_fidelity = random.uniform(0.82, 0.88)
            else:
                source_fidelity = random.uniform(0.80, 0.86)
            
            # AI Cost: $0.001-$0.005 range with slight model variations
            if 'claude' in model_name.lower():
                cost = random.uniform(0.002, 0.004)
            elif 'nova' in model_name.lower():
                cost = random.uniform(0.001, 0.003)
            elif 'gpt' in model_name.lower():
                cost = random.uniform(0.0015, 0.0035)
            else:
                cost = random.uniform(0.001, 0.002)
            
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

def generate_results(project_key, api_key):
    print(f"Generating flags for project {project_key} with API key {api_key} (stub)")
    sdk_key = os.getenv("LD_SDK_KEY")
    if sdk_key:
        ldclient.set_config(Config(sdk_key=sdk_key, events_max_pending=1000))
        client = ldclient.get()
        # Evaluate both bank and public-sector flags as part of the process
        evaluate_bank_and_public_sector_flags(client)
        ai_configs_monitoring_results_generator(client)
        financial_agent_monitoring_results_generator(client)
        experiment_results_generator(client)
        ai_configs_experiment_results_generator(client)
        hero_image_experiment_results_generator(client)
        hero_redesign_experiment_results_generator(client)
        hallucination_detection_experiment_results_generator(client)
        stop_event = threading.Event()
        risk_mgmt_stop_event = threading.Event()
        financial_agent_stop_event = threading.Event()
        
        a4_thread = threading.Thread(target=a4_guarded_release_generator, args=(client, stop_event))
        risk_mgmt_thread = threading.Thread(target=risk_mgmt_guarded_release_generator, args=(client, risk_mgmt_stop_event))
        financial_agent_thread = threading.Thread(target=financial_advisor_agent_guarded_release_generator, args=(client, financial_agent_stop_event))
        
        a4_thread.start()
        risk_mgmt_thread.start()
        financial_agent_thread.start()
        time.sleep(5)
        stop_event.set()
        risk_mgmt_stop_event.set()
        financial_agent_stop_event.set()
        a4_thread.join()
        risk_mgmt_thread.join()
        financial_agent_thread.join()
        client.flush()
        client.close()
    else:
        print("LD_SDK_KEY not set in environment. Skipping flag evaluation, guarded release simulation, AI Configs monitoring, and experiment results generation.") 