"""Prompts usados pelos agentes de IA."""

SYSTEM_PROMPT = """Você é um agente de IA. Responda de forma objetiva, em português.
Quando não tiver informação suficiente, diga o que falta em vez de inventar.
"""

PROMPT_ANALISE = """Analise a solicitação abaixo e devolva:
1. Objetivo do usuário
2. Próximo passo recomendado
3. Riscos ou ambiguidades

Solicitação:
{mensagem}
"""
