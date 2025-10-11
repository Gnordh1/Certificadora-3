const express = require("express");
require("dotenv").config();

const app = express();

// Middleware inicial
app.use(express.json()); // Para o Express entender JSON

app.get("/", (req, res) => {
  res.send("API Meninas Digitais Rodando!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
