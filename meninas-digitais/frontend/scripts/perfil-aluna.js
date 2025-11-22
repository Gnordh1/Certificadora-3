document.addEventListener("DOMContentLoaded", async () => {
  // =======================================================
  // 1. VERIFICAÇÃO DE AUTENTICAÇÃO
  // =======================================================
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Você precisa estar logada.");
    window.location.href = "login-cadastro.html";
    return;
  }

  // Seletores do HTML (Compatíveis com a Versão 2)
  const eventsContainer = document.getElementById("myEventsList");
  const userNameDisplay = document.getElementById("userNameDisplay");

  // =======================================================
  // 2. EXIBIR DADOS DA ALUNA (Nome no topo)
  // =======================================================
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Validação de perfil
    if (payload.user && payload.user.perfil !== "aluna") {
      alert("Esta área é exclusiva para alunas.");
      window.location.href = "index.html";
      return;
    }

    // Exibe o nome se disponível
    if (payload.user && payload.user.nome) {
      userNameDisplay.textContent = `Olá, ${payload.user.nome}`;
    }
  } catch (e) {
    console.error("Erro ao ler dados do usuário:", e);
  }

  // =======================================================
  // 3. BUSCAR EVENTOS NA API
  // =======================================================
  try {
    const res = await fetch("/api/users/my-events", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao buscar inscrições");

    const myEvents = await res.json();
    renderMyEvents(myEvents);
  } catch (error) {
    console.error(error);
    eventsContainer.innerHTML = `
        <div style="text-align: center; color: #c62828; padding: 20px;">
            <p>Não foi possível carregar seus eventos.</p>
            <button onclick="window.location.reload()" class="btn btn-outline">Tentar Novamente</button>
        </div>
    `;
  }

  // =======================================================
  // 4. FUNÇÃO DE RENDERIZAÇÃO (Com correção de Data)
  // =======================================================
  function renderMyEvents(events) {
    // Caso não tenha eventos
    if (!events || events.length === 0) {
      eventsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--muted-foreground);">
            <h3>Você ainda não tem inscrições.</h3>
            <p>Explore os cursos disponíveis e comece a aprender!</p>
            <a href="index.html#events" class="btn btn-primary" style="margin-top: 10px;">Ver Eventos</a>
        </div>
      `;
      return;
    }

    eventsContainer.innerHTML = "";

    events.forEach((event) => {
      let statusColor = "var(--primary-color-start)";
      let statusText = "Inscrita";
      let statusBg = "#f3e5f5";

      if (event.status === "Concluído") {
        statusColor = "#2e7d32";
        statusBg = "#e8f5e9";
        statusText = "Concluído ✅";
      } else if (event.status === "Cancelado") {
        statusColor = "#c62828";
        statusBg = "#ffebee";
        statusText = "Cancelado 🚫";
      }

      let dateStr = "Data a definir";
      if (event.data) {
        try {
          const rawDate = new Date(event.data);
          if (!isNaN(rawDate.getTime())) {
            dateStr = rawDate.toLocaleDateString("pt-BR", { timeZone: "UTC" });
          }
        } catch (e) {
          console.error("Erro data:", event.data);
        }
      }

      // C. Criação do Card (HTML)
      const card = document.createElement("div");
      card.className = "event-card";
      card.style.display = "flex";
      card.style.flexDirection = "row";
      card.style.alignItems = "center";
      card.style.justifyContent = "space-between";
      card.style.padding = "20px";
      card.style.marginBottom = "15px";
      card.style.gap = "15px";
      card.style.flexWrap = "wrap"; // Responsivo para mobile

      card.innerHTML = `
        <div style="flex: 1; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 1.2rem;">${event.titulo}</h3>
            
            <div style="display: flex; gap: 15px; color: var(--muted-foreground); font-size: 0.9rem; margin-bottom: 10px;">
                <span>📅 ${dateStr}</span>
                <span>🕒 ${event.horario}</span>
            </div>

            <span class="badge" style="background-color: ${statusBg}; color: ${statusColor}; border: 1px solid ${statusColor};">
                ${statusText}
            </span>
        </div>

        <div>
            <a href="detalhes-evento.html?id=${event._id}" class="btn btn-outline" style="white-space: nowrap;">
                Gerenciar Inscrição
            </a>
        </div>
      `;

      eventsContainer.appendChild(card);
    });
  }
  // =======================================================
  // 5. LÓGICA DE EDIÇÃO DE PERFIL (ATUALIZADA)
  // =======================================================
  const editModal = document.getElementById("editProfileModal");
  const editBtn = document.getElementById("editProfileBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const overlay = document.querySelector("#editProfileModal .modal-overlay");
  const editForm = document.getElementById("editProfileForm");

  const inputNome = document.getElementById("editNome");
  const inputEmail = document.getElementById("editEmail"); // Novo
  const inputSenha = document.getElementById("editSenha");

  // Função para abrir modal e preencher dados atuais
  editBtn.addEventListener("click", () => {
    // Tenta pegar os dados mais recentes do token atual
    try {
      // Recarrega o token do localStorage para garantir que é o último
      const currentToken = localStorage.getItem("token");
      const payload = JSON.parse(atob(currentToken.split(".")[1]));

      inputNome.value = payload.user.nome || "";
      inputEmail.value = payload.user.email || ""; // Preenche o email
    } catch (e) {
      // Fallback visual caso dê erro no token
      inputNome.value = userNameDisplay.textContent.replace("Olá, ", "");
      inputEmail.value = "";
    }
    inputSenha.value = "";
    editModal.classList.add("show");
  });

  // Funções para fechar modal
  const closeEditModal = () => editModal.classList.remove("show");
  cancelEditBtn.addEventListener("click", closeEditModal);
  overlay.addEventListener("click", closeEditModal);

  // Envio do Formulário
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoNome = inputNome.value;
    const novoEmail = inputEmail.value;
    const novaSenha = inputSenha.value;

    // Monta o objeto de envio
    const bodyData = {
      nome: novoNome,
      email: novoEmail,
    };
    if (novaSenha) {
      bodyData.senha = novaSenha;
    }

    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Erro ao atualizar perfil");
      }
      localStorage.setItem("token", data.token);
      userNameDisplay.textContent = `Olá, ${data.user.nome}`;
      closeEditModal();
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
});
