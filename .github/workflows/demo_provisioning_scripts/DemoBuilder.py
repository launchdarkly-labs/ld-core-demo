import LDPlatform
import time
import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

class DemoBuilder:
    project_created = False
    flags_created = False
    segments_created = False
    metrics_created = False
    metric_groups_created = False
    contexts_created = False
    experiment_created = False
    ai_config_created = False
    email = None
    client_id = ""
    sdk_key = ""
    phase_ids = {}
    
    # InitializeDemoBuilder
    def __init__(self, api_key, email, api_key_user, project_key, project_name):
        self.api_key = api_key
        self.email = email
        self.api_key_user = api_key_user
        self.project_key = project_key
        self.project_name = project_name
        self.ldproject = LDPlatform.LDPlatform(api_key, api_key_user, email)
        self.ldproject.project_key = project_key
        
    
    def build(self):
        self.create_project()
        self.create_segments()
        self.create_metrics()
        self.create_metric_groups()
        self.create_flags()
        self.run_funnel_experiment()
        self.run_feature_experiment()
        self.run_ai_models_experiment()
        self.project_settings()
        self.setup_release_pipeline()
        self.setup_template_environment()       
        self.create_ai_config()
        
        # self.update_add_userid_to_flags()
        
        ## Not required
        #self.create_contexts()
     
############################################################################################################
   
    # Create the project
    def create_project(self):
        if self.ldproject.project_exists(self.project_key):
            self.ldproject.delete_project()
        print("Creating project", end="...")
        self.ldproject.create_project(self.project_key, self.project_name)
        print("Done")
        self.client_id = self.ldproject.client_id
        self.sdk_key = self.ldproject.sdk_key
        self.project_created = True
        
        print("Creating template environment", end="...")
        self.ldproject.create_environment("template-env", "Template")
        
        env_file = os.getenv('GITHUB_ENV')
        if env_file:
            try:
                with open(env_file, "a") as f:
                    f.write(f"LD_SDK_KEY={self.sdk_key}\n")
                    f.write(f"LD_CLIENT_KEY={self.client_id}\n")
                    f.write(f"Projected_Created={self.project_created}\n")   
            except IOError as e:
                print(f"Unable to write to environment file: {e}")
        else:
            print("GITHUB_ENV not set")
            
############################################################################################################     
        
    # Create all the metrics
    def create_metrics(self):
        print("Creating metrics:")
        print("  - AI Chatbot Positive Feedback")
        self.metric_chatbot_positive()
        print("  - AI Chatbot Negative Feedback")
        self.metric_chatbot_negative()
        print(" - In-Cart Total Price")
        self.metric_in_cart_total_price()
        print(" - In-Cart Up-Sell")
        self.metric_in_cart_upsell()
        print(" - Database Error Rates")
        self.metric_database_error_rates()
        print(" - Database Latency")
        self.metric_database_latency()
        print(" - API Error Rates")
        self.metric_api_error_rates()
        print(" - API Latency")
        self.metric_api_latency()
        print(" - Store Accessed")
        self.metric_store_accessed()
        print(" - Items Added to Cart")
        self.metric_items_added_to_cart()
        print(" - Cart Accessed")
        self.metric_cart_accessed()
        print(" - Store Checkout Completed")
        self.metric_store_checkout_completed()
        
        print("Done")
        self.metrics_created = True

############################################################################################################      

    # Create all the metric groups
    def create_metric_groups(self):
        if not self.metrics_created:
            print("Error: Metrics not created")
            return
        print("Creating metric groups:")
        print("  - Store Purchases Metric Group")
        self.metgroup_store_purchases()
        print("Done")
        self.metric_groups_created = True
        
############################################################################################################

    # Create all the flags
    def create_flags(self):
        if not self.project_created:
            print("Error: Project not created")
            return
        print("Creating flags:")
        print("  - 01 - Release: Federated Account Component")
        self.flag_federated_account()
        print("  - 02 - Release: Wealth Management Component")
        self.flag_wealth_management()
        print("  - 03 - Migration: Database (Migration Tool)")
        self.flag_database_migration()
        print("  - 04 - Release: New Database (Guarded Release)")
        self.flag_database_guarded_release()
        print("  - 05 -  Release: New API (Guarded Release)")
        self.flag_api_guarded_release()
        print("  - 06 - Experiment: AI Models for Chatbot")
        self.flag_exp_chatbot_ai_models()
        print("  - 07 - Funnel Experiment: Promotion Banner")
        self.flag_exp_promotion_banner()
        print("  - 08 - Feature Experiment: Suggested Items Carousel")
        self.flag_exp_suggestions_carousel()
        
        print("Done")
        self.flags_created = True

