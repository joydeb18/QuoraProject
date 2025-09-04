// controllers/authController.js

const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Dish 1: Signup karna
// Maine iske response ko bhi thoda behtar kar diya hai
exports.handleSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Ye email already registered hai." 
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, passwordHash });

    return res.status(201).json({
      success: true,
      message: "User successfully register ho gaya!",
      user: { id: newUser.id, username: newUser.username }
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error aaya.", 
      error: err.message 
    });
  }
};


// Dish 2: Login karna
exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Is email se koi user nahi mila." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    // === YEH GALAT THA ===
    // Aapka token generation ka code is block ke andar tha.
    // if (!isMatch) { ... token code yahan tha ... }
    
    // === YEH SAHI LOGIC HAI ===
    // Pehle check karo ki password galat to nahi hai.
    if (!isMatch) {
      // Agar password match nahi hota, to error bhej kar function yahin rok do.
      return res.status(401).json({ success: false, message: "Galat password hai." });
    }

    // Agar upar wala 'if' block nahi chala, iska matlab password sahi hai.
    // Ab hum token banayenge.

    // Step A: Payload taiyar karna
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Step B: VIP Card (Token) banana
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Step C: Customer ko uska card (token) de dena
        res.status(200).json({
          success: true,
          message: "Login successful!",
          token: token,
        });
      }
    );
    
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error aaya.", 
      error: err.message 
    });
  }
};