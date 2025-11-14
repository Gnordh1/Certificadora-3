const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getEventFeedbacks,
} = require("../controllers/feedbackController");
const { protect, isAdmin, isStudent } = require("../middleware/authMiddleware");

// @route   POST api/feedbacks
// @desc    Aluna submete um novo feedback
// @access  Privado/Aluna
router.post("/", protect, isStudent, submitFeedback);

// @route   GET api/feedbacks/evento/:eventId
// @desc    Admin visualiza todos os feedbacks de um evento
// @access  Privado/Admin
router.get("/evento/:eventId", protect, isAdmin, getEventFeedbacks);

module.exports = router;
