const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'societysolve_jwt_secure_key_2026_change_in_production',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new user (Citizen, University, Industry)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'citizen',
      location,
      website,
      departments,
      sector,
      headquarters,
    } = req.body;

    // Validate essential fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Role validation
    const validRoles = ['citizen', 'university', 'industry', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${validRoles.join(', ')}`,
      });
    }

    // Check if email is already taken
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Format departments if string
    let parsedDepartments = [];
    if (Array.isArray(departments)) {
      parsedDepartments = departments;
    } else if (typeof departments === 'string' && departments.trim()) {
      parsedDepartments = departments.split(',').map((d) => d.trim());
    } else if (role === 'university') {
      parsedDepartments = ['Engineering', 'Urban Research Lab'];
    }

    // Create user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      password,
      role,
      location: location || '',
      website: website || '',
      departments: parsedDepartments,
      sector: sector || '',
      headquarters: headquarters || '',
      status: 'Active',
      problemsReported: 0,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully.`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        website: user.website,
        departments: user.departments,
        sector: user.sector,
        headquarters: user.headquarters,
        status: user.status,
        problemsReported: user.problemsReported,
      },
    });
  } catch (error) {
    console.error('[AuthController.register] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user with password included
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Check account status
    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Account is currently inactive. Please contact administration.',
      });
    }

    // Verify role if specified in request
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Account found, but role is '${user.role}' instead of '${role}'. Please use the appropriate portal.`,
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        website: user.website,
        departments: user.departments,
        sector: user.sector,
        headquarters: user.headquarters,
        status: user.status,
        problemsReported: user.problemsReported,
      },
    });
  } catch (error) {
    console.error('[AuthController.login] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// @desc    Get currently logged in user profile (session restoration)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User session not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        website: user.website,
        departments: user.departments,
        sector: user.sector,
        headquarters: user.headquarters,
        status: user.status,
        problemsReported: user.problemsReported,
      },
    });
  } catch (error) {
    console.error('[AuthController.getMe] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving session.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
