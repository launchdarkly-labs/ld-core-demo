import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
from create_ld_segments import createSegmentsForLDEnvs
from create_ld_metrics import createMetricsForLDProject

BASE_URL = "https://app.launchdarkly.com/api/v2"

def createContextKind(ld_api_key, project_key):

    key = "audience"
    url = "/projects/" + project_key + "/context-kinds/" + key

    payload = {
        "name": "audience",
        "description": "For creating experimentation results in the app",
        "hideInTargeting": False,
        "archived": False,
        "version": 1
    }
        
    response = requests.request("PUT", BASE_URL + url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))

    if response.status_code == 200:
        print("Context kind 'audience' updated successfully.")
        project_key = project_key
        url = "https://app.launchdarkly.com/api/v2/projects/" + project_key + "/experimentation-settings"
        
        payload = {
        "randomizationUnits": [
            {
            "randomizationUnit": "user",
            "default": True,
            "standardRandomizationUnit": "user"
            },
            {
            "randomizationUnit": "audience",
            "default": False,
            "standardRandomizationUnit": "user"
            }
        ]
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": ld_api_key,
            "LD-API-Version": "beta"

        }
        response = requests.put(url, json=payload, headers=headers)

        if response.status_code == 200:
            print("Experimentation settings updated successfully.")
        else:
            print(f"Failed to update experimentation settings: {response.status_code}")
            print(response.text)
            exit(1)
    else:
        print(f"Failed to update context kind 'audience': {response.status_code}")
        print(response.text)
        exit(1)
        
def main():
        
    ld_api_key = os.getenv('LD_API_KEY')
    namespace = os.getenv('NAMESPACE')
    project_key = f"{namespace}-ld-demo"


    if not ld_api_key:
        print("LD_API_KEY not set")
        exit(1)

    if not namespace:
        print("NAMESPACE not set")
        exit(1)

    response = requests.request("GET", BASE_URL + '/projects/' + project_key, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = None)
    
    if response.status_code == 200:
        print(f"Project already exists for {namespace}")
        response = requests.request("GET", BASE_URL + '/projects/' + project_key + '/environments/' + namespace, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = None)
        data = response.json()
        sdk_key = data['apiKey']
        client_key = data['_id']
        
        print(f"SDK Key: {sdk_key}")
        print(f"Client Key: {client_key}")
        
        env_file = os.getenv('GITHUB_ENV')
        if env_file:
            try:
                with open(env_file, "a") as f:
                    f.write(f"LD_SDK_KEY={sdk_key}\n")
                    f.write(f"LD_CLIENT_KEY={client_key}\n")
                    f.write(f"PROJECT_EXISTS=true\n")                    
            except IOError as e:
                print(f"Unable to write to environment file: {e}")
                exit(1)
        else:
            print("GITHUB_ENV not set")
            exit(1)

    if response.status_code == 404:
        print(f"Creating project and environment for {namespace}")
        payload = {
            "key": project_key,
            "name": f"LD Demo - {namespace}",
        }

        response = requests.request("POST", BASE_URL + "/projects", headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(payload))
        
        if response.status_code == 201:
            environment_url = f"/projects/{project_key}/environments"
            environment_payload = {
                "color": "DADBEE",
                "key": namespace,
                "name": namespace
            }

            response = requests.request("POST", BASE_URL + environment_url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(environment_payload))
            if response.status_code == 201:
                print(f"Project and Environment Created for {namespace}")
                data = response.json()

                sdk_key = data['apiKey']
                client_key = data['_id']
                env_file = os.getenv('GITHUB_ENV')
                if env_file:
                    try:
                        with open(env_file, "a") as f:
                            f.write(f"LD_SDK_KEY={sdk_key}\n")
                            f.write(f"LD_CLIENT_KEY={client_key}\n")
                            f.write(f"PROJECT_EXISTS=false\n")
                            createContextKind(ld_api_key, project_key)
                            createSegmentsForLDEnvs(namespace)
                            createMetricsForLDProject(ld_api_key)
                            
                    except IOError as e:
                        print(f"Unable to write to environment file: {e}")
                        exit(1)
                else:
                    print("GITHUB_ENV not set")
                    exit(1)

            print(f"Creating Template Environment for LD Demo - {namespace}")
            environment_url = f"/projects/{project_key}/environments"
            environment_payload = {
                "color": "DADBEE",
                "key": "template-env",
                "name": "template-env"
            }
            response = requests.request("POST", BASE_URL + environment_url, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(environment_payload))
            
            if response.status_code == 201:
                print(f"Template Environment Created for LD Demo - {namespace}")
                createSegmentsForLDEnvs("template-env")
                
            
                
        
if __name__ == "__main__":
    main()
