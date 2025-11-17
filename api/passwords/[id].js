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
const User = mongoose.model("User", userSchema);

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

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { id } = req.query;

    if (req.method === "PATCH") {
      // Update password entry
      const user = await auth(req);
      const { website, url, username, password, notes } = req.body;

      const entryIndex = user.passwordEntries.findIndex(
        (entry) => entry.id === id
      );

      if (entryIndex === -1) {
        await mongoose.disconnect();
        return res.status(404).json({ error: "Password entry not found" });
      }

      // Update fields
      user.passwordEntries[entryIndex] = {
        ...user.passwordEntries[entryIndex],
        website,
        url: url || "",
        username,
        password,
        notes: notes || "",
        lastUpdated: new Date(),
      };

      await user.save();
      await mongoose.disconnect();

      res.status(200).json({ entry: user.passwordEntries[entryIndex] });
    } else if (req.method === "DELETE") {
      // Delete password entry
      const user = await auth(req);

      user.passwordEntries = user.passwordEntries.filter(
        (entry) => entry.id !== id
      );

      await user.save();
      await mongoose.disconnect();

      res.status(200).json({ message: "Password entry deleted successfully" });
    } else {
      await mongoose.disconnect();
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    await mongoose.disconnect();
    res.status(401).json({ error: error.message });
  }
};
