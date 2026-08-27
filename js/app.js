const IS_EN = document.documentElement.lang.toLowerCase().startsWith("en");

const I18N_PT = {
  responses: {
    "quem é você?":
      "Passei por uma transição de carreira da área de operações financeiras, curso Análise e Desenvolvimento de Sistemas e atuo com engenharia de software e inteligência artificial.",
    "quais suas habilidades técnicas?":
      "Trabalho com Python, SQL, TypeScript, C#, FastAPI, ASP.NET Core, Next.js e Supabase. Também utilizo ferramentas de IA e automação como Databricks, Groq, Claude, Gemini, Canva, Cursor, Notion e Gamma.",
    "quais seus diferenciais?":
      "Tenho vivência prática construindo soluções sob pressão em hackathons, fui cofundadora de uma comunidade feminina de hardware e foco sempre em eficiência em conjunto com uma visão estratégica para negócios.",
    "por que te contratar?":
      "Sendo bem sincera: eu gosto de dinheiro... Mas eu também tenho automações eficientes, código limpo, muita curiosidade por resolver problemas reais! Dê uma olhada em meus projetos logo abaixo",
  },
  fallback:
    "Comando não reconhecido. Você pode perguntar: 'Quem é você?', 'Quais suas habilidades técnicas?', 'Quais seus diferenciais?' ou 'Por que te contratar?'",
  placeholder: "Selecione um dos botões...",
  userMeta: "você // input",
  agentMeta: "agente // reply",
  typingMeta: "agente // typing",
  typingLabel: "Agente digitando",
  bootLines: [
    "Inicializando perfil... ",
    "Conectando agentes de IA... ",
    "Olá, mundo!",
  ],
  shell: {
    help: "comandos disponíveis:\n  whoami       - quem eu sou\n  curiosidades - o que faço fora do código\n  comunidades  - espaços que apoio e participo\n  hire         - como me contatar\n  clear        - limpa o terminal",
    whoami:
      "Bruna Nagai, criada em Hamamatsu e em Manaus, apaixonada por tecnologia e inovação.",
    curiosidades:
      "Sou fã de anime (One Piece, Death Note e A Viagem de Chihiro que o digam). Também gosto de crochê e de conhecer restaurantes, bares e lugares novos!",
    comunidades:
      "Apoio muito a diversidade na tecnologia e colaboro com comunidades femininas. Atuei como mentora de engenharia de prompt no Hack da Shiva. Hackathons estão sendo minha diversão nos últimos meses!",
    hire: "Quer trocar uma ideia sobre oportunidades? Meus contatos profissionais e redes estão logo abaixo do terminal!",
  },
  zshWelcome: [
    { text: "bruna@portfolio:~$ sessão iniciada", className: "zsh-welcome" },
    {
      text: 'digite "help" para ver os comandos disponíveis',
      className: "zsh-hint",
    },
  ],
  zshUnknown: (command) => `command not found: ${command}. Digite 'help'.`,
  chatError: "Falha ao processar o comando. Tente novamente.",
};

const I18N_EN = {
  responses: {
    "who are you?":
      "I transitioned from financial operations into software. I study Systems Analysis and Development and work across software engineering and artificial intelligence.",
    "what's your stack?":
      "I work with Python, SQL, TypeScript, C#, FastAPI, ASP.NET Core, Next.js, and Supabase. I also use AI and automation tools such as Databricks, Groq, Claude, Gemini, Canva, Cursor, Notion, and Gamma.",
    "what sets you apart?":
      "I have hands-on practice building solutions under pressure in hackathons, co-founded a women-in-hardware community, and always combine efficiency with a strategic eye for business.",
    "why hire you?":
      "I'll be honest: I like money... But I also ship efficient automations, clean code, and a lot of curiosity for real-world problems. Check out my projects below.",
  },
  fallback:
    "Command not recognized. You can ask: 'Who are you?', 'What's your stack?', 'What sets you apart?', or 'Why hire you?'",
  placeholder: "Select one of the buttons...",
  userMeta: "you // input",
  agentMeta: "agent // reply",
  typingMeta: "agent // typing",
  typingLabel: "Agent typing",
  bootLines: [
    "Initializing profile... ",
    "Connecting AI agents... ",
    "Hello, world!",
  ],
  shell: {
    help: "available commands:\n  whoami      - who I am\n  hobbies     - what I do away from the keyboard\n  communities - spaces I support and take part in\n  hire        - how to reach me\n  clear       - clear the terminal",
    whoami:
      "Bruna Nagai, raised in Hamamatsu and Manaus, passionate about technology and innovation.",
    hobbies:
      "I'm an anime fan (One Piece, Death Note, and Spirited Away, to name a few). I also love crochet and discovering new restaurants, bars, and places!",
    communities:
      "I strongly support diversity in tech and often collaborate with women-in-tech communities. I mentored prompt engineering at Hack da Shiva. Hackathons have been my favorite playground these past months!",
    hire: "Want to talk about opportunities? My professional contacts and socials are right below this terminal!",
  },
  zshWelcome: [
    { text: "bruna@portfolio:~$ session started", className: "zsh-welcome" },
    { text: 'type "help" to see available commands', className: "zsh-hint" },
  ],
  zshUnknown: (command) => `command not found: ${command}. Type 'help'.`,
  chatError: "Failed to process the command. Please try again.",
};