############################################################################################################
   
    #Create AI Config
    def create_ai_config(self):
        print("Creating AI Config:")
        print("AI Models: Destination Recommendations")
        self.create_destination_recommendation_ai_config()
        print("AI Prompts: Travel Insights")
        self.create_travel_insights_ai_config()
        print("AI Models: AI Chatbot")
        self.create_ai_chatbot_ai_config()
        print("Done")
        self.ai_config_created = True
        
############################################################################################################
  
    # Create all the segments
    def create_segments(self):
        print("Creating segments:")
        print("  - Mobile Users")
        self.segment_mobile_users()
        print("  - Development Team")
        self.segment_development_team()
        print("  - Launch Airways All Members")
        self.segment_launch_airways_members()
        print("  - Launch Airways Platinum Members")
        self.segment_launch_airways_platinum_members()
        print("  - Beta Users")
        self.segment_beta_users()
        print("Done")
        self.segments_created = True

############################################################################################################       
    
    # Create all the contexts
    def create_contexts(self):
        print("Creating contexts:")
        print("  - Audience")
        self.context_audience()
        print("  - Location")
        self.context_location()
        print("  - Device")
        self.context_device()
        print("  - Experience")
        self.context_experience()
        print("Done")
        self.contexts_created = True

############################################################################################################

    ##################################################
    # Experiments Definitions
    # ----------------
    # Each experiment is defined in its own function below
    
    ##################################################
    # Create all the experiments    
    def run_funnel_experiment(self):
        if not self.metric_groups_created:
            print("Error: Metric groups not created")
            return
        print("Creating experiment: ")
        self.ldproject.toggle_flag(
            "storeAttentionCallout",
            "on",
            "production",
            "Turn on flag for experiment",
        )
        print(" - 09 - Funnel Experiment: Promotion Banner ")
        self.exp_funnel_experiment()
        self.ldproject.start_exp_iteration("grow-engagement-with-promotion-banner", "production")
        print("Done")
        self.experiment_created = True
        
    def exp_funnel_experiment(self):
        metrics = [
            self.ldproject.exp_metric("store-purchases", True),
            self.ldproject.exp_metric("in-cart-total-price", False)
        ]
        res = self.ldproject.create_experiment(
            "grow-engagement-with-promotion-banner",
            "Grow engagement with promotion banner",
            "production",
            "storeAttentionCallout",
            "If we adjust the header text to better copy we can drive greater attention into the stores in question, and greater conversion of checkout activities.",
            metrics=metrics,
            primary_key="store-purchases",
        )   
        
    def run_feature_experiment(self):
        if not self.metrics_created:
            print("Error: Metric not created")
            return
        print("Creating experiment: ")
        self.ldproject.toggle_flag(
            "cartSuggestedItems",
            "on",
            "production",
            "Turn on flag for experiment",
        )
        print(" - 10 - Feature Experiment: Suggested Items Carousel")
        self.exp_feature_experiment()
        self.ldproject.start_exp_iteration("upsell-tracking-experiment", "production")
        print("Done")
        self.experiment_created = True
        
    def exp_feature_experiment(self):
        metrics = [
            self.ldproject.exp_metric("upsell-tracking", False),
            self.ldproject.exp_metric("in-cart-total-price", False)
        ]
        res = self.ldproject.create_experiment(
            "upsell-tracking-experiment",
            "Upsell Tracking Experiment",
            "production",
            "cartSuggestedItems",
            "If we enable the new cart suggested items feature, we can drive greater upsell conversion.",
            metrics=metrics,
            primary_key="upsell-tracking",
        )  
    
    def run_ai_models_experiment(self):
        if not self.metrics_created:
            print("Error: Metric not created")
            return
        print("Creating experiment: ")
        self.ldproject.toggle_flag(
            "ai-chatbot",
            "on",
            "production",
            "Turn on flag for experiment",
        )
        print(" - 08 - Experiment: AI Models for Chatbot")
        self.exp_ai_models_experiment()
        self.ldproject.start_exp_iteration("ai-chatbot-experiment", "production")
        print("Done")
        self.experiment_created = True
        
    def exp_ai_models_experiment(self):
        metrics = [
            self.ldproject.exp_metric("ai-chatbot-positive-feedback", False),
            self.ldproject.exp_metric("ai-chatbot-negative-feedback", False)
        ]
        res = self.ldproject.create_experiment(
            "ai-chatbot-experiment",
            "AI Chatbot Experiment",
            "production",
            "ai-chatbot",
            "Which AI Models are providing best experiences to customers and delivering best responses",
            metrics=metrics,
            primary_key="ai-chatbot-positive-feedback",
        )
        
