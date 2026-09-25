const Problem = require('../models/Problem');

// @desc    Get problems relevant to university (unassigned + assigned to this university)
// @route   GET /api/university/problems
// @access  Private (University, Admin)
const getUniversityProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    console.error('[UniversityController.getUniversityProblems] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch university problem directory.',
    });
  }
};

// @desc    Get single problem detail for academic review
// @route   GET /api/university/problems/:problemId
// @access  Private (University, Admin)
const getUniversityProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;

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

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error('[UniversityController.getUniversityProblemById] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch academic problem details.',
    });
  }
};

// @desc    Adopt problem as primary technical and engineering lead
// @route   PATCH /api/university/problems/:problemId/assign
// @access  Private (University, Admin)
const assignUniversityToProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { leadProfessor } = req.body;

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

    const institutionName = req.user.name;
    const professor = leadProfessor || 'Faculty Research Committee / Capstone Team';

    problem.assignedUniversity = institutionName;
    problem.leadProfessor = professor;
    problem.status = 'University Assigned';
    problem.milestones.push({
      stage: 'University Assigned',
      date: new Date().toLocaleString(),
      note: `Adopted by ${institutionName} as primary technical & engineering lead. Lead: ${professor}`,
      updatedBy: req.user._id,
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Challenge ${problem.problemId} successfully adopted by ${institutionName}.`,
      data: problem,
    });
  } catch (error) {
    console.error('[UniversityController.assignUniversityToProblem] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to adopt academic challenge.',
    });
  }
};

// @desc    Advance project lifecycle stage from university workspace
// @route   PATCH /api/university/problems/:problemId/status
// @access  Private (University, Admin)
const advanceStage = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { status, note } = req.body;

    const allowedNextStages = [
      'Solution Development',
      'Industry Collaboration',
      'Implementation',
      'Completed',
    ];

    if (!status || !allowedNextStages.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid advance stage. Allowed stages: ${allowedNextStages.join(', ')}`,
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
        message: 'Problem ticket not found.',
      });
    }

    problem.status = status;
    problem.milestones.push({
      stage: status,
      date: new Date().toLocaleString(),
      note: note || `Progressed to ${status} under academic oversight of ${req.user.name}.`,
      updatedBy: req.user._id,
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Challenge ${problem.problemId} transitioned to stage '${status}'.`,
      data: problem,
    });
  } catch (error) {
    console.error('[UniversityController.advanceStage] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to transition stage.',
    });
  }
};

module.exports = {
  getUniversityProblems,
  getUniversityProblemById,
  assignUniversityToProblem,
  advanceStage,
};