const I18N = IS_EN ? I18N_EN : I18N_PT;

const RESPONSES = I18N.responses;
const FALLBACK = I18N.fallback;
const PLACEHOLDER = I18N.placeholder;
const TYPE_DELAY_MS = 42;
const TYPING_DELAY_MS = 1500;
const ZSH_MAX_COMMAND_LENGTH = 80;

const chatLog = document.getElementById("chat-log");
const commandText = document.getElementById("command-text");
const actionButtons = document.querySelectorAll(".action-btn");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

let isBusy = false;

function lookup(question) {
  return RESPONSES[question.trim().toLowerCase()] ?? FALLBACK;
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function scrollChatToBottom() {
  if (!chatLog) {
    return;
  }

  chatLog.scrollTop = chatLog.scrollHeight;
}

function setLiveRegion(container, announce) {
  if (!container) {
    return;
  }

  container.setAttribute("aria-live", announce ? "polite" : "off");
}

function appendToLog(container, node, announce) {
  if (!container) {
    return;
  }

  setLiveRegion(container, announce);
  container.appendChild(node);
}

function setDisplay(text, isPlaceholder) {
  if (!commandText) {
    return;
  }

  commandText.textContent = text;
  commandText.classList.toggle("is-placeholder", isPlaceholder);
}

function setButtonsDisabled(disabled) {
  actionButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function appendMessage(role, text, announce) {
  if (!chatLog) {
    return;
  }

  const article = document.createElement("article");
  article.className = `msg msg-${role}`;

  const meta = document.createElement("span");
  meta.className = "msg-meta";
  meta.textContent = role === "user" ? I18N.userMeta : I18N.agentMeta;

  const body = document.createElement("p");
  body.textContent = text;

  article.append(meta, body);
  appendToLog(chatLog, article, announce);
  scrollChatToBottom();
}

function appendTypingIndicator() {
  if (!chatLog) {
    return null;
  }

  const article = document.createElement("article");
  article.className = "msg msg-agent msg-typing";
  article.setAttribute("aria-hidden", "true");

  const meta = document.createElement("span");
  meta.className = "msg-meta";
  meta.textContent = I18N.typingMeta;

  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.setAttribute("aria-hidden", "true");

  for (let index = 0; index < 3; index += 1) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.textContent = ".";
    indicator.appendChild(dot);
  }

  article.append(meta, indicator);
  setLiveRegion(chatLog, false);
  chatLog.appendChild(article);
  scrollChatToBottom();
  return article;
}

async function typeQuestion(question) {
  setDisplay("", false);

  if (!commandText) {
    return;
  }

  if (prefersReducedMotion) {
    setDisplay(question, false);
    return;
  }

  for (const character of question) {
    commandText.textContent += character;
    await sleep(TYPE_DELAY_MS);
  }
}

async function playQuestion(question) {
  if (isBusy || !question || !chatLog) {
    return;
  }

  isBusy = true;
  setButtonsDisabled(true);

  let typingBubble = null;

  try {
    setLiveRegion(chatLog, false);
    appendMessage("user", question, false);
    typingBubble = appendTypingIndicator();

    await Promise.all([
      typeQuestion(question),
      sleep(prefersReducedMotion ? 0 : TYPING_DELAY_MS),
    ]);

    typingBubble?.remove();
    typingBubble = null;
    setDisplay(PLACEHOLDER, true);
    appendMessage("agent", lookup(question), true);
  } catch {
    typingBubble?.remove();
    typingBubble = null;
    setDisplay(PLACEHOLDER, true);
    appendMessage("agent", I18N.chatError, true);
  } finally {
    typingBubble?.remove();
    isBusy = false;
    setButtonsDisabled(false);
  }
}

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    playQuestion((button.dataset.question || button.textContent).trim());
  });
});

