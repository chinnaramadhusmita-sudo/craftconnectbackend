const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const User = require("../models/User");

// 🔐 VERIFY TOKEN MIDDLEWARE
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// ✅ GET USER ROLE
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.user.uid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ roles: user.roles });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { firebaseId, email, role } = req.body;

    let user = await User.findOne({ firebaseId });

    if (!user) {
      user = new User({ firebaseId, email, role });
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error saving user" });
  }
});

module.exports = router;