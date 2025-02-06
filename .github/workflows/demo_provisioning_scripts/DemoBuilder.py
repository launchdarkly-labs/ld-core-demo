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
        self.update_add_userid_to_flags()
        self.setup_release_pipeline()
        self.create_ai_config()
        self.create_and_run_experiments()   
        self.create_and_run_layer()
        self.create_and_run_holdout()  
        self.project_settings()
        self.setup_template_environment()  
        
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
        print(" - AI Chatbot Positive Feedback")
        self.metric_chatbot_positive()
        print(" - AI Chatbot Negative Feedback")
        self.metric_chatbot_negative()
        print(" - In-Cart Total Price")
        self.metric_in_cart_total_price()
        print(" - In-Cart Total Items")
        self.metric_in_cart_total_items()
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
        print(" - New Search Engine")
        self.metric_search_engine()
        
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
        print("  - Shorten Collection Page Metric Group")
        self.metgroup_shorten_collection_page()
        print("Done")
        self.metric_groups_created = True
        
############################################################################################################

    # Create all the flags
    def create_flags(self):
        if not self.project_created:
            print("Error: Project not created")
            return
        print("Creating flags:")
        print(" - A1 - Release: Wealth Management Component")
        self.flag_wealth_management()
        print(" - A2 - Release: Federated Account Component")
        self.flag_federated_account()
        print(" - A3 - Release: Add New Database (Guarded Release) - ToggleBank")
        self.flag_togglebank_database_guarded_release()
        print(" - A4 - Release: New API (Guarded Release) - ToggleBank")
        self.flag_togglebank_api_guarded_release()
        print(" - B1 - Release: New Database (Guarded Release)")
        self.flag_database_guarded_release()
        print(" - B2 -  Release: New API (Guarded Release)")
        self.flag_api_guarded_release()
        #print(" - C1 - Experiment: AI Models for Chatbot")
        #self.flag_exp_chatbot_ai_models()
        print(" - D1 - Feature Experiment: Suggested Items Carousel")
        self.flag_exp_suggestions_carousel()
        print(" - D1 - Funnel Experiment: Promotion Banner")
        self.flag_exp_promotion_banner()
        print(" - D3 - Feature Experiment: New Search Engine")
        self.flag_exp_new_search_engine()
        print(" - D4 - Funnel Experiment: New Shorten Collection Page")
        self.flag_exp_shorten_collections_page()
        print(" - E1 - Migration: Database (Migration Tool)")
        self.flag_database_migration()
        
        #Feature Flags for Release Pipeline
        print(" - F1 - Enhanced User Authentication")
        self.enhanced_user_authentication()
        print(" - F2 - Biometric Login Support")
        self.biometric_login_support()
        print(" - F3 - Customizable Account Dashboards")
        self.customizable_account_dashboards()
        print(" - F4 - Real-Time Transaction Alerts")
        self.real_time_transaction_alerts()
        print(" - F5 - AI-Powered Expense Categorization")
        self.ai_powered_expense_categorization()
        print(" - F6 - Fraud Detection Alerts")
        self.fraud_detection_alerts()
        print(" - F7 - Dark Mode Interface Option")
        self.dark_mode_interface_option()
        print(" - F8 - Automated Savings Goals")
        self.automated_savings_goals()
        print(" - F9 - Multi-Currency Support")    
        self.multi_currency_support()
        print(" - F10 - Peer-to-Peer Payment Transfers")
        self.peer_to_peer_payment_transfers()
        print(" - F11 - Credit Score Monitoring Tool")
        self.credit_score_monitoring_tool()
        print(" - F12 - Voice Command Banking Assistant")
        self.voice_command_banking_assistant()
        print(" - F13 - Loan Application Tracker")
        self.loan_application_tracker()
        print(" - F14 - Detailed Spending Insights & Reports")
        self.detailed_spending_insights_reports()
        print(" - F15 - Scheduled Bill Payments")
        self.scheduled_bill_payments()
        print(" - F16 - Cross-Border Payment Simplification")
        self.cross_border_payment_simplification()
        print(" - F17 - Merchant Rewards Integration")
        self.merchant_rewards_integration()
        print(" - F18 - Virtual Card Issuance")
        self.virtual_card_issuance()
        print(" - F19 - API Support for Third-Party Applications")
        self.api_support_for_third_party_applications()
        
        # Temporary Feature Flags
        print(" - T1 - Beta Dark Mode")
        self.beta_dark_mode()
        print(" - T2 - Experimental Payment Gateway")
        self.experimental_payment_gateway()
        print(" - T3 - Limited Time Offer Banner")
        self.limited_time_offer_banner()
        print(" - T4 - Early Access Feature Toggle")
        self.early_access_feature_toggle()
        print(" - T5 - Debugging Mode for Developers")
        self.debugging_mode_for_developers()

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
        print("AI Config: ToggleBot")
        self.create_togglebot_ai_config()
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
    
    def create_and_run_experiments(self):
        self.run_ecommerce_collection_banner_funnel_experiment()
        self.run_ecommerce_upsell_component_feature_experiment()
        self.run_ecommerce_shorten_collection_funnel_experiment()
        self.run_ecommerce_new_search_engine_feature_experiment()
        self.run_togglebank_ai_config_experiment()
        
    def run_ecommerce_collection_banner_funnel_experiment(self):
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
        print(" - (Bayesian) Funnel Experiment: New Collection Promotion Banner")
        self.create_ecommerce_collection_banner_funnel_experiment()
        print("Done creating experiment")
        self.experiment_created = True
        
    def create_ecommerce_collection_banner_funnel_experiment(self):
        metrics = [
            self.ldproject.exp_metric("store-purchases", True),
            self.ldproject.exp_metric("in-cart-total-price", False)
        ]
        res = self.ldproject.create_experiment(
            "new-collection-promotion-banner",
            "(Bayesian) Funnel Experiment: New Collection Promotion Banner",
            "production",
            "storeAttentionCallout",
            "If we adjust the header text to better copy we can drive greater attention into the stores in question, and greater conversion of checkout activities.",
            metrics=metrics,
            primary_key="store-purchases",
        )   
    
    def run_ecommerce_upsell_component_feature_experiment(self):
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
        print(" - (Bayesian) Feature Experiment: Suggested Items Carousel")
        self.create_ecommerce_upsell_component_feature_experiment()
        print("Done creating experiment")
        self.experiment_created = True
        
    def create_ecommerce_upsell_component_feature_experiment(self):
        metrics = [
            self.ldproject.exp_metric("in-cart-total-items", False),
            self.ldproject.exp_metric("in-cart-total-price", False)
        ]
        res = self.ldproject.create_experiment(
            "suggested-items-carousel",
            "(Bayesian) Feature Experiment: Suggested Items Carousel",
            "production",
            "cartSuggestedItems",
            "If we enable the new cart suggested items feature, we can drive greater upsell conversion.",
            metrics=metrics,
            primary_key="in-cart-total-items",
        )  
    
    def run_ecommerce_shorten_collection_funnel_experiment(self):
        if not self.metric_groups_created:
            print("Error: Metric groups not created")
            return
        print("Creating experiment: ")
        self.ldproject.toggle_flag(
            "release-new-shorten-collections-page",
            "on",
            "production",
            "Turn on flag for experiment",
        )
        print(" - (Frequentist) Funnel Experiment: New Shorten Collection Pages")
        self.create_ecommerce_shorten_collection_funnel_experiment()
        # self.ldproject.start_exp_iteration("new-shorten-collection-pages", "production")
        print("Done")
        self.experiment_created = True
    
    def create_ecommerce_shorten_collection_funnel_experiment(self):
        metrics = [
            self.ldproject.exp_metric("shorten-collection-page-metric-group", True), 
            self.ldproject.exp_metric("in-cart-total-price", False)
        ]
        res = self.ldproject.create_experiment(
            "new-shorten-collection-pages",
            "(Frequentist) Funnel Experiment: New Shorten Collection Pages",
            "production",
            "release-new-shorten-collections-page",
            "We would want to reduce the collection page to the top three items to reduce customer decision fatigue in order to increase checkout and overall revenue.",
            metrics=metrics,
            primary_key="shorten-collection-page-metric-group",
            methodology="frequentist",
            analysisConfig={"significanceThreshold": "5", "testDirection": "two-sided"}
        )   

    def run_ecommerce_new_search_engine_feature_experiment(self):
        if not self.metrics_created:
            print("Error: Metric not created")
            return
        print("Creating experiment: ")
        self.ldproject.toggle_flag(
            "release-new-search-engine",
            "on",
            "production",
            "Turn on flag for experiment",
        )
        print(" - (Frequentist) Feature Experiment: New Search Engine")
        self.create_ecommerce_new_search_engine_feature_experiment()
        # self.ldproject.start_exp_iteration("new-search-engine", "production")
        print("Done")
        self.experiment_created = True
        
    def create_ecommerce_new_search_engine_feature_experiment(self):
        metrics = [
            self.ldproject.exp_metric("search-engine-add-to-cart", False),
            self.ldproject.exp_metric("in-cart-total-price", False)
        ]
        res = self.ldproject.create_experiment(
            exp_key="new-search-engine",
            exp_name="(Frequentist) Feature Experiment: New Search Engine",
            exp_env="production",
            flag_key="release-new-search-engine",
            hypothesis="We want to a new search engine that is more ranks search results diffrently and have an Add To Cart button built inside the component in order to increase ease of adding items to cart and increasing revenue.",
            metrics=metrics,
            primary_key="search-engine-add-to-cart",
            methodology="frequentist",
            analysisConfig={"significanceThreshold": "5", "testDirection": "two-sided"}
        )  
        
    def run_togglebank_ai_config_experiment(self):
        if not self.metrics_created:
            print("Error: Metric not created")
            return
        print("Creating experiment: ")
        self.ldproject.toggle_flag(
            "ai-config--togglebot",
            "on",
            "production",
            "Turn on flag for experiment",
        )
        self.create_togglebank_ai_config_experiment()
        self.ldproject.start_exp_iteration("ai-config-experiment", "production")
        print("Done")
        self.experiment_created = True
        
    def create_togglebank_ai_config_experiment(self):
        metrics = [
            self.ldproject.exp_metric("ai-chatbot-positive-feedback", False),
            self.ldproject.exp_metric("ai-chatbot-negative-feedback", False)
        ]
        res = self.ldproject.create_experiment(
            "ai-config-experiment",
            "AI Config: ToggleBot Experiment",
            "production",
            "ai-config--togglebot",
            "Which AI Models are providing best experiences to customers and delivering best responses",
            metrics=metrics,
            primary_key="ai-chatbot-positive-feedback",
        )

