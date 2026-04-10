"""Backward-compatibility shim — use ldai.managed_model.ManagedModel instead."""

from ldai.managed_model import ManagedModel

# Deprecated alias
Chat = ManagedModel

__all__ = ['ManagedModel', 'Chat']
