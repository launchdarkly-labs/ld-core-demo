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

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

def get_all_bank_flags():
    url = f"{LD_API_URL}/flags/{PROJECT_KEY}"
    response = requests.get(url, headers=HEADERS)
    if not response.ok:
        logging.error(f"Failed to fetch flags: {response.status_code} {response.text}")
        return []
    data = response.json()
    return [flag['key'] for flag in data.get('items', []) if "bank" in flag.get("tags", [])]

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

def evaluate_bank_flags(client):
    if not client.is_initialized():
        logging.error("Failed to initialize LaunchDarkly client")
        return

    logging.info("Starting flag evaluation for all 'bank' flags...")
    flag_keys = get_all_bank_flags()
    if not flag_keys:
        logging.error("No 'bank' flags found to evaluate.")
        client.close()
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

    logging.info("Flag evaluation completed. Flushing and closing client...")
    client.flush()
    logging.info("Flag evaluation script finished.")

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
            time.sleep(0.01)
        except Exception as e:
            logging.error(f"Error during A4 guarded release simulation: {str(e)}")
            continue
    logging.info("A4 guarded release rollback generator finished.")

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
            config, tracker = aiclient.config(LD_FLAG_KEY, context, fallback_value, { 'example_custom_variable': 'example_custom_value'})
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

def experiment_results_generator(client):
    LD_FEATURE_FLAG_KEY = "cartSuggestedItems"
    LD_METRIC_KEY = "in-cart-total-items"  # This is the primary metric for the experiment in DemoBuilder.py
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
                client.track(LD_METRIC_KEY, user_context)
                logging.info(f"User {user_context.key} engaged with {variation} variation")
            if (i + 1) % 100 == 0:
                logging.info(f"Processed {i + 1} users for experiment results")
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
        except Exception as e:
            logging.error(f"Error processing user {i}: {str(e)}")
            continue
    logging.info("AI Configs experiment results generation for ai-config--togglebot completed")

def generate_results(project_key, api_key):
    print(f"Generating flags for project {project_key} with API key {api_key} (stub)")
    sdk_key = os.getenv("LD_SDK_KEY")
    if sdk_key:
        ldclient.set_config(Config(sdk_key=sdk_key))
        client = ldclient.get()
        evaluate_bank_flags(client)
        ai_configs_monitoring_results_generator(client)
        experiment_results_generator(client)
        ai_configs_experiment_results_generator(client)
        stop_event = threading.Event()
        a4_thread = threading.Thread(target=a4_guarded_release_generator, args=(client, stop_event))
        a4_thread.start()
        time.sleep(5)
        stop_event.set()
        a4_thread.join()
        client.flush()
        client.close()
    else:
        print("LD_SDK_KEY not set in environment. Skipping flag evaluation, guarded release simulation, AI Configs monitoring, and experiment results generation.") 