const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ─── Generate JWT Token ───────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ─── Register User ────────────────────────────────────────
// POST /api/users/register
const registerUser = async (req, res) => {
  console.log("Register route hit!", req.body);
  try {
    const { name, email, password, phone } = req.body;

    console.log("Step 1 - Fields extracted");

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    console.log("Step 2 - Validation passed");

    const userExists = await User.findOne({ email });

    console.log("Step 3 - User check done", userExists);

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    console.log("Step 4 - Creating user");

    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    console.log("Step 5 - User created", user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("ERROR CAUGHT:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Login User ───────────────────────────────────────────
// POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Send response with token
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { registerUser, loginUser };