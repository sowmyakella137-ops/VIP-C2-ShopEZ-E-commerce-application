// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Import database connection function
const connectDB = require("./config/db");

// Import all routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bannerRoutes = require("./routes/bannerRoutes");

// Import error handling middleware
const { errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// ─── Middleware ───────────────────────────────────────────
// Allow express to accept JSON data in request body
app.use(express.json());

// Allow frontend (React) to communicate with backend
app.use(cors());

// ─── Connect to MongoDB Atlas ─────────────────────────────
connectDB();

// ─── Routes ───────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);

// ─── Default Route ────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Welcome to ShopEZ API 🛒");
});

// ─── Error Handling Middleware ────────────────────────────
// This must always be at the bottom
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ ShopEZ Server is running on port ${PORT}`);
});