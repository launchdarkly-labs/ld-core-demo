"""
LaunchDarkly API Utilities
Helper functions to interact with LaunchDarkly Management API
"""
import requests
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s'
)

class LaunchDarklyAPIClient:
    """Client for interacting with LaunchDarkly Management API"""
    
    def __init__(self, api_token):
        self.api_token = api_token
        self.base_url = "https://app.launchdarkly.com/api/v2"
        self.headers = {
            "Authorization": api_token,
            "Content-Type": "application/json"
        }
    
    def get_project_environment_keys(self, project_key, environment_key="production"):
        """
        Retrieve SDK key and credentials for a specific project environment
        
        Args:
            project_key: The project key (e.g., "mgarza-ld-demo")
            environment_key: The environment key (default: "production")
            
        Returns:
            dict: Contains sdk_key, mobile_key, and client_id
                  Returns None if project doesn't exist
        """
        try:
            url = f"{self.base_url}/projects/{project_key}/environments/{environment_key}"
            
            logging.info(f"Fetching credentials for project: {project_key}")
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code == 404:
                logging.warning(f"Project {project_key} not found")
                return None
            
            response.raise_for_status()
            env_data = response.json()
            
            credentials = {
                "project_key": project_key,
                "environment_key": environment_key,
                "sdk_key": env_data.get("apiKey"),
                "mobile_key": env_data.get("mobileKey"),
                "client_id": env_data.get("id")
            }
            
            logging.info(f"Successfully retrieved credentials for {project_key}")
            return credentials
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching credentials for {project_key}: {str(e)}")
            return None
    
    def project_exists(self, project_key):
        """Check if a LaunchDarkly project exists"""
        try:
            url = f"{self.base_url}/projects/{project_key}"
            response = requests.get(url, headers=self.headers, timeout=10)
            return response.status_code == 200
        except Exception as e:
            logging.error(f"Error checking project {project_key}: {str(e)}")
            return False


def construct_project_key_from_username(username):
    """
    Construct LaunchDarkly project key from username
    Pattern: {username}-ld-demo
    Example: mgarza -> mgarza-ld-demo
    """
    return f"{username}-ld-demo"