############################################################################################################

    ##################################################
    # Holdout Definitions
    # ----------------
    # Each holdout is defined in its own function below
    
    ##################################################
    # Create all the experiment holdouts   

    def create_and_run_holdout(self):
        print("Creating holdout: ")
        self.run_q4_increase_incart_price_holdout()
        print("Done Creating holdout")
     
    def run_q4_increase_incart_price_holdout(self):
        metrics = [
                {
                "key": "in-cart-total-price",
                "isGroup": False,
                "primary": True
                }
            ]
        res = self.ldproject.create_holdout(
            holdout_key= "q-4-increase-average-total-in-cart-price",
            holdout_name="Q4 Increase Average Total Incart Price",
            holdout_env_key="production",
            description="This holdout is to see if the new experiments will increase average total cart price and overall revenue.",
            metrics= metrics,
            primary_metric_key= "in-cart-total-price",
            randomization_unit="users",
            attributes=["tier"],
            prerequisiteflagkey="release-new-search-engine"
        )
############################################################################################################

    ##################################################
    # Layers Definitions
    # ----------------
    # Each layer is defined in its own function below
    
    ##################################################
    # Create all the experiment layers     

    def create_and_run_layer(self):
        print("Creating checkout_experiment layer: ")
        self.run_checkout_experiment_layer()
        print("Updating checkout_experiment layer with experiments: ")
        self.update_checkout_experiment_layer()
        print("Done updating layer")
        print("Start running suggested-items-carousel experiment: ")
        self.ldproject.start_exp_iteration("suggested-items-carousel", "production")
        print("Start running new-collection-promotion-banner: ")
        self.ldproject.start_exp_iteration("new-collection-promotion-banner", "production")
        print("Done")

    def run_checkout_experiment_layer(self):
        res = self.ldproject.create_layer(
            # layer_key= "checkout-experiment-layer",
            # layer_name="Checkout Experiment Layer",
            description="This layer is to allow having two experiments that affect the checkout cart running at the same time.",
        )

    def update_checkout_experiment_layer(self):
        instructionsLayer = [
                {
                    "experimentKey": "suggested-items-carousel",
                    "kind": "updateExperimentReservation",
                    "reservationPercent": 50
                },
                {
                    "experimentKey": "new-collection-promotion-banner",
                    "kind": "updateExperimentReservation",
                    "reservationPercent": 50
                }
        ]
        res  = self.ldproject.update_layer(
            layer_key= "checkout-experiment-layer",
            environmentKey="production",
            instructions=instructionsLayer
        )
