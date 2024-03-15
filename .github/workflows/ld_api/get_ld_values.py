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

   
    url = "https://app.launchdarkly.com/api/v2/projects/ld-core-demo/environments/" + LD_ENV_KEY

    headers = {"Authorization": LD_API_KEY}

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print('error: ' + str(response.status_code))
        exit()

    else:
        sdk_key = response.json().get('apiKey')
        client_key = response.json().get('_id')
        print(f"{sdk_key}")
        print(f"{client_key}")


if __name__ == "__main__":
    main()