"""Regras de tomada de decisão do agente."""

from __future__ import annotations

from typing import Literal

Acao = Literal["responder", "pedir_clarificacao", "usar_ferramenta"]


def decidir_proximo_passo(mensagem: str) -> Acao:
    """Decide o próximo passo a partir de regras simples e determinísticas."""
    texto = mensagem.strip().lower()

    if not texto:
        return "pedir_clarificacao"

    gatilhos_ferramenta = ("buscar", "consultar", "pesquisar", "api")
    if any(palavra in texto for palavra in gatilhos_ferramenta):
        return "usar_ferramenta"

    if len(texto.split()) < 3:
        return "pedir_clarificacao"

    return "responder"
