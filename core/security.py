"""Helpers de segurança para não expor dados sensíveis em logs ou erros."""

from __future__ import annotations

SENSITIVE_KEYS = ("api_key", "token", "secret", "password", "authorization")


def mask_secret(value: str, visible: int = 4) -> str:
    """Oculta o miolo de um segredo, deixando só o final visível."""
    if not value:
        return ""
    if len(value) <= visible:
        return "*" * len(value)
    return f"{'*' * (len(value) - visible)}{value[-visible:]}"


def redact_mapping(data: dict) -> dict:
    """Devolve uma cópia do dicionário com chaves sensíveis mascaradas."""
    redacted = {}
    for key, value in data.items():
        key_lower = str(key).lower()
        if any(sensitive in key_lower for sensitive in SENSITIVE_KEYS):
            redacted[key] = mask_secret(str(value)) if value is not None else None
        else:
            redacted[key] = value
    return redacted
