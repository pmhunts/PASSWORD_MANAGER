const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = async (req, res) => {
  // CORS headers - MUST allow GitHub Pages
  const allowedOrigins = [
    "https://pmhunts.github.io",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:5500", // VS Code Live Server
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

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

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      await mongoose.disconnect();
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      passwordEntries: [],
    });

    await user.save();
    await mongoose.disconnect();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    await mongoose.disconnect();
    res.status(400).json({ error: error.message });
  }
};
