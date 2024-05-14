import os
import requests
import json
import shutil
from ruamel.yaml import YAML
import yaml
import base64
import time
from ld_api_call import checkRateLimit
import sys

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
    checkRateLimit("POST", createSegmentURL, ld_api_key, json.dumps(betaSegmentPayload))
    patchBetaSegmentPayload(ld_api_key, environment_key, project_key)
    
    print("Creating A380 Passengers segment for " + environment_key + " environment")
    a380SegmentPayload = getA380SegmentPayload()
    checkRateLimit("POST", createSegmentURL, ld_api_key, json.dumps(a380SegmentPayload))
    patchA380SegmentPayload(ld_api_key, environment_key, project_key)
    
    print("Creating Launch Club - Platinum segment for " + environment_key + " environment")
    platinumSegmentPayload = getPlatinumSegmentPayload()
    checkRateLimit("POST", createSegmentURL, ld_api_key, json.dumps(platinumSegmentPayload))
    patchPlatinumSegmentPayload(ld_api_key, environment_key, project_key)
    
    print("Creating Launch Club Entitlement segment for " + environment_key + " environment")
    entitlementSegmentPayload = getEntitlementSegmentPayload()
    checkRateLimit("POST", createSegmentURL, ld_api_key, json.dumps(entitlementSegmentPayload))
    patchEntitlementSegmentPayload(ld_api_key, environment_key, project_key)
    
    print("Development Team Segments created successfully for " + environment_key + " environment")
    devTeamSegmentPayload = getDevTeamSegmentPayload()
    checkRateLimit("POST", createSegmentURL, ld_api_key, json.dumps(devTeamSegmentPayload))
    patchDevTeamSegmentPayload(ld_api_key, environment_key, project_key)
    
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
    
    response = checkRateLimit("PATCH", patchSegmentURL, ld_api_key, json.dumps(patchPayload))

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
    
    response = checkRateLimit("PATCH", patchSegmentURL, ld_api_key, json.dumps(patchPayload))
    
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
    
    response = checkRateLimit("PATCH", patchSegmentURL, ld_api_key, json.dumps(patchPayload))
    
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
    
    response = checkRateLimit("PATCH", patchSegmentURL, ld_api_key, json.dumps(patchPayload))
    
    if response.status_code == 200:
        print("Patch for Beta Users segment successful")

def patchA380SegmentPayload(ld_api_key, environment_key, project_key):
    
    segment_key = "airline-a-390-passengers"
    patchSegmentURL = "/segments/" + project_key + "/" + environment_key + "/" + segment_key
    
    patchPayload = {
        "patch":[
            {
                "op": "add",
                "path": "/rules/0",
                "value": {
                    "clauses": [{ 
                        "contextKind": "experience",
                        "attribute": "airplane",
                        "op": "in",
                        "values": ["a380"],
                        "negate": False
                    }]
                }
            }
        ]
    }
    
    response = checkRateLimit("PATCH", patchSegmentURL, ld_api_key, json.dumps(patchPayload))
    
    if response.status_code == 200:
        print("Patch for A380 Passengers segment successful")
    
    
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
    
def getA380SegmentPayload():
    
    payload = {
        "name": "A380 Passengers",
        "key": "airline-a-390-passengers",
        "description": "Any user who is flying on an A380 Airplane",
        "tags": [
            "A380-passengers"
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
    