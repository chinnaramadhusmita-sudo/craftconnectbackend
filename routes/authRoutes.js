const express = require("express");
const router = express.Router(); // ✅ THIS WAS MISSING

const User = require("../models/User");

// ✅ NORMAL AUTH


// ✅ GOOGLE LOGIN
 router.post("/google", async (req, res) => {
  try {
    const { firebaseId, email, role } = req.body;

    let user = await User.findOne({
  $or: [
    { firebaseId },
    { email }
  ]
});

    if (!user) {
      // NEW USER
      user = await User.create({
        firebaseId,
        email,
        roles: [role || "buyer"],
      });
    } else {
  // ✅ FIX: Ensure roles exists
  if (!user.roles) {
    user.roles = ["buyer"];
  }

  // ADD ROLE IF NOT EXISTS
  if (role && !user.roles.includes(role)) {
    user.roles.push(role);
    await user.save();
  }
}

    res.json({ message: "Google login success", user });
  } catch (error) {
    console.error("🔥 GOOGLE LOGIN ERROR:", error);
res.status(500).json({ error: error.message });
  }
});

module.exports = router; // ✅ ALSO IMPORTANT