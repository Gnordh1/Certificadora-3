document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "/api/eventos";
  const token = localStorage.getItem("token");

  // =========================================================================
  // 1. ELEMENTOS DO DOM
  // =========================================================================

  // --- Modal de Criar/Editar Evento ---
  const modal = document.getElementById("eventModal");
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalTitle = document.getElementById("modalTitle");
  const addEventBtn = document.getElementById("addEventBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const eventForm = document.getElementById("eventForm");
  const eventIdField = document.getElementById("eventId");

  // --- Tabela Principal ---
  const eventsTableBody = document.getElementById("eventsTableBody");

  // --- Modal de Feedback ---
  const feedbackModal = document.getElementById("feedbackModal");
  const closeFeedbackBtn = document.getElementById("closeFeedbackBtn");
  const feedbackList = document.getElementById("feedbackList");
  const feedbackSummary = document.getElementById("feedbackSummary");

  // --- Modal de Participantes ---
  const participantsModal = document.getElementById("participantsModal");
  const closeParticipantsBtn = document.getElementById("closeParticipantsBtn");
  const participantsList = document.getElementById("participantsList");
  const participantsModalTitle = document.getElementById(
    "participantsModalTitle"
  );
  const participantsCountBadge = document.getElementById(
    "participantsCountBadge"
  );
  const copyEmailsBtn = document.getElementById("copyEmailsBtn");

  // Variável para guardar e-mails temporariamente para cópia
  let currentEmails = [];

  // =========================================================================
  // 2. CONTROLE DE ABERTURA/FECHAMENTO DE MODAIS
  // =========================================================================

  // Evento (Criar/Editar)
  const openModal = () => modal.classList.add("show");
  const closeModal = () => {
    modal.classList.remove("show");
    eventForm.reset();
    eventIdField.value = "";
  };

  // Feedback
  const openFeedbackModal = () => feedbackModal.classList.add("show");
  const closeFeedbackModal = () => feedbackModal.classList.remove("show");

  // Participantes
  const openParticipantsModal = () => participantsModal.classList.add("show");
  const closeParticipantsModal = () =>
    participantsModal.classList.remove("show");

  // =========================================================================
  // 3. RENDERIZAÇÃO DA TABELA DE EVENTOS (LAYOUT OTIMIZADO)
  // =========================================================================

  const fetchAndRenderEvents = async () => {
    try {
      const response = await fetch(apiBaseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar eventos");
      const events = await response.json();
      renderEvents(events);
    } catch (error) {
      eventsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${error.message}</td></tr>`;
    }
  };

  const renderEvents = (events) => {
    eventsTableBody.innerHTML = "";

    if (events.length === 0) {
      eventsTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 30px;">Nenhum evento encontrado.</td></tr>`;
      return;
    }

    events.forEach((event) => {
      const row = document.createElement("tr");

      // Cores para o status (Visualização no Select)
      let statusColor = "#555";
      if (event.status === "Concluído") statusColor = "#2e7d32"; // Verde
      if (event.status === "Cancelado") statusColor = "#c62828"; // Vermelho
      if (event.status === "Agendado") statusColor = "#6f42c1"; // Roxo

      // Botão de Feedback (Aparece apenas se concluído)
      // Ocupa 2 colunas no grid para ficar em destaque na parte inferior
      let feedbackBtnHTML = "";
      if (event.status === "Concluído") {
        feedbackBtnHTML = `
          <button class="btn btn-primary btn-feedback btn-action-small" 
                  style="background-color: #6f42c1; border:none; grid-column: span 2;" 
                  data-id="${event._id}" 
                  data-title="${event.titulo}">
             ⭐ Ver Avaliações
          </button>`;
      }

      row.innerHTML = `
        <!-- Título -->
        <td>
            <span style="display: block; line-height: 1.2; font-weight: 600;">${
              event.titulo
            }</span>
        </td>

        <!-- Data e Hora (Agrupados) -->
        <td>
            ${new Date(event.data).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
            <br>
            <span style="font-size: 0.8rem; color: #888;">${
              event.horario
            }</span>
        </td>

        <!-- Local -->
        <td>
            <span style="display: block; font-size: 0.9rem;">${
              event.local
            }</span>
        </td>

        <!-- Vagas -->
        <td style="text-align: center;">
            <strong>${
              event.participantes ? event.participantes.length : 0
            }</strong>
            <span style="color: #888;">/ ${event.numero_vagas}</span>
        </td>

        <!-- Status -->
        <td>
            <select class="status-select" data-id="${
              event._id
            }" style="color: ${statusColor}; border-color: ${statusColor};">
                <option value="Agendado" ${
                  event.status === "Agendado" ? "selected" : ""
                }>Agendado</option>
                <option value="Concluído" ${
                  event.status === "Concluído" ? "selected" : ""
                }>Concluído</option>
                <option value="Cancelado" ${
                  event.status === "Cancelado" ? "selected" : ""
                }>Cancelado</option>
            </select>
        </td>

        <!-- Ações (Grid Organizado) -->
        <td>
          <div class="actions-grid">
            
            <!-- Botão Lista de Inscritas (Destaque) -->
            <button class="btn btn-outline btn-participants btn-action-small" 
                    data-id="${event._id}" 
                    data-title="${event.titulo}"
                    title="Ver Lista de Presença"
                    style="border-color: #0288d1; color: #0288d1; grid-column: span 2;">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
               Lista de Inscritas
            </button>

            <!-- Botão Editar -->
            <button class="btn btn-outline btn-edit btn-action-small" 
                    data-id="${event._id}" title="Editar">
                ✏️ Editar
            </button>

            <!-- Botão Excluir -->
            <button class="btn btn-outline btn-delete btn-action-small" 
                    data-id="${event._id}" 
                    style="color: #c62828; border-color: #c62828;" title="Excluir">
                🗑️ Excluir
            </button>

            ${feedbackBtnHTML}
          </div>
        </td>
      `;
      eventsTableBody.appendChild(row);
    });
  };

  // =========================================================================
  // 4. LÓGICA DE LISTA DE PARTICIPANTES
  // =========================================================================

  const loadParticipants = async (eventId, eventTitle) => {
    participantsModalTitle.textContent = `Inscritas: ${eventTitle}`;
    participantsList.innerHTML =
      '<p class="text-center">Carregando lista...</p>';
    participantsCountBadge.textContent = "...";
    currentEmails = []; // Reseta lista de emails

    openParticipantsModal();

    try {
      const res = await fetch(`/api/eventos/${eventId}/participantes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar participantes");

      const participantes = await res.json();

      participantsCountBadge.textContent = `${participantes.length} Inscritas`;

      if (participantes.length === 0) {
        participantsList.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--muted-foreground);">
                Nenhuma inscrição realizada ainda.
            </div>`;
        return;
      }

      // Preenche a lista visual
      participantsList.innerHTML = participantes
        .map((p) => {
          // Guarda email para o botão de copiar
          if (p.email) currentEmails.push(p.email);

          // Pega inicial para Avatar
          const inicial = p.nome ? p.nome.charAt(0).toUpperCase() : "?";

          return `
            <div style="
                display: flex; 
                align-items: center; 
                gap: 15px; 
                padding: 10px; 
                background: var(--muted); 
                border-radius: var(--radius-sm);
                border: 1px solid var(--border);
            ">
                <div style="
                    width: 35px; 
                    height: 35px; 
                    background: var(--primary-color-start); 
                    color: white; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-weight: bold;
                    flex-shrink: 0;
                ">
                    ${inicial}
                </div>
                <div style="overflow: hidden;">
                    <strong style="display: block; color: var(--foreground);">${p.nome}</strong>
                    <span style="font-size: 0.85rem; color: var(--muted-foreground);">${p.email}</span>
                </div>
            </div>
          `;
        })
        .join("");
    } catch (error) {
      console.error(error);
      participantsList.innerHTML =
        '<p class="text-danger text-center">Erro ao carregar lista.</p>';
    }
  };

  // Botão de Copiar E-mails
  copyEmailsBtn.addEventListener("click", () => {
    if (currentEmails.length === 0) {
      alert("Não há e-mails para copiar.");
      return;
    }
    const allEmails = currentEmails.join("; "); // Formato padrão separado por ponto e vírgula
    navigator.clipboard.writeText(allEmails).then(() => {
      const originalText = copyEmailsBtn.textContent;
      copyEmailsBtn.textContent = "Copiado! ✅";
      setTimeout(() => (copyEmailsBtn.textContent = originalText), 2000);
    });
  });

  // =========================================================================
  // 5. LÓGICA DE FEEDBACKS
  // =========================================================================

  const loadFeedbacks = async (eventId, eventTitle) => {
    document.getElementById(
      "feedbackModalTitle"
    ).textContent = `Avaliações: ${eventTitle}`;
    feedbackList.innerHTML =
      '<p class="text-center">Carregando avaliações...</p>';
    feedbackSummary.innerHTML = "";
    openFeedbackModal();

    try {
      const res = await fetch(`/api/feedbacks/evento/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        feedbackList.innerHTML =
          '<div style="text-align:center; padding:20px;">Nenhum feedback recebido ainda.</div>';
        return;
      }

      const feedbacks = await res.json();

      // Calcular Médias
      const total = feedbacks.length;
      const mediaOrg = (
        feedbacks.reduce((acc, f) => acc + f.satisfacao_organizacao, 0) / total
      ).toFixed(1);
      const mediaCont = (
        feedbacks.reduce((acc, f) => acc + f.satisfacao_conteudo, 0) / total
      ).toFixed(1);

      feedbackSummary.innerHTML = `
            <div>
                <strong style="font-size: 1.2rem; display:block;">${total}</strong>
                <span class="text-muted">Avaliações</span>
            </div>
            <div>
                <strong style="font-size: 1.2rem; display:block; color: #2e7d32;">${mediaOrg} / 5.0</strong>
                <span class="text-muted">Organização</span>
            </div>
            <div>
                <strong style="font-size: 1.2rem; display:block; color: #2B9CDB;">${mediaCont} / 5.0</strong>
                <span class="text-muted">Conteúdo</span>
            </div>
          `;

      // Renderizar Lista de Comentários
      feedbackList.innerHTML = feedbacks
        .map(
          (f) => `
            <div style="border-bottom: 1px solid #eee; padding: 15px 0;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <strong>${f.aluna ? f.aluna.nome : "Anônimo"}</strong>
                    <span style="font-size:0.85rem; color:#888;">${new Date(
                      f.createdAt
                    ).toLocaleDateString("pt-BR")}</span>
                </div>
                <div style="margin-bottom: 8px;">
                    <span class="badge" style="background:#e8f5e9; color:#2e7d32;">Org: ${
                      f.satisfacao_organizacao
                    }</span>
                    <span class="badge" style="background:#e3f2fd; color:#1565c0;">Cont: ${
                      f.satisfacao_conteudo
                    }</span>
                </div>
                ${
                  f.pontos_positivos
                    ? `<p style="margin:5px 0; color:#2e7d32;">👍 ${f.pontos_positivos}</p>`
                    : ""
                }
                ${
                  f.pontos_negativos
                    ? `<p style="margin:5px 0; color:#c62828;">👎 ${f.pontos_negativos}</p>`
                    : ""
                }
            </div>
          `
        )
        .join("");
    } catch (error) {
      console.error(error);
      feedbackList.innerHTML =
        '<p class="text-danger">Erro ao carregar feedbacks.</p>';
    }
  };

  // =========================================================================
  // 6. EVENT DELEGATION (CLIQUES NA TABELA)
  // =========================================================================

  eventsTableBody.addEventListener("click", async (e) => {
    // Procura o botão clicado (mesmo que clique no ícone dentro dele)
    const target = e.target.closest("button");
    if (!target) return;

    const id = target.dataset.id;
    const title = target.dataset.title;

    // Ação: LISTA DE PARTICIPANTES
    if (target.classList.contains("btn-participants")) {
      loadParticipants(id, title);
    }

    // Ação: VER FEEDBACKS
    if (target.classList.contains("btn-feedback")) {
      loadFeedbacks(id, title);
    }

    // Ação: EDITAR EVENTO
    if (target.classList.contains("btn-edit")) {
      try {
        const res = await fetch(`${apiBaseUrl}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const event = await res.json();
        modalTitle.textContent = "Editar Evento";
        eventIdField.value = event._id;
        document.getElementById("titulo").value = event.titulo;
        document.getElementById("descricao").value = event.descricao;
        document.getElementById("data").value = new Date(event.data)
          .toISOString()
          .split("T")[0];
        document.getElementById("horario").value = event.horario;
        document.getElementById("local").value = event.local;
        document.getElementById("numero_vagas").value = event.numero_vagas;
        openModal();
      } catch (err) {
        alert("Erro ao carregar dados.");
      }
    }

    // Ação: EXCLUIR EVENTO
    if (target.classList.contains("btn-delete")) {
      if (
        confirm(
          "Tem certeza que deseja excluir? Isso removerá todas as inscrições e feedbacks deste evento."
        )
      ) {
        await fetch(`${apiBaseUrl}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAndRenderEvents();
      }
    }
  });

  // --- MUDANÇA DE STATUS (Select) ---
  eventsTableBody.addEventListener("change", async (e) => {
    if (e.target.classList.contains("status-select")) {
      const newStatus = e.target.value;
      const id = e.target.dataset.id;
      e.target.disabled = true; // Desabilita enquanto salva

      try {
        await fetch(`${apiBaseUrl}/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
        e.target.disabled = false;
        fetchAndRenderEvents(); // Recarrega para atualizar cor
      } catch (err) {
        alert("Erro ao atualizar status");
        e.target.disabled = false;
      }
    }
  });

  // =========================================================================
  // 7. SUBMIT DO FORMULÁRIO E INICIALIZAÇÃO
  // =========================================================================

  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = eventIdField.value;
    const method = id ? "PUT" : "POST";
    const url = id ? `${apiBaseUrl}/${id}` : apiBaseUrl;

    const payload = {
      titulo: document.getElementById("titulo").value,
      descricao: document.getElementById("descricao").value,
      data: document.getElementById("data").value,
      horario: document.getElementById("horario").value,
      local: document.getElementById("local").value,
      numero_vagas: parseInt(document.getElementById("numero_vagas").value),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        closeModal();
        fetchAndRenderEvents();
      } else {
        alert("Erro ao salvar.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    }
  });

  // Listeners de Botões Fixos
  addEventBtn.addEventListener("click", () => {
    modalTitle.textContent = "Criar Evento";
    openModal();
  });

  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  closeFeedbackBtn.addEventListener("click", closeFeedbackModal);

  // Novo botão para fechar lista de participantes
  closeParticipantsBtn.addEventListener("click", closeParticipantsModal);

  // Carregamento Inicial
  fetchAndRenderEvents();
});
