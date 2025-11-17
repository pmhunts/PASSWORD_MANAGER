const mongoose = require("mongoose");
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
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Authentication middleware
const auth = async (req) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "securevaultsecret"
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error();
    }

    return user;
  } catch (error) {
    throw new Error("Please authenticate");
  }
};

module.exports = async (req, res) => {
  // CORS headers - MUST allow GitHub Pages
  const allowedOrigins = [
    "https://pmhunts.github.io",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:5500", // VS Code Live Server
    "https://password-manager-9bh4og3ub-hunts-projects-e9394626.vercel.app",
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

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (req.method === "GET") {
      // Get user password entries
      const user = await auth(req);
      await mongoose.disconnect();
      res.status(200).json({ passwordEntries: user.passwordEntries });
    } else if (req.method === "POST") {
      // Add new password entry
      const user = await auth(req);
      const { website, url, username, password, notes } = req.body;

      const newEntry = {
        id: new mongoose.Types.ObjectId().toString(),
        website,
        url: url || "",
        username,
        password,
        notes: notes || "",
        created: new Date(),
        lastUpdated: new Date(),
      };

      user.passwordEntries.push(newEntry);
      await user.save();
      await mongoose.disconnect();

      res.status(201).json({ entry: newEntry });
    } else {
      await mongoose.disconnect();
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    await mongoose.disconnect();
    res.status(401).json({ error: error.message });
  }
};
