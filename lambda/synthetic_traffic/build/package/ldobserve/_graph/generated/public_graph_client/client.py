from typing import Any, Dict, List, Tuple

from graphql import (
    DocumentNode,
    NamedTypeNode,
    NameNode,
    OperationDefinitionNode,
    OperationType,
    SelectionNode,
    SelectionSetNode,
    VariableDefinitionNode,
    VariableNode,
    print_ast,
)

from .async_base_client import AsyncBaseClient
from .base_operation import GraphQLField
from .get_sampling_config import GetSamplingConfig


def gql(q: str) -> str:
    return q


class Client(AsyncBaseClient):
    async def get_sampling_config(
        self, organization_verbose_id: str, **kwargs: Any
    ) -> GetSamplingConfig:
        query = gql(
            """
            query GetSamplingConfig($organization_verbose_id: String!) {
              sampling(organization_verbose_id: $organization_verbose_id) {
                spans {
                  name {
                    ...MatchParts
                  }
                  attributes {
                    key {
                      ...MatchParts
                    }
                    attribute {
                      ...MatchParts
                    }
                  }
                  events {
                    name {
                      ...MatchParts
                    }
                    attributes {
                      key {
                        ...MatchParts
                      }
                      attribute {
                        ...MatchParts
                      }
                    }
                  }
                  samplingRatio
                }
                logs {
                  message {
                    ...MatchParts
                  }
                  severityText {
                    ...MatchParts
                  }
                  attributes {
                    key {
                      ...MatchParts
                    }
                    attribute {
                      ...MatchParts
                    }
                  }
                  samplingRatio
                }
              }
            }

            fragment MatchParts on MatchConfig {
              regexValue
              matchValue
            }
            """
        )
        variables: Dict[str, object] = {
            "organization_verbose_id": organization_verbose_id
        }
        response = await self.execute(
            query=query,
            operation_name="GetSamplingConfig",
            variables=variables,
            **kwargs
        )
        data = self.get_data(response)
        return GetSamplingConfig.model_validate(data)

    async def execute_custom_operation(
        self, *fields: GraphQLField, operation_type: OperationType, operation_name: str
    ) -> Dict[str, Any]:
        selections = self._build_selection_set(fields)
        combined_variables = self._combine_variables(fields)
        variable_definitions = self._build_variable_definitions(
            combined_variables["types"]
        )
        operation_ast = self._build_operation_ast(
            selections, operation_type, operation_name, variable_definitions
        )
        response = await self.execute(
            print_ast(operation_ast),
            variables=combined_variables["values"],
            operation_name=operation_name,
        )
        return self.get_data(response)

    def _combine_variables(
        self, fields: Tuple[GraphQLField, ...]
    ) -> Dict[str, Dict[str, Any]]:
        variables_types_combined = {}
        processed_variables_combined = {}
        for field in fields:
            formatted_variables = field.get_formatted_variables()
            variables_types_combined.update(
                {k: v["type"] for k, v in formatted_variables.items()}
            )
            processed_variables_combined.update(
                {k: v["value"] for k, v in formatted_variables.items()}
            )
        return {
            "types": variables_types_combined,
            "values": processed_variables_combined,
        }

    def _build_variable_definitions(
        self, variables_types_combined: Dict[str, str]
    ) -> List[VariableDefinitionNode]:
        return [
            VariableDefinitionNode(
                variable=VariableNode(name=NameNode(value=var_name)),
                type=NamedTypeNode(name=NameNode(value=var_value)),
            )
            for var_name, var_value in variables_types_combined.items()
        ]

    def _build_operation_ast(
        self,
        selections: List[SelectionNode],
        operation_type: OperationType,
        operation_name: str,
        variable_definitions: List[VariableDefinitionNode],
    ) -> DocumentNode:
        return DocumentNode(
            definitions=[
                OperationDefinitionNode(
                    operation=operation_type,
                    name=NameNode(value=operation_name),
                    variable_definitions=variable_definitions,
                    selection_set=SelectionSetNode(selections=selections),
                )
            ]
        )

    def _build_selection_set(
        self, fields: Tuple[GraphQLField, ...]
    ) -> List[SelectionNode]:
        return [field.to_ast(idx) for idx, field in enumerate(fields)]

    async def query(self, *fields: GraphQLField, operation_name: str) -> Dict[str, Any]:
        return await self.execute_custom_operation(
            *fields, operation_type=OperationType.QUERY, operation_name=operation_name
        )

    async def mutation(
        self, *fields: GraphQLField, operation_name: str
    ) -> Dict[str, Any]:
        return await self.execute_custom_operation(
            *fields,
            operation_type=OperationType.MUTATION,
            operation_name=operation_name
        )