const BOOT_ROOT = document.getElementById("boot-sequence-container");
const BOOT_TYPE_DELAY_MS = 40;

function appendBootLine() {
  const line = document.createElement("p");
  line.className = "boot-line";

  const prompt = document.createElement("span");
  prompt.className = "boot-prompt";
  prompt.textContent = "$ ";
  prompt.setAttribute("aria-hidden", "true");

  const body = document.createElement("span");
  line.append(prompt, body);
  BOOT_ROOT?.appendChild(line);
  return { line, body };
}

async function typeInto(element, text) {
  if (prefersReducedMotion) {
    element.textContent += text;
    return;
  }

  for (const character of text) {
    element.textContent += character;
    await sleep(BOOT_TYPE_DELAY_MS);
  }
}

function appendBootCursor(line) {
  const cursor = document.createElement("span");
  cursor.className = "terminal-cursor";
  cursor.setAttribute("aria-hidden", "true");
  line.appendChild(cursor);
}

function appendBootOk(line) {
  const ok = document.createElement("span");
  ok.className = "boot-ok";
  ok.textContent = "OK";
  line.appendChild(ok);
}

async function playBootCycle() {
  if (!BOOT_ROOT) {
    return;
  }

  BOOT_ROOT.replaceChildren();

  const line1 = appendBootLine();
  await typeInto(line1.body, I18N.bootLines[0]);
  appendBootOk(line1.line);
  await sleep(prefersReducedMotion ? 0 : 500);

  const line2 = appendBootLine();
  await typeInto(line2.body, I18N.bootLines[1]);
  appendBootOk(line2.line);
  await sleep(prefersReducedMotion ? 0 : 500);

  const line3 = appendBootLine();
  await typeInto(line3.body, I18N.bootLines[2]);
  appendBootCursor(line3.line);
}

async function runBootSequence() {
  if (!BOOT_ROOT) {
    return;
  }

  if (prefersReducedMotion) {
    await playBootCycle();
    return;
  }

  while (true) {
    try {
      await playBootCycle();
    } catch {
      BOOT_ROOT.replaceChildren();
    }

    await sleep(4000);
    BOOT_ROOT.replaceChildren();
    await sleep(1000);
  }
}

runBootSequence();

const skipLink = document.querySelector(".skip-link");
const mainContent = document.getElementById("conteudo");

if (skipLink && mainContent) {
  skipLink.addEventListener("click", (event) => {
    event.preventDefault();
    mainContent.focus({ preventScroll: false });
  });
}

const filterButtons = document.querySelectorAll(".filter-cmd");
const projectCards = document.querySelectorAll(".project-card");

function setActiveFilter(button) {
  filterButtons.forEach((cmd) => {
    const isActive = cmd === button;
    cmd.classList.toggle("active", isActive);
    cmd.setAttribute("aria-pressed", String(isActive));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button);

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      if (filter === "todos") {
        card.style.display = "flex";
        return;
      }

      const tokens = (card.dataset.stacks || "")
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean);
      card.style.display = tokens.includes(filter) ? "flex" : "none";
    });
  });
});

