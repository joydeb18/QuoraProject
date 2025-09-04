const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // <-- Bouncer ko import karo

// ... (purane routes waise hi rahenge) ...
router.get("/", (req, res) => res.json({ message: "API is working fine! ✅" }));
router.post("/signup", authController.handleSignup);
router.post("/login", authController.handleLogin);

// === NAYA PROTECTED ROUTE ===
// Hinglish: Yeh ek special VIP section hai.
// Is route par aane se pehle, customer ko bouncer (authMiddleware) se check karwana padega.
router.get("/profile", authMiddleware, (req, res) => {
    // Agar bouncer ne aapko andar aane diya, to iska matlab token valid hai.
    // Bouncer ne user ki ID `req.user` me daal di thi, hum use yahan access kar sakte hain.
    res.json({
        success: true,
        message: "Welcome to your profile!",
        user: req.user // Yeh user ID token se aa rahi hai
    });
});

module.exports = router;