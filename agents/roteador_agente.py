"""Roteador determinístico de mensagens com acesso O(1)."""

from __future__ import annotations

_FALLBACK = (
    "Comando não reconhecido. Você pode perguntar: 'Quem é você?', "
    "'Quais suas stacks?', 'Fale sobre seus projetos' ou "
    "'Qual seu foco atual?'"
)


class RoteadorAgente:
    """Responde perguntas pré-mapeadas sem dependências externas."""

    def __init__(self) -> None:
        self._respostas: dict[str, str] = {
            "quem é você?": (
                "Cursando Análise e Desenvolvimento de Sistemas, em "
                "transição de carreira da área de operações financeiras "
                "para a engenharia de software e inteligência "
                "artificial."
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
            "qual seu foco atual?": (
                "Atualmente, meu foco é arquitetar agentes de IA e "
                "automações usando Python, SQL e TypeScript para "
                "transformar processos manuais e ineficientes em sistemas "
                "inteligentes, determinísticos e escaláveis."
            ),
        }

    def processar_mensagem(self, mensagem: str) -> str:
        """Normaliza o input e devolve a resposta correspondente."""
        chave = mensagem.strip().lower()
        return self._respostas.get(chave, _FALLBACK)
