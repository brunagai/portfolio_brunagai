"""Carregamento e validação das variáveis de ambiente.

A aplicação falha na inicialização (Fail-Fast) se a chave da Groq
estiver ausente. Isso evita subir o processo em estado inseguro.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

_ROOT_DIR = Path(__file__).resolve().parent.parent
_ENV_PATH = _ROOT_DIR / ".env"

_DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"
_DEFAULT_LOG_LEVEL = "INFO"


def _load_env_file() -> None:
    """Carrega o `.env` da raiz do projeto, se existir."""
    load_dotenv(dotenv_path=_ENV_PATH)


def _require_env(name: str) -> str:
    """Lê uma variável obrigatória e falha se estiver ausente ou vazia."""
    value = os.getenv(name)
    if value is None or value.strip() == "":
        raise ValueError(
            f"{name} está ausente no .env. "
            "Copie .env.example para .env e preencha a chave."
        )
    return value.strip()


@dataclass(frozen=True)
class Config:
    """Configuração imutável da aplicação, lida do ambiente."""

    groq_api_key: str
    groq_model: str = _DEFAULT_GROQ_MODEL
    log_level: str = _DEFAULT_LOG_LEVEL

    @property
    def GROQ_MODEL(self) -> str:
        """Modelo Groq definido na variável GROQ_MODEL."""
        return self.groq_model

    @classmethod
    def from_env(cls) -> Config:
        """Constrói a configuração a partir das variáveis de ambiente."""
        _load_env_file()
        groq_model = os.getenv("GROQ_MODEL", _DEFAULT_GROQ_MODEL).strip()
        log_level = os.getenv("LOG_LEVEL", _DEFAULT_LOG_LEVEL).strip()
        return cls(
            groq_api_key=_require_env("GROQ_API_KEY"),
            groq_model=groq_model or _DEFAULT_GROQ_MODEL,
            log_level=log_level or _DEFAULT_LOG_LEVEL,
        )


def get_config() -> Config:
    """Ponto único de acesso à configuração validada."""
    return Config.from_env()