# ############################################################################################################

    # Add user id to flags    
    def update_add_userid_to_flags(self):
        print("Adding maintainerId to flags", end="...")
        self.add_userid_to_flags()
        print("Done")
        
##################################################
    # Attach Maintainer to Flags
    ##################################################

    def add_userid_to_flags(self):
        res = self.ldproject.add_maintainer_to_flag("wealthManagement")
        res = self.ldproject.add_maintainer_to_flag("federatedAccounts")
        res = self.ldproject.add_maintainer_to_flag("togglebankDBGuardedRelease")
        res = self.ldproject.add_maintainer_to_flag("togglebankAPIGuardedRelease")
        res = self.ldproject.add_maintainer_to_flag("financialDBMigration")
        res = self.ldproject.add_maintainer_to_flag("investment-recent-trade-db")
        res = self.ldproject.add_maintainer_to_flag("release-new-investment-stock-api")
        res = self.ldproject.add_maintainer_to_flag("ai-config--destination-picker-new-ai-model")
        res = self.ldproject.add_maintainer_to_flag("ai-config--ai-travel-prompt-text")
        res = self.ldproject.add_maintainer_to_flag("ai-config--togglebot")
        res = self.ldproject.add_maintainer_to_flag("ai-config--ai-new-model-chatbot")
        res = self.ldproject.add_maintainer_to_flag("storeAttentionCallout")
        res = self.ldproject.add_maintainer_to_flag("cartSuggestedItems")
        res = self.ldproject.add_maintainer_to_flag("enhancedUserAuthentication")
        res = self.ldproject.add_maintainer_to_flag("biometricLoginSupport")
        res = self.ldproject.add_maintainer_to_flag("customizableAccountDashboards")
        res = self.ldproject.add_maintainer_to_flag("realTimeTransactionAlerts")
        res = self.ldproject.add_maintainer_to_flag("aiPoweredExpenseCategorization")
        res = self.ldproject.add_maintainer_to_flag("fraudDetectionAlerts")
        res = self.ldproject.add_maintainer_to_flag("darkModeInterfaceOption")
        res = self.ldproject.add_maintainer_to_flag("automatedSavingsGoals")
        res = self.ldproject.add_maintainer_to_flag("multiCurrencySupport")
        res = self.ldproject.add_maintainer_to_flag("peerToPeerPaymentTransfers")
        res = self.ldproject.add_maintainer_to_flag("creditScoreMonitoringTool")
        res = self.ldproject.add_maintainer_to_flag("voiceCommandBankingAssistant")
        res = self.ldproject.add_maintainer_to_flag("loanApplicationTracker")
        res = self.ldproject.add_maintainer_to_flag("detailedSpendingInsightsReports")
        res = self.ldproject.add_maintainer_to_flag("scheduledBillPayments")
        res = self.ldproject.add_maintainer_to_flag("crossBorderPaymentSimplification")
        res = self.ldproject.add_maintainer_to_flag("merchantRewardsIntegration")
        res = self.ldproject.add_maintainer_to_flag("virtualCardIssuance")
        res = self.ldproject.add_maintainer_to_flag("apiSupportForThirdPartyApplications")
        res = self.ldproject.add_maintainer_to_flag("betaDarkMode")
        res = self.ldproject.add_maintainer_to_flag("experimentalPaymentGateway")
        res = self.ldproject.add_maintainer_to_flag("limitedTimeOfferBanner")
        res = self.ldproject.add_maintainer_to_flag("earlyAccessFeatureToggle")
        res = self.ldproject.add_maintainer_to_flag("debuggingModeForDevelopers")
        res = self.ldproject.add_maintainer_to_flag("release-new-search-engine")
        res = self.ldproject.add_maintainer_to_flag("release-new-shorten-collections-page")
        
