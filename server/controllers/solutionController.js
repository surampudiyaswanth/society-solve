import Solution from '../models/Solution.js';
import Problem from '../models/Problem.js';
import UniversityProfile from '../models/UniversityProfile.js';

// Helper to get or create university profile for user
const getOrCreateUniversityProfile = async (user) => {
  let profile = await UniversityProfile.findOne({ user: user._id });
  if (!profile) {
    profile = await UniversityProfile.create({
      user: user._id,
      universityName: user.name.includes('University') || user.name.includes('Institute')
        ? user.name
        : `${user.name} Research Institute`,
      location: 'Bengaluru, Karnataka',
      departments: ['Engineering', 'Computer Science', 'Environmental Sciences'],
      facultyCount: 12,
    });
  }
  return profile;
};

// @desc    Propose a new solution blueprint for a problem
// @route   POST /api/solutions
// @access  Private (University, Admin)
export const createSolution = async (req, res) => {
  try {
    const {
      solutionTitle,
      problemId,
      leadFaculty,
      studentTeam,
      department,
      description,
      proposedTechnology,
      requiredResources,
      estimatedCost,
      timeline,
      expectedImpact,
      videoLink,
    } = req.body;

    if (!solutionTitle || !problemId || !leadFaculty || !description || !proposedTechnology) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (solutionTitle, problemId, leadFaculty, description, proposedTechnology).',
      });
    }

    const universityProfile = await getOrCreateUniversityProfile(req.user);

    // Find the problem by problemId or _id
    const problem = await Problem.findOne({
      $or: [{ problemId }, { _id: problemId.match(/^[0-9a-fA-F]{24}$/) ? problemId : null }],
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem '${problemId}' not found.`,
      });
    }

    // Process parsed studentTeam if string
    const parsedStudentTeam = Array.isArray(studentTeam)
      ? studentTeam
      : (studentTeam ? studentTeam.split(',').map((s) => s.trim()) : []);

    const solution = await Solution.create({
      solutionTitle,
      problem: problem._id,
      problemId: problem.problemId,
      university: universityProfile._id,
      leadFaculty,
      studentTeam: parsedStudentTeam,
      department: department || 'Applied Engineering & Innovation',
      description,
      proposedTechnology,
      requiredResources: requiredResources || '',
      estimatedCost: estimatedCost ? Number(estimatedCost) : 5000,
      timeline: timeline || '6 months',
      expectedImpact: expectedImpact || '',
      videoLink: videoLink || '',
      status: 'Proposed',
    });

    // Advance problem status to Solution Development (50%)
    problem.assignedUniversity = universityProfile._id;
    if (problem.progress < 50) {
      problem.status = 'Solution Development';
      problem.progress = 50;
      problem.timeline.push({
        status: 'Solution Development',
        updatedBy: leadFaculty,
        note: `Technical solution proposed: "${solutionTitle}"`,
        timestamp: new Date(),
      });
    }
    await problem.save();

    // Increment active projects in university profile
    universityProfile.activeProjectsCount += 1;
    await universityProfile.save();

    res.status(201).json({
      success: true,
      message: 'Solution blueprint submitted successfully!',
      solution,
      problem,
    });
  } catch (error) {
    console.error('Error creating solution:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting solution.',
    });
  }
};

// @desc    Claim an open societal problem and form research team
// @route   POST /api/solutions/claim/:id
// @access  Private (University, Admin)
export const claimProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { leadFaculty, studentTeam, researchArea, note } = req.body;

    const universityProfile = await getOrCreateUniversityProfile(req.user);

    const problem = await Problem.findOne({
      $or: [{ problemId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found.',
      });
    }

    problem.assignedUniversity = universityProfile._id;
    problem.status = 'University Assigned';
    problem.progress = Math.max(problem.progress, 40);

    const faculty = leadFaculty || req.user.name;
    const teamMembers = Array.isArray(studentTeam)
      ? studentTeam.join(', ')
      : studentTeam || 'Graduate student researchers';

    problem.timeline.push({
      status: 'University Assigned',
      updatedBy: faculty,
      note: note || `Claimed by ${universityProfile.universityName}. Lead: ${faculty}. Team: ${teamMembers}`,
      timestamp: new Date(),
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Successfully claimed challenge ${problem.problemId}! Assigned to ${universityProfile.universityName}`,
      problem,
    });
  } catch (error) {
    console.error('Error claiming problem:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while claiming problem.',
    });
  }
};

// @desc    Get all solutions
// @route   GET /api/solutions
// @access  Public
export const getSolutions = async (req, res) => {
  try {
    const { problemId, universityId } = req.query;
    const query = {};

    if (problemId) query.problemId = problemId;
    if (universityId) query.university = universityId;

    const solutions = await Solution.find(query)
      .populate('university', 'universityName location contactEmail departments')
      .populate('problem', 'title category location severity problemId')
      .populate('collaboratingIndustries.industry', 'companyName industryType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: solutions.length,
      solutions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching solutions.',
    });
  }
};

// @desc    Get university dashboard statistics (The 7 Metrics)
// @route   GET /api/solutions/university-stats
// @access  Private (University, Admin)
export const getUniversityStats = async (req, res) => {
  try {
    const totalProblems = await Problem.countDocuments();
    const newProblems = await Problem.countDocuments({ status: 'Submitted' });
    const problemsUnderReview = await Problem.countDocuments({ status: 'Under Review' });
    
    // Active projects: problems currently in academic development or testing
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

    // Completed solutions: Implemented or Resolved
    const completedSolutions = await Problem.countDocuments({
      status: { $in: ['Implemented', 'Impact Measured', 'Resolved'] },
    });

    // Industry collaborations: problems that have both university and industry partners
    const industryCollaborations = await Problem.countDocuments({
      assignedUniversity: { $ne: null },
      industryPartner: { $ne: null },
    });

    // Impact generated: total citizens affected by completed/piloted solutions
    const impactAgg = await Problem.aggregate([
      {
        $match: {
          status: { $in: ['Pilot Implementation', 'Implemented', 'Impact Measured', 'Resolved'] },
        },
      },
      {
        $group: {
          _id: null,
          totalImpact: { $sum: '$peopleAffected' },
        },
      },
    ]);

    const impactGenerated = impactAgg[0]?.totalImpact || 3800;

    res.status(200).json({
      success: true,
      stats: {
        totalProblems,
        newProblems,
        problemsUnderReview,
        activeProjects,
        completedSolutions,
        industryCollaborations,
        impactGenerated,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error computing university metrics.',
    });
  }
};