const SHELL_EASTER_EGGS_PT = {
  "git init":
    "Initialized empty Git repository. Tudo pronto para o nosso primeiro commit juntos!",
  "git status":
    "On branch main. Working tree is clean. Status atual: disponível para novos desafios.",
  sudo: "Nice try! 🕵️‍♀️ Mas os privilégios de root neste terminal pertencem exclusivamente a mim.",
  ping: "pong! Latência: 0ms. Sou tão rápida quanto as automações que construo. ",
  "rm -rf /": "Acesso negado! Tentando deletar meu portfólio?",
  ls: "projetos_ia/  scripts_sql/  receitas_anel_magico/  mapas_grand_line/",
  cd: "Erro: Caminho não encontrado. Você não estaria usando o senso de direção do Zoro, né?",
  python:
    "Python 3.12.0 (main). Type 'help' or 'credits' for more information.\n>>> print('Automatizando o mundo!')",
  sql: "SELECT * FROM recrutadores WHERE interessados = TRUE;\n-- 1 row(s) returned. \n-- Ação recomendada: Contratar a Bruna!",
  typescript:
    "tsc --strict\n✅ Compilação concluída com sucesso. Zero erros de tipagem encontrados.",
  "c#": "dotnet run\nBuild succeeded.\n0 Warning(s), 0 Error(s).\nIniciando serviço...",
  fastapi:
    "INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)\nINFO:     Application startup complete. Pronta para receber requests!",
  "asp.net":
    "info: Microsoft.Hosting.Lifetime[14]\n      Now listening on: https://localhost:5001\n      Application started. Press Ctrl+C to shut down.",
  "next.js":
    "ready - started server on 0.0.0.0:3000, url: http://localhost:3000\nevent - compiled client and server successfully.",
  supabase:
    "supabase status\nAPI URL: http://localhost:54321\nDB URL: postgresql://postgres:postgres@localhost:54322\nRow Level Security: Ativada.",
  databricks:
    "databricks clusters start\nCluster conectado. Spark pronto para processar pipelines de dados escaláveis!",
  cursor:
    "cursor .\nAbrindo a IDE... O AI Pair Programming já está aquecido para codar.",
  canva:
    "bash: canva: command not found.\nAdoro usar para criar designs incríveis, mas tentar rodar isso no terminal é tipo desenhar com um teclado. ",
  notion:
    "bash: notion: command not found.\nMeu segundo cérebro mora lá, mas não dá pra organizar a vida inteira por linha de comando!",
  gamma:
    "bash: gamma: command not found.\nÓtimo para gerar apresentações com IA em segundos, mas este terminal é puramente texto (e muito estilo).",
  groq: "bash: groq: command not found.\nA inferência na LPU deles é absurdamente rápida, mas as requisições acontecem no meu back-end, não aqui soltas no bash!",
  claude:
    "bash: claude: command not found.\nAdoro bater um papo de arquitetura de software com ele, mas ele mora na nuvem da Anthropic, não no meu console.",
  gemini:
    "bash: gemini: command not found.\n(Como a IA do Google que me ajudou a construir este projeto, com certeza ficou feliz! 😉)",
};

const SHELL_EASTER_EGGS_EN = {
  "git init":
    "Initialized empty Git repository. Ready for our first commit together!",
  "git status":
    "On branch main. Working tree is clean. Current status: available for new challenges.",
  sudo: "Nice try! 🕵️‍♀️ But root privileges on this terminal belong exclusively to me.",
  ping: "pong! Latency: 0ms. I'm as fast as the automations I build. ",
  "rm -rf /": "Access denied! Trying to delete my portfolio?",
  ls: "ai_projects/  sql_scripts/  magic_ring_recipes/  grand_line_maps/",
  cd: "Error: Path not found. You wouldn't be using Zoro's sense of direction, would you?",
  python:
    "Python 3.12.0 (main). Type 'help' or 'credits' for more information.\n>>> print('Automating the world!')",
  sql: "SELECT * FROM recruiters WHERE interested = TRUE;\n-- 1 row(s) returned. \n-- Recommended action: Hire Bruna!",
  typescript:
    "tsc --strict\n✅ Compilation completed successfully. Zero type errors found.",
  "c#": "dotnet run\nBuild succeeded.\n0 Warning(s), 0 Error(s).\nStarting service...",
  fastapi:
    "INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)\nINFO:     Application startup complete. Ready to receive requests!",
  "asp.net":
    "info: Microsoft.Hosting.Lifetime[14]\n      Now listening on: https://localhost:5001\n      Application started. Press Ctrl+C to shut down.",
  "next.js":
    "ready - started server on 0.0.0.0:3000, url: http://localhost:3000\nevent - compiled client and server successfully.",
  supabase:
    "supabase status\nAPI URL: http://localhost:54321\nDB URL: postgresql://postgres:postgres@localhost:54322\nRow Level Security: Enabled.",
  databricks:
    "databricks clusters start\nCluster connected. Spark is ready to process scalable data pipelines!",
  cursor:
    "cursor .\nOpening the IDE... AI Pair Programming is already warmed up and ready to code.",
  canva:
    "bash: canva: command not found.\nI love using it to create stunning designs, but running this in the terminal is like drawing with a keyboard. ",
  notion:
    "bash: notion: command not found.\nMy second brain lives there, but you can't organize your whole life from the command line!",
  gamma:
    "bash: gamma: command not found.\nGreat for generating AI presentations in seconds, but this terminal is pure text (and a lot of style).",
  groq: "bash: groq: command not found.\nTheir LPU inference is insanely fast, but those requests happen in my back-end — not loose here in bash!",
  claude:
    "bash: claude: command not found.\nI love talking software architecture with him, but he lives in Anthropic's cloud, not in my console.",
  gemini:
    "bash: gemini: command not found.\n(As the Google AI that helped me build this project, it was definitely happy! 😉)",
};

