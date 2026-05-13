import LDPlatform
import os
from dotenv import load_dotenv

load_dotenv()


class DemoBuilder:
    """Minimal LaunchDarkly demo provisioner: project + template environment only."""

    project_created = False
    client_id = ""
    sdk_key = ""

    def __init__(self, api_key, email, api_key_user, project_key, project_name):
        self.api_key = api_key
        self.email = email
        self.api_key_user = api_key_user
        self.project_key = project_key
        self.project_name = project_name
        self.ldproject = LDPlatform.LDPlatform(api_key, api_key_user, email)
        self.ldproject.project_key = project_key

    def build(self):
        """Create the LaunchDarkly project (production env + template-env via create_project)."""
        self.create_project()

    def create_project(self):
        if self.ldproject.project_exists(self.project_key):
            self.ldproject.delete_project()
        print("Creating project", end="...")
        self.ldproject.create_project(self.project_key, self.project_name)
        print("Done")
        self.client_id = self.ldproject.client_id
        self.sdk_key = self.ldproject.sdk_key
        self.project_created = True

        print("Creating template environment", end="...")
        self.ldproject.create_environment("template-env", "Template")

        env_file = os.getenv("GITHUB_ENV")
        if env_file:
            try:
                with open(env_file, "a") as f:
                    f.write(f"LD_SDK_KEY={self.sdk_key}\n")
                    f.write(f"LD_CLIENT_KEY={self.client_id}\n")
                    f.write(f"Projected_Created={self.project_created}\n")
            except OSError as e:
                print(f"Unable to write to environment file: {e}")
        else:
            print("GITHUB_ENV not set")


if __name__ == "__main__":
    LD_API_KEY = os.getenv("LD_API_KEY")
    LD_API_KEY_USER = os.getenv("LD_API_KEY_USER")
    LD_PROJECT_KEY = os.getenv("LD_PROJECT_KEY")
    email = os.getenv("DEMO_NAMESPACE") + "@launchdarkly.com"
    LD_PROJECT_NAME = f"LD Core Demo - {os.getenv('DEMO_NAMESPACE')}"

    demo = DemoBuilder(
        LD_API_KEY, email, LD_API_KEY_USER, LD_PROJECT_KEY, LD_PROJECT_NAME
    )

    demo.build()
