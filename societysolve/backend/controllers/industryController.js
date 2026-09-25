const Problem = require('../models/Problem');

// @desc    Get problems available for industrial partnership
// @route   GET /api/industry/problems
// @access  Private (Industry, Admin)
const getIndustryProblems = async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error) {
    console.error('[IndustryController.getIndustryProblems] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch industry problem registry.',
    });
  }
};

// @desc    Submit industrial partnership pledge (resources, tech, recommendations)
// @route   POST /api/industry/problems/:problemId/collaborate
// @access  Private (Industry, Admin)
const submitCollaboration = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { resources, techContribution, recommendations } = req.body;

    if (!resources || !techContribution) {
      return res.status(400).json({
        success: false,
        message: 'Please specify both pledged resources and technical contribution.',
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

    const companyName = req.user.name;

    const newCollab = {
      companyName,
      resources: resources.trim(),
      techContribution: techContribution.trim(),
      recommendations: recommendations ? recommendations.trim() : '',
      pledgedDate: new Date().toISOString().split('T')[0],
      industryUser: req.user._id,
    };

    problem.collaborators.push(newCollab);

    // If problem is in early or development stage, elevate to Industry Collaboration
    if (['Submitted', 'Under Review', 'University Assigned', 'Solution Development'].includes(problem.status)) {
      problem.status = 'Industry Collaboration';
    }

    problem.milestones.push({
      stage: 'Industry Collaboration',
      date: new Date().toLocaleString(),
      note: `${companyName} pledged ${resources} with technical focus: "${techContribution}".`,
      updatedBy: req.user._id,
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Industrial pledge committed successfully for ${problem.problemId}.`,
      data: problem,
    });
  } catch (error) {
    console.error('[IndustryController.submitCollaboration] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to record industrial collaboration pledge.',
    });
  }
};

// @desc    Update an existing industrial collaboration record
// @route   PATCH /api/industry/problems/:problemId/collaboration
// @access  Private (Industry, Admin)
const updateCollaboration = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { resources, techContribution, recommendations } = req.body;

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

    // Find collaboration by current industry user or company name
    const collabIndex = problem.collaborators.findIndex(
      (c) =>
        (c.industryUser && c.industryUser.toString() === req.user._id.toString()) ||
        c.companyName === req.user.name
    );

    if (collabIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'No active collaboration found for your organization on this problem.',
      });
    }

    if (resources) problem.collaborators[collabIndex].resources = resources.trim();
    if (techContribution)
      problem.collaborators[collabIndex].techContribution = techContribution.trim();
    if (recommendations !== undefined)
      problem.collaborators[collabIndex].recommendations = recommendations.trim();

    await problem.save();

    res.status(200).json({
      success: true,
      message: 'Collaboration details updated successfully.',
      data: problem,
    });
  } catch (error) {
    console.error('[IndustryController.updateCollaboration] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update collaboration details.',
    });
  }
};

module.exports = {
  getIndustryProblems,
  submitCollaboration,
  updateCollaboration,
};
