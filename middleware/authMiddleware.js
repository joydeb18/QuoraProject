// Hinglish: Yeh hamara bouncer hai jo VIP card check karega.
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Step 1: Bouncer customer se card maang raha hai.
    // VIP card aam taur par request ke 'headers' me 'x-auth-token' naam se bheja jaata hai.
    const token = req.header('x-auth-token');

    // Step 2: Agar customer ke paas card hi nahi hai.
    if (!token) {
        return res.status(401).json({ success: false, message: 'Koi token nahi hai, access denied.' });
    }

    // Step 3: Agar card hai, to uski jaanch karna.
    try {
        // Bouncer manager ke secret stamp (JWT_SECRET) se card ko verify kar raha hai.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Agar card asli hai, to card par likhi user ki ID ko request me daal do.
        // Taki aage Chef ko pata chale ki yeh kaun sa user hai.
        req.user = decoded.user;
        
        // Aur customer ko andar jaane do.
        next();
    } catch (err) {
        // Step 4: Agar card nakli (invalid) ya expired hai.
        res.status(401).json({ success: false, message: 'Token valid nahi hai.' });
    }
};