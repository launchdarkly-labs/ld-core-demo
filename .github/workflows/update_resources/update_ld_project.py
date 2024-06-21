import os
from pdb import run
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
import subprocess

def main():
    
    update_ld_project()
    
def update_ld_project():
    
    demo_namespace = os.getenv('DEMO_NAMESPACE')
    LD_API_KEY = os.getenv('LD_API_KEY')

    print('Update Cart Suggested Items Feature Flag Config')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag cartSuggestedItems --semantic-patch -d "$(cat ./.github/workflows/update_resources/cartSuggestedItems.json)"'
    runCommand(update_command)
    
    print('Delete Stocks API')
    update_command = f'ldcli flags delete --project {demo_namespace}-ld-demo --flag stocksAPI'
    runCommand(update_command)
    
    print('Delete Adjust Prompt for Wealth Insights FF')
    update_command = f'ldcli flags delete --project aqadri-ld-demo --flag aiPromptText'
    runCommand(update_command)
    
    print('Update 03 - Migrate ToggleBank Financial DB')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag financialDBMigration -d \'{{"patch":[{{"op":"replace","path":"/name","value":"03 - Migrate ToggleBank Financial DB"}}]}}\''
    runCommand(update_command)
    
    print('Update investment platform')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag release-new-investment-stock-api -d "$(cat ./.github/workflows/update_resources/release-new-investment-stock-api.json)"'
    runCommand(update_command)

    print('Update investment recent trade database')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag investment-recent-trade-db -d \'{{"patch":[{{"op":"replace","path":"/name","value":"05 - Release New Recent Trades DB"}}]}}\''
    runCommand(update_command)

    print('Delete Launch Club Loyalty FF')
    update_command = f'ldcli flags delete --project {demo_namespace}-ld-demo --flag launchClubLoyalty'
    runCommand(update_command)

    print('Delete Priority Boarding')
    update_command = f'ldcli flags delete --project {demo_namespace}-ld-demo --flag priorityBoarding'
    runCommand(update_command)

    print('Delete meal promo experience')
    update_command = f'ldcli flags delete --project {demo_namespace}-ld-demo --flag mealPromoExperience'
    runCommand(update_command)

    print('Update AI travel insights Name')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag aiTravelInsights -d \'{{"patch":[{{"op":"replace","path":"/name","value":"07 - Release AI Travel Insights"}}]}}\''
    runCommand(update_command)
    
    print('Create AI Prompt for Travel Insights')
    update_command = f'ldcli flags create --project aqadri-ld-demo -d "$(cat ./.github/workflows/update_resources/aiPromptTravelInsights.json)"'
    runCommand(update_command)
    
    print('Create Destination Recommendations')
    update_command = f'ldcli flags create --project {demo_namespace}-ld-demo -d "$(cat ./.github/workflows/update_resources/destinationRecommendation.json)"'
    runCommand(update_command)
    
    print ('Create AI Models for Chatbot FF')
    update_command = f'ldcli flags create --project {demo_namespace}-ld-demo -d "$(cat ./.github/workflows/update_resources/aiModelsForChatbot.json)"'
    runCommand(update_command)
    
    print('Update featured store headers')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag storeHeaders -d \'{{"patch":[{{"op":"replace","path":"/name","value":"10 - Featured Store Headers"}}]}}\''
    runCommand(update_command)

    print('Update store attention callout')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag storeAttentionCallout -d \'{{"patch":[{{"op":"replace","path":"/name","value":"11 - Store Highlight Text"}}]}}\''
    runCommand(update_command)

    print('Update cart suggested items')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag cartSuggestedItems -d \'{{"patch":[{{"op":"replace","path":"/name","value":"12 - Cart Suggested items"}}]}}\''
    runCommand(update_command)
    
    print('Create AI Chatbot Positive Feedback Metric')
    update_command = f'ldcli metrics create --project {demo_namespace}-ld-demo -d "$(cat ./.github/workflows/update_resources/aiChatbotPositiveFeedback.json)"'
    runCommand(update_command)
    
    print('Create AI Chatbot Negative Feedback Metric')
    update_command = f'ldcli metrics create --project {demo_namespace}-ld-demo -d "$(cat ./.github/workflows/update_resources/aiChatbotNegativeFeedback.json)"'
    runCommand(update_command)
    
def runCommand(command):
    
    while True:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True
        )
        response = result.stdout + result.stderr
        print(response)
        if 'Successfully' in response:
            return response
        if 'API rate limit' in response:
            print("API rate limit exceeded. Waiting for 5 seconds.")
            time.sleep(5)
        if 'error' in response:
            print(f"Failed to run command. Response ->  {response}")
            break
        
    
if __name__ == "__main__":
    main()