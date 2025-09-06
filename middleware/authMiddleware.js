const jwt = require('jsonwebtoken');

// Yeh function ek "Bouncer" ki tarah kaam karta hai
const authMiddleware = (req, res, next) => {
    // 1. Bouncer check karega ki customer ke paas ticket (token) hai ya nahi
    const token = req.header('x-auth-token');

    // 2. Agar ticket hi nahi hai, toh entry mat do
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied.' });
    }

    try {
        // 3. Agar ticket hai, toh check karo ki woh asli hai ya nakli
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Agar ticket asli hai, toh customer ki ID ko request mein daal do
        req.user = decoded.user;
        
        // 5. Bouncer customer ko andar aane ki permission de raha hai
        next();
    } catch (err) {
        // 6. Agar ticket nakli (invalid) nikla, toh entry mat do
        res.status(401).json({ success: false, message: 'Token is not valid.' });
    }
};

module.exports = authMiddleware;