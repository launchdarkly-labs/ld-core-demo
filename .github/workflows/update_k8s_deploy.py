import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
import textwrap

def main():

    update_deploy_files()

def replace_placeholders(input_file, output_file, replacements):
    with open(input_file, "r") as f_in:
        with open(output_file, "w") as f_out:
            for line in f_in:
                for placeholder, value in replacements.items():
                    if placeholder in line:
                        line = textwrap.indent(value, line.index(placeholder) * ' ')
                f_out.write(line)

def update_deploy_files():

	create_folder = os.mkdir("./.github/workflows/deploy_files")

	namespace = os.getenv('NAMESPACE')
	url = "{0}.launchdarklydemos.com".format(namespace)
	image_url = "955116512041.dkr.ecr.us-east-1.amazonaws.com/ld-core-demo:{0}".format(os.getenv('IMAGE_TAG'))

	input_file = "./.github/workflows/deploy.yaml"
	output_file = "./.github/workflows/deploy_files/{0}-deploy.yaml".format(namespace)
	replacements = {
    "SERVICE_NAME": '  name: {0} \n'.format(namespace),
    "HOST_URL": '    - host: {0} \n'.format(url),
    "SERVICE_NAME_FOR_INGRESS": '        name: {0}\n'.format(namespace),
    "IMAGE_URL": '          image: {0} \n'.format(image_url)
	}
        
	replace_placeholders(input_file, output_file, replacements)

if __name__ == "__main__":
	main()