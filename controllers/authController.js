const bcrypt = require("bcrypt");
const User = require("../models/User");

// POST /signup → Naya User Register karna
exports.handleSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check karo ki saari fields aayi hain ya nahi
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Please sab fields fill karo." 
      });
    }

    // Check karo ki email pehle se registered to nahi hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Ye email already registered hai." 
      });
    }

    // Password ko hash (encrypt) karo
    const passwordHash = await bcrypt.hash(password, 10);

    // Naya user database mein save karo
    const newUser = await User.create({ username, email, passwordHash });

    // Success hone par JSON response bhejo
    return res.status(201).json({ 
      success: true, 
      message: "User successfully register ho gaya!",
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });

  } catch (err) {
    // Agar koi server error aaye
    return res.status(500).json({ 
      success: false, 
      message: "Server error aaya.", 
      error: err.message 
    });
  }
};


// POST /login → User ko Login karana
exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check karo ki fields khaali na ho
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email aur password dono daalo." 
      });
    }

    // Database mein user ko email se dhoondo
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ // 404 Not Found status code
        success: false, 
        message: "Is email se koi user nahi mila." 
      });
    }

    // User ke diye gaye password aur database ke hash password ko compare karo
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ // 401 Unauthorized status code
        success: false, 
        message: "Galat password hai." 
      });
    }

    // Agar sab sahi hai → success ka JSON response bhejo
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (err) {
    // Agar koi server error aaye
    return res.status(500).json({ 
      success: false, 
      message: "Server error aaya.", 
      error: err.message 
    });
  }
};