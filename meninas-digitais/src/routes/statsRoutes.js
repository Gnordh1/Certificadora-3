const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/statsController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// @route   GET /api/stats/dashboard
// @desc    Busca estatísticas agregadas para o dashboard
// @access  Privado/Admin
router.get("/dashboard", protect, isAdmin, getDashboardStats);

module.exports = router;
