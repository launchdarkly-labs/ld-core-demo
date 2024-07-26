import os
import re
from urllib import response
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
import sys

BASE_URL = "https://app.launchdarkly.com/api/v2"

def main():
    
    if len(sys.argv) > 1:
        ld_env_key = sys.argv[1]
        createSegmentsForLDEnvs(ld_env_key)
    
def createSegmentsForLDEnvs(ld_env_key):
    
    ld_api_key = os.getenv('LD_API_KEY')
    namespace = os.getenv('NAMESPACE')
    project_key = f"{namespace}-ld-demo"
    environment_key = ld_env_key
    
    createSegmentURL = "/segments/" + project_key + "/" + environment_key
    
    print("Creating Beta Users segment for " + environment_key + " environment")
    betaSegmentPayload = getBetaSegmentPayload()
    response = requests.request("POST", BASE_URL + createSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(betaSegmentPayload))
    if response.status_code == 201:
        print("Beta Users segment created successfully")
        patchBetaSegmentPayload(ld_api_key, environment_key, project_key)
    
    print("Creating Launch Club - Platinum segment for " + environment_key + " environment")
    platinumSegmentPayload = getPlatinumSegmentPayload()
    response = requests.request("POST", BASE_URL + createSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(platinumSegmentPayload))
    if response.status_code == 201:
        print("Launch Club - Platinum segment created successfully")
        patchPlatinumSegmentPayload(ld_api_key, environment_key, project_key)
    
    print("Creating Launch Club Entitlement segment for " + environment_key + " environment")
    entitlementSegmentPayload = getEntitlementSegmentPayload()
    response = requests.request("POST", BASE_URL + createSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(entitlementSegmentPayload))
    if response.status_code == 201:
        print("Launch Club Entitlement segment created successfully")
        patchEntitlementSegmentPayload(ld_api_key, environment_key, project_key)
    
    print("Creating Development Team Segment for " + environment_key + " environment")
    devTeamSegmentPayload = getDevTeamSegmentPayload()
    response = requests.request("POST", BASE_URL + createSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(devTeamSegmentPayload))
    if response.status_code == 201:
        print("Development Team segment created successfully")
        patchDevTeamSegmentPayload(ld_api_key, environment_key, project_key)
        
    print("Creating Device Segment " + environment_key + " environment")
    mobileSegmentPayload = getMobileSegmentPayload()
    response = requests.request("POST", BASE_URL + createSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(mobileSegmentPayload))
    if response.status_code == 201:
        print("Mobile segment created successfully")
        patchMobileSegmentPayload(ld_api_key, environment_key, project_key)
        
        
def patchMobileSegmentPayload(ld_api_key, environment_key, project_key):
    
    segment_key = "mobile-users"
    patchSegmentURL = "/segments/" + project_key + "/" + environment_key + "/" + segment_key
    
    patchPayload = {
        "patch":[
            {
            "op": "add",
            "path": "/rules/0",
            "value": {
                "clauses": [{ 
                    "contextKind": "device",
                    "attribute": "platform",
                    "op": "in",
                    "values": ["Mobile"],
                    "negate": False
                }]
            }
            }]
    }
    response = requests.request("PATCH", BASE_URL + patchSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(patchPayload))
    if response.status_code == 200:
        print("Patch for Development Team segment successful")
    
def patchDevTeamSegmentPayload(ld_api_key, environment_key, project_key):
    
    segment_key = "dev-team"
    patchSegmentURL = "/segments/" + project_key + "/" + environment_key + "/" + segment_key
    
    patchPayload = {
        "patch":[
            {
            "op": "add",
            "path": "/rules/0",
            "value": {
                "clauses": [{ 
                    "contextKind": "user",
                    "attribute": "role",
                    "op": "in",
                    "values": ["Developer"],
                    "negate": False
                }]
            }
            }]
    }
    response = requests.request("PATCH", BASE_URL + patchSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(patchPayload))
    if response.status_code == 200:
        print("Patch for Development Team segment successful")
        