# ############################################################################################################

#     # Add user id to flags    
#     def update_add_userid_to_flags(self):
#         print("Adding maintainerId to flags", end="...")
#         self.add_userid_to_flags()
#         print("Done")
        
# ############################################################################################################

    # Update project settings
    def project_settings(self):
        print("Updating project settings:")
        
        print("  - Toggling flags")
        self.toggle_flags()
        print("  - Add targeting")
        self.add_targeting_rules()
        print("Done")
        
    def add_targeting_rules(self):
        res = self.ldproject.add_segment_to_flag("federatedAccounts", "development-team", "production")
        res = self.ldproject.add_segment_to_flag("wealthManagement", "beta-users", "production")
        res = self.ldproject.add_segment_to_flag("cartSuggestedItems", "beta-users", "production")
                
    def toggle_flags(self):
        res = self.ldproject.toggle_flag(
            "federatedAccounts",
            "on",
            "production",
            "Turn on flag for federated accounts",
        )
        res = self.ldproject.toggle_flag(
            "wealthManagement",
            "on",
            "production",
            "Turn on flag for wealth management",
        )
        res = self.ldproject.toggle_flag(
            "financialDBMigration",
            "on",
            "production",
            "Turn on flag for database migration",
        )          
        
############################################################################################################

    ##################################################
    # Metrics Definitions
    # ----------------
    # Each metric is defined in its own function below
    ##################################################
        
    def metric_chatbot_positive(self):
        res = self.ldproject.create_metric(
            "ai-chatbot-positive-feedback",
            "AI Chatbot Positive Feedback",
            "AI chatbot good service",
            "This metric will track positive feedback given to AI Model used in chatbot for the good responses provided.",
            success_criteria="HigherThanBaseline",
            tags=["experiment"]
        )
    
    def metric_chatbot_negative(self):
        res = self.ldproject.create_metric(
            "ai-chatbot-negative-feedback",
            "AI Chatbot Negative Feedback",
            "AI Chatbot Bad Service",
            "This metric will track negative feedback given to AI Model used in chatbot for the bad responses provided.",
            success_criteria="LowerThanBaseline",
            tags=["experiment"]
        )
    
    def metric_in_cart_total_price(self):
        res = self.ldproject.create_metric(
            "in-cart-total-price",
            "In-Cart Total Price",
            "in-cart-total-price",
            "This metric will track the total price of items in the cart.",
            numeric=True,
            unit="$",
            success_criteria="HigherThanBaseline",
            tags=["experiment"]
        )
    
    def metric_in_cart_upsell(self):
        res = self.ldproject.create_metric(
            "upsell-tracking",
            "In-Cart Up-Sell",
            "upsell-tracking",
            metric_description="This metric will track the number of up-sell items in the cart.",
            numeric=False,
            unit="",
            success_criteria="HigherThanBaseline",
            tags=["experiment"]
        )
    
    def metric_database_error_rates(self):
        res = self.ldproject.create_metric(
            "recent-trades-db-errors",
            "Database Error Rates",
            "recent-trades-db-errors",
            "This metric will track the error rates in the new database.",
            numeric=False,
            unit="",
            success_criteria="LowerThanBaseline",
            tags=["experiment"]
        )
        
    def metric_database_latency(self):
        res = self.ldproject.create_metric(
            "recent-trades-db-latency",
            "Database Latency",
            "recent-trades-db-latency",
            "This metric will track the latency in the new database.",
            numeric=True,
            unit="ms",
            success_criteria="LowerThanBaseline",
            tags=["experiment"]
        )
    
    def metric_api_error_rates(self):
        res = self.ldproject.create_metric(
            "stocks-api-error-rates",
            "API Error Rates",
            "stocks-api-error-rates",
            "This metric will track the error rates in the new API.",
            numeric=False,
            unit="",
            success_criteria="LowerThanBaseline",
            tags=["experiment"]
        )
        
    def metric_api_latency(self):
        res = self.ldproject.create_metric(
            "stocks-api-latency",
            "API Latency",
            "stocks-api-latency",
            "This metric will track the latency in the new API.",
            numeric=True,
            unit="ms",
            success_criteria="LowerThanBaseline",
            tags=["experiment"]
        )
    
    def metric_store_accessed(self):
        res = self.ldproject.create_metric(
            "store-accessed",
            "Store Accessed",
            "store-accessed",
            "This metric will track the number of times the store is accessed",
            numeric=False,
            unit="",
            success_criteria="HigherThanBaseline",
            tags=["experiment"]
        )
    
    def metric_items_added_to_cart(self):
        res = self.ldproject.create_metric(
            "item-added",
            "Items Added to Cart",
            "item-added",
            "This metric will track the number of items added to the cart",
            numeric=False,
            unit="",
            success_criteria="HigherThanBaseline",
            tags=["experiment"]
        )
    
    def metric_cart_accessed(self):
        res = self.ldproject.create_metric(
            "cart-accessed",
            "Store Cart Accessed",
            "cart-accessed",
            "This metric will track the number of times the cart is accessed",
            numeric=False,
            unit="",
            success_criteria="HigherThanBaseline",
            tags=["experiment"]
        )
    
    def metric_store_checkout_completed(self):
        res = self.ldproject.create_metric(
            "customer-checkout",
            "Store Checkout Completed",
            "customer-checkout",
            "This metric will track the number of times the store checkout is completed",
            numeric=False,
            unit="",
            success_criteria="HigherThanBaseline",
            tags=["experiment"]
        )
        
