document.addEventListener("DOMContentLoaded", () => {
    // =======================================================
    // 1. CONFIGURAÇÃO, AUTENTICAÇÃO E DECODIFICAÇÃO DO TOKEN
    // =======================================================
    const token = localStorage.getItem("token");
    let user = null; // Objeto para armazenar as informações do usuário

    // Endpoints baseados na sua estrutura de rotas
    // Removido USER_API_URL, pois o token já tem os dados.
    const REGISTRATIONS_API_URL = "/api/users/my-events"; // Endpoint inferido para buscar inscrições

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            console.log("Payload completo:", payload);
            
            // CORREÇÃO: Acesse user.nome, user.email, user.perfil
            user = {
                nome: payload.user.nome,      // ← payload.user.nome
                email: payload.user.email,    // ← payload.user.email  
                perfil: payload.user.perfil,  // ← payload.user.perfil
            };
            
            console.log("User após decodificação:", user);
            
            // Verifica se o perfil é 'aluna'
            if (user.perfil !== "aluna") {
                alert("Acesso negado. Esta página é para alunas.");
                window.location.href = "index.html";
                return;
            }

        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            alert("Sessão inválida ou expirada. Faça o login novamente.");
            window.location.href = "login-cadastro.html";
            return;
        }
    }

    // --- 1.2 Checagem final de login (Necessária se o token não foi decodificado) ---
    if (!user) {
        alert("Acesso negado. Por favor, faça o login.");
        window.location.href = "login-cadastro.html";
        return;
    }

    // --- 1.3 Configura o Logout (Copiado de main.js/admin-auth.js) ---
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole"); 
            alert("Você saiu da sua conta.");
            window.location.href = "index.html";
        });
    }

    // =======================================================
    // 2. FUNÇÕES DE UTILIDADE (Não mudam)
    // =======================================================

    // SVGs dos ícones
    const ICONS = {
        Calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
        Clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        MapPin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'
    };

    // Formata data
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString + "T00:00:00"); 
            return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
        } catch (e) {
            return dateString || 'Data Inválida';
        }
    };

    // =======================================================
    // 3. RENDERIZAÇÃO E CHAMADA DA API
    // =======================================================

    /**
     * Renderiza a lista de eventos na div #events-list-container.
     */

    const renderEvents = (userRegistrations) => {
        const eventsListContainer = document.getElementById('events-list-container');
        eventsListContainer.innerHTML = '';

        console.log("Dados para renderizar:", userRegistrations);

        if (!userRegistrations || userRegistrations.length === 0) {
            eventsListContainer.innerHTML = `
                <div class="text-center py-12">
                    <p class="text-muted-foreground">
                        Você ainda não está inscrita em nenhum evento.
                    </p>
                </div>
            `;
        } else {
            // CORREÇÃO: Use _id em vez de id para MongoDB
            const eventsHtml = userRegistrations.map((event) => {
                // A API retorna um array de eventos direto, não tem 'event' nem 'registration'
                const eventId = event._id || event.id;
                const eventTitle = event.titulo || "Evento sem título";
                const eventDate = event.data || "Data não definida";
                const eventTime = event.horario || "Horário não definido";
                const eventLocation = event.local || "Local não definido";
                const eventType = event.tipo || event.publico_alvo || "Geral";

                return `
                    <div
                        key="${eventId}"
                        class="event-row border rounded-lg p-4 transition-colors cursor-pointer"
                        onclick="window.location.href='detalhes-evento.html?id=${eventId}'"
                    >
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                                <h3 class="font-semibold text-lg mb-2">${eventTitle}</h3>
                                
                                <div class="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                    <div class="flex items-center gap-2">
                                        ${ICONS.Calendar}
                                        <span>${formatDate(eventDate)}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        ${ICONS.Clock}
                                        <span>${eventTime}</span>
                                    </div>
                                    <div class="flex items-center gap-2 sm:col-span-2">
                                        ${ICONS.MapPin}
                                        <span>${eventLocation}</span>
                                    </div>
                                </div>
                            </div>
                            <span class="badge bg-gray-100 text-gray-800">${eventType}</span>
                        </div>
                    </div>
                `;
            }).join('');

            eventsListContainer.innerHTML = `
                <div class="space-y-4">
                    ${eventsHtml}
                </div>
            `;
        }
    };


    /**
     * Busca os eventos registrados do usuário.
     */
    const fetchUserRegistrations = async () => {
        try {
            console.log("Buscando inscrições do usuário...");
            
            const registrationsResponse = await fetch(REGISTRATIONS_API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Status da resposta:", registrationsResponse.status);
            
            if (!registrationsResponse.ok) {
                throw new Error("Falha ao buscar inscrições.");
            }

            const userRegistrations = await registrationsResponse.json();
            console.log("Inscrições recebidas:", userRegistrations);
            
            // CORREÇÃO: Atualiza o contador com o número real de eventos
            document.getElementById('events-count').textContent = userRegistrations.length;
            
            // CORREÇÃO: Chama renderEvents com os dados corretos
            renderEvents(userRegistrations);

        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            
            document.getElementById('events-list-container').innerHTML = `
                <div class="py-12 text-center text-red-600">
                    <p>Erro ao carregar seus eventos. Tente novamente mais tarde.</p>
                    <p class="text-sm">Detalhes: ${error.message}</p>
                </div>`;
            
            document.getElementById('events-count').textContent = '0';
        }
    };

    // =======================================================
    // 4. INICIALIZAÇÃO
    // =======================================================

    // 1. Preenche o cartão de informações com os dados do token
    document.getElementById('user-name').textContent = user.nome;
    document.getElementById('user-email').textContent = user.email;

    // 2. Inicia a busca pelos eventos
    fetchUserRegistrations();
});