const express = require("express");
const router = express.Router();
const { getMyEvents, getMyProfile } = require("../controllers/userController");
const { protect, isStudent } = require("../middleware/authMiddleware");

// Rota para obter perfil do usuário
router.get("/me", protect, getMyProfile);

// Rota para obter eventos do usuário
router.get("/my-events", protect, isStudent, getMyEvents);

module.exports = router;