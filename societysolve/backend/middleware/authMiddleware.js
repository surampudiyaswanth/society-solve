const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'societysolve_jwt_secure_key_2026_change_in_production'
      );

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.',
        });
      }

      if (req.user.status === 'Inactive') {
        return res.status(403).json({
          success: false,
          message: 'Your account is deactivated. Please contact platform administration.',
        });
      }

      next();
    } catch (error) {
      console.error('[AuthMiddleware] Verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: Invalid or expired token.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authorization token provided.',
    });
  }
};

module.exports = { protect };
