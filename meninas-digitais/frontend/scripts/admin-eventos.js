document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "/api/eventos";
  const token = localStorage.getItem("token");

  // Seletores DOM
  const modal = document.getElementById("eventModal");
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalTitle = document.getElementById("modalTitle");
  const addEventBtn = document.getElementById("addEventBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const eventForm = document.getElementById("eventForm");
  const eventsTableBody = document.getElementById("eventsTableBody");
  const eventIdField = document.getElementById("eventId");

  // Controles Modal
  const openModal = () => modal.classList.add("show");
  const closeModal = () => {
    modal.classList.remove("show");
    eventForm.reset();
    eventIdField.value = "";
  };

  // --- RENDERIZAÇÃO COM STATUS ---
  const fetchAndRenderEvents = async () => {
    try {
      const response = await fetch(apiBaseUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Falha ao buscar eventos");
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
      const dataFormatada = new Date(event.data).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      });

      // Estilo visual do dropdown
      let statusStyle = "";
      if (event.status === "Concluído")
        statusStyle = "color: green; font-weight: bold;";
      if (event.status === "Cancelado") statusStyle = "color: red;";

      const totalInscritos = event.participantes
        ? event.participantes.length
        : 0;

      row.innerHTML = `
        <td>${event.titulo}</td>
        <td>${dataFormatada}</td>
        <td>${event.local}</td>
        <td>${event.numero_vagas}</td>
        <td>${totalInscritos}</td>
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
        <td class="actions-cell">
          <button class="btn btn-outline btn-edit" data-id="${
            event._id
          }">Editar</button>
          <button class="btn btn-outline btn-delete" data-id="${
            event._id
          }">Excluir</button>
        </td>
      `;
      eventsTableBody.appendChild(row);
    });
  };

  // --- EVENT LISTENERS ---

  // 1. MUDANÇA DE STATUS 
  eventsTableBody.addEventListener("change", async (e) => {
    if (e.target.classList.contains("status-select")) {
      const newStatus = e.target.value;
      const eventId = e.target.dataset.id;

      e.target.disabled = true; // Bloqueia enquanto salva

      try {
        const res = await fetch(`${apiBaseUrl}/${eventId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) throw new Error("Erro ao atualizar");

        // Sucesso: Atualiza visual
        e.target.disabled = false;
        e.target.style = "";
        if (newStatus === "Concluído")
          e.target.style = "color: green; font-weight: bold;";
        if (newStatus === "Cancelado") e.target.style = "color: red;";
      } catch (err) {
        alert("Erro ao mudar status.");
        e.target.disabled = false;
        fetchAndRenderEvents(); // Reverte
      }
    }
  });

  // 2. AÇÕES DE EDITAR E EXCLUIR
  eventsTableBody.addEventListener("click", async (e) => {
    const target = e.target;
    const eventId = target.dataset.id;
    if (!eventId) return;

    // Editar
    if (target.classList.contains("btn-edit")) {
      try {
        const res = await fetch(`${apiBaseUrl}/${eventId}`, {
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

    // Excluir
    if (target.classList.contains("btn-delete")) {
      if (confirm("Excluir este evento permanentemente?")) {
        try {
          const res = await fetch(`${apiBaseUrl}/${eventId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) fetchAndRenderEvents();
          else alert("Erro ao excluir.");
        } catch (err) {
          alert("Erro de conexão.");
        }
      }
    }
  });

  // 3. SALVAR FORMULÁRIO (Criar/Editar)
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
      console.error(err);
      alert("Erro de conexão.");
    }
  });

  // 4. CONTROLES MODAL
  addEventBtn.addEventListener("click", () => {
    modalTitle.textContent = "Criar Novo Evento";
    openModal();
  });
  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  // Inicia
  fetchAndRenderEvents();
});
