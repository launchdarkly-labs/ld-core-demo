import os
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

    print('Update Cart Suggested Items Feature Flag Config')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag cartSuggestedItems --semantic-patch -d "$(cat ./.github/workflows/v.1.2.1/cartSuggestedItems.json)"'
    runCommand(update_command)
    
    print('Delete Stocks API')
    update_command = f'ldcli flags delete --project {demo_namespace}-ld-demo --flag stocksAPI'
    runCommand(update_command)
    
    print('Update investment platform')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag release-new-investment-stock-api -d "$(cat ./.github/workflows/v.1.2.1/release-new-investment-stock-api.json)"'
    runCommand(update_command)

    print('Update investment recent trade database')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag investment-recent-trade-db -d \'{{"patch":[{{"op":"replace","path":"/name","value":"06 - Release New Recent Trades DB"}}]}}\''
    runCommand(update_command)

    print('Update launch club loyalty')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag launchClubLoyalty -d \'{{"patch":[{{"op":"replace","path":"/name","value":"07 - Enable Launch Club Loyalty Program"}}]}}\''
    runCommand(update_command)

    print('Update priority boarding')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag priorityBoarding -d \'{{"patch":[{{"op":"replace","path":"/name","value":"08 - Launch Club - Priority Boarding"}}]}}\''
    runCommand(update_command)

    print('delete meal promo experience')
    update_command = f'ldcli flags delete --project {demo_namespace}-ld-demo --flag mealPromoExperience'
    runCommand(update_command)

    print('Update AI travel insights')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag aiTravelInsights -d \'{{"patch":[{{"op":"replace","path":"/name","value":"10 - Release AI Travel Insights"}}]}}\''
    runCommand(update_command)

    print('Update featured store headers')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag storeHeaders -d \'{{"patch":[{{"op":"replace","path":"/name","value":"11 - Featured Store Headers"}}]}}\''
    runCommand(update_command)

    print('Update store attention callout')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag storeAttentionCallout -d \'{{"patch":[{{"op":"replace","path":"/name","value":"12 - Store Highlight Text"}}]}}\''
    runCommand(update_command)

    print('Update cart suggested items')
    update_command = f'ldcli flags update --project {demo_namespace}-ld-demo --flag cartSuggestedItems -d \'{{"patch":[{{"op":"replace","path":"/name","value":"13 - Cart Suggested items"}}]}}\''
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