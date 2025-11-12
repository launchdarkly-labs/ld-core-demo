import requests
import json
import time
import uuid


class LDPlatform:
    ##################################################
    # Member variables
    ##################################################
    project_key = ""
    api_key = ""
    api_key_user = ""
    client_id = ""
    sdk_key = ""
    user_id = None

    ##################################################
    # Constructor
    ##################################################
    def __init__(self, api_key, api_key_user, email):
        self.api_key = api_key
        self.api_key_user = api_key_user
        self.user_id = self.get_user_id(email)

    def getrequest(self, method, url, json=None, headers=None):

        response = requests.request(method, url, json=json, headers=headers)

        #########################
        # Rate limiting Logic
        #########################

        if "X-Ratelimit-Route-Remaining" in response.headers:
            # Completely stolen from Tom Totenberg :)
            call_limit = 5
            delay = 5
            tries = 5
            limit_remaining = response.headers["X-Ratelimit-Route-Remaining"]

            if int(limit_remaining) <= call_limit:
                resetTime = int(response.headers["X-Ratelimit-Reset"])
                currentMilliTime = round(time.time() * 1000)
                if resetTime - currentMilliTime > 0:
                    delay = round((resetTime - currentMilliTime) // 1000)
                else:
                    delay = 0

                if delay < 1:
                    delay = 0.5

                tries -= 1
                time.sleep(delay)
                if tries == 0:
                    return "Rate limit exceeded. Please try again later."
            else:
                tries = 5

        return response

    ##################################################
    # Create a project
    ##################################################
    def create_project(self, project_key, project_name):
        self.project_key = project_key
        if self.project_exists(project_key):
            return
        payload = {
            "key": project_key,
            "name": project_name, 
            "defaultClientSideAvailability": {
                "usingEnvironmentId": True,
                "usingMobileKey": True,
            },
        }

        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects",
            json=payload,
            headers={"Authorization": self.api_key, "Content-Type": "application/json"},
        )

        # Check if the response is successful
        if response.status_code != 200 and response.status_code != 201:
            print(f"Error creating project: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return

        # Parse response with error handling
        try:
            data = json.loads(response.text)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Response status: {response.status_code}")
            print(f"Response text: {response.text[:500]}...")
            return

        # Check if response contains expected data structure
        if "environments" not in data:
            print(f"Error: Response does not contain 'environments' key")
            print(f"Response status: {response.status_code}")
            print(f"Response: {response.text[:500]}...")
            return

        # Extract environment information
        for e in data["environments"]:
            if e["key"] == "production":
                self.client_id = e["_id"]
                self.sdk_key = e["apiKey"]

        if "message" in data:
            print("Error creating project: " + data["message"])

        # remove comment and confirm requirements
        payload = [
            {"op": "replace", "path": "/requireComments", "value": False},
            {"op": "replace", "path": "/confirmChanges", "value": False},
        ]
        self.getrequest(
            "PATCH",
            "https://app.launchdarkly.com/api/v2/projects/"
            + project_key
            + "/environments/production",
            json=payload,
            headers={
                "Authorization": self.api_key,
                "Content-Type": "application/json",
                "LD-API-Version": "beta",
            },
        )
        return response
    
    ##################################################
    # Create an environment
    ##################################################
    def create_environment(self, env_key, env_name):
        payload = {"key": env_key, "name": env_name, "color": "DADBEE"}
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/" + self.project_key + "/environments",
            json=payload,
            headers={"Authorization": self.api_key, "Content-Type": "application/json"},
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating environment: " + data["message"])
        return response
    ##################################################

    ##################################################
    # Delete a project
    ##################################################
    def delete_project(self):
        res = self.getrequest(
            "DELETE",
            "https://app.launchdarkly.com/api/v2/projects/" + self.project_key,
            headers={"Authorization": self.api_key},
        )

    ##################################################
    # Create a flag
    ##################################################
    def create_flag(
        self,
        flag_key,
        flag_name,
        description,
        variations=[],
        purpose=None,
        on_variation=0,
        off_variation=1,
        tags=[],
        migration_stages=0,
        prerequisites=[],
        temporary=False,
    ):
        if self.flag_exists(flag_key):
            return

        payload = {
            "key": flag_key,
            "name": flag_name,
            "description": description,
            "clientSideAvailability": {
                "usingEnvironmentId": True,
                "usingMobileKey": True,
            },
            "temporary": temporary,
            "maintainerId": self.user_id
        }

        if len(variations) > 0:
            payload["variations"] = variations

        if migration_stages > 0:
            payload["migrationSettings"] = {
                "contextKind": "user",
                "stageCount": migration_stages,
            }

        if len(prerequisites) > 0:
            payload["initialPrerequisites"] = prerequisites

        if purpose is None:
            payload["defaults"] = {
                "onVariation": on_variation,
                "offVariation": off_variation,
            }
        else:
            payload["purpose"] = purpose

        if len(tags) > 0:
            payload["tags"] = tags

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/flags/" + self.project_key,
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating flag: " + data["message"])
        return response
    
    ##################################################
    # Update a flag
    ##################################################
    def update_flag_client_side_availability(self, flag_key):

        payload = {
            "instructions": [ 
                { 
                    "kind": "turnOnClientSideAvailability", "value": "usingEnvironmentId" 
                } 
            ]
        }
        
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
        }
                                             
        url = "https://app.launchdarkly.com/api/v2/flags/" + self.project_key + "/" + flag_key
        res = self.getrequest("PATCH", url, headers=headers, json=payload)        
        return res

    ##################################################
    # Copy a flag
    ##################################################
    def copy_flag_settings(self, flag_key, source_env_key, target_env_key):

        payload = {
            "comment": "copy feature flag settings",
            "source": {
                "key": source_env_key
            },
            "target": {
                "key": target_env_key
            }
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
            + "/copy",
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error copying flag: " + data["message"])
        return response
    
    ##################################################
    # Create AI Config
    ##################################################
    
    def create_ai_config(self, config_key, config_name, description, tags):
        
        payload = {
            "description": description,
            "key": config_key,
            "name": config_name,
            "tags": tags
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        
        if self.user_id:
            payload["maintainerId"] = self.user_id
        
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/"+ self.project_key +"/ai-configs",
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating AI Config: " + data["message"])
        return response
        
    
    ##################################################
    # Create AI Config Versions
    ##################################################
        
    def create_ai_config_versions(self, ai_config_key, ai_config_version_key, ai_model_config_key, ai_config_version_name, model, messages, custom=None):
        
        payload = {
            "key": ai_config_version_key,
            "name": ai_config_version_name,
            "messages": messages,  # Used for AI config versions
            "model": model,
            "modelConfigKey": ai_model_config_key,
            "tools": [],
            "toolKeys": []
        }
        if custom is not None:
            payload["custom"] = custom

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }

        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/" + self.project_key + "/ai-configs/" + ai_config_key + "/variations",
            json=payload,
            headers=headers,
        )
        
        # Add better error handling for JSON parsing
        if response.text.strip():  # Only try to parse if response is not empty
            try:
                data = json.loads(response.text)
                if "message" in data:
                    print("Error creating AI config version: " + data["message"])
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print(f"Response status: {response.status_code}")
                print(f"Response text: {response.text[:500]}...")
        else:
            print("Empty response received from AI config version API")
            
        return response
    
    ##################################################
    # Create AI Agent
    ##################################################
    
    def create_ai_agent(self, agent_key, agent_name, description, maintainer_id=None, maintainer_team_key=None, mode="agent", tags=None):
        
        payload = {
            "key": agent_key,
            "name": agent_name,
            "description": description,
            "mode": mode,
            "tags": tags or []
        }
        
        if maintainer_id:
            payload["maintainerId"] = maintainer_id
        if maintainer_team_key:
            payload["maintainerTeamKey"] = maintainer_team_key
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/"+ self.project_key +"/ai-configs",
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating AI Agent: " + data["message"])
        return response
    
    ##################################################
    # Create AI Agent Variations (Bulk)
    ##################################################
    
    def create_ai_agent_variations_bulk(self, agent_key, variations):
        # Create variations one by one since bulk API might not be available
        results = []
        for variation in variations:
            result = self.create_ai_agent_variation(agent_key, variation)
            results.append(result)
        return results
    
    def create_ai_agent_variation(self, agent_key, variation):
        payload = {
            "key": variation["key"],
            "name": variation["name"],
            "messages": [],  # Empty for AI agents
            "instructions": variation["instructions"],
            "model": variation["model"],
            "modelConfigKey": variation["modelConfigKey"],
            "tools": [],
            "toolKeys": []
        }
        
        # Add optional fields if present
        if "comment" in variation:
            payload["comment"] = variation["comment"]
        if "description" in variation:
            payload["description"] = variation["description"]
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/" + self.project_key + "/ai-configs/" + agent_key + "/variations",
            json=payload,
            headers=headers,
        )
        
        # Add better error handling for JSON parsing
        if response.text.strip():  # Only try to parse if response is not empty
            try:
                data = json.loads(response.text)
                if "message" in data:
                    print("Error creating AI Agent variation: " + data["message"])
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print(f"Response status: {response.status_code}")
                print(f"Response text: {response.text[:500]}...")
        else:
            print("Empty response received from AI agent variation API")
            
        return response
    
    ##################################################
    # Create Custom Model Configuration
    ##################################################
    
    def create_custom_model_config(self, model_key, model_name, provider="LD", cost_per_input_token=0.8, cost_per_output_token=6.0, params=None, custom_params=None, tags=None):
        """
        Create a custom model configuration for AI agents
        """
        payload = {
            "name": model_name,
            "key": model_key,
            "id": model_key,
            "icon": "🤖",
            "provider": provider,
            "params": params or {},
            "customParams": custom_params or {},
            "tags": tags or ["custom-model", "financial-ai"],
            "costPerInputToken": cost_per_input_token,
            "costPerOutputToken": cost_per_output_token
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        
        response = self.getrequest(
            "POST",
            f"https://app.launchdarkly.com/api/v2/projects/{self.project_key}/ai-configs/model-configs",
            json=payload,
            headers=headers,
        )
        
        # Add better error handling for JSON parsing
        if response.text.strip():
            try:
                data = json.loads(response.text)
                if "message" in data:
                    print(f"Error creating custom model config {model_name}: {data['message']}")
                else:
                    print(f"Successfully created custom model config: {model_name}")
            except json.JSONDecodeError as e:
                print(f"JSON decode error for model {model_name}: {e}")
                print(f"Response status: {response.status_code}")
                print(f"Response text: {response.text[:500]}...")
        else:
            print(f"Empty response received for model config {model_name}")
            
        return response
    
    
    ##################################################
    # Create a segment
    ##################################################

    def create_segment(self, segment_key, segment_name, env_key, description=""):
        if self.segment_exists(segment_key, env_key):
            return

        payload = {
            "key": segment_key,
            "name": segment_name,
            "description": description,
            "unbounded": False,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/segments/"
            + self.project_key
            + "/"
            + env_key,
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating segment: " + data["message"])
        return response

    ##################################################
    # Add a segment rule
    ##################################################

    def add_segment_rule(
        self, segment_key, env_key, context_kind, attribute, op, value
    ):
        payload = [
            {
                "op": "add",
                "path": "/rules/0",
                "value": {
                    "clauses": [
                        {
                            "contextKind": context_kind,
                            "op": op,
                            "attribute": attribute,
                            "values": value,
                            "negate": False,
                        }
                    ],
                    "rolloutContextKind": "user",
                    "description": "",
                },
            },
        ]

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }
        response = self.getrequest(
            "PATCH",
            "https://app.launchdarkly.com/api/v2/segments/"
            + self.project_key
            + "/"
            + env_key
            + "/"
            + segment_key,
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating segment: " + data["message"])
        return response

    ##################################################
    # Create a metric
    ##################################################
    def create_metric(
        self,
        metric_key,
        metric_name,
        event_key,
        metric_description="",
        kind="custom",
        numeric=False,
        success_criteria="LowerThanBaseline",
        unit="",
        exclude_empty_events=False,
        randomization_units=[],
        tags=[],
    ):
        if self.metric_exists(metric_key):
            return

        payload = {
            "key": metric_key,
            "name": metric_name,
            "description": metric_description,
            "eventKey": event_key,
            "kind": kind,
            "maintainerId": self.user_id,
            "isNumeric": numeric,
            "successCriteria": success_criteria,
            "eventDefault": {"disabled": exclude_empty_events},
        }

        if len(tags) > 0:
            payload["tags"] = tags

        if numeric:
            payload["unit"] = unit

        if randomization_units:
            payload["randomizationUnits"] = randomization_units

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/metrics/" + self.project_key,
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating metric: " + data["message"])
        return response

    ##################################################
    # Create a metric group
    ##################################################
    def create_metric_group(
        self, group_key, group_name, metrics, kind="funnel", description=""
    ):
        if self.metric_group_exists(group_key):
            return

        payload = {
            "key": group_key,
            "name": group_name,
            "description": description,
            "kind": kind,
            "maintainerId": self.user_id,
            "tags": ["coast"],
            "metrics": metrics,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/metric-groups",
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating metric group: " + data["message"])
        return response

    ##################################################
    # Create context kind
    ##################################################
    def create_context(self, context_key, for_experiment=False):
        payload = {
            "name": context_key,
            "hideInTargeting": False,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }
        response = self.getrequest(
            "PUT",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/context-kinds/"
            + context_key,
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating context: " + data["message"])

        if for_experiment:
            settings = []
            response = self.getrequest(
                "GET",
                "https://app.launchdarkly.com/api/v2/projects/"
                + self.project_key
                + "/experimentation-settings",
                headers=headers,
            )
            
            # Check if the response is successful
            if response.status_code != 200:
                print(f"Error getting experimentation settings: HTTP {response.status_code}")
                print(f"Response: {response.text}")
                return
            
            # Parse response with error handling
            try:
                data = json.loads(response.text)
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print(f"Response status: {response.status_code}")
                print(f"Response text: {response.text[:500]}...")
                return
            
            if "message" in data:
                print("Error getting experimentation settings: " + data["message"])
                return

            # Check if response contains expected data structure
            if "randomizationUnits" not in data:
                print(f"Error: Response does not contain 'randomizationUnits' key")
                print(f"Response status: {response.status_code}")
                print(f"Response: {response.text[:500]}...")
                return

            for ru in data["randomizationUnits"]:
                item = {
                    "randomizationUnit": ru["randomizationUnit"],
                    "standardRandomizationUnit": ru["standardRandomizationUnit"],
                    "default": ru["default"],
                }
                settings.append(item)

            settings.append(
                {
                    "randomizationUnit": context_key,
                    "standardRandomizationUnit": "user",
                    "default": False,
                }
            )

            payload = {
                "randomizationUnits": settings,
            }

            response = self.getrequest(
                "PUT",
                "https://app.launchdarkly.com/api/v2/projects/"
                + self.project_key
                + "/experimentation-settings",
                json=payload,
                headers=headers,
            )
            data = json.loads(response.text)
            if "message" in data:
                print("Error setting experimentation settings: " + data["message"])
        return response

    ##################################################
    # Create an experiment
    ##################################################
    def create_experiment(
        self,
        exp_key,
        exp_name,
        exp_env,
        flag_key,
        hypothesis,
        metrics,
        primary_key,
        attributes=None,
        randomization_unit="user",
        custom_treatment_names=None,
        methodology="bayesian",
        analysisConfig={"bayesianThreshold": "95"},
        flagConfigVersion=1,
    ):
        if self.experiment_exists(exp_key, exp_env):
            return

        treatments = self.get_treatments(flag_key, custom_treatment_names)

        payload = {
            "name": exp_name,
            "key": exp_key,
            "maintainerId": self.user_id,
            "iteration": {
                "hypothesis": hypothesis,
                "canReshuffleTraffic": True,
                "metrics": metrics,
                "treatments": treatments,
                "flags": {
                    flag_key: {
                        "ruleId": "fallthrough",
                        "flagConfigVersion": flagConfigVersion,
                    },
                },
                "randomizationUnit": randomization_unit,
            },
            "methodology": methodology,
            "analysisConfig": analysisConfig,
        }

        if self.metric_group_exists(primary_key):
            payload["iteration"]["primaryFunnelKey"] = primary_key
        else:
            payload["iteration"]["primarySingleMetricKey"] = primary_key

        if attributes is not None:
            payload["iteration"]["attributes"] = attributes

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }

        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/environments/"
            + exp_env
            + "/experiments",
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating experiment: " + data["message"])
        return response

    ##################################################
    # Create a holdout
    ##################################################
    def create_holdout(
        self,
        holdout_key,
        holdout_name,
        holdout_env_key,   
        description,
        metrics,
        primary_metric_key,
        randomization_unit="users",
        attributes=None,
        prerequisiteflagkey=""
    ):

        payload = {
            "name": holdout_name,
            "key": holdout_key,
            "description": description,
            "randomizationunit": randomization_unit,
            "attributes": attributes,
            "holdoutamount": "5",
            "primarymetrickey": primary_metric_key,
            "metrics": metrics,
            "prerequisiteflagkey": prerequisiteflagkey,
            "analysisConfig": {"significanceThreshold": "5", "testDirection": "two-sided"},
            "methodology": "frequentist",
            "maintainerId": self.user_id,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }

        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/environments/"
            + holdout_env_key
            + "/holdouts",
            json=payload,
            headers=headers,
        )

        data = json.loads(response.text)
        if "message" in data:
            print("Error creating holdout: " + data["message"])
        return response

    ##################################################
    # Create a layer
    ##################################################

    def create_layer(
        self,
        # layer_key,
        # layer_name,
        description,
    ):

        payload = {
            "name": "Checkout Experiment Layer",
            "key": "checkout-experiment-layer",
            "description": description,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }

        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/layers",
            json=payload,
            headers=headers,
        )

        data = json.loads(response.text)
        if "message" in data:
            print("Error creating layer: " + data["message"])
        return response


    def update_layer(
        self,
        layer_key,
        environmentKey,
        instructions = [],
    ):
        payload = {
            "comment": "Example comment describing the update",
            "environmentKey": environmentKey,
            "instructions": instructions
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }

        response = self.getrequest(
            "PATCH",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/layers/"
            + layer_key,
            json=payload,
            headers=headers,
        )

        data = json.loads(response.text)
        if "message" in data:
            print("Error updating layer: " + data["message"])
        return response



    ##################################################
    # Create a release pipeline
    ##################################################
    def create_release_pipeline(self, pipeline_key, pipeline_name):
        if self.release_pipeline_exists(pipeline_key):
            return

        payload = {
            "description": "Standard pipeline to roll out to production",
            "key": pipeline_key,
            "name": pipeline_name,
            "phases": [
                {
                    "audiences": [
                        {
                            "environmentKey": "test",
                            "name": "everyone",
                            "configuration": {
                                "releaseStrategy": "immediate-rollout",
                                "requireApproval": False,
                            },
                        }
                    ],
                    "name": "Testing Phase",
                },
                {
                    "audiences": [
                        {
                            "environmentKey": "production",
                            "name": "everyone",
                            "configuration": {
                                "releaseStrategy": "immediate-rollout",
                                "requireApproval": False,
                            },
                        }
                    ],
                    "name": "QA Phase",
                },
                {
                    "audiences": [
                        {
                            "environmentKey": "production",
                            "name": "everyone",
                            "configuration": {
                                "releaseStrategy": "immediate-rollout",
                                "requireApproval": False,
                            },
                        }
                    ],
                    "name": "GA",
                },
            ],
            "isProjectDefault": True,
        }

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/release-pipelines",
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating release pipeline: " + data["message"])
        return response

    def create_shortcut(self, name, key, icon, tags, env_key, sort_by="name"):
        payload = {
            "name": name,
            "key": key,
            "icon": icon,
            "type": "flags",
            "context": {
                "projectKey": self.project_key,
                "environmentKeys": ["production"],
                "selectedEnvironmentKey": env_key,
            },
            "filters": {
                "filter": {
                    "tags": tags
                    },
                    "state": "live",
                    "sort": sort_by
                },
            "visibility": "me",
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key_user,
            "LD-API-Version": "beta",
        }
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/shortcuts",
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating shortcut: " + data["message"])
        return response

    #####################################
    #
    # Helper functions
    #
    #####################################

    ##################################################
    # Get the User ID from the email
    ##################################################

    def get_user_id(self, email):
        if email is None:
            return None
        
        filter = "email:" + email
        if email == "":
            filter = "role:owner"

        res = self.getrequest(
            "GET",
            "https://app.launchdarkly.com/api/v2/members?filter=" + filter,
            headers={"Authorization": self.api_key, "Content-Type": "application/json"},
        )
        
        # Check if the response is successful
        if res.status_code != 200:
            print(f"Error getting user ID: HTTP {res.status_code}")
            print(f"Response: {res.text}")
            return "6502137e3310e112c47aeb92"
        
        # Parse response with error handling
        try:
            data = json.loads(res.text)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Response status: {res.status_code}")
            print(f"Response text: {res.text[:500]}...")
            return "6502137e3310e112c47aeb92"
        
        # Check if response contains expected data structure
        if "totalCount" not in data or "items" not in data:
            print(f"Error: Response does not contain expected keys")
            print(f"Response status: {res.status_code}")
            print(f"Response: {res.text[:500]}...")
            return "6502137e3310e112c47aeb92"
            
        if data["totalCount"] == 0:
            return "6502137e3310e112c47aeb92"

        self.user_id = data["items"][0]["_id"]
        return self.user_id

    ##################################################
    # Check if a project exists
    ##################################################

    def project_exists(self, project_key):
        res = self.getrequest(
            "GET",
            "https://app.launchdarkly.com/api/v2/projects/" + project_key,
            headers={"Authorization": self.api_key},
        )
        data = json.loads(res.text)
        if "message" in data:
            return False
        return True
    
    ##################################################
    # Create a user
    ##################################################
    def create_user(self, email):
        
        payload = [
            { 
                "email": email,
                "role": "admin",
            }
        ]

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }
        response = self.getrequest(
            "POST",
            "https://app.launchdarkly.com/api/v2/members",
            json=payload,
            headers=headers,
        )
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating user: " + data["message"])
            return "demoengineering@launchdarkly.com"
        return response

    ##################################################
    # Check if a flag exists
    ##################################################
    def flag_exists(self, flag_key):
        res = self.getrequest(
            "GET",
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key,
            headers={"Authorization": self.api_key},
        )
        data = json.loads(res.text)
        if "message" in data:
            return False
        return True

    ##################################################
    # Check if a segment exists
    ##################################################

    def segment_exists(self, segment_key, env_key):
        res = self.getrequest(
            "GET",
            "https://app.launchdarkly.com/api/v2/segments/"
            + self.project_key
            + "/"
            + env_key
            + "/"
            + segment_key,
            headers={"Authorization": self.api_key},
        )
        if res.text.strip() == "":
            return False
        return True

    ##################################################
    # Check if a metric exists
    ##################################################
    def metric_exists(self, metric_key):
        res = self.getrequest(
            "GET",
            "https://app.launchdarkly.com/api/v2/metrics/"
            + self.project_key
            + "/"
            + metric_key,
            headers={"Authorization": self.api_key},
        )
        data = json.loads(res.text)
        if "message" in data:
            return False
        return True

    ##################################################
    # Check if a metric group exists
    ##################################################
    def metric_group_exists(self, group_key):
        res = self.getrequest(
            "GET",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/metric-groups/"
            + group_key,
            headers={"Authorization": self.api_key, "LD-API-Version": "beta"},
        )
        data = json.loads(res.text)
        if "message" in data:
            return False
        return True

    ##################################################
    # Check if an experiment exists
    ##################################################
    def experiment_exists(self, exp_key, exp_env):
        res = self.getrequest(
            "GET",
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/environments/"
            + exp_env
            + "/experiments/"
            + exp_key,
            headers={"Authorization": self.api_key, "LD-API-Version": "beta"},
        )
        data = json.loads(res.text)
        if "message" in data:
            return False
        return True

    ##################################################
    # Check if a release pipeline exists
    ##################################################
    def release_pipeline_exists(self, pipeline_key):
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/release-pipelines"
            + pipeline_key
        )
        res = self.getrequest(
            "GET",
            url,
            headers={
                "Content-Type": "application/json",
                "Authorization": self.api_key,
                "LD-API-Version": "beta",
            },
        )
        if res.status_code == 404:
            return False
        return True

    ##################################################
    # Build a treatment object
    ##################################################
    def treatment(self, name, baseline, allocation_percent, flag_key, variation_id):
        return {
            "name": name,
            "baseline": baseline,
            "allocationPercent": allocation_percent,
            "parameters": [
                {
                    "flagKey": flag_key,
                    "variationId": variation_id,
                },
            ],
        }

    #########################################################
    # Get the flag variation IDs with values, returns a list
    #########################################################
    def get_flag_variation_values(self, flag_key):
        var_ids = []

        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json",
        }
        res = self.getrequest("GET", url, headers=headers)
        
        # Check if the response is successful
        if res.status_code != 200:
            print(f"Error getting flag variation values: HTTP {res.status_code}")
            print(f"Response: {res.text}")
            return [], {"onVariation": 0, "offVariation": 0}
        
        # Parse response with error handling
        try:
            data = json.loads(res.text)
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Response status: {res.status_code}")
            print(f"Response text: {res.text[:500]}...")
            return [], {"onVariation": 0, "offVariation": 0}
        
        # Check if response contains expected data structure
        if "defaults" not in data or "variations" not in data:
            print(f"Error: Response does not contain expected keys")
            print(f"Response status: {res.status_code}")
            print(f"Response: {res.text[:500]}...")
            return [], {"onVariation": 0, "offVariation": 0}
        
        defaults = {
            "onVariation": data["defaults"]["onVariation"],
            "offVariation": data["defaults"]["offVariation"],
        }
        ordinal = 0
        for var in data["variations"]:
            var_ids.append(
                {"ordinal": ordinal, "value": var["value"], "id": var["_id"]}
            )
            ordinal += 1

        return var_ids, defaults

    ##################################################
    # Get flag variation names from LaunchDarkly API
    ##################################################
    def get_flag_variation_names(self, flag_key, segment=False):
        """
        Get the names of flag variations from LaunchDarkly API
        Returns a list of variation names (excluding 'disabled' unless segment=True)
        """
        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json",
        }
        res = self.getrequest("GET", url, headers=headers)
        data = json.loads(res.text)
        if "variations" not in data:
            return []
        
        variation_names = []
        for var in data["variations"]:
            # If segment is True, include all variations (including "disabled")
            # If segment is False, exclude "disabled" as before
            if segment or var["name"] != "disabled":
                variation_names.append(var["name"])
        
        return variation_names

    ##################################################
    # Get flag variation details (names and IDs) from LaunchDarkly API
    ##################################################
    def get_flag_variation_details(self, flag_key, segment=False):
        """
        Get both names and IDs of flag variations from LaunchDarkly API
        Returns a list of dictionaries with 'name' and 'id' keys
        """
        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json",
        }
        res = self.getrequest("GET", url, headers=headers)
        data = json.loads(res.text)
        if "variations" not in data:
            return []
        
        variation_details = []
        for var in data["variations"]:
            # If segment is True, include all variations (including "disabled")
            # If segment is False, exclude "disabled" as before
            if segment or var["name"] != "disabled":
                variation_details.append({
                    "name": var["name"],
                    "id": var["_id"],
                    "value": var.get("value", None)
                })
        
        return variation_details

    ##################################################
    # Get the flag variation IDs, returns a list
    ##################################################
    def get_flag_variations(self, flag_key, filter=None, segment=False):
        var_ids = []
        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json",
        }
        res = self.getrequest("GET", url, headers=headers)
        data = json.loads(res.text)
        if "variations" not in data:
            return []
        for var in data["variations"]:
            # If segment is True, include all variations (including "disabled")
            # If segment is False, exclude "disabled" as before
            if segment or var["name"] != "disabled":
                if filter is not None:
                    if var["value"] == filter:
                        var_ids.append(var["_id"])
                else:
                    var_ids.append(var["_id"])
        return var_ids

    ##################################################
    # Create a list of treatments, returns a list
    ##################################################
    def get_treatments(self, flag_key, name_list=None):
        # Get both variation IDs and names in one API call for efficiency
        variation_details = self.get_flag_variation_details(flag_key)
        treatments = [var["id"] for var in variation_details]
        ret_treatments = []
        names = []

        if name_list is not None:
            if len(name_list) != len(treatments):
                print("Error: name list length does not match the number of treatments")
                return
            else:
                names = name_list.copy()
        else:
            # Use actual flag variation names from LaunchDarkly API
            names = [var["name"] for var in variation_details]
        allocs = []
        total = 0.0
        for i in range(len(treatments)):
            x = round(float(100 / len(treatments)), 2)
            allocs.append(x)
            total += x

        if total > 100.0:
            allocs[0] = float(allocs[0]) - (total - 100.0)
        if total < 100.0:
            allocs[0] = allocs[0] + (100.0 - total)

        for i in range(len(treatments)):
            is_control = False
            if i == 0:
                is_control = True
            ret_treatments.append(
                self.treatment(
                    names[i],
                    is_control,
                    allocs[i],
                    flag_key,
                    treatments[i],
                )
            )

        return ret_treatments

    ##################################################
    # Experiment metric object
    ##################################################
    def exp_metric(self, key, is_group=True):
        return {
            "key": key,
            "isGroup": is_group,
        }

    ##################################################
    # List of experiment metrics
    ##################################################
    def get_exp_metrics(self, metric_list):
        retval = []
        for m in metric_list:
            retval.append(m)

        return retval

    ##################################################
    # Add a guarded rollout to a flag
    ##################################################
    def add_guarded_rollout(
        self,
        flag_key,
        env_key,
        timeout=604800000,
        rollback=True,
        weight=50000,
        notify=True,
        days=1,
        metrics=[],
    ):
        vars, defaults = self.get_flag_variation_values(flag_key)

        control_var = ""
        test_var = ""
        stagesWindow = 120000

        if days == 7:
            stagesWindow = 120960000

        for v in vars:
            if v["value"] == False:
                control_var = v["id"]
            else:
                test_var = v["id"]

        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
            + "?ignoreConflicts=true"
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
        }
        payload = {
            "comment": "",
            "environmentKey": env_key,
            "instructions": [
                {
                    "kind": "turnFlagOn"
                },
                {
                    "kind": "updateFallthroughWithMeasuredRolloutV2",
                    "testVariationId": test_var,
                    "metrics": [
                        {
                            "metricKey": metric,
                            "regressionThreshold": 0,
                            "onRegression": {
                                "rollback": True,
                                "notify": True
                            }
                        } for metric in metrics
                    ],
                    "controlVariationId": control_var,
                    "randomizationUnit": "user",
                    "onRegression": {"notify": notify, "rollback": rollback},
                    "onProgression": {"notify": notify, "rollForward": True},
                    "monitoringWindowMilliseconds": timeout,
                    "rolloutWeight": weight,
                    "metricKeys": metrics,
                    "stages": [
                            {
                                "rolloutWeight": 1000,
                                "monitoringWindowMilliseconds": stagesWindow
                            },
                            {
                                "rolloutWeight": 5000,
                                "monitoringWindowMilliseconds": stagesWindow
                            },
                            {
                                "rolloutWeight": 10000,
                                "monitoringWindowMilliseconds": stagesWindow
                            },
                            {
                                "rolloutWeight": 25000,
                                "monitoringWindowMilliseconds": stagesWindow
                            },
                            {
                                "rolloutWeight": 50000,
                                "monitoringWindowMilliseconds": stagesWindow
                            },         
                    ]
                }
            ],
        }
        res = self.getrequest("PATCH", url, headers=headers, json=payload)
        return res
    
    ##################################################
    # Add a guarded rollout to a flag
    ##################################################
    def add_progressive_rollout(
        self,
        flag_key,
        env_key,
        timeout=604800000,
        rollback=True,
        weight=50000,
        notify=True,
    ):
        vars, defaults = self.get_flag_variation_values(flag_key)

        control_var = ""
        end_var = ""

        for v in vars:
            if v["value"] == False:
                control_var = v["id"]
            else:
                end_var = v["id"]

        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
            + "?ignoreConflicts=true"
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
        }
        payload = {
            "comment": "",
            "environmentKey": env_key,
            "instructions": [
                {
                    "kind": "turnFlagOn"
                },
                {
                    "kind": "updateFallthroughVariationOrRollout",
                    "rolloutContextKind": "user",
                    "progressiveRolloutConfiguration": {
                        "controlVariationId": control_var,
                        "endVariationId": end_var,
                        "stages": [
                            {
                                "displayUnit": "day",
                                "durationMs": timeout,
                                "rollout": {
                                    end_var: 1000,
                                    control_var: 99000,
                                }
                            },
                            {
                                "displayUnit": "day",
                                "durationMs": timeout,
                                "rollout": {
                                    end_var: 5000,
                                    control_var: 95000,
                                }
                            },
                            {
                                "displayUnit": "day",
                                "durationMs": timeout,
                                "rollout": {
                                    end_var: 10000,
                                    control_var: 90000,
                                }
                            },
                            {
                                "displayUnit": "day",
                                "durationMs": timeout,
                                "rollout": {
                                    end_var: 25000,
                                    control_var: 75000,
                                }
                            },
                            {
                                "displayUnit": "day",
                                "durationMs": timeout,
                                "rollout": {
                                    end_var: 50000,
                                    control_var: 50000,
                                }
                            },
                            {
                                "displayUnit": "day",
                                "rollout": {
                                    end_var: 100000,
                                    control_var: 0,
                                }
                            }
                        ]
                    }
                }
            ],
        }
        res = self.getrequest("PATCH", url, headers=headers, json=payload)
        return res

    ##################################################
    # Toggle flag state
    ##################################################
    def toggle_flag(self, flag_key, flag_state, flag_env, comment=None):
        cmd = ""
        if flag_state == "on":
            cmd = "turnFlagOn"
        else:
            cmd = "turnFlagOff"

        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
        }
        payload = {"environmentKey": flag_env, "instructions": [{"kind": cmd}]}
        if comment is not None:
            payload["comment"] = comment

        res = self.getrequest("PATCH", url, headers=headers, json=payload)
        return res

    ##################################################
    # Add a maintainerId to flag
    ##################################################

    def add_maintainer_to_flag(self, flag_key):
        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json",
        }
        payload = [
            {
                "op": "replace",
                "path": "/maintainerId",
                "value": self.user_id,
            }
        ]

        res = self.getrequest("PATCH", url, headers=headers, json=payload)
        return res

    ##################################################
    # Add a maintainerId to metric
    ##################################################

    def add_maintainer_to_metric(self, metric_key):
        url = (
            "https://app.launchdarkly.com/api/v2/metrics/"
            + self.project_key
            + "/"
            + metric_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json",
        }
        payload = [
            {
                "op": "replace",
                "path": "/maintainerId",
                "value": self.user_id,
            }
        ]

        res = self.getrequest("PATCH", url, headers=headers, json=payload)
        return res

    ##################################################
    # Add segment to flag
    ##################################################

    def add_segment_to_flag(self, flag_key, segment_key, env_key, variation=True, segment=False):
        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
        }
        var_id = self.get_flag_variations(flag_key, None, segment)[0]
        payload = {
            "environmentKey": env_key,
            "instructions": [
                {
                    "kind": "addRule",
                    "variationId": var_id,
                    "clauses": [
                        {
                            "contextKind": "",
                            "attribute": "segmentMatch",
                            "op": "segmentMatch",
                            "negate": False,
                            "values": [segment_key],
                        }
                    ],
                }
            ],
        }

        res = self.getrequest("PATCH", url, headers=headers, json=payload)
        return res

    ##################################################
    # Add prequisite to flag
    ##################################################

    def add_prerequisite_to_flag(self, flag_key, prerequisite_key, var_id, env_key):
        varids = self.get_flag_variations(prerequisite_key)

        url = (
            "https://app.launchdarkly.com/api/v2/flags/"
            + self.project_key
            + "/"
            + flag_key
        )
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
        }
        payload = {
            "environmentKey": env_key,
            "instructions": [
                {
                    "kind": "addPrerequisite",
                    "prerequisiteKey": prerequisite_key,
                    "variationId": varids[var_id],
                }
            ],
        }

        res = self.getrequest("PATCH", url, headers=headers, json=payload)
        return res

    ##################################################
    # Start experiment iteration
    ##################################################
    def start_exp_iteration(self, exp_key, exp_env):
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/environments/"
            + exp_env
            + "/experiments/"
            + exp_key
        )

        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json",
            "LD-API-Version": "beta",
        }
        payload = {
            "instructions": [
                {
                    "kind": "startIteration",
                    "changeJustification": "Time to start the experiment!",
                }
            ]
        }

        res = self.getrequest("PATCH", url, headers=headers, json=payload)
        return res

    ##################################################
    # Add a flag to a pipeline
    ##################################################
    def add_pipeline_flag(self, flag_key, pipeline_key):
        var_ids = self.get_flag_variations(flag_key)
        if not var_ids:
            print(f"Warning: No variations found for flag {flag_key}, skipping pipeline addition")
            return None
        var_id = var_ids[0]
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/flags/"
            + flag_key
            + "/release"
        )

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }

        payload = {
            "releaseVariationId": var_id,
            "releasePipelineKey": pipeline_key,
        }

        response = requests.put(url, json=payload, headers=headers)
        return response

    ##################################################
    # Get pipeline phase IDs
    ##################################################
    def get_pipeline_phase_ids(self, pipeline_key):
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/release-pipelines/"
            + pipeline_key
        )
        res = self.getrequest(
            "GET",
            url,
            headers={
                "Content-Type": "application/json",
                "Authorization": self.api_key,
                "LD-API-Version": "beta",
            },
        )
        data = json.loads(res.text)
        c = 0
        phases = ["test", "guard", "ga"]
        phase_ids = {}
        for p in data["phases"]:
            id = p["id"]
            phase_ids.update({phases[c]: id})
            c += 1
        return phase_ids

    ##################################################
    # Attach a metric to a flag
    ##################################################
    def attach_metric_to_flag(self, flag_key, metric_keys=[]):
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/flags/"
            + flag_key
            + "/measured-rollout-configuration"
        )

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }

        payload = {"metricKeys": metric_keys}

        response = requests.put(url, json=payload, headers=headers)
        return response

    ##################################################
    # Advance a flag to the next phase
    ##################################################
    def advance_flag_phase(self, flag_key, status, pipeline_phase_id, guarded=False):
        counter = 0
        status_code = 0
        payload = {}
        while status_code != 200:
            counter += 1
            url = (
                "https://app.launchdarkly.com/api/v2/projects/"
                + self.project_key
                + "/flags/"
                + flag_key
                + "/release/phases/"
                + pipeline_phase_id
            )
            
            if guarded == True:
                payload = {
                    "status": status,
                    "audiences": [
						{
							"audienceId": str(uuid.uuid4()),
							"releaseGuardianConfiguration": {
								"randomizationUnit": "user"
							}
						}
					]
                }
                
            else:
                payload = {
                    "status": status,
                }
    
            headers = {
                "Content-Type": "application/json",
                "Authorization": self.api_key,
                "LD-API-Version": "beta",
            }

            response = requests.put(url, json=payload, headers=headers)
            status_code = response.status_code
            if counter > 8:
                break
            if status_code != 200:
                data = json.loads(response.text)
                print("Error advancing flag phase: " + data["message"])
                time.sleep(3)

        return response
    
    ##################################################
    # Update AI Config Targeting
    ##################################################
    def update_ai_config_targeting(self, ai_config_key, environment_key, variation_id):
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/ai-configs/"
            + ai_config_key
            + "/targeting"
        )
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        
        payload = {
            "environmentKey": environment_key,
            "instructions": [
                {
                    "kind": "updateFallthroughVariationOrRollout",
                    "variationId": variation_id
                }
            ]
        }
        
        response = self.getrequest("PATCH", url, headers=headers, json=payload)
        data = json.loads(response.text)
        if "message" in data:
            print("Error updating AI config targeting: " + data["message"])
        return response
    
    ##################################################
    # Toggle AI Config
    ##################################################
    def toggle_ai_config(self, ai_config_key, environment_key, state="on"):
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/ai-configs/"
            + ai_config_key
            + "/targeting"
        )
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        
        instruction_kind = "turnConfigOn" if state == "on" else "turnConfigOff"
        
        payload = {
            "environmentKey": environment_key,
            "instructions": [
                {
                    "kind": instruction_kind
                }
            ]
        }
        
        response = self.getrequest("PATCH", url, headers=headers, json=payload)
        data = json.loads(response.text)
        if "message" in data:
            print("Error toggling AI config: " + data["message"])
        return response
    
    ##################################################
    # Get AI Config Variation ID
    ##################################################
    def get_ai_config_variation_id(self, ai_config_key, variation_key):
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/ai-configs/"
            + ai_config_key
        )
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        
        response = self.getrequest("GET", url, headers=headers)
        data = json.loads(response.text)
        if "message" in data:
            print("Error getting AI config: " + data["message"])
            return None
            
        # Find the variation with the matching key
        for variation in data.get("variations", []):
            if variation.get("key") == variation_key:
                return variation.get("_id")
        
        print(f"Variation with key '{variation_key}' not found")
        return None
    
    ##################################################
    # Add guarded rollout to AI Agent
    ##################################################
    def add_ai_agent_guarded_rollout(
        self,
        ai_config_key,
        env_key,
        metrics=[],
        timeout=600000,  # 10 minutes in milliseconds
        rollback=True,
        weight=50000,
        notify=True,
        days=1,
    ):
        # Get AI config variations (excluding disabled)
        variations = self.get_ai_config_variations(ai_config_key)
        
        if len(variations) < 2:
            print(f"Error: AI config {ai_config_key} needs at least 2 variations for guarded rollout")
            return None
        
        # Use first two variations (excluding disabled)
        control_var = variations[1]["_id"]
        test_var = variations[0]["_id"]
        
        # Calculate stages window based on days
        stages_window = 120000  # 2 minutes default
        if days == 7:
            stages_window = 120960000  # 7 days
        elif days == 1:
            stages_window = 720000  # 12 minutes for 1 day
        
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/ai-configs/"
            + ai_config_key
            + "/targeting"
        )
        
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json; domain-model=launchdarkly.semanticpatch",
            "LD-API-Version": "beta",
        }
        
        payload = {
            "comment": f"Guarded rollout for AI Agent {ai_config_key}",
            "environmentKey": env_key,
            "instructions": [
                {
                    "kind": "updateFallthroughWithMeasuredRolloutV2",
                    "testVariationId": test_var,
                    "controlVariationId": control_var,
                    "randomizationUnit": "user",
                    "onRegression": {
                        "notify": notify,
                        "rollback": rollback
                    },
                    "onProgression": {
                        "notify": notify,
                        "rollForward": True
                    },
                    "monitoringWindowMilliseconds": timeout,
                    "rolloutWeight": weight,
                    "stages": [
                        {
                            "rolloutWeight": 1000,
                            "monitoringWindowMilliseconds": stages_window
                        },
                        {
                            "rolloutWeight": 5000,
                            "monitoringWindowMilliseconds": stages_window
                        },
                        {
                            "rolloutWeight": 10000,
                            "monitoringWindowMilliseconds": stages_window
                        },
                        {
                            "rolloutWeight": 25000,
                            "monitoringWindowMilliseconds": stages_window
                        },
                        {
                            "rolloutWeight": 50000,
                            "monitoringWindowMilliseconds": stages_window
                        }
                    ],
                    "metrics": [
                        {
                            "metricKey": metric,
                            "regressionThreshold": 0,
                            "onRegression": {
                                "rollback": True,
                                "notify": False
                            }
                        } for metric in metrics
                    ],
                    "metricSources": [
                        {
                            "key": metric,
                            "isGroup": False
                        } for metric in metrics
                    ]
                }
            ]
        }
        
        response = self.getrequest("PATCH", url, headers=headers, json=payload)
        
        # Add better error handling for JSON parsing
        if response.text.strip():
            try:
                data = json.loads(response.text)
                if "message" in data:
                    print("Error adding AI agent guarded rollout: " + data["message"])
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print(f"Response status: {response.status_code}")
                print(f"Response text: {response.text[:500]}...")
        else:
            print("Empty response received from AI agent guarded rollout API")
            
        return response
    
    ##################################################
    # Get AI Config Variations (excluding disabled)
    ##################################################
    def get_ai_config_variations(self, ai_config_key):
        url = (
            "https://app.launchdarkly.com/api/v2/projects/"
            + self.project_key
            + "/ai-configs/"
            + ai_config_key
        )
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
            "LD-API-Version": "beta",
        }
        
        response = self.getrequest("GET", url, headers=headers)
        data = json.loads(response.text)
        if "message" in data:
            print("Error getting AI config variations: " + data["message"])
            return []
            
        # Filter out disabled variations
        variations = []
        for variation in data.get("variations", []):
            if variation.get("name", "").lower() != "disabled":
                variations.append(variation)
        
        return variations
    
    ##################################################
    # Create Alert
    ##################################################
    def create_alert(
        self,
        alert_name,
        description,
        alert_type="anomaly",
        flag_key=None,
        environment="production"
    ):
        """
        Creates an alert in LaunchDarkly
        
        Args:
            alert_name: Name of the alert
            description: Description of the alert
            alert_type: Type of alert (anomaly, threshold, etc.)
            flag_key: Optional flag key to associate with the alert
            environment: Environment key (default: production)
        """
        url = f"https://app.launchdarkly.com/api/v2/projects/{self.project_key}/alerts"
        
        payload = {
            "name": alert_name,
            "description": description,
            "kind": alert_type,
            "environmentKey": environment
        }
        
        # adding flag filter if specified
        if flag_key:
            payload["filter"] = {
                "flagKey": flag_key
            }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key,
        }
        
        response = self.getrequest("POST", url, json=payload, headers=headers)
        
        if response.status_code not in [200, 201]:
            print(f"Error creating alert: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return response
        
        data = json.loads(response.text)
        if "message" in data:
            print("Error creating alert: " + data["message"])
        else:
            print(f"✅ Alert created: {alert_name}")
        
        return response