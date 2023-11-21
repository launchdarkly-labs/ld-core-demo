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
    
def replace_placeholders(file_path, replacements):
    sed_command = ["sed", "-i", "-e"]
    for placeholder, replacement in replacements.items():
        sed_command.extend(["s/{}/{}/g".format(placeholder, replacement)])
    sed_command.append(file_path)
    
    subprocess.run(sed_command)

def update_deploy_files():

	namespace = os.getenv('NAMESPACE')
	url = "{0}.launchdarklydemos.com".format(namespace)
	image_url = "955116512041.dkr.ecr.us-east-1.amazonaws.com/ld-core-demo:{0}".format(os.getenv('IMAGE_TAG'))
	# Example usage
	file_path = "./.github/workflows/deploy_files/deploy.yaml"
	replacements = {
		"placeholder1": "{0}".format(namespace),
		"placeholder2": "{0}".format(url),
		"placeholder3": "{0}".format(namespace),
		"placeholder4": "{0}".format(image_url)
	}
        
	replace_placeholders(file_path, replacements)

if __name__ == "__main__":
	main()