const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ─── Place Order ──────────────────────────────────────────
// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Calculate delivery charge
    const deliveryCharge = cart.totalPrice > 500 ? 0 : 50;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      deliveryAddress,
      paymentMethod,
      itemsPrice: cart.totalPrice,
      deliveryCharge,
      totalPrice: cart.totalPrice + deliveryCharge,
    });

    // Reduce stock for each product
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Clear cart after order placed
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Get Single Order ─────────────────────────────────────
// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure the order belongs to logged in user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { placeOrder, getOrderById };