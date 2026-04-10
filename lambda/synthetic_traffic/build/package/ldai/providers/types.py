"""Types for AI provider responses."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Optional

from ldai.models import LDMessage
from ldai.tracker import TokenUsage

# Type alias for a registry of tools available to an agent.
# Keys are tool names; values are the callable implementations.
ToolRegistry = Dict[str, Callable]


@dataclass
class LDAIMetrics:
    """
    Metrics information for AI operations that includes success status and token usage.
    """
    success: bool
    usage: Optional[TokenUsage] = None

    def to_dict(self) -> Dict[str, Any]:
        """
        Render the metrics as a dictionary object.
        """
        result: Dict[str, Any] = {
            'success': self.success,
        }
        if self.usage is not None:
            result['usage'] = {
                'total': self.usage.total,
                'input': self.usage.input,
                'output': self.usage.output,
            }
        return result


@dataclass
class ModelResponse:
    """
    Response from a model invocation.
    """
    message: LDMessage
    metrics: LDAIMetrics
    evaluations: Optional[List[JudgeResponse]] = None


@dataclass
class StructuredResponse:
    """
    Structured response from AI models.
    """
    data: Dict[str, Any]
    raw_response: str
    metrics: LDAIMetrics


@dataclass
class EvalScore:
    """
    Score and reasoning for a single evaluation metric.
    """
    score: float  # Score between 0.0 and 1.0
    reasoning: str  # Reasoning behind the provided score

    def to_dict(self) -> Dict[str, Any]:
        """
        Render the evaluation score as a dictionary object.
        """
        return {
            'score': self.score,
            'reasoning': self.reasoning,
        }


@dataclass
class JudgeResponse:
    """
    Response from a judge evaluation containing scores and reasoning for multiple metrics.
    """
    evals: Dict[str, EvalScore]  # Dictionary where keys are metric names and values contain score and reasoning
    success: bool  # Whether the evaluation completed successfully
    judge_config_key: Optional[str] = None  # The key of the judge configuration that was used to generate this response
    error: Optional[str] = None  # Error message if evaluation failed

    def to_dict(self) -> Dict[str, Any]:
        """
        Render the judge response as a dictionary object.
        """
        result: Dict[str, Any] = {
            'evals': {key: eval_score.to_dict() for key, eval_score in self.evals.items()},
            'success': self.success,
        }
        if self.judge_config_key is not None:
            result['judgeConfigKey'] = self.judge_config_key
        if self.error is not None:
            result['error'] = self.error
        return result


@dataclass
class AgentResult:
    """
    Result from a single-agent run.
    """
    output: str
    raw: Any
    metrics: LDAIMetrics


@dataclass
class AgentGraphResult:
    """
    Result from an agent graph run.
    """
    output: str
    raw: Any
    metrics: LDAIMetrics
