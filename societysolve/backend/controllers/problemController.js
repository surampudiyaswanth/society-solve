const Problem = require('../models/Problem');
const User = require('../models/User');

const CATEGORIES_DATA = [
  {
    id: 'education',
    name: 'Education',
    color: '#3B82F6',
    icon: 'book-open',
    placeholder: 'e.g. Broken lab computers or lack of STEM equipment at Municipal High School',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    color: '#10B981',
    icon: 'heart-pulse',
    placeholder: 'e.g. Primary Health Centre vaccine cold-chain outage or shortage of diagnostic kits',
  },
  {
    id: 'roads',
    name: 'Roads & Transportation',
    color: '#F59E0B',
    icon: 'bus',
    placeholder: 'e.g. Major cratered potholes near Market Flyover causing heavy transit congestion',
  },
  {
    id: 'water',
    name: 'Water',
    color: '#06B6D4',
    icon: 'droplet',
    placeholder: 'e.g. Contaminated drinking supply or burst distribution pipeline in Ward 14',
  },
  {
    id: 'waste',
    name: 'Waste Management',
    color: '#8B5CF6',
    icon: 'trash-2',
    placeholder: 'e.g. Unsegregated dump site near lake bed requiring biological treatment',
  },
  {
    id: 'environment',
    name: 'Environment',
    color: '#14B8A6',
    icon: 'trees',
    placeholder: 'e.g. Illegal industrial particulate emissions during nighttime along residential buffer',
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    color: '#84CC16',
    icon: 'sprout',
    placeholder: 'e.g. High pest resistance in local onion crop demanding IoT micro-monitoring',
  },
  {
    id: 'safety',
    name: 'Public Safety',
    color: '#EF4444',
    icon: 'shield-alert',
    placeholder: 'e.g. Dark unlit pedestrian underpasses near industrial corridor',
  },
  {
    id: 'employment',
    name: 'Employment',
    color: '#EC4899',
    icon: 'briefcase',
    placeholder: 'e.g. Lack of technical skill certification centers for local vocational youth',
  },
  {
    id: 'other',
    name: 'Other',
    color: '#64748B',
    icon: 'help-circle',
    placeholder: 'e.g. Community civic space revitalization or drainage telemetry requirement',
  },
];

// @desc    Get all 10 civic problem categories
// @route   GET /api/problems/categories
// @access  Public
const getCategories = async (req, res) => {
  res.status(200).json({
    success: true,
    data: CATEGORIES_DATA,
  });
};

// @desc    Submit a new civic problem
// @route   POST /api/problems
// @access  Private (Citizen)
const createProblem = async (req, res) => {
  try {
    const { category, title, description, location, priority = 'Medium', contacts } = req.body;

    if (!category || !title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, title, description, and location.',
      });
    }

    // Extract file evidence URLs if uploaded
    let imageEvidence = null;
    let documentEvidence = null;

    if (req.files) {
      if (req.files.imageEvidence && req.files.imageEvidence[0]) {
        imageEvidence = `/uploads/${req.files.imageEvidence[0].filename}`;
      } else if (req.files.photo && req.files.photo[0]) {
        imageEvidence = `/uploads/${req.files.photo[0].filename}`;
      }

      if (req.files.documentEvidence && req.files.documentEvidence[0]) {
        documentEvidence = `/uploads/${req.files.documentEvidence[0].filename}`;
      } else if (req.files.document && req.files.document[0]) {
        documentEvidence = `/uploads/${req.files.document[0].filename}`;
      }
    }

    const citizenUser = req.user;

    const initialMilestone = {
      stage: 'Submitted',
      date: new Date().toLocaleString(),
      note: 'Verified grassroots ticket generated on SocietySolve ledger.',
      updatedBy: citizenUser._id,
    };

    const problem = new Problem({
      category: category.toLowerCase().trim(),
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      priority: priority || 'Medium',
      contacts: contacts ? contacts.trim() : 'Not specified',
      submittedBy: citizenUser._id,
      submittedByName: citizenUser.name,
      submittedByEmail: citizenUser.email,
      submittedAt: new Date().toLocaleString(),
      status: 'Submitted',
      milestones: [initialMilestone],
      collaborators: [],
      imageEvidence,
      documentEvidence,
    });

    await problem.save();

    // Increment user problems count
    await User.findByIdAndUpdate(citizenUser._id, { $inc: { problemsReported: 1 } });

    res.status(201).json({
      success: true,
      message: 'Problem submitted successfully.',
      data: problem,
    });
  } catch (error) {
    console.error('[ProblemController.createProblem] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating problem ticket.',
    });
  }
};

// @desc    Get all problems submitted by logged in citizen
// @route   GET /api/problems/my
// @access  Private (Citizen)
const getMyProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    console.error('[ProblemController.getMyProblems] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user problems.',
    });
  }
};

// @desc    Get single problem by problemId or _id
// @route   GET /api/problems/:problemId
// @access  Private (Citizen can view own; University, Industry, Admin can view all)
const getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Search by custom problemId (SS-XXXXX) or standard Mongo ObjectId
    let query = { problemId: problemId };
    if (problemId.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ problemId }, { _id: problemId }] };
    }

    const problem = await Problem.findOne(query);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with ID '${problemId}' not found.`,
      });
    }

    // Role verification: citizen can only view their own unless admin/univ/industry
    if (
      req.user &&
      req.user.role === 'citizen' &&
      problem.submittedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access restricted: Citizens can only inspect their own submitted issues.',
      });
    }

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error('[ProblemController.getProblemById] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch problem details.',
    });
  }
};

// @desc    Update problem status and record milestone
// @route   PATCH /api/problems/:problemId/status
// @access  Private (University, Admin)
const updateProblemStatus = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status, note } = req.body;

    const validStages = [
      'Submitted',
      'Under Review',
      'University Assigned',
      'Solution Development',
      'Industry Collaboration',
      'Implementation',
      'Completed',
    ];

    if (!status || !validStages.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid stage status. Must be one of: ${validStages.join(', ')}`,
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
        message: `Problem ticket '${problemId}' was not found.`,
      });
    }

    problem.status = status;
    problem.milestones.push({
      stage: status,
      date: new Date().toLocaleString(),
      note: note || `Status updated to ${status} by ${req.user.name} (${req.user.role}).`,
      updatedBy: req.user._id,
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Status updated to '${status}'.`,
      data: problem,
    });
  } catch (error) {
    console.error('[ProblemController.updateProblemStatus] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update problem status.',
    });
  }
};

module.exports = {
  getCategories,
  createProblem,
  getMyProblems,
  getProblemById,
  updateProblemStatus,
  CATEGORIES_DATA,
};
