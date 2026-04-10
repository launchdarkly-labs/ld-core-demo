from typing import Any, Dict, Optional

from .custom_fields import InitializeSessionResponseFields
from .custom_typing_fields import GraphQLField
from .input_types import (
    BackendErrorObjectInput,
    ErrorObjectInput,
    MetricInput,
    ReplayEventsInput,
)


class Mutation:
    @classmethod
    def initialize_session(
        cls,
        session_secure_id: str,
        organization_verbose_id: str,
        enable_strict_privacy: bool,
        enable_recording_network_contents: bool,
        client_version: str,
        firstload_version: str,
        client_config: str,
        environment: str,
        fingerprint: str,
        client_id: str,
        *,
        app_version: Optional[str] = None,
        service_name: Optional[str] = None,
        network_recording_domains: Optional[str] = None,
        disable_session_recording: Optional[bool] = None,
        privacy_setting: Optional[str] = None
    ) -> InitializeSessionResponseFields:
        arguments: Dict[str, Dict[str, Any]] = {
            "session_secure_id": {"type": "String!", "value": session_secure_id},
            "organization_verbose_id": {
                "type": "String!",
                "value": organization_verbose_id,
            },
            "enable_strict_privacy": {
                "type": "Boolean!",
                "value": enable_strict_privacy,
            },
            "enable_recording_network_contents": {
                "type": "Boolean!",
                "value": enable_recording_network_contents,
            },
            "clientVersion": {"type": "String!", "value": client_version},
            "firstloadVersion": {"type": "String!", "value": firstload_version},
            "clientConfig": {"type": "String!", "value": client_config},
            "environment": {"type": "String!", "value": environment},
            "appVersion": {"type": "String", "value": app_version},
            "serviceName": {"type": "String", "value": service_name},
            "fingerprint": {"type": "String!", "value": fingerprint},
            "client_id": {"type": "String!", "value": client_id},
            "network_recording_domains": {
                "type": "String",
                "value": network_recording_domains,
            },
            "disable_session_recording": {
                "type": "Boolean",
                "value": disable_session_recording,
            },
            "privacy_setting": {"type": "String", "value": privacy_setting},
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return InitializeSessionResponseFields(
            field_name="initializeSession", arguments=cleared_arguments
        )

    @classmethod
    def identify_session(
        cls,
        session_secure_id: str,
        user_identifier: str,
        *,
        user_object: Optional[Any] = None
    ) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {
            "session_secure_id": {"type": "String!", "value": session_secure_id},
            "user_identifier": {"type": "String!", "value": user_identifier},
            "user_object": {"type": "Any", "value": user_object},
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(field_name="identifySession", arguments=cleared_arguments)

    @classmethod
    def add_session_properties(
        cls, session_secure_id: str, *, properties_object: Optional[Any] = None
    ) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {
            "session_secure_id": {"type": "String!", "value": session_secure_id},
            "properties_object": {"type": "Any", "value": properties_object},
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(
            field_name="addSessionProperties", arguments=cleared_arguments
        )

    @classmethod
    def push_payload(
        cls,
        session_secure_id: str,
        events: ReplayEventsInput,
        messages: str,
        resources: str,
        errors: ErrorObjectInput,
        *,
        payload_id: Optional[str] = None,
        web_socket_events: Optional[str] = None,
        is_beacon: Optional[bool] = None,
        has_session_unloaded: Optional[bool] = None,
        highlight_logs: Optional[str] = None
    ) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {
            "session_secure_id": {"type": "String!", "value": session_secure_id},
            "payload_id": {"type": "ID", "value": payload_id},
            "events": {"type": "ReplayEventsInput!", "value": events},
            "messages": {"type": "String!", "value": messages},
            "resources": {"type": "String!", "value": resources},
            "web_socket_events": {"type": "String", "value": web_socket_events},
            "errors": {"type": "ErrorObjectInput!", "value": errors},
            "is_beacon": {"type": "Boolean", "value": is_beacon},
            "has_session_unloaded": {"type": "Boolean", "value": has_session_unloaded},
            "highlight_logs": {"type": "String", "value": highlight_logs},
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(field_name="pushPayload", arguments=cleared_arguments)

    @classmethod
    def push_payload_compressed(
        cls, session_secure_id: str, payload_id: str, data: str
    ) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {
            "session_secure_id": {"type": "String!", "value": session_secure_id},
            "payload_id": {"type": "ID!", "value": payload_id},
            "data": {"type": "String!", "value": data},
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(
            field_name="pushPayloadCompressed", arguments=cleared_arguments
        )

    @classmethod
    def push_backend_payload(
        cls, errors: BackendErrorObjectInput, *, project_id: Optional[str] = None
    ) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {
            "project_id": {"type": "String", "value": project_id},
            "errors": {"type": "BackendErrorObjectInput!", "value": errors},
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(
            field_name="pushBackendPayload", arguments=cleared_arguments
        )

    @classmethod
    def push_metrics(cls, metrics: MetricInput) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {
            "metrics": {"type": "MetricInput!", "value": metrics}
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(field_name="pushMetrics", arguments=cleared_arguments)

    @classmethod
    def mark_backend_setup(
        cls,
        *,
        project_id: Optional[str] = None,
        session_secure_id: Optional[str] = None,
        type: Optional[str] = None
    ) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {
            "project_id": {"type": "String", "value": project_id},
            "session_secure_id": {"type": "String", "value": session_secure_id},
            "type": {"type": "String", "value": type},
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(field_name="markBackendSetup", arguments=cleared_arguments)

    @classmethod
    def add_session_feedback(
        cls,
        session_secure_id: str,
        verbatim: str,
        timestamp: Any,
        *,
        user_name: Optional[str] = None,
        user_email: Optional[str] = None
    ) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {
            "session_secure_id": {"type": "String!", "value": session_secure_id},
            "user_name": {"type": "String", "value": user_name},
            "user_email": {"type": "String", "value": user_email},
            "verbatim": {"type": "String!", "value": verbatim},
            "timestamp": {"type": "Timestamp!", "value": timestamp},
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(
            field_name="addSessionFeedback", arguments=cleared_arguments
        )
