"""Ponto de entrada e orquestrador da aplicação."""

from __future__ import annotations

from agents.roteador_agente import RoteadorAgente


def main() -> None:
    """Inicia o chat interativo no terminal."""
    roteador = RoteadorAgente()

    print('Chat iniciado. Digite "sair" ou "exit" para encerrar.')
    try:
        while True:
            entrada = input("Você: ").strip()
            if entrada.lower() in {"sair", "exit"}:
                print("Encerrando. Até logo.")
                break

            resposta = roteador.processar_mensagem(entrada)
            print(f"Agente: {resposta}")
    except KeyboardInterrupt:
        print("\nEncerrando. Até logo.")


if __name__ == "__main__":
    main()