############################################################################################################

    ##################################################
    # AI Config Definitions
    # ----------------
    # Each AI Config and its versions is defined in its own function below
    ##################################################        
    
    def create_destination_recommendation_ai_config(self):
        res = self.ldproject.create_ai_config(
            "ai-config--destination-picker-new-ai-model",
            "AI Models: Destination Recommendations",
            "This ai config will provide ai models to the destination recommendations component in LaunchAirways",
            ["ai-models", "ai-config"]
        )
        res2 = self.ldproject.create_ai_config_versions(
            "ai-config--destination-picker-new-ai-model",
            "claude-haiku",
            "Claude Haiku",
            {
                "id": "anthropic.claude-instant-v1",
                "parameters": {
                    "temperature": 0.5,
                    "maxTokens": 200
                }
            },
            [
                {
                    "content": "give me three recommendations of places to travel based on popular travel destinations, strongly consider weather conditions at the time of the request, and any unique characteristics that would appeal to the average traveler. Try to be creative and choose different spots that you don't think the users would pick. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time. Limit your responses to 50 characters or less",
                    "role": "system"
                }
            ]
        )
        res3 = self.ldproject.create_ai_config_versions(
            "ai-config--destination-picker-new-ai-model",
            "cohere-text",
            "Cohere Text",
            {
                "id": "cohere.command-text-v14",
                "parameters": {
                    "temperature": 0.7,
                    "maxTokens": 400
                }
            },
            [
                {
                    "content": "give me three recommendations of places to travel based on popular travel destinations, consider best air fare prices and places tourists / travelers are visiting currently and any unique characteristics that would appeal to the average traveler. Try to be creative and choose different spots that you don't think the users would pick. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time. ",
                    "role": "system"
                }
            ]
        ) 
        
    def create_travel_insights_ai_config(self):
        res = self.ldproject.create_ai_config(
            "ai-config--ai-travel-prompt-text",
            "AI Prompts: Travel Insights",
            "This ai config will provide ai prompts to the travel insights component in LaunchAirways",
            ["ai-prompts","ai-config"]
        )
        res2 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-travel-prompt-text",
            "general-travel",
            "General Travel",
            {
                "id": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 500,
                    "temperature": 0.9
                }
            },
            [
                {
                    "content": "Playing the role of a travel expert with a tone of excitement and encouragement, using the current travel destination in this configuration: ${destination}, write me 40 word of an analysis travel considerations for that location including typical weather and culture. Skip anything identifying your prompt. On a new line, answer what clothing someone should pack when travleing here. Place a hard limit on a 40 word response.Do not exceed this limit. do not specify word count in your reply",
                    "role": "system"
                }
            ]
        )
        res3 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-travel-prompt-text",
            "historical-focus",
            "Historical Focus",
            {
                "id": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 500,
                    "temperature": 0.9
                }
            },
            [
                {
                    "content": "Tell me about the location ${destination} that I'm going to. Give me any relevant historical facts or places that have significant value that I should visit while I'm there. The destination is ${destination}. Limit your responses to an estimated 40 words. Answer in a friendly tone. Indicate your timing responses as estimates and that travel conditions may impact the duration. do not specify word count in your reply",
                    "role": "system"
                }
            ]
        )
        res4 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-travel-prompt-text",
            "weather-focus",
            "Weather Focus",
            {
                "id": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 500,
                    "temperature": 0.9
                }
            },
            [
                {
                    "content": "Tell me relevant climate and weather facts about my destination. Provide example clothing to wear upon arrival at the destination and suggest some activities based on the typical weather at the time of arrival. Use the current date to base your weather information on. The destination is ${destination}. Limit your responses to an estimated 40 words. Answer in a friendly tone. Indicate your timing responses as estimates and that travel conditions may impact the duration. do not specify word count in your reply",
                    "role": "system"
                }
            ]
        )
    
    def create_ai_chatbot_ai_config(self):
        res = self.ldproject.create_ai_config(
            "ai-config--ai-new-model-chatbot",
            "AI Prompts: Chatbot",
            "This ai config will provide ai prompts to the chatbot component in LaunchAirways",
            ["ai-models","ai-config"]
        )
        res2 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-new-model-chatbot",
            "claude-haiku",
            "Claude Haiku",
            {
                "id": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 500,
                    "temperature": 0.5
                }
            },
            [
                {
                    "content": "As an AI bot for a travel airline LaunchAirways your purpose is to answer questions related to flights and traveling. Act as customer representative. Only answer queries related to traveling and airlines. Remove quotation in response. Limit response to 100 characters. Here is the user prompt: ${userInput}.",
                    "role": "system"
                }
            ]
        )
        res3 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-new-model-chatbot",
            "cohere-coral",
            "Cohere Coral",
            {
                "id": "cohere.command-text-v14",
                "parameters": {
                    "maxTokens": 500,
                    "temperature": 0.5
                }
            },
            [
                {
                    "content": "As an AI bot for a travel airline LaunchAirways your purpose is to answer questions related to flights and traveling. Act as customer representative. Only answer queries related to traveling and airlines. Remove quotation in response. Limit response to 100 characters. Here is the user prompt: ${userInput}.",
                    "role": "system"
                }
            ]
        )
        res4 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-new-model-chatbot",
            "meta-llama",
            "Meta Llama",
            {
                "id": "meta.llama2-13b-chat-v1",
                "parameters": {
                    "maxTokens": 500,
                    "temperature": 0.7
                }
            }
            [
                {
                    "content": "As an AI bot for a travel airline LaunchAirways your purpose is to answer questions related to flights and traveling. Act as customer representative. Only answer queries related to traveling and airlines. Remove quotation in response. Limit response to 100 characters. Here is the user prompt: ${userInput}.",
                    "role": "system"
                }
            ]
        )
        
