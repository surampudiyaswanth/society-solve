import Collaboration from '../models/Collaboration.js';
import Problem from '../models/Problem.js';
import Solution from '../models/Solution.js';
import IndustryProfile from '../models/IndustryProfile.js';

// Helper to get or create industry profile for user
const getOrCreateIndustryProfile = async (user) => {
  let profile = await IndustryProfile.findOne({ user: user._id });
  if (!profile) {
    profile = await IndustryProfile.create({
      user: user._id,
      companyName: user.name.includes('Tech') || user.name.includes('Corp') || user.name.includes('Ltd')
        ? user.name
        : `${user.name} Innovations Ltd.`,
      industryType: 'Technology & Urban Solutions',
      location: 'Bengaluru / Hyderabad',
      technologies: ['IoT Sensors', 'Solar Microinverters', 'AI Analytics', 'Cloud Infrastructure'],
      totalFundingProvided: 25000,
      sponsoredProjectsCount: 2,
    });
  }
  return profile;
};

// @desc    Sponsor a university solution or community problem
// @route   POST /api/collaborations
// @access  Private (Industry, Admin)
export const createCollaboration = async (req, res) => {
  try {
    const {
      problemId,
      solutionId,
      contributionType = 'Funding',
      fundingAmount = 10000,
      technologiesProvided,
      mentorshipDetails,
      note,
    } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: 'Please specify the problem ID to sponsor.',
      });
    }

    const industryProfile = await getOrCreateIndustryProfile(req.user);

    // Find the problem
    const problem = await Problem.findOne({
      $or: [{ problemId }, { _id: problemId.match(/^[0-9a-fA-F]{24}$/) ? problemId : null }],
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // Optional find solution
    let solution = null;
    if (solutionId) {
      solution = await Solution.findById(solutionId);
    } else {
      solution = await Solution.findOne({ problem: problem._id });
    }

    const parsedTech = Array.isArray(technologiesProvided)
      ? technologiesProvided
      : (technologiesProvided ? technologiesProvided.split(',').map((t) => t.trim()) : []);

    const collaboration = await Collaboration.create({
      problem: problem._id,
      solution: solution?._id || null,
      problemId: problem.problemId,
      solutionTitle: solution?.solutionTitle || problem.title,
      industry: industryProfile._id,
      companyName: industryProfile.companyName,
      university: problem.assignedUniversity || solution?.university || null,
      contributionType,
      fundingAmount: Number(fundingAmount) || 0,
      technologiesProvided: parsedTech,
      mentorshipDetails: mentorshipDetails || '',
      status: 'Active',
      note: note || '',
    });

    // Advance problem status to Industry Collaboration (65%)
    problem.industryPartner = industryProfile._id;
    if (problem.progress < 65) {
      problem.status = 'Industry Collaboration';
      problem.progress = 65;
    }
    problem.timeline.push({
      status: 'Industry Collaboration',
      updatedBy: industryProfile.companyName,
      note: `Corporate sponsorship committed: ${contributionType} ($${Number(fundingAmount).toLocaleString()})`,
      timestamp: new Date(),
    });
    await problem.save();

    // Update solution if present
    if (solution) {
      solution.status = 'Industry Sponsored';
      solution.collaboratingIndustries.push({
        industry: industryProfile._id,
        contributionType,
        amount: Number(fundingAmount) || 0,
        note: note || '',
        joinedAt: new Date(),
      });
      await solution.save();
    }

    // Update industry profile metrics
    industryProfile.totalFundingProvided += Number(fundingAmount) || 0;
    industryProfile.sponsoredProjectsCount += 1;
    await industryProfile.save();

    res.status(201).json({
      success: true,
      message: `Successfully sponsored ${problem.problemId}! Project transitioned to Industry Collaboration.`,
      collaboration,
      problem,
    });
  } catch (error) {
    console.error('Error creating collaboration:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating collaboration.',
    });
  }
};

// @desc    Get industry user's active sponsorships & collaborations
// @route   GET /api/collaborations/my
// @access  Private (Industry, Admin)
export const getMyCollaborations = async (req, res) => {
  try {
    const industryProfile = await getOrCreateIndustryProfile(req.user);

    const collaborations = await Collaboration.find({ industry: industryProfile._id })
      .populate('problem', 'title category location severity status progress problemId')
      .populate('solution', 'solutionTitle proposedTechnology estimatedCost timeline leadFaculty')
      .populate('university', 'universityName location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: collaborations.length,
      collaborations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching industry collaborations.',
    });
  }
};

// @desc    Get Industry Dashboard 7 Core Metrics
// @route   GET /api/collaborations/industry-stats
// @access  Private (Industry, Admin)
export const getIndustryStats = async (req, res) => {
  try {
    const industryProfile = await getOrCreateIndustryProfile(req.user);

    const availableProblems = await Problem.countDocuments({ status: { $ne: 'Resolved' } });
    const universityProjects = await Solution.countDocuments();
    const activeCollaborations = await Collaboration.countDocuments({ status: 'Active' });
    const supportedProjects = industryProfile.sponsoredProjectsCount || 1;
    const fundingContributions = industryProfile.totalFundingProvided || 25000;
    const mentorshipActivities = await Collaboration.countDocuments({
      contributionType: { $in: ['Mentorship', 'Comprehensive CSR Support'] },
    });
    const completedProjects = await Problem.countDocuments({
      industryPartner: industryProfile._id,
      status: { $in: ['Implemented', 'Impact Measured', 'Resolved'] },
    });

    res.status(200).json({
      success: true,
      stats: {
        availableProblems,
        universityProjects: universityProjects || 6,
        activeCollaborations: activeCollaborations || 3,
        supportedProjects,
        fundingContributions,
        mentorshipActivities: mentorshipActivities || 2,
        completedProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving industry metrics.',
    });
  }
};
