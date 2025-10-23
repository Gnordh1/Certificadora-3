const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Cadastro de Administradora
exports.registerAdmin = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verifica se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Usuário já existe" });
    }

    user = new User({
      nome,
      email,
      senha,
      perfil: "administradora", // Define o perfil como administradora
    });

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(senha, salt);

    await user.save();

    // Gera o token JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // Expira em 1 hora
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// Login de Usuário
exports.loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o usuário existe
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    // Compara a senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    // Gera o token JWT
    const payload = {
      user: {
        id: user.id,
        perfil: user.perfil,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" }, // Expira em 5 horas
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

// @desc    Registra um novo usuário (aluna)
// @route   POST /api/auth/register
// @access  Público
exports.registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Usuário já existe" });
    }

    user = new User({
      nome,
      email,
      senha,
      perfil: "aluna",
    });

    const salt = await bcrypt.genSalt(10);
    user.senha = await bcrypt.hash(senha, salt);

    await user.save();

    // Cria e retorna o token para que a usuária já entre logada
    const payload = {
      user: {
        id: user.id,
        perfil: user.perfil,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};