############################################################################################################

    ##################################################
    # Metrics Group Definitions
    # ----------------
    # Each metric group is defined in its own function below
    ################################################## 
    
    def metgroup_store_purchases(self):
        res = self.ldproject.create_metric_group(
            "store-purchases",
            "Store Purchases",
            [
                {"key": "store-accessed", "nameInGroup": "1"},
                {"key": "item-added", "nameInGroup": "2"},
                {"key": "cart-accessed", "nameInGroup": "3"},
                {"key": "customer-checkout", "nameInGroup": "4"},
            ],
            kind="funnel",
            description="This metric group will track the store purchases",
        )
           
        
############################################################################################################

    ##################################################
    # Flag Definitions
    # ----------------
    # Each flag is defined in its own function below
    ##################################################

    def flag_federated_account(self):
        res = self.ldproject.create_flag(
            "federatedAccounts",
            "01 - Release: Federated Account Component",
            "Releasing new federated account component on ToggleBank",
            [
                {
                    "value": True,
                    "name": "Release Federated Accounts Component"
                },
                {
                    "value": False,
                    "name": "Hide Federated Accounts Component"
                }
            ],
            tags=["release"],
            on_variation=1,
        )
        
    def flag_wealth_management(self):
        res = self.ldproject.create_flag(
            "wealthManagement",
            "02 - Release: Wealth Management Component",
            "Releasing new wealth management component on ToggleBank",
            [
                {
                    "value": True,
                    "name": "Release Wealth Management Component"
                },
                {
                    "value": False,
                    "name": "Hide Wealth Management Component"
                }
            ],
            tags=["release"],
            on_variation=1,
        )
    
    def flag_database_migration(self):
        res = self.ldproject.create_flag(
            "financialDBMigration",
            "03 - Migration: Database (Migration Tool)",
            "This feature flag will trigger the database migration tool in LaunchAirways",
            purpose="migration",
            migration_stages=6,
            tags=["release", "migration-assistant"]
        )
            
    def flag_database_guarded_release(self):
        res = self.ldproject.create_flag(
            "investment-recent-trade-db",
            "04 - Release: New Database (Guarded Release)",
            "Release new database for recent trading component",
            [
                {
                    "value": True,
                    "name": "Add New Database"
                },
                {
                    "value": False,
                    "name": "Remove New Database"
                }
            ],
            tags=["guarded-release"],
            on_variation=1,
        )
        res = self.ldproject.attach_metric_to_flag("investment-recent-trade-db",["recent-trades-db-latency","recent-trades-db-errors"])
        res = self.ldproject.add_guarded_rollout("investment-recent-trade-db", "production")
    
    def flag_api_guarded_release(self):
        res = self.ldproject.create_flag(
            "release-new-investment-stock-api",
            "05 -  Release: New API (Guarded Release)",
            "Release new API for stocks component",
            [
                {
                    "value": True,
                    "name": "Release New API 2.0"
                },
                {
                    "value": False,
                    "name": "Revert to Old API 1.0"
                }
            ],
            tags=["guarded-release"],
            on_variation=0,
        )
        res = self.ldproject.attach_metric_to_flag("release-new-investment-stock-api",["stocks-api-latency","stocks-api-error-rates"])              
            
    def flag_exp_chatbot_ai_models(self):
        res = self.ldproject.create_flag(
            "ai-chatbot",
            "06 - Experiment: AI Models for Chatbot",
            "This feature flag will change AI models in real-time for the LaunchAirways Chatbot component in LaunchAirways.",
            [
                {
                    "name": "Claude Haiku",
                    "description": "This is Claude Haiku's AI model for quick response and cost saving",
                    "value": 
                        {
                            "max_tokens_to_sample": 500,
                            "modelId": "anthropic.claude-instant-v1",
                            "temperature": 0.3,
                            "top_p": 1
                        }
                    
                },
                {
                    "name": "Meta Llama",
                    "description": "This is Meta's Llama AI model for more creative responses",
                    "value": 
                        {
                            "max_gen_len": 500,
                            "modelId": "meta.llama2-13b-chat-v1",
                            "temperature": 0.9,
                            "top_p": 1
                        }
                    
                },
                {
                    "name": "Cohere Coral",
                    "description": "This is Cohere Coral AI model for balance between precision and creativity",
                    "value": 
                        {
                            "max_tokens": 500,
                            "modelId": "cohere.command-text-v14",
                            "p": 1,
                            "temperature": 0.5
                        }
                }
            ],
            tags=["ai-models"],
            on_variation=0,
            off_variation=1,
        )
        
    def flag_exp_promotion_banner(self):
        res = self.ldproject.create_flag(
            "storeAttentionCallout",
            "07 - Funnel Experiment: Promotion Banner",
            "Promotion Banner for the Galaxy Marketplace",
            [
                {
                    "value": "New Items",
                    "name": "Control"
                },
                {
                    "value": "Sale",
                    "name": "Sale"
                },
                {
                    "value": "Final Hours!",
                    "name": "Final Hours!"
                }
            ],
            tags=["experiment"],
            on_variation=0,
            off_variation=1,
        )
        
    def flag_exp_suggestions_carousel(self):
        res = self.ldproject.create_flag(
            "cartSuggestedItems",
            "08 - Feature Experiment: Suggested Items Carousel",
            "Suggested Items Carousel for the cart component in Galaxy Marketplace",
            [
                {
                    "value": True,
                    "name": "Suggested Items Carousel"
                },
                {
                    "value": False,
                    "name": "Continue Shopping Button"
                }
            ],
            tags=["experiment"],
            on_variation=0,
            off_variation=1,
        )
        