const SHELL_EASTER_EGGS = IS_EN ? SHELL_EASTER_EGGS_EN : SHELL_EASTER_EGGS_PT;

const SHELL_COMMANDS = {
  ...I18N.shell,
  ...SHELL_EASTER_EGGS,
  curiosidades: I18N.shell.curiosidades || I18N.shell.hobbies,
  hobbies: I18N.shell.hobbies || I18N.shell.curiosidades,
  comunidades: I18N.shell.comunidades || I18N.shell.communities,
  communities: I18N.shell.communities || I18N.shell.comunidades,
};

const zshHistory = document.getElementById("zsh-history");
const zshInput = document.getElementById("zsh-input");
const zshWindow = document.querySelector(".zsh-window");
const zshBody = document.querySelector(".zsh-body");

function appendZshLine(text, className, announce = false) {
  if (!zshHistory) {
    return;
  }

  const line = document.createElement("p");
  line.className = `zsh-line ${className}`;
  line.textContent = text;
  appendToLog(zshHistory, line, announce);
}

function scrollZshToBottom() {
  if (!zshBody) {
    return;
  }

  zshBody.scrollTop = zshBody.scrollHeight;
}

function restoreZshWelcome() {
  if (!zshHistory) {
    return;
  }

  zshHistory.replaceChildren();
  setLiveRegion(zshHistory, false);
  I18N.zshWelcome.forEach(({ text, className }) => {
    appendZshLine(text, className, false);
  });
}

function runZshCommand(rawValue) {
  const command = rawValue.toLowerCase().trim().slice(0, ZSH_MAX_COMMAND_LENGTH);

  if (zshInput) {
    zshInput.value = "";
  }

  if (!command) {
    zshInput?.focus();
    return;
  }

  if (command === "clear") {
    restoreZshWelcome();
    zshInput?.focus();
    scrollZshToBottom();
    return;
  }

  appendZshLine(`> ${command}`, "zsh-cmd", false);

  const reply = SHELL_COMMANDS[command];
  if (reply) {
    appendZshLine(reply, "zsh-out", true);
  } else {
    appendZshLine(I18N.zshUnknown(command), "zsh-error", true);
  }

  if (zshInput) {
    zshInput.focus();
  }
  scrollZshToBottom();
}

if (zshInput && zshHistory) {
  zshInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    runZshCommand(zshInput.value);
  });

  zshWindow?.addEventListener("click", () => {
    zshInput.focus();
  });
}

const DEMO_GALLERIES = {
  lumen: {
    title: IS_EN ? "Lúmen — visual prototype" : "Lúmen — protótipo visual",
    slides: [
      {
        src: "images/lumen/doacao.png",
        caption: IS_EN ? "Donation screen" : "Tela de doação",
      },
      {
        src: "images/lumen/pagamento.png",
        caption: IS_EN ? "Payment method" : "Meio de pagamento",
      },
      {
        src: "images/lumen/obrigado.png",
        caption: IS_EN ? "Payment confirmation" : "Confirmação do Pagamento",
      },
      {
        src: "images/lumen/transparencia.png",
        caption: IS_EN ? "Transparency" : "Transparência",
      },
      {
        src: "images/lumen/inserir-nf.png",
        caption: IS_EN ? "Insert invoice" : "Inserir nota fiscal",
      },
    ],
  },
  "decasa-os": {
    title: IS_EN ? "DeCasa OS — visual prototype" : "DeCasa OS — protótipo visual",
    slides: [
      {
        src: "images/decasa-os/login.png",
        caption: IS_EN ? "Login screen" : "Tela de Login",
      },
      {
        src: "images/decasa-os/fila-do-dia.png",
        caption: IS_EN ? "Daily queue" : "Fila do dia",
      },
      {
        src: "images/decasa-os/funil.png",
        caption: IS_EN ? "Funnel" : "Funil",
      },
      {
        src: "images/decasa-os/mensagens.png",
        caption: IS_EN ? "Messages" : "Mensagens",
      },
      {
        src: "images/decasa-os/relatorios.png",
        caption: IS_EN ? "Reports" : "Relatórios",
      },
      {
        src: "images/decasa-os/configuracoes.png",
        caption: IS_EN ? "Settings" : "Configurações",
      },
      {
        src: "images/decasa-os/novo-cliente.png",
        caption: IS_EN ? "+ New client" : "+ Novo Cliente",
      },
      {
        src: "images/decasa-os/catalogo.png",
        caption: IS_EN ? "Catalog" : "Catálogo",
      },
    ],
  },
  tino: {
    title: IS_EN ? "Tino — visual prototype" : "Tino — protótipo visual",
    slides: [
      {
        src: "images/tino/login.png?v=2",
        caption: IS_EN ? "Login screen" : "Tela de Login",
      },
      {
        src: "images/tino/controle-clientes.png",
        caption: IS_EN ? "Client control" : "Controle de Clientes",
      },
      {
        src: "images/tino/funil.png",
        caption: IS_EN ? "Funnel & deals" : "Funil & Negociações",
      },
      {
        src: "images/tino/registro-pratico.png",
        caption: IS_EN ? "Practical log" : "Registro Prático",
      },
      {
        src: "images/tino/perfil.png",
        caption: IS_EN ? "Profile" : "Perfil",
      },
      {
        src: "images/tino/relatorios.png",
        caption: IS_EN ? "Reports" : "Relatórios",
      },
    ],
  },
};

