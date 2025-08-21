// Hinglish: Controller me business logic hota hai (signup dikhao, signup process karo)

const bcrypt = require("bcrypt");
const User = require("../models/User");

// GET /signup → form dikhana
exports.showSignup = (req, res) => {
  // Hinglish: error aur old values pass kar rahe taaki form me dikhe
  res.render("signup", { error: null, old: { username: "", email: "" } });
};

// POST /signup → form submit handle
exports.handleSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // --- Basic validations (school level) ---
    if (!username || !email || !password) {
      return res.status(400).render("signup", {
        error: "Please sab fields fill karo.",
        old: { username, email }
      });
    }

    // Simple email check
    const emailOk = /^\S+@\S+\.\S+$/.test(email);
    if (!emailOk) {
      return res.status(400).render("signup", {
        error: "Valid email daalo.",
        old: { username, email }
      });
    }

    // Email already registered?
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).render("signup", {
        error: "Ye email already registered hai.",
        old: { username, email }
      });
    }

    // Password hash
    const passwordHash = await bcrypt.hash(password, 10); // Hinglish: 10 = saltRounds

    // Save user
    await User.create({ username, email, passwordHash });

    // Success → welcome page
    return res.redirect("/welcome");
  } catch (err) {
    console.error(err);
    return res.status(500).render("signup", {
      error: "Server error aaya. Thoda baad try karo.",
      old: { username: req.body.username || "", email: req.body.email || "" }
    });
  }
};

// GET /welcome → success page
exports.showWelcome = (req, res) => {
  res.render("welcome");
};
