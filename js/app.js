const RESPONSES = {
  "quem é você?":
    "Sou estudante do 3º semestre de Análise e Desenvolvimento de Sistemas, em transição da área de operações financeiras para a tecnologia.",
  "quais suas stacks?":
    "Trabalho com Python, SQL, TypeScript, C#, FastAPI, ASP.NET Core, Next.js e Supabase. Também utilizo ferramentas de IA e automação como Databricks, Groq, Claude, Make, n8n, Cursor, Leonardo.ai e Gamma.",
  "fale sobre seus projetos":
    "Destaco o Lúmen (2º lugar no WoHackathon na rede Solana focado em transparência de doações), o SatVantage (onboarding educacional com agentes IA) e o Tino (CRM integrado ao Supabase).",
  "como é a experiência na aramis?":
    "Atuo como estagiária de IA no time de Talentos e Transformação, desenvolvendo automações de processos e agentes de IA estruturados em Python e SQL.",
};

const FALLBACK =
  "Comando não reconhecido. Você pode perguntar: 'Quem é você?', 'Quais suas stacks?', 'Fale sobre seus projetos' ou 'Como é a experiência na Aramis?'";

const PLACEHOLDER = "Selecione um dos botões...";
const TYPE_DELAY_MS = 42;
const TYPING_DELAY_MS = 1500;

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
  chatLog.scrollTop = chatLog.scrollHeight;
}

function setDisplay(text, isPlaceholder) {
  commandText.textContent = text;
  commandText.classList.toggle("is-placeholder", isPlaceholder);
}

function setButtonsDisabled(disabled) {
  actionButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function appendMessage(role, text) {
  const article = document.createElement("article");
  article.className = `msg msg-${role}`;

  const meta = document.createElement("span");
  meta.className = "msg-meta";
  meta.textContent = role === "user" ? "você // input" : "agente // reply";

  const body = document.createElement("p");
  body.textContent = text;

  article.append(meta, body);
  chatLog.appendChild(article);
  scrollChatToBottom();
}

function appendTypingIndicator() {
  const article = document.createElement("article");
  article.className = "msg msg-agent msg-typing";
  article.setAttribute("aria-label", "Agente digitando");

  const meta = document.createElement("span");
  meta.className = "msg-meta";
  meta.textContent = "agente // typing";

  const dots = document.createElement("div");
  dots.className = "typing-dots";
  dots.setAttribute("aria-hidden", "true");

  for (let index = 0; index < 3; index += 1) {
    dots.appendChild(document.createElement("span"));
  }

  article.append(meta, dots);
  chatLog.appendChild(article);
  scrollChatToBottom();
  return article;
}

async function typeQuestion(question) {
  setDisplay("", false);

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
  if (isBusy || !question) {
    return;
  }

  isBusy = true;
  setButtonsDisabled(true);

  let typingBubble = null;

  try {
    appendMessage("user", question);
    typingBubble = appendTypingIndicator();

    await Promise.all([
      typeQuestion(question),
      sleep(prefersReducedMotion ? 0 : TYPING_DELAY_MS),
    ]);

    typingBubble.remove();
    typingBubble = null;
    setDisplay(PLACEHOLDER, true);
    appendMessage("agent", lookup(question));
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

const BOOT_ROOT = document.getElementById("boot-sequence");
const BOOT_TYPE_DELAY_MS = 28;
const BOOT_DOT_DELAY_MS = 380;

function appendBootLine() {
  const line = document.createElement("p");
  line.className = "boot-line";
  BOOT_ROOT.appendChild(line);
  return line;
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

async function runBootSequence() {
  if (!BOOT_ROOT) {
    return;
  }

  const line1 = appendBootLine();
  await typeInto(line1, "$ Initializing profile...");

  await sleep(300);
  const line2 = appendBootLine();
  await typeInto(line2, "$ Loading stack: Python, SQL, TypeScript, C#");

  await sleep(300);
  const line3 = appendBootLine();
  await typeInto(line3, "$ Connecting AI agents @ Aramis");

  for (let index = 0; index < 3; index += 1) {
    await sleep(prefersReducedMotion ? 0 : BOOT_DOT_DELAY_MS);
    line3.textContent += ".";
  }

  await sleep(prefersReducedMotion ? 0 : 500);
  const ok = document.createElement("span");
  ok.className = "boot-ok";
  ok.textContent = " OK";
  line3.appendChild(ok);

  await sleep(300);
  const line4 = appendBootLine();
  await typeInto(line4, "$ Hello, world! Bem-vinda ao meu terminal.");

  const cursor = document.createElement("span");
  cursor.className = "boot-cursor";
  cursor.textContent = "█";
  cursor.setAttribute("aria-hidden", "true");
  line4.appendChild(cursor);
}

runBootSequence();

const filterButtons = document.querySelectorAll(".filter-cmd");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((cmd) => {
      cmd.classList.remove("active");
    });
    button.classList.add("active");

    const filter = button.dataset.filter;

    projectCards.forEach((card) => {
      if (filter === "todos") {
        card.style.display = "flex";
        return;
      }

      const stacks = card.dataset.stacks || "";
      card.style.display = stacks.includes(filter) ? "flex" : "none";
    });
  });
});
