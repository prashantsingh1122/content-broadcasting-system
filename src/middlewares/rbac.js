/**
 * Role-Based Access Control Middleware
 * Checks if authenticated user has required role
 * 
 * @param {...string} allowedRoles - Roles that can access the route
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Access denied. This route requires ${allowedRoles.join(' or ')} role.`,
        userRole: req.user.role
      });
    }

    // User has required role
    next();
  };
};

module.exports = authorize;