function initDemoModal() {
  const dialog = document.getElementById("demo-modal");
  if (!dialog) {
    return;
  }

  const title = document.getElementById("demo-modal-title");
  const image = document.getElementById("demo-slide-image");
  const caption = document.getElementById("demo-slide-caption");
  const dotsRoot = dialog.querySelector(".demo-dots");

  let slides = [];
  let index = 0;
  let touchStartX = 0;

  function renderSlide() {
    const slide = slides[index];
    if (!slide || !image || !caption) {
      return;
    }

    image.src = slide.src;
    image.alt = slide.caption;
    caption.textContent = slide.caption;

    dotsRoot?.querySelectorAll(".demo-dot").forEach((dot, dotIndex) => {
      dot.setAttribute("aria-selected", String(dotIndex === index));
    });
  }

  function goTo(nextIndex) {
    if (!slides.length) {
      return;
    }
    index = (nextIndex + slides.length) % slides.length;
    renderSlide();
  }

  function buildDots() {
    if (!dotsRoot) {
      return;
    }
    dotsRoot.replaceChildren();
    slides.forEach((slide, slideIndex) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "demo-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", slide.caption);
      dot.setAttribute("aria-selected", String(slideIndex === index));
      dot.addEventListener("click", () => goTo(slideIndex));
      dotsRoot.append(dot);
    });
  }

  function openGallery(galleryId) {
    const gallery = DEMO_GALLERIES[galleryId];
    if (!gallery) {
      return;
    }

    slides = gallery.slides;
    index = 0;
    if (title) {
      title.textContent = gallery.title;
    }
    if (image) {
      image.removeAttribute("src");
      image.alt = "";
    }
    if (caption) {
      caption.textContent = "";
    }
    buildDots();
    renderSlide();

    try {
      if (!dialog.open && typeof dialog.showModal === "function") {
        dialog.showModal();
      } else if (!dialog.open) {
        dialog.setAttribute("open", "");
      }
    } catch {
      dialog.setAttribute("open", "");
    }
  }

  function closeGallery() {
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("#demo-modal")) {
      return;
    }

    if (event.target.closest("a.project-card-link")) {
      return;
    }

    const card = event.target.closest(".project-card");
    if (!card) {
      return;
    }

    activateProjectCard(card);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const card = event.target.closest?.(".project-card");
    if (!card || event.target !== card) {
      return;
    }

    event.preventDefault();
    activateProjectCard(card);
  });

  function activateProjectCard(card) {
    const galleryId = card.dataset.demo;
    if (galleryId && DEMO_GALLERIES[galleryId]?.slides?.length) {
      openGallery(galleryId);
    }
  }

  dialog.querySelector("[data-demo-prev]")?.addEventListener("click", () => goTo(index - 1));
  dialog.querySelector("[data-demo-next]")?.addEventListener("click", () => goTo(index + 1));
  dialog.querySelector("[data-demo-close]")?.addEventListener("click", closeGallery);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeGallery();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      goTo(index - 1);
    }
    if (event.key === "ArrowRight") {
      goTo(index + 1);
    }
  });

  image?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  image?.addEventListener("touchend", (event) => {
    const delta = (event.changedTouches[0]?.clientX || 0) - touchStartX;
    if (Math.abs(delta) < 40) {
      return;
    }
    goTo(delta < 0 ? index + 1 : index - 1);
  }, { passive: true });
}

initDemoModal();
