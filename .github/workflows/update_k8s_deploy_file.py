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
    tls_secret_name = "{0}-tls-secret".format(namespace)

    # Update service name
    sed_command = ["sed -i 's|placeholder1|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(namespace)]
    subprocess.run(sed_command, shell=True)

    # Update host/URL
    sed_command = ["sed -i 's|placeholder2|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(url)]
    subprocess.run(sed_command, shell=True)

    # Update service name reference
    sed_command = ["sed -i 's|placeholder3|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(namespace)]
    subprocess.run(sed_command, shell=True)

    # Update container image
    sed_command = ["sed -i 's|placeholder4|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(image_url)]
    subprocess.run(sed_command, shell=True)
    
    # Update TLS secret name
    sed_command = ["sed -i 's|placeholder-tls-secret|{0}|g' ./.github/workflows/deploy_files/deploy.yaml".format(tls_secret_name)]
    subprocess.run(sed_command, shell=True)

if __name__ == "__main__":
	main()