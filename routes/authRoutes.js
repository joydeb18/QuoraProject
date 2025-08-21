// Hinglish: Routes sirf URL ko controller functions se map karte hain.

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Home → redirect to signup
router.get("/", (req, res) => res.redirect("/signup"));

// Signup form + submit
router.get("/signup", authController.showSignup);
router.post("/signup", authController.handleSignup);

// Welcome (success page)
router.get("/welcome", authController.showWelcome);

module.exports = router;
