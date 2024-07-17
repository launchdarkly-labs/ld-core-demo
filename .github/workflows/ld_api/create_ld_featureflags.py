import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time

ld_api_key = os.getenv('LD_API_KEY')
namespace = os.getenv('NAMESPACE')
project_key = f"{namespace}-ld-demo"
BASE_URL = "https://app.launchdarkly.com/api/v2"


def main():
    
    createFederatedFeatureFlag()
    createWealthManagementFeatureFlag()
    createaiTravelPromptTextFeatureFlag()
    createAITravelInsightsFeatureFlag()
    createStoreHeadersFeatureFlag()
    createStoreAttentionCalloutFeatureFlag()
    createReleaseNewInvestmentStockApiFeatureFlag()
    createReleaseNewRecentTradesDBFeatureFlag()
    createCartSuggestedItemsFeatureFlag()
    createDestinationRecommendationFeatureFlag()
    createAIChatbotModelsFeatureFlag()
    createGovShowCardsSectionComponentFeatureFlag()
    createGovPatchShowCardsSectionComponentFeatureFlag()
    createGovShowHeroRedesignFeatureFlag()
    createGovShowDifferentHeroImageFeatureFlag()
 
def createAIChatbotModelsFeatureFlag():
    
    print("Creating AI chatbot models feature flag...")
    
    url = "/flags/" + project_key
    
    payload = {
        "name": "09 - LaunchAirways Chatbot (AI Models)",
        "key": "ai-chatbot",
        "description": "This feature flag will change AI models in real-time for the LaunchAirways Chatbotcomponent in LaunchAirways.",
        "clientSideAvailability": {
            "usingMobileKey": True,
            "usingEnvironmentId": True
        },
        "variations": [
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
        "tags": [
            "ai"
        ]
    }
    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("AI Chatbot feature flag created successfully.")
    
def createDestinationRecommendationFeatureFlag():
    
    print("Creating destination recommendation feature flag...")
    
    url = "/flags/" + project_key
    
    payload = {
        "name": "06 - Destination Recommendation (AI Models)",
        "key": "destination-picker-ai-model",
        "description": "This feature flag will change AI models in real-time for the destination recommendation component in LaunchAirways.",
        "clientSideAvailability": {
            "usingMobileKey": True,
            "usingEnvironmentId": True
        },
        "variations": [
            {
                "name": "Claude Haiku",
                "description": "This is Claude Haiku's AI model for quick response and cost saving",
                "value": 
                    {
                        "max_tokens": 200,
                        "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
                        "temperature": 0.5
                    }
                
            },
            {
                "name": "Cohere Text",
                "description": "This is Cohere's AI model for detailed response with cost of high tokens",
                "value": 
                    {
                        "max_tokens": 400,
                        "modelId": "cohere.command-text-v14",
                        "temperature": 0.7
                    }
                
            }
        ],
        "tags": [
            "ai"
        ]
    }
    
    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("Destination recommendation feature flag created successfully.")
    
    
      
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

    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
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

    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("Wealth management feature flag created successfully")
    
def createaiTravelPromptTextFeatureFlag():
        
    print("Creating AI prompt text feature flag...")
    
    url = "/flags/" + project_key

    payload = {
        "clientSideAvailability": {
            "usingEnvironmentId": True,
            "usingMobileKey": True
        },
        "key": "aiTravelPromptText",
        "name": "08 - AI Prompts for Travel Insights",
        "description": "This feature flag will change AI prompts in real-time for AI Travel Insights Component component in LaunchAirways.",
        "variations": [
                {
                    "value": "Playing the role of a travel expert with a tone of excitement and encouragement, using the current travel destination in this configuration: ${destination}, write me 40 word of an analysis travel considerations for that location including typical weather and culture. Skip anything identifying your prompt. On a new line, answer what clothing someone should pack when travleing here. Place a hard limit on a 40 word response.Do not exceed this limit. do not specify word count in your reply",
                    "name": "General Travel",
                    "description": "General Advisor"
                },
                {
                    "value": "Tell me about the location ${destination} that I'm going to. Give me any relevant historical facts or places that have significant value that I should visit while I'm there. The destination is ${destination}. Limit your responses to an estimated 40 words. Answer in a friendly tone. Indicate your timing responses as estimates and that travel conditions may impact the duration. do not specify word count in your reply",
                    "name": "Historical Focus",
                    "description": "Historical Advisor"
                },
                {
                    "value": "Tell me relevant climate and weather facts about my destination. Provide example clothing to wear upon arrival at the destination and suggest some activities based on the typical weather at the time of arrival. Use the current date to base your weather information on. The destination is ${destination}. Limit your responses to an estimated 40 words. Answer in a friendly tone. Indicate your timing responses as estimates and that travel conditions may impact the duration. do not specify word count in your reply",
                    "name": "Weather Focus",
                    "description": "Weather Advisor"
                }
            ],
        "defaults":{
            "onVariation": 0,
            "offVariation": 1
        },
        "tags": [
            "ai"
        ]
    }

    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("AI prompt text feature flag created successfully.")

def createAITravelInsightsFeatureFlag():
    
    print("Creating AI travel insights feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "aiTravelInsights",
    "name": "07 - Release AI Travel Insights",
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
        "ai"
    ]
    }
    
    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
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
    "name": "10 - Featured Store Headers",
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
    
    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
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
    "name": "11 - Store Highlight Text",
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
    
    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("Store attention callout feature flag created successfully.")
        
