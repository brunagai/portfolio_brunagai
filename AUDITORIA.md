# Auditoria do portfólio

Fonte: revisão de `index.html`, `en.html`, `css/styles.css`, `js/app.js` + checagem no browser em http://127.0.0.1:4173/ (PT e EN) · HEAD/GET nas URLs externas · 26 ago 2026

> **O site local está sólido. A URL pública não.**
>
> Localmente PT e EN sobem, o chat responde e os 7 projetos externos devolvem 200. https://brunagai.github.io/portifolio_brunagai/ devolve 404 — GitHub Pages não está publicado. Isso é o único bloqueio de “colocar no ar”.

| Score geral | P0 em aberto | Achados P1 | Achados P2 | Achados P3 |
| --- | --- | --- | --- | --- |
| **71 / 100** | 0 | 4 | 5 | 2 |

---

## Score por pilar

Eixo: score de 0 a 100. Linha de corte em 70.

| Pilar | Score |
| --- | ---: |
| SEO | 46 |
| Acessibilidade | 72 |
| Performance | 84 |
| Segurança | 88 |
| UX | 78 |
| Deploy | 62 |
| Mobile | 81 |

Achados por severidade (contagem não ponderada): **4 P1 · 5 P2 · 2 P3**

---

## O que já passa

- `lang` pt-BR / en, viewport, description, skip-link, labels no zsh
- `prefers-reduced-motion`, CSP + referrer-policy, `rel="noopener noreferrer"`
- `textContent` no chat/zsh, IDs únicos, sem `<section>` aninhada
- 7/7 URLs de projeto HTTP 200
- Layout mobile com CTAs empilhados
- Contraste do corpo (`#F3F0FF` em `#0B0308`) passa AAA
- Violeta de apoio (`#8B5CF6`) fica ~4.8:1 — AA para texto normal, abaixo de AAA

---

## Achados

### P1

| Pilar | Problema | Impacto | Correção |
| --- | --- | --- | --- |
| Deploy | GitHub Pages 404 em brunagai.github.io/portifolio_brunagai | O rodapé promete GitHub Pages, mas a URL pública não serve o site. Recrutador que chegar pelo repo não vê o portfólio. | Ativar Pages em Settings → Pages, source = main / root. Confirmar o URL e colocar no README. |
| SEO | hreflang com href relativo (`index.html` / `en.html`) | O Google ignora hreflang relativo. PT e EN competem como páginas duplicadas. | Usar URLs absolutas + hreflang `x-default` apontando para o PT. |
| SEO | Sem favicon, `og:*`, `twitter:card` ou `og:image` | Aba do browser fica genérica. LinkedIn, WhatsApp e iMessage compartilham um link sem preview. | favicon.svg + PNG 32/180. `og:title`, `og:description`, `og:url`, `og:image` 1200×630 por idioma. |
| A11y | Quatro regiões `aria-live=polite`; boot em loop infinito | Leitor de tela anuncia o typewriter do boot sem parar. O command-bar também vive e soletra cada letra do chat. | Tirar `aria-live` do boot e do command-bar. Manter só chat-log e zsh-history, com `aria-live=polite` só na mensagem completa. |

### P2

| Pilar | Problema | Impacto | Correção |
| --- | --- | --- | --- |
| SEO | Title idêntico em PT e EN; sem canonical, robots.txt ou sitemap | Snippet igual nas duas línguas. Sem mapa, o crawler depende só dos links internos. | Title PT vs EN distintos. `link rel=canonical` absoluto. `robots.txt` + `sitemap.xml` no root. |
| A11y | Skip-link vai para `#chat` e pula o hero | Teclado e leitores pulam nome, cargo e CTAs — o conteúdo principal. | `id` no `<main>` e skip para `#conteudo`. Hero cargo como `<p>`, não `<h2>`. |
| A11y | Filtros sem `aria-pressed`; idioma sem `aria-current` | O estado ativo só existe em CSS. SR não diz qual filtro ou língua está selecionada. | `aria-pressed` nas `.filter-cmd`. `aria-current="true"` no idioma ativo. |
| UX | Tino e DeCasa OS “ao vivo” abrem `/login` | Filtro ver ao vivo promete demo. Recrutador cai num muro de autenticação. | Landing pública, ou rótulo no card (demo autenticada) + GitHub ao lado. |
| Conteúdo | Meta EN cita Web3; a PT não. Tokens mortos em `data-stacks` | Snippet EN vende Web3. Cards ainda carregam `ia` / `api` / `nextjs` / `web3` que nenhum filtro usa. | Alinhar as duas descriptions. Limpar `data-stacks` para `todos` \| `repositorio` \| `ver ao vivo`. |

