document.addEventListener("DOMContentLoaded", () => {
  // Gerencia a interface de autenticação e busca os eventos públicos ao carregar a página.
  setupAuthenticationUI();
  fetchAndRenderEvents();
});

// --- Seletores de Elementos do DOM ---
const eventsGrid = document.getElementById("eventsGrid");
const noEvents = document.getElementById("noEvents");
const eventsCountEl = document.getElementById("eventsCount");
const verEventosBtnHero = document.getElementById("verEventosBtnHero");
const sobreBtnHero = document.getElementById("sobreBtnHero");

/**
 * Verifica o estado de autenticação do usuário (através do token)
 * e atualiza a barra de navegação de acordo.
 */
function setupAuthenticationUI() {
  const navActions = document.querySelector(".nav-actions");
  const token = localStorage.getItem("token");

  if (token) {
    // Se o usuário está logado, exibe os botões de "Meus Eventos" e "Sair".
    navActions.innerHTML = `
      <a href="#" id="myEventsBtn" class="nav-link">Meus Eventos</a>
      <button id="logoutBtn" class="btn btn-primary">Sair</button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      alert("Você saiu da sua conta.");
      window.location.reload(); // Recarrega a página para refletir a mudança de estado.
    });

    document.getElementById("myEventsBtn").addEventListener("click", () => {
      alert("Funcionalidade 'Meus Eventos' a ser implementada!");
    });
  } else {
    // Se não há token, exibe o botão de "Login".
    navActions.innerHTML = `
      <a href="login-cadastro.html" id="loginBtnNav" class="btn btn-primary">Login</a>
    `;
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
 * @param {Array} eventsData - Um array de objetos de evento vindos da API.
 */
function renderEvents(eventsData) {
  eventsCountEl.textContent = `${eventsData.length}+`;

  if (eventsData.length === 0) {
    noEvents.hidden = false;
    eventsGrid.innerHTML = "";
  } else {
    noEvents.hidden = true;
    eventsGrid.innerHTML = ""; // Garante que a grid esteja limpa antes da nova renderização.
    eventsData.forEach((ev) => {
      const card = createEventCard(ev);
      eventsGrid.appendChild(card);
    });
  }
}

/**
 * Cria um elemento HTML (card) para um único evento.
 * @param {object} event - O objeto do evento contendo seus dados.
 * @returns {HTMLElement} O elemento <article> do card pronto para ser inserido no DOM.
 */
function createEventCard(event) {
  const card = document.createElement("article");
  card.className = "event-card";
  card.setAttribute("data-id", event._id); // O ID do MongoDB é usado como identificador.

  // Mapeia os dados do backend para a estrutura do card.
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

  // Adiciona o evento de clique ao botão de detalhes do card recém-criado.
  card.querySelector(".btn-join").addEventListener("click", () => {
    alert(
      `Detalhes do evento: ${event.titulo}\n\nPara se inscrever, faça o login!`
    );
  });

  return card;
}

/**
 * Formata uma string de data para o padrão 'dd/mês/aaaa' em português.
 * @param {string} dateStr - A string de data (ex: "2024-10-31").
 * @returns {string} A data formatada.
 */
function formatDate(dateStr) {
  try {
    // Interpreta a data como UTC para evitar deslocamentos de fuso horário
    // que poderiam resultar no dia errado sendo exibido.
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateStr; // Retorna a string original em caso de erro.
  }
}

// --- Listeners de Eventos para a Seção Hero ---
verEventosBtnHero?.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
});

sobreBtnHero?.addEventListener("click", (e) => {
  e.preventDefault();
  window.alert(
    "Sobre o projeto: Meninas Digitais - UTFPR-CP. Ferramenta para gestão de oficinas e minicursos."
  );
});
