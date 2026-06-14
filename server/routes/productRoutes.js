const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  addProductReview,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

// ─── Product Routes ───────────────────────────────────────
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.post("/:id/review", protect, addProductReview);

module.exports = router;