def createCartSuggestedItemsFeatureFlag():
    
    print("Creating cartSuggestedItems feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "cartSuggestedItems",
    "name": "12 - Cart Suggested items",
    "description": "Show suggested items in the cart",
     "variations": [
        {
            "value": True,
            "name": "Suggested Cart Component"
        },
        {
            "value": False,
            "name": "Continue Shopping Button"
        }
    ],
    "defaults":{
        "onVariation": 1,
        "offVariation": 1
    },
    "tags": [
        "experiment"
    ]
    }
    
    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("Cart Suggested items feature flag created successfully.")

def createReleaseNewInvestmentStockApiFeatureFlag():
        
    print("Creating release-new-investment-stock-api feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "release-new-investment-stock-api",
    "name": "04 - Release New Investment Stock Api",
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
    
    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
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
    "name": "05 - Release New Recent Trades DB",
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
    
    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("Release New Recent Trades DB feature flag created successfully.")


def createGovShowCardsSectionComponentFeatureFlag(): 
    
    print("Creating Show Cards Section Component [Gov Vertical] feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "show-cards-section-component",
    "name": "Show Cards Section Component [Gov Vertical]",
    "description": "Show Cards Section Component [Gov Vertical]",
    "variations": [
        {
            "value": True,
            "name": "Show Card Section"
        },
        {
            "value": False,
            "name": "Hide Card Section"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "government"
    ]
    }

    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("Show Cards Section Component [Gov Vertical] feature flag created successfully.")
    
def createGovPatchShowCardsSectionComponentFeatureFlag(): 
    
    print("Creating Patch Show Cards Section Component [Gov Vertical] feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "patch-show-cards-section-component",
    "name": "Patch Show Cards Section Component [Gov Vertical]",
    "description": "Patch Show Cards Section Component [Gov Vertical]",
    "variations": [
        {
            "value": True,
            "name": "Apply Patch"
        },
        {
            "value": False,
            "name": "Not Apply Patch"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "government"
    ]
    }

    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("SPatch Show Cards Section Component [Gov Vertical] feature flag created successfully.")
    
def createGovShowHeroRedesignFeatureFlag(): 
    
    print("[Experimentation] Show Hero Redesign [Gov Vertical] feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "show-hero-redesign",
    "name": "[Experimentation] Show Hero Redesign [Gov Vertical]",
    "description": "[Experimentation] Show Hero Redesign [Gov Vertical]",
    "variations": [
        {
            "value": "text-left",
            "name": "Show Text Left In Hero Component"
        },
        {
            "value": "text-right",
            "name": "Show Text Right In Hero Component"
        }
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "government"
    ]
    }

    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("[Experimentation] Show Hero Redesign [Gov Vertical] feature flag created successfully.")
    
def createGovShowDifferentHeroImageFeatureFlag(): 
    
    print("[Experimentation] Show Different Hero Image [Gov Vertical] feature flag...")
    
    url = "/flags/" + project_key

    payload = {
    "clientSideAvailability": {
        "usingEnvironmentId": True,
        "usingMobileKey": True
    },
    "key": "show-different-hero-image-string",
    "name": "[Experimentation] Show Different Hero Image [Gov Vertical]",
    "description": "[Experimentation] Show Different Hero Image [Gov Vertical]",
    "variations": [
        {
            "value": "imageA",
            "name": "imageA"
        },
        {
            "value": "imageB",
            "name": "imageB"
        },
         {
            "value": "imageC",
            "name": "imageC"
        },
    ],
    "defaults":{
        "onVariation": 0,
        "offVariation": 1
    },
    "tags": [
        "government"
    ]
    }

    response = requests.request("POST", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
    if(response.status_code == 201):
        print("[Experimentation] Show Different Hero Image [Gov Vertical] feature flag created successfully.")
    
if __name__ == "__main__":
    main()