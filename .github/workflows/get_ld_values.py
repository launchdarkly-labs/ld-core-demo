import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time

dotenv()


def main():

    return getLDEnvs()

def getLDEnvs():

    LD_API_KEY = os.getenv('LD_API_KEY')
    LD_ENV_KEY = os.getenv('LD_ENV_KEY')
    
    if LD_API_KEY is None:
        print("LD_API_KEY not set")
        exit(1)

    project_key = os.getenv('LD_ENV_KEY')
    environment_key = os.getenv('LD_API_KEY')
    url = "https://app.launchdarkly.com/api/v2/projects/" + project_key + "/environments/" + environment_key

    headers = {"Authorization": os.getenv('LD_API_KEY')}

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
		print('error: ' + str(resp.status_code))
		exit()
    
    else:
		data = response.json()
        for env in data:

            #For Reference
            sdk_key = env["apiKey"]
            client_key = env["_id"]
            
            return sdk_key, client_key


if __name__ == "__main__":
    main()