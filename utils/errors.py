"""Tratamento de erros reaproveitável."""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


class AppError(Exception):
    """Erro de aplicação com mensagem segura para o usuário."""

    def __init__(self, message: str, *, cause: Exception | None = None) -> None:
        super().__init__(message)
        self.cause = cause


def handle_error(exc: Exception) -> str:
    """Registra o erro técnico e devolve uma mensagem amigável."""
    logger.exception("Falha na execução: %s", exc)
    if isinstance(exc, AppError):
        return str(exc)
    return "Ocorreu um erro inesperado. Verifique os logs para mais detalhes."
