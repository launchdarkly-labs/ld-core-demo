import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
from ld_api_call import checkRateLimit

ld_api_key = os.getenv('LD_API_KEY')
namespace = os.getenv('NAMESPACE')
project_key = f"{namespace}-ld-demo"

def main():
    
    createFederatedFeatureFlag()
    createStocksAPIFeatureFlag()
    createWealthManagementFeatureFlag()
    createAIPromptTextFeatureFlag()
    createLaunchClubLoyaltyFeatureFlag()
    createPriorityBoardFeatureFlag()
    createMealPromoExperienceFeatureFlag()
    createAITravelInsightsFeatureFlag()
    createStoreHeadersFeatureFlag()
    createStoreAttentionCalloutFeatureFlag()
    
   
def createFederatedFeatureFlag(): 
    
    print("Creating federated feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "federatedAccounts",
    "name": "01 - Release Federated Account Access",
    "description": "Release New External Account Federation",
    "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "release"
    ]
    }

    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Federated feature flag created successfully.")
    

        
def createWealthManagementFeatureFlag():
    
    print("Creating wealth management feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "wealthManagement",
    "name": "02 - Release Wealth Management Module",
    "description": "Release the new Wealth Management components",
    "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 1,
        "offVariation": 1
    },
    "tags": [
        "release"
    ]
    }

    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Wealth management feature flag created successfully")
    
def createAIPromptTextFeatureFlag():
        
    print("Creating AI prompt text feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "aiPromptText",
    "name": "03 - Adjust Prompts for Wealth Insights",
    "description": "Tune and release new prompts for the AWS Bedrock powered Wealth Insights API",
    "variations": [
        {
            "value": "Playing the role of a financial analyst, using the data contained within the information set at the end of this prompt, write me 50 word of an analysis of the data and highlight the item I spend most on. Skip any unnecessary explanations. Summarize the mostly costly area im spending at. Your response should be tuned to talking directly to the requestor. Hard constraint on a maximum of 50 words. Financial data is next - ",
            "name": "Baseline"
        },
        {
            "value": "Playing the role of a financial analyst specializing in maximizing financial savings, using the data contained within the information set at the end of this prompt, write me 50 words focused on how I could adjust spending to improve my financial situation. Provide 2 areas I should reduce spending to improve my financial situation. Your response should be tuned to talking directly to the requestor. Hard constraint on a maximum of 50 words. Financial data is next - ",
            "name": "Aggressive Savings"
        },
        {
            "value": "Throw caution to the wind. Play the role of a financially irresponsible individual, who is looking to party in vegas for a weekend without regrets. Using the data contained within the information set at the end of this prompt, write me 50 words focused on how I could build hype in my life at Vegas this year. Provide 2 safe-for-work suggestions for me to spend additional money on to amplify my lifestyle. Your response should be tuned to talking directly to the requestor. Financial data is next - ",
            "name": "Chaos Savings"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "release"
    ]
    }

    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("AI prompt text feature flag created successfully.")
    
def createLaunchClubLoyaltyFeatureFlag():
    
    print("Creating Launch Club Loyalty feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "launchClubLoyalty",
    "name": "05 - Enable Launch Club Loyalty Program",
    "description": "Enable Launch Club Loyalty Program on ToggleAirlines",
     "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "target"
    ]
    }

    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Launch Club Loyalty flag created successfully.")

def createPriorityBoardFeatureFlag():
    
    print("Creating priority board feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "priorityBoarding",
    "name": "06 - Launch Club - Priority Boarding",
    "description": "Enable Launch Club Priority Program on ToggleAirlines",
     "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "target"
    ]
    }

    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Priority Boarding feature flag created successfully.")
    
def createMealPromoExperienceFeatureFlag():
    
    print("Creating meal promo experience feature flag...")
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "mealPromoExperience",
    "name": "07 - Targeted Plane Meal Promotion",
    "description": "Rolling our meal service on our A380 aircraft - free promotion for testing",
     "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "target"
    ]
    }

    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Meal promo experience feature flag created successfully.")
    
def createAITravelInsightsFeatureFlag():
    
    print("Creating AI travel insights feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "aiTravelInsights",
    "name": "08 - Release AI Travel Insights",
    "description": "Amazon Bedrock Powered Travel Insights",
     "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "target"
    ]
    }
    
    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("AI travel insights feature flag created successfully.")
    
def createStoreHeadersFeatureFlag():
    
    print("Creating store headers feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "storeHeaders",
    "name": "09 - Featured Store Headers",
    "description": "Headers to drive engagement on specific stores",
     "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "experiment"
    ]
    }
    
    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Store headers feature flag created successfully.")
    
def createStoreAttentionCalloutFeatureFlag():
    
    print("Creating store attention callout feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "storeAttentionCallout",
    "name": "10 - Store Highlight Text",
    "description": "Header Text for Marketplace Stores",
     "variations": [
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
            "name": "Final Hours"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 0
    },
    "tags": [
        "experiment"
    ]
    }
    
    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Store attention callout feature flag created successfully.")
    
def createStocksAPIFeatureFlag():
        
    print("Creating stocks API feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "stocksAPI",
    "name": "11 - Release Stocks API",
    "description": "Release New Stocks API",
     "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "release"
    ]
    }
    
    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Stocks API feature flag created successfully.")

def createReleaseNewInvestmentStockApiFeatureFlag():
        
    print("Creating release-new-investment-stock-api feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "release-new-investment-stock-api",
    "name": "12 - Release New Investment Stock Api",
    "description": "Release New Investment Stock Api",
     "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "remediate"
    ]
    }
    
    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Release New Investment Stock Api feature flag created successfully.")

def createReleaseNewRecentTradesDBFeatureFlag():
        
    print("Creating investment-recent-trade-db feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "investment-recent-trade-db",
    "name": "13 - Release New Recent Trades DB",
    "description": "Release New Recent Trades DB",
     "variations": [
        {
            "value": True,
            "name": "Available"
        },
        {
            "value": False,
            "name": "Unavailable"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "remediate"
    ]
    }
    
    response = checkRateLimit("POST", url, ld_api_key, json.dumps(payload))
    if(response.status_code == 201):
        print("Release New Recent Trades DB feature flag created successfully.")

        
if __name__ == "__main__":
    main()