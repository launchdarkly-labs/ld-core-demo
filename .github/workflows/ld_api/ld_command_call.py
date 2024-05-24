import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
import subprocess

def main():
    
    command = os.getenv('COMMAND')
    callCommand(command)
    
def callCommand(command):
    
    while True:
        try:
            result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if result.stdout.strip() == "You've exceeded the API rate limit. Try again later. (code: rate_limited)":
                time.sleep(5)
                continue
            return result.stdout
        except subprocess.CalledProcessError as e:
            print(f"An error occurred while executing the command: {e.stderr}")
            return None
    
    
if __name__ == "__main__":
    main()