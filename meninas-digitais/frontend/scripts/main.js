document.addEventListener("DOMContentLoaded", () => {
  setupAuthenticationUI();
  fetchAndRenderEvents();
});

// --- Seletores de Elementos do DOM ---
const eventsGrid = document.getElementById("eventsGrid");
const noEvents = document.getElementById("noEvents");
const eventsCountEl = document.getElementById("eventsCount");
const verEventosBtnHero = document.getElementById("verEventosBtnHero");
const sobreBtnHero = document.getElementById("sobreBtnHero");

function setupAuthenticationUI() {
  const navActions = document.querySelector(".nav-actions");
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // "aluna" ou "administradora"

  // Usuário não logado (sem token) → mostra botão de login
  if (!token) {
    navActions.innerHTML = `<a href="login-cadastro.html" id="loginBtnNav" class="btn btn-primary">Login</a>`;
    return;
  }

  // Se o token existe, renderiza a UI com base no perfil do usuário

  // === Navbar para ALUNA ===
  if (userRole === "aluna") {
    navActions.innerHTML = `
      <a href="perfil-aluna.html" class="btn btn-outline">Meus Eventos</a>
      <button id="logoutBtn" class="btn btn-primary">Sair</button>
    `;
  }

  // === Navbar para ADMIN ===
  else if (userRole === "administradora") {
    navActions.innerHTML = `
      <a href="admin-dashboard.html" class="btn btn-outline">Dashboard ADM</a>
      <button id="logoutBtn" class="btn btn-primary">Sair</button>
    `;
  }

  // === Botão Sair (para ambos) ===
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      alert("Você saiu da sua conta.");
      window.location.reload();
    });
  }
}

/**
 * Busca os eventos da API de forma assíncrona e os renderiza na página.
 */
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
    noEvents.textContent =
      "Erro ao carregar eventos. Tente novamente mais tarde.";
    noEvents.hidden = false;
  }
}

/**
 * Renderiza a lista de eventos na grade da página.
 */
function renderEvents(eventsData) {
  eventsCountEl.textContent = `${eventsData.length}+`;

  if (eventsData.length === 0) {
    noEvents.hidden = false;
    eventsGrid.innerHTML = "";
  } else {
    noEvents.hidden = true;
    eventsGrid.innerHTML = "";
    eventsData.forEach((ev) => {
      const card = createEventCard(ev);
      eventsGrid.appendChild(card);
    });
  }
}

/**
 * Cria um elemento HTML (card) para um único evento.
 */
function createEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.setAttribute("data-id", event._id);

  card.innerHTML = `
    <div class="cover event-badges-container">
      <span class="badge badge-type">${event.publico_alvo || "Evento"}</span>
      <span class="badge badge-vacancies">${event.numero_vagas} vagas</span>
    </div>
    <div class="content">
      <h3>${event.titulo}</h3>
      <p class="event-meta-line">
        <span class="icon-text">🗓️ ${formatDate(event.data)}</span> 
        <span class="icon-text">🕒 ${event.horario}</span>
      </p>
      <p class="event-meta-line">
        <span class="icon-text">📍 ${event.local}</span>
      </p>
      <p class="event-desc">${event.descricao}</p>
      <div class="card-actions">
        <button class="btn btn-join btn-primary">Ver Detalhes</button>
      </div>
    </div>
  `;

  card.querySelector(".btn-join").addEventListener("click", () => {
    alert(
      `Detalhes do evento: ${event.titulo}\n\nPara se inscrever, faça o login!`
    );
  });

  return card;
}

/**
 * Formata uma string de data para o padrão 'dd/mês/aaaa' em português.
 */
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

// --- Listeners de Eventos para a Seção Hero ---
verEventosBtnHero?.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
});

