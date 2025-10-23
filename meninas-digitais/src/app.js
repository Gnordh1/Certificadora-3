const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const User = require("./models/User");
const bcrypt = require("bcryptjs");

// Importa as rotas
const authRoutes = require("./routes/authRoutes");
const eventoRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/eventos", eventoRoutes);
app.use("/api/users", userRoutes);

// Rota "catch-all" para servir o index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;

// --- Função para criar o admin inicial ---
const setupInitialAdmin = async () => {
  try {
    // 1. Verifica se já existe um administrador
    const adminExists = await User.findOne({ perfil: "administradora" });

    if (!adminExists) {
      console.log("Nenhum administrador encontrado. Criando usuário padrão...");

      const email = process.env.INITIAL_ADMIN_EMAIL;
      const senha = process.env.INITIAL_ADMIN_PASSWORD;
      const nome = process.env.INITIAL_ADMIN_NAME;

      if (!email || !senha || !nome) {
        console.error(
          "As variáveis de ambiente para o admin inicial não foram definidas. O admin não será criado."
        );
        return; // Encerra a função se as variáveis não estiverem definidas
      }

      // 2. Criptografa a senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);

      // 3. Cria o novo usuário administrador
      const adminUser = new User({
        nome,
        email,
        senha: hashedPassword,
        perfil: "administradora",
      });

      await adminUser.save();
      console.log(`Administrador padrão criado com sucesso! Email: ${email}`);
    } else {
      console.log(
        "Um administrador já existe no banco de dados. Nenhuma ação é necessária."
      );
    }
  } catch (error) {
    console.error("Erro ao tentar configurar o administrador inicial:", error);
  }
};

// --- Lógica de inicialização do servidor ---
const startServer = async () => {
  try {
    await connectDB(); // 1. Conecta ao banco de dados
    await setupInitialAdmin(); // 2. Executa a verificação e criação do admin

    // 3. Inicia o servidor
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error.message);
    process.exit(1);
  }
};


// Inicia o servidor
startServer();