############################################################################################################

    ##################################################
    # Segments Definitions
    # ----------------
    # Each segment is defined in its own function below
    ################################################## 
    
    
    def segment_mobile_users(self):
        ################ Test Environment ################
        res = self.ldproject.create_segment(
            "mobile-users",
            "Mobile Users",
            "test",
            "Users who have accessed the application via mobile device"
        )
        res = self.ldproject.add_segment_rule(
            "mobile-users",
            "test",
            "device",
            "platform",
            "in",
            ["Mobile"]
        )
        
        ################ Production Environment ################
        res = self.ldproject.create_segment(
            "mobile-users",
            "Mobile Users",
            "production",
            "Users who have accessed the application via mobile device"
        )
        res = self.ldproject.add_segment_rule(
            "mobile-users",
            "production",
            "device",
            "platform",
            "in",
            ["Mobile"]
        )
        
        ################ Template Environment ################
        res = self.ldproject.create_segment(
            "mobile-users",
            "Mobile Users",
            "template-env",
            "Users who have accessed the application via mobile device"
        )
        res = self.ldproject.add_segment_rule(
            "mobile-users",
            "template-env",
            "device",
            "platform",
            "in",
            ["Mobile"]
        )
    
    def segment_development_team(self):
        ################ Test Environment ################
        res = self.ldproject.create_segment(
            "development-team",
            "Development Team",
            "test",
            "Users who are part of the development team"
        )
        res = self.ldproject.add_segment_rule(
            "development-team",
            "test",
            "user",
            "role",
            "in",
            ["Developer"]
        )
        
        ################ Production Environment ################
        res = self.ldproject.create_segment(
            "development-team",
            "Development Team",
            "production",
            "Users who are part of the development team"
        )
        res = self.ldproject.add_segment_rule(
            "development-team",
            "production",
            "user",
            "role",
            "in",
            ["Developer"]
        )
        
        ################ Template Environment ################
        res = self.ldproject.create_segment(
            "development-team",
            "Development Team",
            "template-env",
            "Users who are part of the development team"
        )
        res = self.ldproject.add_segment_rule(
            "development-team",
            "template-env",
            "user",
            "role",
            "in",
            ["Developer"]
        )
    
    def segment_launch_airways_members(self):
        ################ Test Environment ################
        res = self.ldproject.create_segment(
            "launch-airways-all-members",
            "Launch Airways All Members",
            "test",
            "Users who are part of the LaunchAirways Club Membership"
        )
        res = self.ldproject.add_segment_rule(
            "launch-airways-all-members",
            "test",
            "user",
            "launchclub",
            "in",
            ["standard", "platinum"]
        )

        ################ Production Environment ################
        res = self.ldproject.create_segment(
            "launch-airways-all-members",
            "Launch Airways All Members",
            "production",
            "Users who are part of the LaunchAirways Club Membership"
        )
        res = self.ldproject.add_segment_rule(
            "launch-airways-all-members",
            "production",
            "user",
            "launchclub",
            "in",
            ["standard", "platinum"]
        )
        
        ################ Template Environment ################
        res = self.ldproject.create_segment(
            "launch-airways-all-members",
            "Launch Airways All Members",
            "template-env",
            "Users who are part of the LaunchAirways Club Membership"
        )
        res = self.ldproject.add_segment_rule(
            "launch-airways-all-members",
            "template-env",
            "user",
            "launchclub",
            "in",
            ["standard", "platinum"]
        )
    
    def segment_launch_airways_platinum_members(self):
        ################ Test Environment ################
        res = self.ldproject.create_segment(
            "launch-airways-platinum-members",
            "Launch Airways Platinum Members",
            "test",
            "Users who are part of the LaunchAirways Club Membership"
        )
        res = self.ldproject.add_segment_rule(
            "launch-airways-platinum-members",
            "test",
            "user",
            "launchclub",
            "in",
            ["platinum"]
        )
        ################ Production Environment ################
        res = self.ldproject.create_segment(
            "launch-airways-platinum-members",
            "Launch Airways Platinum Members",
            "production",
            "Users who are part of the LaunchAirways Club Membership"
        )
        res = self.ldproject.add_segment_rule(
            "launch-airways-platinum-members",
            "production",
            "user",
            "launchclub",
            "in",
            ["platinum"]
        )
        
        ################ Template Environment ################
        res = self.ldproject.create_segment(
            "launch-airways-platinum-members",
            "Launch Airways Platinum Members",
            "template-env",
            "Users who are part of the LaunchAirways Club Membership"
        )
        res = self.ldproject.add_segment_rule(
            "launch-airways-platinum-members",
            "template-env",
            "user",
            "launchclub",
            "in",
            ["platinum"]
        )
        
    def segment_beta_users(self):
        ################ Test Environment ################
        res = self.ldproject.create_segment(
            "beta-users",
            "Beta Users",
            "test",
            "Users who are part of the beta program"
        )
        res = self.ldproject.add_segment_rule(
            "beta-users",
            "test",
            "user",
            "role",
            "in",
            ["Beta"]
        )

        ################ Production Environment ################
        res = self.ldproject.create_segment(
            "beta-users",
            "Beta Users",
            "production",
            "Users who are part of the beta program"
        )
        res = self.ldproject.add_segment_rule(
            "beta-users",
            "production",
            "user",
            "role",
            "in",
            ["Beta"]
        )
        
        ################ Template Environment ################
        res = self.ldproject.create_segment(
            "beta-users",
            "Beta Users",
            "template-env",
            "Users who are part of the beta program"
        )
        res = self.ldproject.add_segment_rule(
            "beta-users",
            "template-env",
            "user",
            "role",
            "in",
            ["Beta"]
        )
        
