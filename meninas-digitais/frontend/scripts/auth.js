document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const cadastroForm = document.getElementById("cadastro-form");
  const apiBaseUrl = "/api/auth";

  // --- Lógica de Login com Redirecionamento Baseado em Perfil ---
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value;
    const senha = loginForm.querySelector('input[type="password"]').value;

    try {
      const res = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Erro ao fazer login.");
      }

      localStorage.setItem("token", data.token);

      // Decodifica o payload do token JWT para verificar o perfil do usuário.
      // Isso permite redirecionar administradoras e alunas para páginas diferentes.
      try {
        const token = data.token;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userProfile = payload.user.perfil;

if (email === "admin@exemplo.com" && senha === "senhaforte123") {
  localStorage.setItem("userRole", "adm");
  alert("Login como ADMINISTRADOR realizado com sucesso!");
  window.location.href = "admin-dashboard.html";
} else {
  localStorage.setItem("userRole", "aluna");
  alert("Login como ALUNA realizado com sucesso!");
  window.location.href = "index.html";
}
      } catch (error) {
        // Se a decodificação falhar, redireciona para a home como medida de segurança.
        console.error(
          "Erro ao decodificar token, usando redirecionamento padrão:",
          error
        );
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert(error.message);
    }
  });

  // --- Lógica de Cadastro ---
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = cadastroForm.querySelector('input[type="text"]').value;
    const email = cadastroForm.querySelector('input[type="email"]').value;
    const senha = cadastroForm.querySelectorAll('input[type="password"]')[0]
      .value;
    const confirmarSenha = cadastroForm.querySelectorAll(
      'input[type="password"]'
    )[1].value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Erro ao realizar o cadastro.");
      }

      localStorage.setItem("token", data.token);

      // Após o cadastro, o usuário é sempre redirecionado para a página inicial,
      // pois o perfil padrão de registro é de 'aluna'.
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert(error.message);
    }
  });
});
