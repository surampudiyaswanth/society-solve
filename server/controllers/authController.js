import User from '../models/User.js';
import CitizenProfile from '../models/CitizenProfile.js';
import UniversityProfile from '../models/UniversityProfile.js';
import IndustryProfile from '../models/IndustryProfile.js';
import generateToken from '../utils/generateToken.js';

// Helper to fetch user's attached role profile
const getRoleProfile = async (userId, role) => {
  if (role === 'citizen') {
    return await CitizenProfile.findOne({ user: userId });
  } else if (role === 'university') {
    return await UniversityProfile.findOne({ user: userId });
  } else if (role === 'industry') {
    return await IndustryProfile.findOne({ user: userId });
  }
  return null;
};

// @desc    Register a new user (Citizen, University, Industry, Government)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'citizen',
      phone,
      location,
      city,
      state,
      postalCode,
      // University specific
      universityName,
      departments,
      researchAreas,
      facultyCount,
      // Industry specific
      companyName,
      industryType,
      technologies,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists. Please log in instead.',
      });
    }

    // Create Base User
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone,
    });

    let profile = null;

    // Create role-specific profile
    if (role === 'citizen') {
      profile = await CitizenProfile.create({
        user: user._id,
        location: location || '',
        city: city || '',
        state: state || '',
        postalCode: postalCode || '',
      });
    } else if (role === 'university') {
      profile = await UniversityProfile.create({
        user: user._id,
        universityName: universityName || name,
        location: location || city || '',
        departments: Array.isArray(departments) ? departments : (departments ? departments.split(',').map(s => s.trim()) : []),
        researchAreas: Array.isArray(researchAreas) ? researchAreas : (researchAreas ? researchAreas.split(',').map(s => s.trim()) : []),
        facultyCount: facultyCount ? parseInt(facultyCount, 10) : 0,
        contactEmail: email,
        contactPhone: phone || '',
      });
    } else if (role === 'industry') {
      profile = await IndustryProfile.create({
        user: user._id,
        companyName: companyName || name,
        industryType: industryType || 'Technology',
        location: location || city || '',
        technologies: Array.isArray(technologies) ? technologies : (technologies ? technologies.split(',').map(s => s.trim()) : []),
        contactEmail: email,
        contactPhone: phone || '',
      });
    }

    // Generate Token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to SocietySolve.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      profile,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during registration.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Fetch role profile
    const profile = await getRoleProfile(user._id, user.role);

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      profile,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login.',
    });
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const profile = await getRoleProfile(user._id, user.role);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile.',
    });
  }
};

// @desc    Seed 5 instant demo accounts for quick testing
// @route   POST /api/auth/seed-demo
// @access  Public (Dev helper)
export const seedDemoAccounts = async (req, res) => {
  try {
    const demoAccounts = [
      {
        name: 'Aarav Sharma (Citizen)',
        email: 'citizen@societysolve.org',
        password: 'password123',
        role: 'citizen',
        phone: '+91 98765 43210',
        city: 'Bengaluru',
        state: 'Karnataka',
        location: 'Indiranagar 100ft Road',
      },
      {
        name: 'Prof. Radhika Rao (University Team)',
        email: 'university@societysolve.org',
        password: 'password123',
        role: 'university',
        phone: '+91 98123 45678',
        universityName: 'National Institute of Technology & Research',
        departments: ['Civil & Environmental Engineering', 'Computer Science', 'Public Health'],
        researchAreas: ['Smart Water Treatment', 'Urban Transport Optimization', 'Renewable Energy'],
        location: 'Bengaluru',
        facultyCount: 14,
      },
      {
        name: 'Apex Green Technologies (Industry Partner)',
        email: 'industry@societysolve.org',
        password: 'password123',
        role: 'industry',
        phone: '+91 98000 11223',
        companyName: 'Apex Green Technologies Ltd.',
        industryType: 'CleanTech & Urban Solutions',
        technologies: ['IoT Water Flow Sensors', 'Solar Grid Microinverters', 'AI Analytics'],
        location: 'Bengaluru / Hyderabad',
      },
      {
        name: 'Municipal Commissioner (Government Officer)',
        email: 'gov@societysolve.org',
        password: 'password123',
        role: 'government',
        phone: '+91 98450 11223',
      },
      {
        name: 'System Administrator (Admin)',
        email: 'admin@societysolve.org',
        password: 'password123',
        role: 'admin',
        phone: '+91 99999 00000',
      },
    ];

    for (const acc of demoAccounts) {
      let user = await User.findOne({ email: acc.email });
      if (!user) {
        user = await User.create({
          name: acc.name,
          email: acc.email,
          password: acc.password,
          role: acc.role,
          phone: acc.phone,
          isVerified: true,
        });

        if (acc.role === 'citizen') {
          await CitizenProfile.create({
            user: user._id,
            location: acc.location,
            city: acc.city,
            state: acc.state,
          });
        } else if (acc.role === 'university') {
          await UniversityProfile.create({
            user: user._id,
            universityName: acc.universityName,
            location: acc.location,
            departments: acc.departments,
            researchAreas: acc.researchAreas,
            facultyCount: acc.facultyCount,
            contactEmail: acc.email,
          });
        } else if (acc.role === 'industry') {
          await IndustryProfile.create({
            user: user._id,
            companyName: acc.companyName,
            industryType: acc.industryType,
            technologies: acc.technologies,
            location: acc.location,
            contactEmail: acc.email,
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Demo accounts seeded and verified successfully!',
      credentials: demoAccounts.map((a) => ({
        role: a.role,
        email: a.email,
        password: a.password,
      })),
    });
  } catch (error) {
    console.error('Seed demo error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error seeding demo accounts.',
    });
  }
};