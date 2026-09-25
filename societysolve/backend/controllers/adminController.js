const User = require('../models/User');
const Problem = require('../models/Problem');

// @desc    Get aggregated platform metrics & chart statistics
// @route   GET /api/admin/statistics (or /api/admin/dashboard)
// @access  Private (Admin)
const getAdminStatistics = async (req, res) => {
  try {
    const [totalCitizens, totalUniversities, totalIndustries, problems] = await Promise.all([
      User.countDocuments({ role: 'citizen' }),
      User.countDocuments({ role: 'university' }),
      User.countDocuments({ role: 'industry' }),
      Problem.find().lean(),
    ]);

    const totalProblems = problems.length;
    const completedProblems = problems.filter((p) => p.status === 'Completed').length;
    const activeProblems = totalProblems - completedProblems;
    const totalCollaborations = problems.reduce((acc, p) => acc + (p.collaborators ? p.collaborators.length : 0), 0);

    // Category breakdown
    const categoryCounts = {};
    problems.forEach((p) => {
      const cat = p.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Stage breakdown
    const stageCounts = {
      'Submitted': 0,
      'Under Review': 0,
      'University Assigned': 0,
      'Solution Development': 0,
      'Industry Collaboration': 0,
      'Implementation': 0,
      'Completed': 0,
    };

    problems.forEach((p) => {
      if (stageCounts[p.status] !== undefined) {
        stageCounts[p.status]++;
      } else {
        stageCounts[p.status] = 1;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalCitizens,
        totalUniversities,
        totalIndustries,
        totalProblems,
        activeProblems,
        completedProblems,
        totalCollaborations,
        categoryCounts,
        stageCounts,
      },
    });
  } catch (error) {
    console.error('[AdminController.getAdminStatistics] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate admin statistics.',
    });
  }
};

// @desc    Get all users categorized by role
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const citizens = users.filter((u) => u.role === 'citizen');
    const universities = users.filter((u) => u.role === 'university');
    const industries = users.filter((u) => u.role === 'industry');
    const admins = users.filter((u) => u.role === 'admin');

    res.status(200).json({
      success: true,
      data: {
        all: users,
        citizens,
        universities,
        industries,
        admins,
      },
    });
  } catch (error) {
    console.error('[AdminController.getAllUsers] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user directory.',
    });
  }
};

// @desc    Get all problems master audit ledger
// @route   GET /api/admin/problems
// @access  Private (Admin)
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    console.error('[AdminController.getAllProblems] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch problem registry.',
    });
  }
};

// @desc    Toggle university / industry / user account status (Active / Inactive)
// @route   PATCH /api/admin/users/:userId/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    await user.save();

    res.status(200).json({
      success: true,
      message: `Account status for ${user.name} changed to '${user.status}'.`,
      data: user,
    });
  } catch (error) {
    console.error('[AdminController.toggleUserStatus] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update user status.',
    });
  }
};

// @desc    Admin audit verification of civic problem
// @route   PATCH /api/admin/problems/:problemId/verify
// @access  Private (Admin)
const verifyProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status = 'Under Review', note = 'Field inspection verified by municipal authority.' } = req.body;

    let query = { problemId };
    if (problemId.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ problemId }, { _id: problemId }] };
    }

    const problem = await Problem.findOne(query);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found.',
      });
    }

    problem.status = status;
    problem.milestones.push({
      stage: status,
      date: new Date().toLocaleString(),
      note: note,
      updatedBy: req.user._id,
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Problem ${problem.problemId} verification status set to '${status}'.`,
      data: problem,
    });
  } catch (error) {
    console.error('[AdminController.verifyProblem] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify problem.',
    });
  }
};

// @desc    Admin direct assignment of academic institution
// @route   PATCH /api/admin/problems/:problemId/assign
// @access  Private (Admin)
const adminAssignUniversity = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { universityName, leadProfessor } = req.body;

    if (!universityName) {
      return res.status(400).json({
        success: false,
        message: 'University name is required.',
      });
    }

    let query = { problemId };
    if (problemId.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ problemId }, { _id: problemId }] };
    }

    const problem = await Problem.findOne(query);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found.',
      });
    }

    problem.assignedUniversity = universityName;
    problem.leadProfessor = leadProfessor || 'Assigned Academic Directorate';
    problem.status = 'University Assigned';
    problem.milestones.push({
      stage: 'University Assigned',
      date: new Date().toLocaleString(),
      note: `Assigned to ${universityName} by Central Municipal Administration.`,
      updatedBy: req.user._id,
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Problem ${problem.problemId} assigned to ${universityName}.`,
      data: problem,
    });
  } catch (error) {
    console.error('[AdminController.adminAssignUniversity] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to assign university.',
    });
  }
};

module.exports = {
  getAdminStatistics,
  getAllUsers,
  getAllProblems,
  toggleUserStatus,
  verifyProblem,
  adminAssignUniversity,
};
