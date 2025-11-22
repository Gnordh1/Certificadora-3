document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const cadastroForm = document.getElementById("cadastro-form");
  const apiBaseUrl = "/api/auth";

  // --- Lógica de Login com Redirecionamento e Armazenamento de Perfil ---
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

      // 1. Armazena o token recebido do servidor
      localStorage.setItem("token", data.token);

      // 2. Decodifica o token para obter o perfil
      try {
        const token = data.token;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userProfile = payload.user.perfil; // Ex: "administradora" ou "aluna"

        // 3. Armazena o perfil no localStorage para uso na UI
        localStorage.setItem("userRole", userProfile);

        // 4. Redireciona com base no perfil obtido do token
        if (userProfile === "administradora") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "index.html";
        }
      } catch (error) {
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

  // --- Lógica de Cadastro  ---
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

      // O backend cria o usuário como 'aluna' por padrão e retorna um token.
      // O login é implícito após o cadastro.
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "aluna"); // Perfil padrão no cadastro

      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert(error.message);
    }
  });
});
