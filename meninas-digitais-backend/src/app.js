const express = require("express");
const connectDB = require("./config/database");
require("dotenv").config();

// Importa as rotas
const authRoutes = require("./routes/authRoutes");
const eventoRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Conectar ao Banco de Dados
connectDB();

// Middlewares
app.use(express.json()); // Para o Express entender JSON

// Rotas
app.use("/api/auth", authRoutes); // Usa as rotas de autenticação
app.use("/api/eventos", eventoRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
