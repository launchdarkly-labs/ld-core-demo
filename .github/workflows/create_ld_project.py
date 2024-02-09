import os
import requests

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

    url = "https://app.launchdarkly.com/api/v2/projects/" + project_key
    headers = {"Authorization": ld_api_key}
    response = requests.get(url, headers=headers)    

    if response.status_code == 200:
        print(f"Project already exists for {namespace}")
        url = "https://app.launchdarkly.com/api/v2/projects/" + project_key + "/environments/" + namespace
        headers = {"Authorization": ld_api_key}
        response = requests.get(url, headers=headers)
        data = response.json()
        
        sdk_key = data['apiKey']
        client_key = data['_id']
        
        env_file = os.getenv('GITHUB_ENV')
        if env_file:
            try:
                with open(env_file, "a") as f:
                    f.write(f"LD_SDK_KEY={sdk_key}\n")
                    f.write(f"LD_CLIENT_KEY={client_key}\n")
                    exit(1)
            except IOError as e:
                print(f"Unable to write to environment file: {e}")
                exit(1)
        else:
            print("GITHUB_ENV not set")
            exit(1)



    if response.status_code == 404:
        url = "https://app.launchdarkly.com/api/v2/projects"

        payload = {
            "key": project_key,
            "name": f"LD Demo - {namespace}",
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": ld_api_key
        }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code == 201:
            environment_url = f"{url}/{project_key}/environments"
            environment_payload = {
                "color": "DADBEE",
                "key": namespace,
                "name": namespace
            }

            response = requests.post(environment_url, json=environment_payload, headers=headers)

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
                    except IOError as e:
                        print(f"Unable to write to environment file: {e}")
                        exit(1)
                else:
                    print("GITHUB_ENV not set")
                    exit(1)
        else:
            print(f"Failed to create project: {response.status_code}")
            print(response.text)
            exit(1)

if __name__ == "__main__":
    main()
