"""Sampling functionality for OpenTelemetry traces."""

from .custom_sampler import CustomSampler, SamplingResult, default_sampler

__all__ = [
    "CustomSampler",
    "SamplingResult",
    "default_sampler",
]