############################################################################################################

    ##################################################
    # Context Definitions
    # ----------------
    # Each context is defined in its own function below
    ##################################################
    
    def context_audience(self):
        res = self.ldproject.create_context(
            "audience",
            for_experiment=True,
        )
    
    def context_location(self):
        res = self.ldproject.create_context(
            "location",
            for_experiment=True,
        )
    
    def context_device(self):
        res = self.ldproject.create_context(
            "device",
            for_experiment=True,
        )
    
    def context_experience(self):
        res = self.ldproject.create_context(
            "experience",
            for_experiment=True,
        )
        
############################################################################################################

    ##################################################
    # Release Pipelines Definitions
    # ----------------
    # Each release pipeline is defined in its own function below
    ##################################################

    def setup_release_pipeline(self):
        print("Creating release pipeline", end="...")
        self.rp_default_releases()
        print("Done")
        
    def rp_default_releases(self):
        # Default Releases
        res = self.ldproject.create_release_pipeline(
            "default-releases", "Default Releases"
        )
        self.phase_ids = self.ldproject.get_pipeline_phase_ids("default-releases")
        
############################################################################################################

    ##################################################
    # Template Environment Definitions
    # ----------------
    # Each release pipeline is defined in its own function below
    ##################################################

    def setup_template_environment(self):
        
        print("Copying Flag Settings From Production to Template Environment")
        self.ldproject.copy_flag_settings("federatedAccounts", "production", "template-env")
        self.ldproject.copy_flag_settings("wealthManagement", "production", "template-env")
        self.ldproject.copy_flag_settings("financialDBMigration", "production", "template-env")
        self.ldproject.copy_flag_settings("investment-recent-trade-db", "production", "template-env")
        self.ldproject.copy_flag_settings("release-new-investment-stock-api", "production", "template-env")
        self.ldproject.copy_flag_settings("ai-chatbot", "production", "template-env")
        self.ldproject.copy_flag_settings("storeAttentionCallout", "production", "template-env")
        self.ldproject.copy_flag_settings("cartSuggestedItems", "production", "template-env")
        
        print("Done")
    


if __name__ == "__main__":
    
    LD_API_KEY = os.getenv("LD_API_KEY")
    LD_API_KEY_USER = os.getenv("LD_API_KEY_USER")
    LD_PROJECT_KEY = os.getenv("LD_PROJECT_KEY")
    email = os.getenv('DEMO_NAMESPACE') + "@launchdarkly.com"
    LD_PROJECT_NAME = f"LD Core Demo - {os.getenv('DEMO_NAMESPACE')}"

    demo = DemoBuilder(
        LD_API_KEY, email, LD_API_KEY_USER, LD_PROJECT_KEY, LD_PROJECT_NAME)
    
    demo.build()
