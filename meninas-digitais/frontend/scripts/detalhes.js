// =======================================================
// 1. CONFIGURAÇÃO INICIAL E UTILITÁRIOS
// =======================================================

const getUrlParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

const formatDate = (dateString) => {
    try {
        const date = new Date(dateString); 
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
    } catch {
        return dateString;
    }
};

const simulateToast = (title, description, isDestructive = false) => {
    console.log(`[TOAST - ${isDestructive ? 'ERRO' : 'SUCESSO'}] ${title}: ${description}`);
    alert(`${title}\n${description}`); 
};

// =======================================================
// 2. AUTENTICAÇÃO E DADOS DO USUÁRIO LOGADO
// =======================================================

/**
 * Obtém os dados do usuário logado a partir do token JWT
 */
const getLoggedInUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.warn("Nenhum token encontrado - usuário não está logado");
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            id: payload.user.id,
            nome: payload.user.nome,
            email: payload.user.email,
            perfil: payload.user.perfil
        };
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return null;
    }
};

/**
 * Verifica se o usuário está logado e redireciona se necessário
 */
const checkAuthentication = () => {
    const user = getLoggedInUser();
    if (!user) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login-cadastro.html";
        return null;
    }
    return user;
};

// =======================================================
// 3. INTEGRAÇÃO COM A API (FETCH)
// =======================================================

/**
 * Busca um evento real no servidor usando o ID.
 */