# ############################################################################################################

    # Update project settings
    def project_settings(self):
        print("Updating project settings:")
        
        print("  - Toggling flags")
        self.toggle_flags()
        print("  - Add targeting")
        self.add_targeting_rules()
        print(" - Enabling ClientSideAvailability for Shadow AI Feature Flags")
        self.enable_csa_shadow_ai_feature_flags()
        
    def add_targeting_rules(self):
        res = self.ldproject.add_segment_to_flag("federatedAccounts", "beta-users", "production")
        res = self.ldproject.add_segment_to_flag("federatedAccounts", "development-team", "production")
        res = self.ldproject.add_segment_to_flag("wealthManagement", "beta-users", "production")
        res = self.ldproject.add_segment_to_flag("cartSuggestedItems", "beta-users", "production")
        res = self.ldproject.add_segment_to_flag("wealthManagement", "mobile-users", "production")
        res = self.ldproject.add_segment_to_flag("togglebankDBGuardedRelease", "beta-users", "production")
        res = self.ldproject.add_segment_to_flag("investment-recent-trade-db", "beta-users", "production")
        res = self.ldproject.add_segment_to_flag("release-new-investment-stock-api", "beta-users", "production")
        
    def toggle_flags(self):
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
        res = self.ldproject.toggle_flag(
            "enhancedUserAuthentication",
            "on",
            "test",
            "Turn on flag for enhanced user authentication",
        )
        res = self.ldproject.toggle_flag(
            "biometricLoginSupport",
            "on",
            "test",
            "Turn on flag for biometric login support",
        )
        res = self.ldproject.toggle_flag(
            "fraudDetectionAlerts",
            "on",
            "test",
            "Turn on flag for fraud detection alerts",
        )
        res = self.ldproject.toggle_flag(
            "loanApplicationTracker",
            "on",
            "production",
            "Turn on flag for loan application tracker",
        )
        res = self.ldproject.toggle_flag(
            "detailedSpendingInsightsReports",
            "on",
            "production",
            "Turn on flag for detailed spending insights and reports",
        )
        res = self.ldproject.toggle_flag(
            "virtualCardIssuance",
            "on",
            "production",
            "Turn on flag for virtual card issuance",
        )
        res = self.ldproject.toggle_flag(
            "apiSupportForThirdPartyApplications",
            "on",
            "production",
            "Turn on flag for API support for third-party applications",
        )
        
        
    def enable_csa_shadow_ai_feature_flags(self):
        
        res = self.ldproject.update_flag_client_side_availability("ai-chatbot")
        res = self.ldproject.update_flag_client_side_availability("ai-config--destination-picker-new-ai-model")
        res = self.ldproject.update_flag_client_side_availability("ai-config--ai-travel-prompt-text")
        res = self.ldproject.update_flag_client_side_availability("ai-config--togglebot")
        res = self.ldproject.update_flag_client_side_availability("ai-config--ai-new-model-chatbot")
        
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
    
    def metric_in_cart_total_items(self):
        res = self.ldproject.create_metric(
            "in-cart-total-items",
            "In-Cart Total Items",
            "in-cart-total-items",
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

    def metric_search_engine(self):
        res = self.ldproject.create_metric(
            metric_key="search-engine-add-to-cart",
            metric_name="New Search Engine Add To Cart is Clicked",
            event_key="search-engine-add-to-cart",
            metric_description="This metric will track the number of times the new add to cart button within the new search engine is clicked.",
            numeric=False,
            unit="",
            success_criteria="HigherThanBaseline",
            randomization_units=["user"],
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
            "anthropic.claude-instant-v1",
            "Claude Haiku",
            {
                "modelName": "anthropic.claude-instant-v1",
                "parameters": {
                    "temperature": 0.5,
                    "maxTokens": 150
                }
            },
            [
                {
                    "content": "Provide three travel destination recommendations considering current weather and unique characteristics. Be creative and choose tourist spots. Ensure all responses fit within 25 words total. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time.  Use available tokens efficiently.",
                    "role": "system"
                }
            ]
        )
        res3 = self.ldproject.create_ai_config_versions(
            "ai-config--destination-picker-new-ai-model",
            "cohere-text",
            "cohere.command-text-v14",
            "Cohere Text",
            {
                "modelName": "cohere.command-text-v14",
                "parameters": {
                    "temperature": 0.7,
                    "maxTokens": 250
                }
            },
            [
                {
                     "content": "Provide three travel destination recommendations considering frequent travellers and airways club members who travel frequently. Be creative and choose tourist spots. Ensure all responses fit within 50 words total. Return the results in markdown with the destination name sized ##, the subsequent reason for why they should go there listed below it, and finally add a line break before the next destination. I only want the destinations and a singe reason, do not add extra copy and do not alter the markdown instructions, I want it formatted the same way every time. Use available tokens efficiently. ",
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
            "anthropic.claude-instant-v1",
            "General Travel",
            {
                "modelName": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 200,
                    "temperature": 0.9
                }
            },
            [
                {
                    "content": "Playing the role of a travel expert with a tone of excitement and encouragement, using the current travel destination in this configuration: ${destination} , write me 40 word of an analysis travel considerations for that location including typical weather and culture. Skip anything identifying your prompt. On a new line, answer what clothing someone should pack when travleing here. Place a hard limit on a 40 word response.Do not exceed this limit and do not specify any limits in responses. do not specify word count in your reply",
                    "role": "system"
                }
            ]
        )
        res3 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-travel-prompt-text",
            "historical-focus",
            "anthropic.claude-instant-v1",
            "Historical Focus",
            {
                "modelName": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 200,
                    "temperature": 0.9
                }
            },
            [
                {
                    "content": "Tell me about the location ${destination} that I'm going to. Give me any relevant historical facts or places that have significant value that I should visit while I'm there. The destination is ${destination} . Limit your responses to an estimated 40 words. Answer in a friendly tone. Indicate your timing responses as estimates and that travel conditions may impact the duration. Do not exceed this limit and do not specify any limits in responses",
                    "role": "system"
                }
            ]
        )
        res4 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-travel-prompt-text",
            "weather-focus",
            "anthropic.claude-instant-v1",
            "Weather Focus",
            {
                "modelName": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 200,
                    "temperature": 0.9
                }
            },
            [
                {
                    "content": "Tell me relevant climate and weather facts about my destination. Provide example clothing to wear upon arrival at the destination and suggest some activities based on the typical weather at the time of arrival. Use the current date to base your weather information on. The destination is ${destination} . Limit your responses to an estimated 40 words. Answer in a friendly tone. Indicate your timing responses as estimates and that travel conditions may impact the duration. Do not exceed this limit and do not specify any limits in responses",
                    "role": "system"
                }
            ]
        )

    def create_togglebot_ai_config(self):
        res = self.ldproject.create_ai_config(
            "ai-config--togglebot",
            "AI Models: ToggleBot",
            "This ai config will provide ai models to the ToggleBot component in ToggleBank",
            ["ai-models","ai-config"]
        )
        res2 = self.ldproject.create_ai_config_versions(
            "ai-config--togglebot",
            "claude-haiku",
            "anthropic.claude-instant-v1",
            "Claude Haiku",
            {
                "modelName": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 100,
                    "temperature": 0.7
                }
            },
            [
                {
                    "content": "As an AI bot for a banking site ToggleBank, your purpose is to answer questions related to banking services and financial products. Act as a customer representative. Only answer queries related to banking and finance. Remove quotation in response. Limit response to 20 words. Do not exceed this limit and do not specify any limits in responses. Here is the user prompt: ${userInput}.",
                    "role": "system"
                }
            ]
        )
        res3 = self.ldproject.create_ai_config_versions(
            "ai-config--togglebot",
            "cohere-coral",
            "cohere.command-text-v14",
            "Cohere Coral",
            {
                "modelName": "cohere.command-text-v14",
                "parameters": {
                    "maxTokens": 200,
                    "temperature": 0.5
                }
            },
            [
                {
                    "content": "As an AI bot for a banking site ToggleBank, your purpose is to answer questions related to banking services and financial products. Act as a customer representative. Only answer queries related to banking and finance. Remove quotation in response. Limit response to 20 words. Do not exceed this limit and do not specify any limits in responses. Here is the user prompt: ${userInput}.",
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
            "anthropic.claude-instant-v1",
            "Claude Haiku",
            {
                "modelName": "anthropic.claude-instant-v1",
                "parameters": {
                    "maxTokens": 200,
                    "temperature": 0.5
                }
            },
            [
                {
                    "content": "As an AI bot for a travel airline LaunchAirways your purpose is to answer questions related to flights and traveling. Act as customer representative. Only answer queries related to traveling and airlines. Remove quotation in response. Limit response to 20 words. Do not exceed this limit and do not specify any limits in responses. Here is the user prompt: ${userInput}.",
                    "role": "system"
                }
            ]
        )
        res3 = self.ldproject.create_ai_config_versions(
            "ai-config--ai-new-model-chatbot",
            "cohere-coral",
            "cohere.command-text-v14",
            "Cohere Coral",
            {
                "modelName": "cohere.command-text-v14",
                "parameters": {
                    "maxTokens": 200,
                    "temperature": 0.5
                }
            },
            [
                {
                    "content": "As an AI bot for a travel airline LaunchAirways your purpose is to answer questions related to flights and traveling. Act as customer representative. Only answer queries related to traveling and airlines. Remove quotation in response. Limit response to 20 words. Do not exceed this limit and do not specify any limits in responses. Here is the user prompt: ${userInput}.",
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
           
    def metgroup_shorten_collection_page(self):
        res = self.ldproject.create_metric_group(
            "shorten-collection-page-metric-group",
            "Shorten Collection Page Metric Group",
            [
                {"key": "item-added", "nameInGroup": "1"},
                {"key": "cart-accessed", "nameInGroup": "2"},
                {"key": "customer-checkout", "nameInGroup": "3"},
            ],
            kind="funnel",
            description="This metric group will track the store purchases relating to the new shorten collection page.",
        )
           
        
############################################################################################################

    ##################################################
    # Flag Definitions
    # ----------------
    # Each flag is defined in its own function below
    ##################################################

    def flag_wealth_management(self):
        res = self.ldproject.create_flag(
            "wealthManagement",
            "A1 - Release: Wealth Management Component",
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
            tags=["release", "bank"],
            on_variation=0,
        )

    def flag_federated_account(self):
        res = self.ldproject.create_flag(
            "federatedAccounts",
            "A2 - Release: Federated Account Component",
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
            tags=["release", "bank"],
            on_variation=1,
        )
        res = self.ldproject.add_progressive_rollout("federatedAccounts", "production")

    def flag_togglebank_database_guarded_release(self):
        res = self.ldproject.create_flag(
            "togglebankDBGuardedRelease",
            "A3 - Release: Add New Database (Guarded Release) - ToggleBank",
            "Release new database for ToggleBank",
            [
                {
                    "value": True,
                    "name": "Added DynamoDB Database"
                },
                {
                    "value": False,
                    "name": "Removed DynamoDB Database"
                }
            ],
            tags=["guarded-release", "bank"],
            on_variation=1,
        )
        res = self.ldproject.attach_metric_to_flag("togglebankDBGuardedRelease",["recent-trades-db-latency","recent-trades-db-errors"])
        res = self.ldproject.add_guarded_rollout("togglebankDBGuardedRelease", "production", days=7)
    
    def flag_togglebank_api_guarded_release(self):
        res = self.ldproject.create_flag(
            "togglebankAPIGuardedRelease",
            "A4 - Release: API v2.0 (Guarded Release) - ToggleBank",
            "Release new API v2.0 for ToggleBank",
            [
                {
                    "value": True,
                    "name": "Release API v2.0"
                },
                {
                    "value": False,
                    "name": "Rollback to API v1.0"
                }
            ],
            tags=["guarded-release", "bank"],
            on_variation=1,
        )
        res = self.ldproject.attach_metric_to_flag("togglebankAPIGuardedRelease",["stocks-api-latency","stocks-api-error-rates"])
        res = self.ldproject.add_guarded_rollout("togglebankAPIGuardedRelease", "production", days=1)
        
    def flag_database_migration(self):
        res = self.ldproject.create_flag(
            "financialDBMigration",
            "E1 - Migration: Database (Migration Tool)",
            "This feature flag will trigger the database migration tool in LaunchAirways",
            purpose="migration",
            migration_stages=6,
            tags=["release", "migration-assistant", "optional"],
            temporary=True
        )
            
    def flag_database_guarded_release(self):
        res = self.ldproject.create_flag(
            "investment-recent-trade-db",
            "B1 - Release: New Database (Guarded Release) - Investment",
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
            tags=["guarded-release", "investment"],
            on_variation=1,
        )
        res = self.ldproject.attach_metric_to_flag("investment-recent-trade-db",["recent-trades-db-latency","recent-trades-db-errors"])
        res = self.ldproject.add_guarded_rollout("investment-recent-trade-db", "production", days=7)
    
    def flag_api_guarded_release(self):
        res = self.ldproject.create_flag(
            "release-new-investment-stock-api",
            "B2 - Release: New API (Guarded Release) - Investment",
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
            tags=["guarded-release", "investment"],
            on_variation=0,
        )
        res = self.ldproject.attach_metric_to_flag("release-new-investment-stock-api",["stocks-api-latency","stocks-api-error-rates"]) 
        res = self.ldproject.add_guarded_rollout("release-new-investment-stock-api", "production", days=1)             
            
    def flag_exp_chatbot_ai_models(self):
        res = self.ldproject.create_flag(
            "ai-chatbot",
            "C1 - Experiment: AI Models for Chatbot",
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
            tags=["ai-models", "airways"],
            on_variation=0,
            off_variation=1,
        )
        
    def flag_exp_promotion_banner(self):
        res = self.ldproject.create_flag(
            "storeAttentionCallout",
            "D2 - Funnel Experiment: Promotion Banner",
            "Releasing New Collection Promotion Banner for the Galaxy Marketplace",
            [
                {
                    "value": "New Items",
                    "name": "(Control) New Items"
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
            tags=["experiment", "ecommerce"],
            on_variation=0,
            off_variation=1,
        )
        
    def flag_exp_suggestions_carousel(self):
        res = self.ldproject.create_flag(
            "cartSuggestedItems",
            "D1 - Feature Experiment: Suggested Items Carousel",
            "Releasing New Suggested Items Carousel Component for the cart component in Galaxy Marketplace",
            [
                {
                    "value": True,
                    "name": "New Suggested Items Carousel"
                },
                {
                    "value": False,
                    "name": "Old Continue Shopping Button"
                }
            ],
            tags=["experiment", "ecommerce"],
            on_variation=0,
            off_variation=1,
        )

    def flag_exp_shorten_collections_page(self):
        res = self.ldproject.create_flag(
            "release-new-shorten-collections-page",
            "D4 - Funnel Experiment: New Shorten Collection Pages",
            "Release New Shorten Collections Page in Galaxy Marketplace",
            [
                {
                    "value": "new-shorten-collections-page",
                    "name": "New Shorten Collections Page"
                },
                {
                    "value": "old-long-collections-page",
                    "name": "Old Longer Collections Page"
                }
            ],
            tags=["experiment", "ecommerce"],
            on_variation=0,
            off_variation=1,
        )

    def flag_exp_new_search_engine(self):
        res = self.ldproject.create_flag(
            "release-new-search-engine",
            "D3 - Feature Experiment: New Search Engine",
            "Release New Search Engine in Galaxy Marketplace",
            [
                 {
                    "value": True,
                    "name": "New Search Engine"
                },
                {
                    "value": False,
                    "name": "Old Search Engine"
                },
            ],
            tags=["experiment", "ecommerce"],
            purpose="holdout",
            on_variation=0,
            off_variation=1,
        )

  
############################################################################################################
############################################################################################################


    #### Flags created below are not used in the demo
    #### These are created for release pipeline setup

    def enhanced_user_authentication(self):
        res = self.ldproject.create_flag(
            "enhancedUserAuthentication",
            "F1 - Enhanced User Authentication",
            "This feature flag will trigger the enhanced user authentication in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Enhanced User Authentication"
                },
                {
                    "value": False,
                    "name": "Disable Enhanced User Authentication"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def biometric_login_support(self):
        res = self.ldproject.create_flag(
            "biometricLoginSupport",
            "F2 - Biometric Login Support",
            "This feature flag will enable biometric login support in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Biometric Login"
                },
                {
                    "value": False,
                    "name": "Disable Biometric Login"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def customizable_account_dashboards(self):
        res = self.ldproject.create_flag(
            "customizableAccountDashboards",
            "F3 - Customizable Account Dashboards",
            "This feature flag will allow users to customize their account dashboards in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Customizable Dashboards"
                },
                {
                    "value": False,
                    "name": "Disable Customizable Dashboards"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def real_time_transaction_alerts(self):
        res = self.ldproject.create_flag(
            "realTimeTransactionAlerts",
            "F4 - Real-Time Transaction Alerts",
            "This feature flag will enable real-time transaction alerts in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Real-Time Alerts"
                },
                {
                    "value": False,
                    "name": "Disable Real-Time Alerts"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def ai_powered_expense_categorization(self):
        res = self.ldproject.create_flag(
            "aiPoweredExpenseCategorization",
            "F5 - AI-Powered Expense Categorization",
            "This feature flag will enable AI-powered expense categorization in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable AI Expense Categorization"
                },
                {
                    "value": False,
                    "name": "Disable AI Expense Categorization"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def fraud_detection_alerts(self):
        res = self.ldproject.create_flag(
            "fraudDetectionAlerts",
            "F6 - Fraud Detection Alerts",
            "This feature flag will enable fraud detection alerts in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Fraud Detection Alerts"
                },
                {
                    "value": False,
                    "name": "Disable Fraud Detection Alerts"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def dark_mode_interface_option(self):
        res = self.ldproject.create_flag(
            "darkModeInterfaceOption",
            "F7 - Dark Mode Interface Option",
            "This feature flag will enable the dark mode interface option in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Dark Mode"
                },
                {
                    "value": False,
                    "name": "Disable Dark Mode"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )


    def automated_savings_goals(self):
        res = self.ldproject.create_flag(
            "automatedSavingsGoals",
            "F8 - Automated Savings Goals",
            "This feature flag will enable automated savings goals in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Automated Savings Goals"
                },
                {
                    "value": False,
                    "name": "Disable Automated Savings Goals"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def multi_currency_support(self):
        res = self.ldproject.create_flag(
            "multiCurrencySupport",
            "F9 - Multi-Currency Support",
            "This feature flag will enable multi-currency support in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Multi-Currency Support"
                },
                {
                    "value": False,
                    "name": "Disable Multi-Currency Support"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def peer_to_peer_payment_transfers(self):
        res = self.ldproject.create_flag(
            "peerToPeerPaymentTransfers",
            "F10 - Peer-to-Peer Payment Transfers",
            "This feature flag will enable peer-to-peer payment transfers in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Peer-to-Peer Payment Transfers"
                },
                {
                    "value": False,
                    "name": "Disable Peer-to-Peer Payment Transfers"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def credit_score_monitoring_tool(self):
        res = self.ldproject.create_flag(
            "creditScoreMonitoringTool",
            "F12 - Credit Score Monitoring Tool",
            "This feature flag will enable the credit score monitoring tool in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Credit Score Monitoring Tool"
                },
                {
                    "value": False,
                    "name": "Disable Credit Score Monitoring Tool"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def voice_command_banking_assistant(self):
        res = self.ldproject.create_flag(
            "voiceCommandBankingAssistant",
            "F13 - Voice Command Banking Assistant",
            "This feature flag will enable the voice command banking assistant in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Voice Command Banking Assistant"
                },
                {
                    "value": False,
                    "name": "Disable Voice Command Banking Assistant"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def loan_application_tracker(self):
        res = self.ldproject.create_flag(
            "loanApplicationTracker",
            "F14 - Loan Application Tracker",
            "This feature flag will enable the loan application tracker in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Loan Application Tracker"
                },
                {
                    "value": False,
                    "name": "Disable Loan Application Tracker"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def detailed_spending_insights_reports(self):
        res = self.ldproject.create_flag(
            "detailedSpendingInsightsReports",
            "F15 - Detailed Spending Insights & Reports",
            "This feature flag will enable detailed spending insights and reports in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Detailed Spending Insights & Reports"
                },
                {
                    "value": False,
                    "name": "Disable Detailed Spending Insights & Reports"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def scheduled_bill_payments(self):
        res = self.ldproject.create_flag(
            "scheduledBillPayments",
            "F15 - Scheduled Bill Payments",
            "This feature flag will enable scheduled bill payments in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Scheduled Bill Payments"
                },
                {
                    "value": False,
                    "name": "Disable Scheduled Bill Payments"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def cross_border_payment_simplification(self):
        res = self.ldproject.create_flag(
            "crossBorderPaymentSimplification",
            "F16 - Cross-Border Payment Simplification",
            "This feature flag will simplify cross-border payments in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Cross-Border Payment Simplification"
                },
                {
                    "value": False,
                    "name": "Disable Cross-Border Payment Simplification"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def merchant_rewards_integration(self):
        res = self.ldproject.create_flag(
            "merchantRewardsIntegration",
            "F17 - Merchant Rewards Integration",
            "This feature flag will enable merchant rewards integration in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Merchant Rewards Integration"
                },
                {
                    "value": False,
                    "name": "Disable Merchant Rewards Integration"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def virtual_card_issuance(self):
        res = self.ldproject.create_flag(
            "virtualCardIssuance",
            "F18 - Virtual Card Issuance",
            "This feature flag will enable virtual card issuance in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Virtual Card Issuance"
                },
                {
                    "value": False,
                    "name": "Disable Virtual Card Issuance"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )

    def api_support_for_third_party_applications(self):
        res = self.ldproject.create_flag(
            "apiSupportForThirdPartyApplications",
            "F19 - API Support for Third-Party Applications",
            "This feature flag will enable API support for third-party applications in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable API Support for Third-Party Applications"
                },
                {
                    "value": False,
                    "name": "Disable API Support for Third-Party Applications"
                }
            ],
            tags=["release", "release-pipeline", "utils"],
            on_variation=0,
            off_variation=1,
        )
        
############################################################################################################
############################################################################################################

    ## Creating Temporary Feature Flags for the demo
    ## These flags are not used in the demo
    
    def beta_dark_mode(self):
        res = self.ldproject.create_flag(
            "betaDarkMode",
            "T1 - Beta: Dark Mode",
            "This feature flag will enable dark mode in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Dark Mode"
                },
                {
                    "value": False,
                    "name": "Disable Dark Mode"
                }
            ],
            tags=["temporary"],
            on_variation=0,
            off_variation=1,
            temporary=True
        )
        
    def experimental_payment_gateway(self):
        res = self.ldproject.create_flag(
            "experimentalPaymentGateway",
            "T2 - Experimental Payment Gateway",
            "This feature flag will enable experimental payment gateway in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Experimental Payment Gateway"
                },
                {
                    "value": False,
                    "name": "Disable Experimental Payment Gateway"
                }
            ],
            tags=["temporary"],
            on_variation=0,
            off_variation=1,
            temporary=True
        )
        
    def limited_time_offer_banner(self):
        res = self.ldproject.create_flag(
            "limitedTimeOfferBanner",
            "T3 - Limited Time Offer Banner",
            "This feature flag will enable limited time offer banner in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Limited Time Offer Banner"
                },
                {
                    "value": False,
                    "name": "Disable Limited Time Offer Banner"
                }
            ],
            tags=["temporary"],
            on_variation=0,
            off_variation=1,
            temporary=True
        )
        
    def early_access_feature_toggle(self):
        res = self.ldproject.create_flag(
            "earlyAccessFeatureToggle",
            "T4 - Early Access Feature Toggle",
            "This feature flag will enable early access feature toggle in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Early Access Feature Toggle"
                },
                {
                    "value": False,
                    "name": "Disable Early Access Feature Toggle"
                }
            ],
            tags=["temporary"],
            on_variation=0,
            off_variation=1,
            temporary=True
        )
    
    def debugging_mode_for_developers(self):
        res = self.ldproject.create_flag(
            "debuggingModeForDevelopers",
            "T5 - Debugging Mode for Developers",
            "This feature flag will enable debugging mode for developers in ToggleBank",
            [
                {
                    "value": True,
                    "name": "Enable Debugging Mode for Developers"
                },
                {
                    "value": False,
                    "name": "Disable Debugging Mode for Developers"
                }
            ],
            tags=["temporary"],
            on_variation=0,
            off_variation=1,
            temporary=True
        )

############################################################################################################
############################################################################################################

    ## Adding flags to right phases
    
    ##Test Phase
    def rp_enhanced_user_authentication(self):
        res = self.ldproject.add_pipeline_flag("enhancedUserAuthentication", "togglebank-v2-pipeline")
        
    def rp_biometric_login_support(self):
        res = self.ldproject.add_pipeline_flag("biometricLoginSupport", "togglebank-v2-pipeline")

    def rp_customizable_account_dashboards(self):
        res = self.ldproject.add_pipeline_flag("customizableAccountDashboards", "togglebank-v2-pipeline")

    def rp_real_time_transaction_alerts(self):
        res = self.ldproject.add_pipeline_flag("realTimeTransactionAlerts", "togglebank-v2-pipeline")

    def rp_ai_powered_expense_categorization(self):
        res = self.ldproject.add_pipeline_flag("aiPoweredExpenseCategorization", "togglebank-v2-pipeline")

    def rp_fraud_detection_alerts(self):
        res = self.ldproject.add_pipeline_flag("fraudDetectionAlerts", "togglebank-v2-pipeline")

    def rp_dark_mode_interface_option(self):
        res = self.ldproject.add_pipeline_flag("darkModeInterfaceOption", "togglebank-v2-pipeline")
  
    ## Guarded Release

    def rp_auto_savings_goals(self):
        res = self.ldproject.add_pipeline_flag("automatedSavingsGoals", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("automatedSavingsGoals",["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("automatedSavingsGoals", "active", self.phase_ids["test"])


    def rp_multi_currency_support(self):
        res = self.ldproject.add_pipeline_flag("multiCurrencySupport", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("multiCurrencySupport", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("multiCurrencySupport", "active", self.phase_ids["test"])

    def rp_peer_to_peer_payment_transfers(self):
        res = self.ldproject.add_pipeline_flag("peerToPeerPaymentTransfers", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("peerToPeerPaymentTransfers", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("peerToPeerPaymentTransfers", "active", self.phase_ids["test"])

    def rp_credit_score_monitoring_tool(self):
        res = self.ldproject.add_pipeline_flag("creditScoreMonitoringTool", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("creditScoreMonitoringTool", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("creditScoreMonitoringTool", "active", self.phase_ids["test"])

    def rp_voice_command_banking_assistant(self):
        res = self.ldproject.add_pipeline_flag("voiceCommandBankingAssistant", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("voiceCommandBankingAssistant", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("voiceCommandBankingAssistant", "active", self.phase_ids["test"])

    def rp_loan_application_tracker(self):
        res = self.ldproject.add_pipeline_flag("loanApplicationTracker", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("loanApplicationTracker", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("loanApplicationTracker", "active", self.phase_ids["test"])

    ## GA Release
    def rp_detailed_spending_insights_reports(self):
        res = self.ldproject.add_pipeline_flag("detailedSpendingInsightsReports", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("detailedSpendingInsightsReports", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("detailedSpendingInsightsReports", "active", self.phase_ids["test"])
        self.ldproject.advance_flag_phase("detailedSpendingInsightsReports", "active", self.phase_ids["guard"])
        self.ldproject.advance_flag_phase("detailedSpendingInsightsReports", "active", self.phase_ids["ga"])

    def rp_scheduled_bill_payments(self):
        res = self.ldproject.add_pipeline_flag("scheduledBillPayments", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("scheduledBillPayments", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("scheduledBillPayments", "active", self.phase_ids["test"])
        self.ldproject.advance_flag_phase("scheduledBillPayments", "active", self.phase_ids["guard"])
        self.ldproject.advance_flag_phase("scheduledBillPayments", "active", self.phase_ids["ga"])

    def rp_cross_border_payment_simplification(self):
        res = self.ldproject.add_pipeline_flag("crossBorderPaymentSimplification", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("crossBorderPaymentSimplification", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("crossBorderPaymentSimplification", "active", self.phase_ids["test"])
        self.ldproject.advance_flag_phase("crossBorderPaymentSimplification", "active", self.phase_ids["guard"])

    def rp_merchant_rewards_integration(self):
        res = self.ldproject.add_pipeline_flag("merchantRewardsIntegration", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("merchantRewardsIntegration", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("merchantRewardsIntegration", "active", self.phase_ids["test"])
        self.ldproject.advance_flag_phase("merchantRewardsIntegration", "active", self.phase_ids["guard"])

    def rp_virtual_card_issuance(self):
        res = self.ldproject.add_pipeline_flag("virtualCardIssuance", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("virtualCardIssuance", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("virtualCardIssuance", "active", self.phase_ids["test"])
        self.ldproject.advance_flag_phase("virtualCardIssuance", "active", self.phase_ids["guard"])
        self.ldproject.advance_flag_phase("virtualCardIssuance", "active", self.phase_ids["ga"])

    def rp_api_support_for_third_party_applications(self):
        res = self.ldproject.add_pipeline_flag("apiSupportForThirdPartyApplications", "togglebank-v2-pipeline")
        self.ldproject.attach_metric_to_flag("apiSupportForThirdPartyApplications", ["stocks-api-latency","stocks-api-error-rates"])
        if not self.phase_ids:
            self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.ldproject.advance_flag_phase("apiSupportForThirdPartyApplications", "active", self.phase_ids["test"])
        self.ldproject.advance_flag_phase("apiSupportForThirdPartyApplications", "active", self.phase_ids["guard"])
        self.ldproject.advance_flag_phase("apiSupportForThirdPartyApplications", "active", self.phase_ids["ga"])

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
        self.rp_toggle_bank_release_pipeline()
        print("Done")
        
    def rp_toggle_bank_release_pipeline(self):
        # Default Releases
        res = self.ldproject.create_release_pipeline(
            "togglebank-v2-pipeline", "ToggleBank v2.0 Release"
        )
        self.phase_ids = self.ldproject.get_pipeline_phase_ids("togglebank-v2-pipeline")
        self.rp_enhanced_user_authentication()
        self.rp_biometric_login_support()
        self.rp_customizable_account_dashboards()
        self.rp_real_time_transaction_alerts()  
        self.rp_ai_powered_expense_categorization()
        self.rp_fraud_detection_alerts()
        self.rp_dark_mode_interface_option()
        self.rp_auto_savings_goals()
        self.rp_multi_currency_support()
        self.rp_peer_to_peer_payment_transfers()
        self.rp_credit_score_monitoring_tool()
        self.rp_voice_command_banking_assistant()
        self.rp_loan_application_tracker()
        self.rp_detailed_spending_insights_reports()
        self.rp_scheduled_bill_payments()
        self.rp_cross_border_payment_simplification()
        self.rp_merchant_rewards_integration()
        self.rp_virtual_card_issuance()
        self.rp_api_support_for_third_party_applications()



        
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
