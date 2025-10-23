document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // Configuração e Seletores de DOM
  // ==========================================================================
  const apiBaseUrl = "/api/eventos";
  const token = localStorage.getItem("token");

  const modal = document.getElementById("eventModal");
  const modalOverlay = document.querySelector(".modal-overlay");
  const modalTitle = document.getElementById("modalTitle");
  const addEventBtn = document.getElementById("addEventBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const eventForm = document.getElementById("eventForm");
  const eventsTableBody = document.getElementById("eventsTableBody");
  const eventIdField = document.getElementById("eventId");

  // ==========================================================================
  // Funções de Controle do Modal
  // ==========================================================================
  const openModal = () => modal.classList.add("show");
  const closeModal = () => {
    modal.classList.remove("show");
    eventForm.reset(); // Limpa os campos do formulário.
    eventIdField.value = ""; // Limpa o ID do evento para evitar edições acidentais.
  };

  // ==========================================================================
  // Funções de Comunicação com a API (CRUD)
  // ==========================================================================

  /**
   * Busca todos os eventos na API e os exibe na tabela.
   * Requer um token de autorização para acessar o endpoint.
   */
  const fetchAndRenderEvents = async () => {
    try {
      const response = await fetch(apiBaseUrl, {
        headers: {
          // O cabeçalho 'Authorization' é essencial para a API autenticar a requisição.
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar eventos. Verifique sua autenticação.");
      }
      const events = await response.json();
      renderEvents(events);
    } catch (error) {
      console.error("Erro:", error);
      eventsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${error.message}</td></tr>`;
    }
  };

  /**
   * Renderiza a lista de eventos no corpo da tabela (tbody).
   * @param {Array} events - Um array de objetos de evento.
   */
  const renderEvents = (events) => {
    eventsTableBody.innerHTML = "";
    if (events.length === 0) {
      eventsTableBody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum evento encontrado.</td></tr>`;
      return;
    }

    events.forEach((event) => {
      const row = document.createElement("tr");
      // O ID do evento vem do MongoDB como `_id`.
      row.innerHTML = `
        <td>${event.titulo}</td>
        <td>${new Date(event.data).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        })}</td>
        <td>${event.local}</td>
        <td>${event.numero_vagas}</td>
        <td>${event.inscritas?.length || 0}</td>
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

  /**
   * Busca os dados de um evento específico pela API e preenche o formulário para edição.
   * @param {string} id - O ID do evento a ser editado.
   */
  const populateFormForEdit = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Evento não encontrado.");

      const event = await response.json();

      modalTitle.textContent = "Editar Evento";
      eventIdField.value = event._id; // Armazena o ID no campo oculto.
      document.getElementById("titulo").value = event.titulo;
      document.getElementById("descricao").value = event.descricao;
      // Formata a data para 'YYYY-MM-DD', o formato exigido pelo input[type="date"].
      document.getElementById("data").value = new Date(event.data)
        .toISOString()
        .split("T")[0];
      document.getElementById("horario").value = event.horario;
      document.getElementById("local").value = event.local;
      document.getElementById("numero_vagas").value = event.numero_vagas;

      openModal();
    } catch (error) {
      console.error("Erro ao buscar evento para edição:", error);
      alert(error.message);
    }
  };

  // ==========================================================================
  // Manipulação de Eventos (Event Listeners)
  // ==========================================================================

  // Abre o modal em modo de criação.
  addEventBtn.addEventListener("click", () => {
    modalTitle.textContent = "Criar Novo Evento";
    openModal();
  });

  // Fecha o modal ao clicar no botão "Cancelar" ou no overlay.
  cancelBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);

  /**
   * Lida com a submissão do formulário para criar ou atualizar um evento.
   * Se o campo 'eventId' estiver preenchido, faz uma requisição PUT (atualizar).
   * Caso contrário, faz uma requisição POST (criar).
   */
  eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const eventId = eventIdField.value;
    const method = eventId ? "PUT" : "POST";
    const url = eventId ? `${apiBaseUrl}/${eventId}` : apiBaseUrl;

    const eventData = {
      titulo: document.getElementById("titulo").value,
      descricao: document.getElementById("descricao").value,
      data: document.getElementById("data").value,
      horario: document.getElementById("horario").value,
      local: document.getElementById("local").value,
      numero_vagas: parseInt(document.getElementById("numero_vagas").value, 10),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Falha ao salvar o evento.");
      }

      closeModal();
      fetchAndRenderEvents(); // Atualiza a tabela com os dados mais recentes.
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert(error.message);
    }
  });

  /**
   * Usa "event delegation" para gerenciar cliques nos botões de editar e excluir.
   * Isso permite que botões adicionados dinamicamente à tabela funcionem corretamente.
   */
  eventsTableBody.addEventListener("click", async (e) => {
    const target = e.target;
    const eventId = target.dataset.id;

    if (!eventId) return; // Ignora cliques fora dos botões com 'data-id'.

    // Ação de Editar
    if (target.classList.contains("btn-edit")) {
      populateFormForEdit(eventId);
    }

    // Ação de Excluir
    if (target.classList.contains("btn-delete")) {
      if (confirm("Tem certeza que deseja excluir este evento?")) {
        try {
          const response = await fetch(`${apiBaseUrl}/${eventId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Falha ao excluir o evento.");
          }
          fetchAndRenderEvents(); // Atualiza a tabela após a exclusão.
        } catch (error) {
          console.error("Erro ao excluir evento:", error);
          alert(error.message);
        }
      }
    }
  });

  // ==========================================================================
  // Inicialização
  // ==========================================================================
  fetchAndRenderEvents(); // Carrega os eventos da API assim que a página é carregada.
});
