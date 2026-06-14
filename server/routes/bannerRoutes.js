const express = require("express");
const router = express.Router();
const {
  getBanners,
  addBanner,
  deleteBanner,
} = require("../controllers/bannerController");
const { protect, admin } = require("../middleware/authMiddleware");

// ─── Banner Routes ────────────────────────────────────────
router.get("/", getBanners);
router.post("/", protect, admin, addBanner);
router.delete("/:id", protect, admin, deleteBanner);

module.exports = router;