async function fetchEventById(eventId) {
    const API_URL = `/api/eventos/${eventId}`; 

    try {
        const response = await fetch(API_URL); 
        
        if (!response.ok) {
            if (response.status === 404) {
                 throw new Error("Evento não encontrado (404).");
            }
            throw new Error(`Erro ao buscar evento: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
        
    } catch (error) {
        throw error;
    }
}

/**
 * Realiza a inscrição do usuário no evento (AGORA COM API REAL)
 */
const registerForEvent = async (eventId, formData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/eventos/${eventId}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            return true;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.msg || "Erro ao realizar inscrição");
        }
    } catch (error) {
        console.error("Erro na inscrição:", error);
        throw error;
    }
};

// =======================================================
// 4. LÓGICA DE RENDERIZAÇÃO PRINCIPAL
// =======================================================

const renderEventDetails = async () => {
    // Verifica autenticação
    const user = checkAuthentication();
    if (!user) return;

    const container = document.getElementById('event-details-content');
    const eventId = getUrlParam('id'); 

    if (!container) {
        console.error("ERRO FATAL: Container 'event-details-content' não encontrado.");
        return; 
    }

    if (!eventId) {
        container.innerHTML = `<div class="py-16 text-center"><h1 class="text-2xl font-bold mb-4">ID do Evento faltando na URL.</h1></div>`;
        return;
    }
    
    container.innerHTML = `<div class="p-8 text-center" style="color: var(--muted-foreground);">Carregando detalhes do evento...</div>`;
    
    try {
        const event = await fetchEventById(eventId); 
        
        // Mapeamento dos dados do evento
        const titulo = event.titulo; 
        const descricao = event.descricao;
        const data = event.data; 
        const horario = event.horario;
        const local = event.local;
        const vagasTotal = event.numero_vagas;

        // Campos Opcionais
        const tipo = event.tipo || "Evento Não Classificado"; 
        const publicoAlvo = event.publico_alvo || "Público Geral"; 
        
        // CÁLCULO DE VAGAS
        const numParticipantes = event.participantes ? event.participantes.length : 0;
        const vagasDisponiveis = vagasTotal - numParticipantes;

        // Lógica de Status
        document.title = `Detalhes do Evento - ${titulo}`;
        const isAvailable = vagasDisponiveis > 0;

        const vagasStatusClass = isAvailable ? "text-success" : "text-danger";
        const vagasStatusText = `${vagasDisponiveis} de ${vagasTotal}`;

        // Conteúdo HTML
        container.innerHTML = `
<button id="back-button" class="btn-back">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
    Voltar
</button>

<!-- GRID PRINCIPAL COM 2 COLUNAS -->
<div class="main-content-grid">
    
    <!-- COLUNA ESQUERDA: Título + Detalhes do Evento -->
    <div class="left-column">
        
        <!-- Título e Descrição -->
        <div class="event-header">
            <h1>${titulo}</h1>
            <p class="event-description">${descricao}</p>
        </div>

        <!-- Card de Detalhes do Evento -->
        <div class="info-card event-details-card">
            <h2>Detalhes do Evento</h2>
            <div class="card-content-custom">
                <div class="detail-item">
                    <span class="icon-detail">📅</span>
                    <div class="detail-text">
                        <strong>Data</strong>
                        <span>${formatDate(data)}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="icon-detail">🕒</span>
                    <div class="detail-text">
                        <strong>Horário</strong>
                        <span>${horario}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="icon-detail">📍</span>
                    <div class="detail-text">
                        <strong>Local</strong>
                        <span>${local}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="icon-detail">👥</span>
                    <div class="detail-text">
                        <strong>Público-alvo</strong>
                        <span>${publicoAlvo}</span>
                    </div>
                </div>
                
                <!-- Vagas disponíveis -->
                <div class="vagas-info">
                    <p class="font-medium">Vagas disponíveis</p>
                    <p class="vagas-count ${vagasStatusClass}">
                        ${vagasStatusText}
                    </p>
                </div>
            </div>
        </div>
        
    </div>

    <!-- COLUNA DIREITA: Apenas Formulário -->
    <div class="right-column">
        <div class="info-card registration-card">
            <div class="card-header-custom">
                <h2 class="card-title">Formulário de Inscrição</h2>
                <p class="card-description">Preencha seus dados para garantir sua vaga.</p>
            </div>
            <div class="card-content-custom">
                <form id="registration-form">
                    <div class="form-group">
                        <label for="name">Nome Completo *</label>
                        <input id="name" type="text" value="${user.nome}" placeholder="Seu nome completo" required readonly />
                    </div>
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input id="email" type="email" value="${user.email}" placeholder="seu@email.com" required readonly />
                    </div>
                    <div class="form-group">
                        <label for="phone">Telefone/WhatsApp *</label>
                        <input id="phone" type="tel" placeholder="(00) 00000-0000" required />
                    </div>
                    <div class="form-group">
                        <label for="school">Escola *</label>
                        <input id="school" type="text" placeholder="Nome da sua escola" required />
                    </div>
                    <div class="form-group">
                        <label for="grade">Série/Ano *</label>
                        <input id="grade" type="text" placeholder="Ex: 9º ano" required />
                    </div>
                    <button 
                        type="submit" 
                        id="submit-button"
                        class="btn-submit"
                        ${!isAvailable ? 'disabled' : ''}
                    >
                        ${isAvailable ? "Confirmar Inscrição" : "Vagas Esgotadas"}
                    </button>
                </form>
            </div>
        </div>
    </div>
    
</div>
`;
        
        setupEventListeners(event._id, user);

    } catch (error) {
        container.innerHTML = `
            <div class="py-16 text-center">
                <h1 class="text-2xl font-bold mb-4 text-danger">Evento Não Encontrado!</h1>
                <p>Verifique o link ou se o servidor da API está funcionando.</p>
                <a href="index.html" class="btn btn-primary mt-4">Voltar para a Lista de Eventos</a>
            </div>
        `;
    }
};

const setupEventListeners = (eventId, user) => {
    // 1. Botão Voltar 
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }

    // 2. Formulário de Submissão (AGORA COM API REAL)
    const form = document.getElementById('registration-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const submitButton = document.getElementById('submit-button');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = "Processando...";

            const formData = {
                participantName: document.getElementById('name').value.trim(),
                participantEmail: document.getElementById('email').value.trim(),
                participantPhone: document.getElementById('phone').value.trim(),
                school: document.getElementById('school').value.trim(),
                grade: document.getElementById('grade').value.trim(),
                eventId: eventId
            };
            
            try {
                await registerForEvent(eventId, formData);
                simulateToast("Inscrição realizada!", `Parabéns! Você foi inscrita no evento.`);
                window.location.href = 'perfil-aluna.html'; 
            } catch (error) {
                simulateToast("Erro", error.message || "Não foi possível realizar a inscrição.", true);
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // 3. Configurar logout
    const logoutBtn = document.querySelector(".btn-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole"); 
            alert("Você saiu da sua conta.");
            window.location.href = "index.html";
        });
    }
};

// =======================================================
// 5. INICIALIZAÇÃO
// =======================================================
document.addEventListener('DOMContentLoaded', renderEventDetails);