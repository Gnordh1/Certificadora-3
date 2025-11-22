document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");

  if (!eventId) {
    alert("Evento não especificado.");
    window.location.href = "index.html";
    return;
  }

  const dom = {
    title: document.getElementById("eventTitle"),
    desc: document.getElementById("eventDescription"),
    type: document.getElementById("eventType"),
    vacancies: document.getElementById("eventVacancies"),
    status: document.getElementById("eventStatus"),
    date: document.getElementById("eventDate"),
    time: document.getElementById("eventTime"),
    location: document.getElementById("eventLocation"),
    actionSection: document.getElementById("actionSection"),
    feedbackSection: document.getElementById("feedbackSection"),
    feedbackForm: document.getElementById("feedbackForm"),
  };

  const token = localStorage.getItem("token");
  let currentEvent = null;
  let userEnrollments = [];

  // 1. Buscar Evento
  try {
    const res = await fetch(`/api/eventos/${eventId}`);
    if (!res.ok) throw new Error("Erro ao carregar evento");
    currentEvent = await res.json();
    renderEventDetails(currentEvent);
  } catch (error) {
    dom.title.textContent = "Erro ao carregar evento.";
    return;
  }

  // 2. Verificar se usuário já está inscrito
  if (token) {
    try {
      const resMe = await fetch("/api/users/my-events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resMe.ok) {
        const myEvents = await resMe.json();
        userEnrollments = myEvents.map((e) => e._id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  updateActionUI(currentEvent, userEnrollments, token);

  // --- FUNÇÕES ---

  function renderEventDetails(event) {
    dom.title.textContent = event.titulo;
    dom.desc.innerHTML = event.descricao.replace(/\n/g, "<br>");
    dom.type.textContent = event.publico_alvo || "Geral";

    // Cálculo de Vagas
    const totalInscritos = event.participantes ? event.participantes.length : 0;
    const vagasRestantes = Math.max(0, event.numero_vagas - totalInscritos);

    dom.vacancies.textContent = `${vagasRestantes} vagas restantes`;
    dom.status.textContent = event.status;
    dom.date.textContent = new Date(event.data).toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
    dom.time.textContent = event.horario;
    dom.location.textContent = event.local;
  }

  function updateActionUI(event, enrollments, token) {
    const isEnrolled = enrollments.includes(event._id);
    const isFinished = event.status === "Concluído";
    const isCanceled = event.status === "Cancelado";

    const totalInscritos = event.participantes ? event.participantes.length : 0;
    const vagasRestantes = event.numero_vagas - totalInscritos;
    const isSoldOut = vagasRestantes <= 0;

    dom.actionSection.innerHTML = "";

    // Caso 1: Não logado
    if (!token) {
      dom.actionSection.innerHTML = `
            <h3>Gostou? Participe!</h3>
            <p>Faça login para se inscrever.</p>
            <a href="login-cadastro.html" class="btn btn-primary">Fazer Login</a>
        `;
      return;
    }

    // Caso 2: Evento Cancelado
    if (isCanceled) {
      dom.actionSection.innerHTML = `<div class="alert-message" style="background:#ffebee; color:#c62828; border:1px solid #ef9a9a; font-weight:bold;">⚠️ Evento Cancelado</div>`;
      return;
    }

    // Caso 3: Usuário Inscrito
    if (isEnrolled) {
      if (isFinished) {
        dom.actionSection.innerHTML = `<div class="alert-message" style="background:#e8f5e9; color:#2e7d32; border:1px solid #a5d6a7;">✅ Evento Concluído. Obrigado por participar!</div>`;
        dom.feedbackSection.style.display = "block";
        setupFeedbackForm(event._id, token);
      } else {
        dom.actionSection.innerHTML = `
                <div style="text-align:center;">
                    <p style="color: green; font-weight: bold; margin-bottom: 10px;">✅ Você está inscrita!</p>
                    <button id="btnUnenroll" class="btn btn-outline" style="color:red; border-color:red;">Cancelar Inscrição</button>
                </div>
            `;
        document
          .getElementById("btnUnenroll")
          .addEventListener("click", () => handleUnenroll(event._id, token));
      }
      return;
    }

    // Caso 4: Não Inscrito
    if (isFinished) {
      dom.actionSection.innerHTML = `<div class="alert-message">Este evento já foi encerrado.</div>`;
    } else if (isSoldOut) {
      dom.actionSection.innerHTML = `<div class="alert-message" style="background:#fff3cd; color:#856404; border:1px solid #ffeeba;">🚫 Vagas Esgotadas</div>`;
    } else {
      dom.actionSection.innerHTML = `<button id="btnEnroll" class="btn btn-primary btn-join" style="width:100%;">Inscrever-se (${vagasRestantes} vagas)</button>`;
      document
        .getElementById("btnEnroll")
        .addEventListener("click", () => handleEnroll(event._id, token));
    }
  }

  async function handleEnroll(id, token) {
    if (!confirm("Confirmar inscrição?")) return;
    try {
      const res = await fetch(`/api/eventos/${id}/enroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Inscrição realizada!");
        window.location.reload();
      } else {
        alert(data.msg || "Erro ao inscrever.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    }
  }

  async function handleUnenroll(id, token) {
    if (!confirm("Deseja cancelar sua inscrição?")) return;
    try {
      const res = await fetch(`/api/eventos/${id}/unenroll`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Inscrição cancelada.");
        window.location.reload();
      } else {
        alert("Erro ao cancelar.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    }
  }

  function setupFeedbackForm(eventId, token) {
    dom.feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        eventoId: eventId,
        satisfacao_organizacao: document.getElementById("satOrg").value,
        satisfacao_conteudo: document.getElementById("satConteudo").value,
        satisfacao_carga_horaria: 5,
        pontos_positivos: document.getElementById("positivos").value,
        pontos_negativos: document.getElementById("negativos").value,
      };

      try {
        const res = await fetch("/api/feedbacks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          alert("Feedback enviado!");
          dom.feedbackForm.reset();
          dom.feedbackSection.innerHTML =
            "<p class='text-center text-success'>Feedback enviado com sucesso! ✨</p>";
        } else {
          const err = await res.json();
          alert(err.msg);
        }
      } catch (error) {
        alert("Erro ao enviar.");
      }
    });
  }
});
