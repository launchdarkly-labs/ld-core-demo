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
    update_deploy_files()

def update_deploy_files():
    namespace = os.getenv('NAMESPACE')
    url = "{0}.launchdarklydemos.com".format(namespace)
    image_url = os.getenv('IMAGE')
    
    # Replace placeholders in the deploy file
    # Service name
    sed_command = ["sed -i 's|placeholder1|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(namespace)]
    subprocess.run(sed_command, shell=True)
    
    # Host URL
    sed_command = ["sed -i 's|placeholder2|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(url)]
    subprocess.run(sed_command, shell=True)
    
    # Service name for backend
    sed_command = ["sed -i 's|placeholder3|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(namespace)]
    subprocess.run(sed_command, shell=True)
    
    # Container image
    sed_command = ["sed -i 's|placeholder4|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(image_url)]
    subprocess.run(sed_command, shell=True)

if __name__ == "__main__":
    main()