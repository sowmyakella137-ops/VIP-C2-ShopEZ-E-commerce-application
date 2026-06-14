const Banner = require("../models/Banner");

// ─── Get All Banners ──────────────────────────────────────
// GET /api/banners
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Add Banner ───────────────────────────────────────────
// POST /api/banners
const addBanner = async (req, res) => {
  try {
    const { title, image, link, order } = req.body;

    const banner = await Banner.create({
      title,
      image,
      link,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Banner added successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Delete Banner ────────────────────────────────────────
// DELETE /api/banners/:id
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getBanners, addBanner, deleteBanner };