def patchEntitlementSegmentPayload(ld_api_key, environment_key, project_key):
    
    segment_key = "launch-club-entitlement"
    patchSegmentURL = "/segments/" + project_key + "/" + environment_key + "/" + segment_key
    patchPayload = {
        "patch":[
            {
                "op": "add",
                "path": "/rules/0",
                "value": {
                    "clauses": [{ 
                        "contextKind": "user",
                        "attribute": "launchclub",
                        "op": "in",
                        "values": ["platinum", "standard"],
                        "negate": False
                    }]
                }
            }
        ]
    }
    
    response = requests.request("PATCH", BASE_URL + patchSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(patchPayload))
    if response.status_code == 200:
        print("Patch for Launch Club Entitlement segment successful")
    
def patchPlatinumSegmentPayload(ld_api_key, environment_key, project_key):
    
    segment_key = "launch-club-platinum"
    patchSegmentURL = "/segments/" + project_key + "/" + environment_key + "/" + segment_key
    patchPayload = {
        "patch":[
            {
                "op": "add",
                "path": "/rules/0",
                "value": {
                    "clauses": [{ 
                        "contextKind": "user",
                        "attribute": "launchclub",
                        "op": "in",
                        "values": ["platinum"],
                        "negate": False
                    }]
                }
            }
        ]
    }
    
    response = requests.request("PATCH", BASE_URL + patchSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(patchPayload))
    
    if response.status_code == 200:
        print("Patch for Launch Club - Platinum segment successful")

def patchBetaSegmentPayload(ld_api_key, environment_key, project_key):
    
    segment_key = "beta-users"
    patchSegmentURL = "/segments/" + project_key + "/" + environment_key + "/" + segment_key
    
    patchPayload = {
        "patch":[
            {
                "op": "add",
                "path": "/rules/0",
                "value": {
                    "clauses": [{ 
                        "contextKind": "user",
                        "attribute": "role",
                        "op": "in",
                        "values": ["Beta"],
                        "negate": False
                    }]
                }
            }
        ]
    }
    
    response = requests.request("PATCH", BASE_URL + patchSegmentURL, headers = {'Authorization': ld_api_key, 'Content-Type': 'application/json'}, data = json.dumps(patchPayload))
    
    if response.status_code == 200:
        print("Patch for Beta Users segment successful")


    
def getDevTeamSegmentPayload():
    
    payload = {
        "name": "Development Team",
        "key": "dev-team",
        "description": "Members of the internal development team",
        "tags": [
            "developmentTeam"
        ],
        "unbounded": False,
    }
    
    return payload
                
    
def getEntitlementSegmentPayload():
    
    payload = {
        "name": "Launch Club Entitlement",
        "key": "launch-club-entitlement",
        "description": "Launch Club Users - Standard or Platinum",
        "tags": [
            "launchClubMembers"
        ],
        "unbounded": False,
    }
    
    return payload
    

def getPlatinumSegmentPayload():
    
    payload = {
        "name": "Launch Club - Platinum",
        "key": "launch-club-platinum",
        "description": "Exclusive targeting for Platinum Launch Club users",
        "tags": [
            "launchClubLoyalty"
        ],
        "unbounded": False,
    }
    
    return payload

def getMobileSegmentPayload():
        
        payload = {
            "name": "Mobile Users",
            "key": "mobile-users",
            "description": "Users who have accessed the application via mobile device",
            "tags": [
                "Mobile"
            ],
            "unbounded": False,
        }
        
        return payload
    
def getBetaSegmentPayload():
    
    payload = {
        "name": "Beta Users",
        "key": "beta-users",
        "description": "Users who have signed up for Beta access to the application",
        "tags": [
            "beta"
        ],
        "unbounded": False,
    }
    
    return payload
    