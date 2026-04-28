const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { User } = require('../models');

/**
 * Middleware to verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required. Please provide a token.' 
      });
    }

    // Check format: "Bearer TOKEN"
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token format. Use: Bearer <token>' 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Token not provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Check if user still exists
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User no longer exists' 
      });
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: user.name
    };

    next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired. Please login again.' 
      });
    }

    return res.status(401).json({ 
      success: false,
      error: 'Authentication failed' 
    });
  }
};

module.exports = authenticate;