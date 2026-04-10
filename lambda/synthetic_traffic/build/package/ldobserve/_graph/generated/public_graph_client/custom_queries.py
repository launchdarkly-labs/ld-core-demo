from typing import Any, Dict, Optional

from .custom_fields import SamplingConfigFields
from .custom_typing_fields import GraphQLField


class Query:
    @classmethod
    def ignore(cls, id: str) -> GraphQLField:
        arguments: Dict[str, Dict[str, Any]] = {"id": {"type": "ID!", "value": id}}
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return GraphQLField(field_name="ignore", arguments=cleared_arguments)

    @classmethod
    def sampling(cls, organization_verbose_id: str) -> SamplingConfigFields:
        arguments: Dict[str, Dict[str, Any]] = {
            "organization_verbose_id": {
                "type": "String!",
                "value": organization_verbose_id,
            }
        }
        cleared_arguments = {
            key: value for key, value in arguments.items() if value["value"] is not None
        }
        return SamplingConfigFields(field_name="sampling", arguments=cleared_arguments)
