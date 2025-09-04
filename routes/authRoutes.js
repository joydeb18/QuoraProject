// Hinglish: Routes sirf API endpoints ko controller functions se map karte hain.
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Home Route - API status check karne ke liye
router.get("/", (req, res) => {
  res.json({ message: "API is working fine! ✅" });
});

// Signup ka POST route
router.post("/signup", authController.handleSignup);

// Login ka POST route
router.post("/login", authController.handleLogin);

module.exports = router;