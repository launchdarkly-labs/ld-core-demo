import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time


def main():

    return createMetricGroup()

def createMetricGroup():

    ld_api_key = os.getenv('LD_API_KEY')
    namespace = os.getenv('NAMESPACE')
    project_key = f"{namespace}-ld-demo"

    if not ld_api_key:
        print("LD_API_KEY not set")
        exit(1)
    
    if not namespace:
        print("NAMESPACE not set")
        exit(1)

    url = "https://app.launchdarkly.com/api/v2/projects/" + project_key + "/metric-groups"

    payload = {
        "key": "store-checkout-metrics",
        "name": "Store Purchases",
        "kind": "funnel",
        "maintainerId": "6127d90d9971632664df6f1a",
        "tags": [
            "store-checkout"
        ],
        "metrics": [
            {
                "key": "store-accessed",
                "nameInGroup": "Step 1"
            },
            {
                "key": "item-added",
                "nameInGroup": "Step 2"
            },
            {
                "key": "cart-accessed",
                "nameInGroup": "Step 3"
            },
            {
                "key": "customer-checkout",
                "nameInGroup": "Step 4"
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": ld_api_key,
        "LD-API-Version": "beta"
    }
    
    
    
    while True:
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 201:
            print("Metric Group created successfully")
            break
        elif response.status_code == 429:
            print("Rate limit exceeded, waiting 10 seconds to retry...")
            time.sleep(10)
        else:
            data = response.json()
            print(response.status_code)
            print(response.text)
            print(data)
            break
       
if __name__ == "__main__":
    main()