"""Internal class for building evaluation response schemas."""

from typing import Any, Dict


class EvaluationSchemaBuilder:
    """
    Internal class for building evaluation response schemas.
    Not exported - only used internally by Judge.
    Schema is a fixed shape: top-level score and reasoning.
    The judge config's evaluation_metric_key is only used when keying the result,
    not in the schema.
    """

    @staticmethod
    def build() -> Dict[str, Any]:
        """
        Build the evaluation response schema. No parameters; the schema is
        always the same. The judge keys the parsed result by its config's
        evaluation_metric_key.

        In practice the model returns JSON like:
          {"score": 0.85, "reasoning": "The response is accurate."}

        :return: Schema dictionary for structured output
        """
        return {
            'title': 'EvaluationResponse',
            'description': 'Response containing an evaluation (score and reasoning).',
            'type': 'object',
            'properties': {
                'score': {
                    'type': 'number',
                    'minimum': 0,
                    'maximum': 1,
                    'description': 'Score between 0.0 and 1.0.',
                },
                'reasoning': {
                    'type': 'string',
                    'description': 'Reasoning behind the score.',
                },
            },
            'required': ['score', 'reasoning'],
            'additionalProperties': False,
        }
