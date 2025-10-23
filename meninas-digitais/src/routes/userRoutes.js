const express = require("express");
const router = express.Router();
const { getMyEvents } = require("../controllers/userController");
const { protect, isStudent } = require("../middleware/authMiddleware");

router.get("/my-events", protect, isStudent, getMyEvents);

module.exports = router;
