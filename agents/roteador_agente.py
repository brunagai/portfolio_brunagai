"""Roteador determinístico de mensagens com acesso O(1)."""

from __future__ import annotations

_FALLBACK = (
    "Comando não reconhecido. Você pode perguntar: 'Quem é você?', "
    "'Quais suas stacks?', 'Fale sobre seus projetos' ou "
    "'Como é a experiência na Aramis?'"
)


class RoteadorAgente:
    """Responde perguntas pré-mapeadas sem dependências externas."""

    def __init__(self) -> None:
        self._respostas: dict[str, str] = {
            "quem é você?": (
                "Sou estudante do 3º semestre de Análise e Desenvolvimento "
                "de Sistemas, em transição da área de operações financeiras "
                "para a tecnologia."
            ),
            "quais suas stacks?": (
                "Trabalho com Python, SQL, TypeScript, C#, FastAPI, "
                "ASP.NET Core, Next.js e Supabase. Também utilizo "
                "ferramentas de IA e automação como Databricks, Groq, "
                "Claude, Make, n8n, Cursor, Leonardo.ai e Gamma."
            ),
            "fale sobre seus projetos": (
                "Destaco o Lúmen (2º lugar no WoHackathon na rede Solana "
                "focado em transparência de doações), o SatVantage "
                "(onboarding educacional com agentes IA) e o Tino "
                "(CRM integrado ao Supabase)."
            ),
            "como é a experiência na aramis?": (
                "Atuo como estagiária de IA no time de Talentos e "
                "Transformação, desenvolvendo automações de processos e "
                "agentes de IA estruturados em Python e SQL."
            ),
        }

    def processar_mensagem(self, mensagem: str) -> str:
        """Normaliza o input e devolve a resposta correspondente."""
        chave = mensagem.strip().lower()
        return self._respostas.get(chave, _FALLBACK)
