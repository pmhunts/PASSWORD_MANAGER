const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordEntries: [
    {
      id: String,
      website: String,
      url: String,
      username: String,
      password: String,
      notes: String,
      created: Date,
      lastUpdated: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      await mongoose.disconnect();
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      await mongoose.disconnect();
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await mongoose.disconnect();
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "securevaultsecret",
      { expiresIn: "1h" }
    );

    await mongoose.disconnect();

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    await mongoose.disconnect();
    res.status(400).json({ error: error.message });
  }
};
