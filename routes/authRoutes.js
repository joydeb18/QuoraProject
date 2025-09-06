const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Route 1: Signup ke liye
router.post("/signup", authController.handleSignup);

// Route 2: Login ke liye
router.post("/login", authController.handleLogin);

// Route 3: Protected Profile Route
router.get("/profile", authMiddleware, (req, res) => {
    // yeh route sirf tabhi chalega jab token valid hoga
    res.json({
        success: true,
        message: "Welcome to your profile!",
        user: req.user
    });
});

module.exports = router;