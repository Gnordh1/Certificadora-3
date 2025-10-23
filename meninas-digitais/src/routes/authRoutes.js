const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginUser,
  registerUser,
} = require("../controllers/authController"); // Adicione registerUser

// @route   POST api/auth/register-admin
// @desc    Registra uma nova administradora
// @access  Público (inicialmente, depois pode ser restrito)
router.post("/register-admin", registerAdmin);

// @route   POST api/auth/login
// @desc    Autentica um usuário e retorna o token
// @access  Público
router.post("/login", loginUser);

// @route   POST api/auth/register
// @desc    Registra uma nova usuária (aluna)
// @access  Público
router.post("/register", registerUser);

module.exports = router;
