document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "/api/eventos";
  const token = localStorage.getItem("token");

  // DOM Elements - Eventos
  const modal = document.getElementById("eventModal");
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalTitle = document.getElementById("modalTitle");
  const addEventBtn = document.getElementById("addEventBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const eventForm = document.getElementById("eventForm");
  const eventsTableBody = document.getElementById("eventsTableBody");
  const eventIdField = document.getElementById("eventId");

  // DOM Elements - Feedback
  const feedbackModal = document.getElementById("feedbackModal");
  const closeFeedbackBtn = document.getElementById("closeFeedbackBtn");
  const feedbackList = document.getElementById("feedbackList");
  const feedbackSummary = document.getElementById("feedbackSummary");

  // --- CONTROLE DE MODAIS ---
  const openModal = () => modal.classList.add("show");
  const closeModal = () => {
    modal.classList.remove("show");
    eventForm.reset();
    eventIdField.value = "";
  };

  const openFeedbackModal = () => feedbackModal.classList.add("show");
  const closeFeedbackModal = () => feedbackModal.classList.remove("show");

  // --- RENDERIZAÇÃO DA LISTA DE EVENTOS ---
  const fetchAndRenderEvents = async () => {
    try {
      const response = await fetch(apiBaseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar eventos");
      const events = await response.json();
      renderEvents(events);
    } catch (error) {
      eventsTableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">${error.message}</td></tr>`;
    }
  };

  const renderEvents = (events) => {
    eventsTableBody.innerHTML = "";
    if (events.length === 0) {
      eventsTableBody.innerHTML = `<tr><td colspan="7" class="text-center">Nenhum evento encontrado.</td></tr>`;
      return;
    }

    events.forEach((event) => {
      const row = document.createElement("tr");

      // Estilo do Status
      let statusStyle = "";
      if (event.status === "Concluído")
        statusStyle = "color: green; font-weight: bold;";
      if (event.status === "Cancelado") statusStyle = "color: red;";

      // Botão de Feedback (SEM ESTRELA)
      let feedbackBtn = "";
      if (event.status === "Concluído") {
        feedbackBtn = `<button class="btn btn-primary btn-feedback" style="padding: 4px 8px; font-size: 0.8rem; background-color: #6f42c1;" data-id="${event._id}" data-title="${event.titulo}">Ver Avaliações</button>`;
      }

      row.innerHTML = `
        <td>${event.titulo}</td>
        <td>${new Date(event.data).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        })}</td>
        <td>${event.local}</td>
        <td>${event.participantes ? event.participantes.length : 0} / ${
        event.numero_vagas
      }</td>
        <td>
            <select class="status-select" data-id="${
              event._id
            }" style="border-radius:5px; padding:4px; ${statusStyle}">
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
        <td class="actions-cell" style="display: flex; flex-direction: column; gap: 5px;">
          <div style="display: flex; gap: 5px;">
            <button class="btn btn-outline btn-edit" data-id="${
              event._id
            }">Editar</button>
            <button class="btn btn-outline btn-delete" data-id="${
              event._id
            }">Excluir</button>
          </div>
          ${feedbackBtn}
        </td>
      `;
      eventsTableBody.appendChild(row);
    });
  };

  // --- LÓGICA DE FEEDBACK ---
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

      // Renderizar Lista
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

  // --- EVENT DELEGATION ---
  eventsTableBody.addEventListener("click", async (e) => {
    const target = e.target;
    const id = target.dataset.id;

    if (target.classList.contains("btn-feedback")) {
      loadFeedbacks(id, target.dataset.title);
    }

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

    if (target.classList.contains("btn-delete")) {
      if (confirm("Excluir este evento?")) {
        await fetch(`${apiBaseUrl}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAndRenderEvents();
      }
    }
  });

  // Mudança de Status
  eventsTableBody.addEventListener("change", async (e) => {
    if (e.target.classList.contains("status-select")) {
      const newStatus = e.target.value;
      const id = e.target.dataset.id;
      e.target.disabled = true;
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
        fetchAndRenderEvents();
      } catch (err) {
        alert("Erro ao atualizar status");
        e.target.disabled = false;
      }
    }
  });

  // Form Submit (Criar/Editar)
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

  addEventBtn.addEventListener("click", () => {
    modalTitle.textContent = "Criar Evento";
    openModal();
  });
  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  closeFeedbackBtn.addEventListener("click", closeFeedbackModal);
  fetchAndRenderEvents();
});
