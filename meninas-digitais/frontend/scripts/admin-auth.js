document.addEventListener("DOMContentLoaded", () => {
  // Obtém o token de autenticação do armazenamento local.
  const token = localStorage.getItem("token");

  // Se não houver token, o acesso é negado e o usuário é redirecionado para a página de login.
  if (!token) {
    alert("Acesso negado. Por favor, faça o login como administrador.");
    window.location.href = "login-cadastro.html";
    return; // Encerra a execução do script.
  }

  try {
    // Decodifica o payload do JWT para extrair informações do usuário.
    // O payload é a segunda parte do token, codificada em Base64.
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userProfile = payload.user.perfil;

    // Verifica se o perfil do usuário é de 'administradora'.
    // Se não for, nega o acesso a esta área restrita.
    if (userProfile !== "administradora") {
      alert("Acesso negado. Esta área é exclusiva para administradoras.");
      window.location.href = "index.html";
      return;
    }

    // Se a autenticação e autorização foram bem-sucedidas, configura o botão de logout.
    setupLogout();
  } catch (error) {
    // Em caso de erro na decodificação (token inválido, malformado ou expirado),
    // a sessão é invalidada e o usuário é enviado para o login.
    console.error("Erro ao verificar o token:", error);
    localStorage.removeItem("token");
    alert("Sessão inválida ou expirada. Por favor, faça o login novamente.");
    window.location.href = "login-cadastro.html";
  }
});

/**
 * Adiciona a funcionalidade de logout aos botões designados.
 * Procura todos os elementos com a classe '.btn-logout'.
 */
function setupLogout() {
  const logoutButtons = document.querySelectorAll(".btn-logout");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem("token"); // Limpa o token do armazenamento.
      alert("Você saiu da sua conta.");
      window.location.href = "index.html"; // Redireciona para a página inicial.
    });
  });
}
