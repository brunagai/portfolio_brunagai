"""Integração resiliente com a API da Groq."""

from __future__ import annotations

import logging

from groq import APIConnectionError, APITimeoutError, Groq, RateLimitError

from core.config import Config

logger = logging.getLogger(__name__)

_MENSAGEM_FALLBACK = "Erro de comunicação com o serviço cognitivo."


class GroqService:
    """Encapsula o cliente Groq e isola falhas da API do restante do agente."""

    def __init__(self, config: Config) -> None:
        self._config = config
        self._client = Groq(api_key=config.groq_api_key)

    def gerar_resposta(self, prompt: str) -> str:
        """Envia o prompt ao modelo configurado e devolve o texto gerado."""
        try:
            resposta = self._client.chat.completions.create(
                model=self._config.GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
            )
            conteudo = resposta.choices[0].message.content
            return conteudo.strip() if conteudo else _MENSAGEM_FALLBACK
        except RateLimitError as exc:
            logger.error("Rate limit da Groq atingido: %s", exc)
            return _MENSAGEM_FALLBACK
        except (APIConnectionError, APITimeoutError) as exc:
            logger.error("Falha de conexão com a Groq: %s", exc)
            return _MENSAGEM_FALLBACK
        except Exception as exc:
            logger.exception("Erro inesperado ao chamar a Groq: %s", exc)
            return _MENSAGEM_FALLBACK
