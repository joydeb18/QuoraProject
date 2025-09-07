const jwt = require('jsonwebtoken');

// Yeh function ek "Super Bouncer" ki tarah kaam karta hai
const adminMiddleware = (req, res, next) => {
    // 1. Pehle normal bouncer wala kaam karo: ticket (token) check karo
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied.' });
    }

    try {
        // 2. Ticket ko decode karke user ki details nikalo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        
        // 3. YEH HAI ASLI ADMIN CHECK
        // Kya user ka role 'admin' hai?
        if (req.user.role !== 'admin') {
            // Agar admin nahi hai, toh entry mat do
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }
        
        // 4. Agar admin hai, toh andar aane do
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid.' });
    }
};

module.exports = adminMiddleware;