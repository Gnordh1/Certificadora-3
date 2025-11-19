const express = require("express");
const router = express.Router();
const {
  createEvento,
  getAllEventos,
  getEventoById,
  updateEvento,
  deleteEvento,
  enrollEvento,
  getEventParticipants,
  updateEventStatus,
  unenrollEvento,
} = require("../controllers/eventController");
const { protect, isAdmin, isStudent } = require("../middleware/authMiddleware");

// Rotas Públicas (acessíveis por qualquer um)
router.get("/", getAllEventos);
router.get("/:id", getEventoById);

// Rotas Privadas (apenas para administradoras logadas)
// Usamos o 'protect' para verificar o token e o 'isAdmin' para verificar o perfil
router.post("/", protect, isAdmin, createEvento);
router.put("/:id", protect, isAdmin, updateEvento);
router.delete("/:id", protect, isAdmin, deleteEvento);
router.get("/:id/participantes", protect, isAdmin, getEventParticipants);
router.patch("/:id/status", protect, isAdmin, updateEventStatus);

// Rotas Privadas para Alunas
router.post("/:id/enroll", protect, isStudent, enrollEvento);
router.post("/:id/unenroll", protect, isStudent, unenrollEvento);


module.exports = router;
