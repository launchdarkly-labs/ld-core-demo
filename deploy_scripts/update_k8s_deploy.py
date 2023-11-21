import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time

def main():

    update_deploy_files()

def update_deploy_files():

	namespace = os.getenv('NAMESPACE')
	url = "{0}.launchdarklydemos.com".format(namespace)
	image_url = "955116512041.dkr.ecr.us-east-1.amazonaws.com/ld-core-demo:{0}".format(os.getenv('IMAGE_TAG'))

	input_file = os.path.join("./deploy_scripts/deploy.yaml")
	output_file = "./deploy_scripts/{0}-deploy.yaml".format(namespace)
	with open(input_file, "r") as f_in:
		with open(output_file, "w") as f_out:
			#Replace placeholders with values
			for line in f_in:
				if "SERVICE_NAME" in line:
					line = '  name: {0} \n'.format(namespace)
				if "HOST_URL" in line: 
					line = '    - host: {0} \n'.format(url)
				if "SERVICE_NAME_FOR_INGRESS" in line:
					line = '                name: {0} \n'.format(namespace)
				if "IMAGE_URL" in line:
					line = '          image: {0} \n'.format(image_url)
			    
				f_out.write(line)

if __name__ == "__main__":
	main()