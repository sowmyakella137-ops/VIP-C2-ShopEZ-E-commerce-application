const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// ─── Auth Routes ──────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login", loginUser);

// ─── User Routes (Protected) ──────────────────────────────
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/orders", protect, getUserOrders);

module.exports = router;