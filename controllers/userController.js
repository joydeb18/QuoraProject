const User = require('../models/User');

// Yeh function database se saare users ki list nikaalega
exports.getAllUsers = async (req, res) => {
    try {
        // User.find({}) ka matlab hai "saare users dhoondho"
        // .select('-passwordHash') ka matlab hai "lekin unka password mat bhejna" (SECURITY)
        const users = await User.find({}).select('-passwordHash');
        
        res.json({
            success: true,
            users: users,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error aaya.', error: err.message });
    }
};