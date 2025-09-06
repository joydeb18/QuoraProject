const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Function 1: Signup karna
exports.handleSignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "Saari fields zaroori hain." });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Ye email already registered hai." });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, passwordHash });
        return res.status(201).json({
            success: true,
            message: "User successfully register ho gaya!",
            user: { id: newUser._id, username: newUser.username }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error aaya.", error: err.message });
    }
};

// Function 2: Login karna (Master Key ke Logic ke Saath)
exports.handleLogin = async (req, res) => {
    try {
        const { email, password, masterKey } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email zaroori hai." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Is email se koi user nahi mila." });
        }

        // CASE 1: ADMIN LOGIN
        if (user.role === 'admin') {
            if (!masterKey || masterKey !== process.env.ADMIN_MASTER_KEY) {
                return res.status(403).json({ success: false, message: 'Galat Master Key hai.' });
            }
        } 
        // CASE 2: NORMAL USER LOGIN
        else {
            if (!password) {
                 return res.status(400).json({ success: false, message: 'Password zaroori hai.' });
            }
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Galat password hai." });
            }
        }

        // AGAR UPAR KOI ERROR NAHI AAYA, TOH LOGIN SUCCESSFUL HAI
        const payload = { user: { id: user._id, role: user.role } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    success: true,
                    message: "Login successful!",
                    token: token,
                    user: { role: user.role }
                });
            }
        );
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error aaya.", error: err.message });
    }
};