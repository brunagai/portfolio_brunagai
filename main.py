"""Ponto de entrada e orquestrador da aplicação."""

from __future__ import annotations

import logging
import sys

from agents.prompts import PROMPT_ANALISE, SYSTEM_PROMPT
from agents.regras import decidir_proximo_passo
from core.config import get_config
from core.security import mask_secret
from services.groq_service import GroqService
from utils.errors import AppError, handle_error
from utils.helpers import configurar_logging

logger = logging.getLogger(__name__)


def executar(mensagem: str, groq_service: GroqService) -> str:
    acao = decidir_proximo_passo(mensagem)

    if acao == "pedir_clarificacao":
        return "Preciso de um pouco mais de contexto para continuar."

    if acao == "usar_ferramenta":
        return (
            "Esta solicitação pediria uma ferramenta externa. "
            "Ainda não há integração ligada neste passo."
        )

    prompt = f"{SYSTEM_PROMPT}\n\n{PROMPT_ANALISE.format(mensagem=mensagem)}"
    return groq_service.gerar_resposta(prompt)


def main() -> int:
    try:
        config = get_config()
    except Exception as exc:
        print(
            "Falha ao carregar configurações. Copie .env.example para .env e preencha as variáveis.",
            file=sys.stderr,
        )
        print(f"Detalhe: {exc}", file=sys.stderr)
        return 1

    configurar_logging(config.log_level)
    logger.info(
        "Agente iniciado | modelo=%s | chave=%s",
        config.groq_model,
        mask_secret(config.groq_api_key),
    )

    mensagem = " ".join(sys.argv[1:]).strip()
    if not mensagem:
        print("Uso: python main.py \"sua mensagem\"")
        return 0

    groq_service = GroqService(config)

    try:
        resultado = executar(mensagem, groq_service)
    except Exception as exc:
        raise AppError("Não foi possível concluir a solicitação.", cause=exc) from exc

    print(resultado)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(handle_error(exc), file=sys.stderr)
        raise SystemExit(1)
