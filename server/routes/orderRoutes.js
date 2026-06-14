const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrderById,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// ─── Order Routes (All Protected) ────────────────────────
router.post("/", protect, placeOrder);
router.get("/:id", protect, getOrderById);

module.exports = router;