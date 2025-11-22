document.addEventListener("DOMContentLoaded", () => {
  // 1. Configura a Navbar (Funciona em todas as páginas)
  setupAuthenticationUI();

  // 2. Só busca eventos se estivermos na página que tem o grid (Home)
  const eventsGrid = document.getElementById("eventsGrid");
  if (eventsGrid) {
    fetchAndRenderEvents();
  }
});

// --- Seletores Globais (podem ser null dependendo da página) ---
const eventsGrid = document.getElementById("eventsGrid");
const noEvents = document.getElementById("noEvents");
const eventsCountEl = document.getElementById("eventsCount");
const verEventosBtnHero = document.getElementById("verEventosBtnHero");

function setupAuthenticationUI() {
  const navActions = document.querySelector(".nav-actions");
  // Proteção extra caso a navbar não tenha a classe .nav-actions
  if (!navActions) return;

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    navActions.innerHTML = `<a href="login-cadastro.html" id="loginBtnNav" class="btn btn-primary">Login</a>`;
    return;
  }

  if (userRole === "aluna") {
    navActions.innerHTML = `
      <a href="perfil-aluna.html" class="btn btn-outline">Meus Eventos</a>
      <button id="logoutBtn" class="btn btn-primary">Sair</button>
    `;
  } else if (userRole === "administradora") {
    navActions.innerHTML = `
      <a href="admin-dashboard.html" class="btn btn-outline">Dashboard ADM</a>
      <button id="logoutBtn" class="btn btn-primary">Sair</button>
    `;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      alert("Você saiu da sua conta.");
      window.location.href = "index.html"; // Redireciona para home ao sair
    });
  }
}

async function fetchAndRenderEvents() {
  try {
    const response = await fetch("/api/eventos");
    if (!response.ok) {
      throw new Error("Não foi possível carregar os eventos.");
    }
    const eventsData = await response.json();
    renderEvents(eventsData);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    if (noEvents) {
      noEvents.textContent =
        "Erro ao carregar eventos. Tente novamente mais tarde.";
      noEvents.hidden = false;
    }
  }
}

function renderEvents(eventsData) {
  // Proteção: Só executa se os elementos existirem
  if (eventsCountEl) eventsCountEl.textContent = `${eventsData.length}+`;

  if (eventsData.length === 0) {
    if (noEvents) noEvents.hidden = false;
    if (eventsGrid) eventsGrid.innerHTML = "";
  } else {
    if (noEvents) noEvents.hidden = true;
    if (eventsGrid) {
      eventsGrid.innerHTML = "";
      eventsData.forEach((ev) => {
        const card = createEventCard(ev);
        eventsGrid.appendChild(card);
      });
    }
  }
}

function createEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.setAttribute("data-id", event._id);

  const dataFormatada = formatDate(event.data);

  // Cálculo de Vagas
  const totalInscritos = event.participantes ? event.participantes.length : 0;
  let vagasRestantes = event.numero_vagas - totalInscritos;
  if (vagasRestantes < 0) vagasRestantes = 0;

  // Lógica de Badge e Botão
  let badgeClass = "badge-vacancies";
  let badgeText = `${vagasRestantes} vagas`;
  let btnText = "Ver Detalhes";

  if (event.status === "Cancelado") {
    badgeText = "Cancelado";
    // Opcional: Estilo visual para cancelado
    card.style.opacity = "0.7";
  } else if (event.status === "Concluído") {
    badgeText = "Concluído";
  } else if (vagasRestantes === 0) {
    badgeText = "Esgotado";
  }

  card.innerHTML = `
    <div class="cover event-badges-container">
      <span class="badge badge-type">${event.publico_alvo || "Geral"}</span>
      <span class="badge ${badgeClass}">${badgeText}</span>
    </div>
    <div class="content">
      <h3>${event.titulo}</h3>
      <p class="event-meta-line">
        <span class="icon-text">🗓️ ${dataFormatada}</span> 
        <span class="icon-text">🕒 ${event.horario}</span>
      </p>
      <p class="event-meta-line">
        <span class="icon-text">📍 ${event.local}</span>
      </p>
      <p class="event-desc">${
        event.descricao ? event.descricao.substring(0, 100) + "..." : ""
      }</p>
      <div class="card-actions">
        <a href="detalhes-evento.html?id=${
          event._id
        }" class="btn btn-join btn-primary" style="width: 100%; text-decoration: none;">
          ${btnText}
        </a>
      </div>
    </div>
  `;

  return card;
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}

// Scroll Hero (Só adiciona o evento se o botão existir na página)
if (verEventosBtnHero) {
  verEventosBtnHero.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  });
}
