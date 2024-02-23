import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time

def main():
    
    return createMigrationFlag()

def createMigrationFlag():
    
    ld_api_key = os.getenv('LD_API_KEY')
    namespace = os.getenv('NAMESPACE')
    project_key = f"{namespace}-ld-demo"

    if not ld_api_key:
        print("LD_API_KEY not set")
        exit(1)
        
    if not namespace:
        print("NAMESPACE not set")
        exit(1)
    
    url = "https://app.launchdarkly.com/api/v2/flags/" + project_key

    payload = {
        "name": "04 - Migrate ToggleBank Financial DB",
        "key": "financialDBMigration",
        "clientSideAvailability": {
            "usingEnvironmentId": True,
            "usingMobileKey": True
        },     
        "description": "Migrate to new financial database for extended records",
        "tags": [
            "release"
        ],
        "purpose": "migration",
        "migrationSettings": {
            "stageCount": 2,
        }
    }

    headers = {
    "Content-Type": "application/json",
    "Authorization": ld_api_key,
    "LD-API-Version": "beta"
    }
    
    while True:
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 201:
            print("Financial DB migration flag created successfully")
            break
        elif response.status_code == 429:
            print("Rate limit exceeded, waiting 10 seconds to retry...")
            time.sleep(10)
        else:
            data = response.json()
            print(data)
            break
        
if __name__ == "__main__":
    main()