### P3

| Pilar | Problema | Impacto | Correção |
| --- | --- | --- | --- |
| Deploy | Sem `404.html` no GitHub Pages | URL errada cai no 404 padrão do GitHub, fora da identidade visual. | `404.html` com o mesmo tema e link de volta ao index. |
| Manutenção | CLI Python (`main.py` / roteador) desatualizado vs o site | Quem rodar `python main.py` lê stacks e perguntas antigas. | Arquivar o CLI ou gerar as respostas a partir do mesmo dicionário do front. |

---

## Checagem de URLs

Método HEAD (GET quando HEAD falhou) · timeout 20s · 26 ago 2026

| Alvo | URL | HTTP | Nota |
| --- | --- | --- | --- |
| Lúmen | https://github.com/brunagai/lumen | 200 | OK |
| Tino | https://otino.vercel.app/login | 200 | Login wall |
| DeCasa OS | https://decasa-esquadria.vercel.app/login | 200 | Login wall |
| SatVantage | https://sat-vantage-gislanesena.vercel.app/ | 200 | OK |
| Clínica Popular | https://github.com/brunagai/clinica-popular | 200 | OK |
| BuildXP | https://www.buildxpdev.com.br/ | 200 | OK |
| Validação Fiscal | https://github.com/brunagai/api-validacao-fiscal | 200 | OK |
| GitHub user | https://github.com/brunagai | 200 | OK |
| LinkedIn | https://www.linkedin.com/in/brunagai | 999 | Anti-bot no HEAD; perfil existe |
| GitHub Pages | https://brunagai.github.io/portifolio_brunagai/ | 404 | Pages desligado |
| favicon.ico | http://127.0.0.1:4173/favicon.ico | 404 | Ausente |
| robots.txt | http://127.0.0.1:4173/robots.txt | 404 | Ausente |

---

## Plano de correção

- [ ] Ativar GitHub Pages (main / root) e validar o URL público
- [ ] favicon + Open Graph + Twitter Card (PT e EN)
- [ ] hreflang absoluto, `x-default`, canonical e titles distintos
- [ ] Remover `aria-live` do boot e do command-bar
- [ ] Skip para `main`, `aria-pressed` nos filtros, `aria-current` no idioma
- [ ] Tratar Tino/DeCasa: landing pública ou rótulo de demo autenticada

---

## Detalhe por pilar

### SEO — 46

Tem description e hreflang, mas o hreflang relativo não conta para o Google. Title igual nas duas línguas. Sem canonical, robots, sitemap, favicon ou preview social. Isso é o maior gap para um portfólio que precisa ser encontrado e compartilhado.

### Acessibilidade — 72

Base boa (skip-link, labels, reduced-motion, regiões nomeadas). O boot em loop com `aria-live` é o regressor. Outline de headings começa com H1 + H2 de cargo antes de “Sobre mim”. Filtros e toggle de idioma não expõem estado.

### Performance — 84

Site estático, zero fetch, imagens zero. Custo: Google Fonts bloqueando render e o loop infinito do boot (timers + DOM). `display=swap` já está no CSS da fonte.

### Segurança — 88

CSP em meta, referrer estrito, noopener, sem secrets, sem `innerHTML` no zsh. Meta CSP é mais fraca que header HTTP — no GitHub Pages isso é o máximo sem Cloudflare/`_headers`.

### UX / conteúdo — 78

PT/EN consistentes no fluxo. Chat O(1) e filtros funcionam. “Ver ao vivo” que abre login quebra a promessa. Cards não dizem se o destino é GitHub ou deploy.

### Deploy — 62

Repo https://github.com/brunagai/portifolio_brunagai existe (200). Pages no github.io 404. Sem CNAME, sem `404.html`, sem README de URL.

### Mobile — 81

Breakpoints em 860/768/720/640. CTAs empilham. Boot fica abaixo da dobra — aceitável. Toggle de idioma permanece visível.
