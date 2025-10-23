const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Middleware para proteger rotas que exigem autenticação
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Pega o token do header (formato "Bearer token")
      token = req.headers.authorization.split(" ")[1];

      // Verifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Anexa o usuário (sem a senha) ao objeto da requisição
      req.user = await User.findById(decoded.user.id).select("-senha");

      if (!req.user) {
        return res.status(401).json({ msg: "Usuário não encontrado." });
      }

      next(); // Passa para a próxima função
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: "Não autorizado, token falhou" });
    }
  }

  if (!token) {
    res.status(401).json({ msg: "Não autorizado, sem token" });
  }
};

// Middleware para verificar se o usuário é Administradora
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.perfil === "administradora") {
    next();
  } else {
    res
      .status(403)
      .json({ msg: "Acesso negado. Rota exclusiva para administradoras." });
  }
};

// Middleware para verificar se o usuário é Aluna
exports.isStudent = (req, res, next) => {
  if (req.user && req.user.perfil === "aluna") {
    next();
  } else {
    res.status(403).json({ msg: "Acesso negado. Rota exclusiva para alunas." });
  }
};
