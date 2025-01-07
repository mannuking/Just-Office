const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    console.log('Auth middleware - checking token');
    console.log('Headers:', req.headers);
    
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Extracted token:', token ? 'Present' : 'Missing');

    // Check if no token
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        console.log('Verifying token with JWT_SECRET');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified successfully');
        console.log('Decoded user:', decoded.user);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ 
            message: 'Token is not valid',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};
