import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time


def main():

    return deleteLDProject()


def deleteLDProject():

    ld_api_key = os.getenv('LD_API_KEY')
    namespace = os.getenv('NAMESPACE')
    project_key = f"{namespace}-ld-demo"

    if not ld_api_key:
        print("LD_API_KEY not set")
        exit(1)
    
    if not namespace:
        print("NAMESPACE not set")
        exit(1)
    
    url = "https://app.launchdarkly.com/api/v2/projects/" + project_key
    headers = {"Authorization": ld_api_key}

    response = requests.delete(url, headers=headers)

    if response.status_code == 204:
        print(namespace + " project deleted successfully")
    else:
        data = response.json()
        print(data)

if __name__ == "__main__":
    main()
