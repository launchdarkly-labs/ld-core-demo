import os
from results_generator import generate_results

def main():
    project_key = os.environ.get("LD_PROJECT_KEY")
    api_key = os.environ.get("LD_API_KEY")

    if not project_key or not api_key:
        raise ValueError("LD_PROJECT_KEY and LD_API_KEY must be set in environment variables.")

    print(f"Running generators for project: {project_key}")
    generate_results(project_key, api_key)
    print("All generators completed.")

if __name__ == "__main__":
    main() 