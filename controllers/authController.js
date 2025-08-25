const bcrypt = require("bcrypt");
const User = require("../models/User");

// ---------------- SIGNUP (pehle se bana hua) ----------------
exports.showSignup = (req, res) => {
  res.render("signup", { error: null, old: { username: "", email: "" } });
};

exports.handleSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).render("signup", {
        error: "Please sab fields fill karo.",
        old: { username, email }
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).render("signup", {
        error: "Ye email already registered hai.",
        old: { username, email }
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, email, passwordHash });
    return res.redirect("/welcome");
  } catch (err) {
    return res.status(500).render("signup", {
      error: "Server error aaya.",
      old: { username: req.body.username || "", email: req.body.email || "" }
    });
  }
};

// ---------------- LOGIN (NEW) ----------------

// GET /login → login form dikhana
exports.showLogin = (req, res) => {
  res.render("login", { error: null, old: { email: "" } });
};

// POST /login → form submit handle
exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
      return res.status(400).render("login", {
        error: "Email aur password dono daalo.",
        old: { email }
      });
    }

    // User find karo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render("login", {
        error: "User nahi mila. Pehle sign up karo.",
        old: { email }
      });
    }

    // Password compare
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).render("login", {
        error: "Galat password hai.",
        old: { email }
      });
    }

    // Agar sab sahi hai → welcome page dikhao
    return res.redirect("/welcome");
  } catch (err) {
    return res.status(500).render("login", {
      error: "Server error aaya.",
      old: { email: req.body.email || "" }
    });
  }
};

// ---------------- WELCOME PAGE ----------------
exports.showWelcome = (req, res) => {
  res.render("welcome");
};
