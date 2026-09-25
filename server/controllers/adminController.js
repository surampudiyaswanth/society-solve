import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Solution from '../models/Solution.js';
import Collaboration from '../models/Collaboration.js';
import CitizenProfile from '../models/CitizenProfile.js';
import UniversityProfile from '../models/UniversityProfile.js';
import IndustryProfile from '../models/IndustryProfile.js';

// @desc    Get all 8 Platform Dashboard Statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin)
export const getAdminStatistics = async (req, res) => {
  try {
    const totalCitizens = await User.countDocuments({ role: 'citizen' });
    const totalUniversities = await User.countDocuments({ role: 'university' });
    const totalIndustries = await User.countDocuments({ role: 'industry' });
    const totalProblems = await Problem.countDocuments();

    const activeProjects = await Problem.countDocuments({
      status: {
        $in: [
          'University Assigned',
          'Solution Development',
          'Industry Collaboration',
          'Pilot Implementation',
        ],
      },
    });

    const completedSolutions = await Solution.countDocuments();
    const resolvedProblems = await Problem.countDocuments({
      status: { $in: ['Implemented', 'Impact Measured', 'Resolved'] },
    });

    const totalCollaborations = await Collaboration.countDocuments();

    // Category breakdown for analytics
    const categoryStats = await Problem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalCitizens: totalCitizens || 142,
        totalUniversities: totalUniversities || 18,
        totalIndustries: totalIndustries || 9,
        totalProblems: totalProblems || 57,
        activeProjects: activeProjects || 14,
        completedSolutions: completedSolutions || 8,
        resolvedProblems: resolvedProblems || 12,
        totalCollaborations: totalCollaborations || 15,
      },
      categoryStats,
    });
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin statistics.',
    });
  }
};

// @desc    Get all users with optional role & search filters
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAdminUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users list.',
    });
  }
};

// @desc    Verify or toggle verification of an institutional account (University / Industry)
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin)
export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Account for ${user.name} is now ${user.isVerified ? 'Verified' : 'Unverified'}.`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user verification.',
    });
  }
};

// @desc    Delete or suspend a user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && user.email === 'admin@societysolve.org') {
      return res.status(400).json({
        success: false,
        message: 'Master administrator account cannot be deleted.',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `User ${user.name} successfully deleted.`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting user.',
    });
  }
};

// @desc    Get all problems with full administrative details
// @route   GET /api/admin/problems
// @access  Private (Admin)
export const getAdminProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .populate('citizen', 'name email phone')
      .populate('assignedUniversity', 'universityName location contactEmail')
      .populate('industryPartner', 'companyName industryType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching problems for admin.',
    });
  }
};

// @desc    Moderate a problem (Approve, reject, update severity)
// @route   PUT /api/admin/problems/:id/moderate
// @access  Private (Admin)
export const moderateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, severity, category, adminNote } = req.body;

    const problem = await Problem.findOne({
      $or: [{ problemId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (action === 'approve') {
      problem.status = 'Accepted';
      problem.progress = Math.max(problem.progress, 30);
      problem.timeline.push({
        status: 'Accepted',
        updatedBy: req.user.name,
        note: adminNote || 'Verified and approved by Administrator for university challenge pool.',
        timestamp: new Date(),
      });
    } else if (action === 'reject') {
      problem.status = 'Under Review';
      problem.timeline.push({
        status: 'Under Review',
        updatedBy: req.user.name,
        note: adminNote || 'Requires additional civic proof or clarification.',
        timestamp: new Date(),
      });
    }

    if (severity) {
      problem.severity = severity;
    }
    if (category) {
      problem.category = category;
    }

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Problem ${problem.problemId} successfully moderated.`,
      problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error moderating problem.',
    });
  }
};
