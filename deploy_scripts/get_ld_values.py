import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time


def main():

    return getLDEnvs()

def getLDEnvs():

    LD_API_KEY = os.getenv('LD_API_KEY')
    LD_ENV_KEY = os.getenv('LD_ENV_KEY')
    
    if LD_API_KEY is None:
        print("LD_API_KEY not set")
        exit(1)

    url = 'https://app.launchdarkly.com/api/v2/projects/' + LD_ENV_KEY + '/environments'
    headers = {
        'Authorization': LD_API_KEY,
        'Content-Type': "application/json",
        'cache-control': "no-cache"
    }
    response = requests.request("GET", url, headers=headers)
    envs = json.loads(response.text)


    for env in envs:

		#For Reference
        sdk_key = env["apiKey"]
        client_key = env["_id"]
        
        return sdk_key, client_key


if __name__ == "__main__":
    main()