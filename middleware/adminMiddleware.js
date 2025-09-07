const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        
        // Asli admin check
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Not an admin.' });
        }
        
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is not valid.' });
    }
};

module.exports = adminMiddleware;