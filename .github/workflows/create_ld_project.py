import os
import requests
from ruamel.yaml import YAML


def main():

    return createLDProjectWithEnvironment()

def createLDProjectWithEnvironment():

    LD_API_KEY = os.getenv('LD_API_KEY')
    NAMESPACE = os.getenv('NAMESPACE')

    if LD_API_KEY is None:
        print("LD_API_KEY not set")
        exit(1)

    if NAMESPACE is None:
        print("NAMESPACE not set")
        exit(1)
    
    url = "https://app.launchdarkly.com/api/v2/projects"

    project_key = NAMESPACE + "-ld-demo"

    payload = {
        "key": project_key,
        "name": "LD Demo - " + NAMESPACE,
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": LD_API_KEY
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 201:

        url = "https://app.launchdarkly.com/api/v2/projects/" + project_key + "/environments"

        payload = {
            "color": "DADBEE",
            "key": NAMESPACE,
            "name": NAMESPACE
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": LD_API_KEY
        }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code == 201:
            print("Project and Environment Created for " + NAMESPACE)
            data = response.json()

            sdk_key = data['apiKey']
            client_key = data['_id']

            env_file = os.getenv('GITHUB_ENV')
            with open(env_file, "a") as f:
                f.write(f"LD_SDK_KEY={sdk_key}\n")
                f.write(f"LD_CLIENT_KEY={client_key}\n")

if __name__ == "__main__":
    main()
            



            

        




        
