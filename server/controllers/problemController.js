import Problem from '../models/Problem.js';
import CitizenProfile from '../models/CitizenProfile.js';
import { generateProblemId } from '../utils/problemIdGenerator.js';

// @desc    Submit a new societal problem
// @route   POST /api/problems
// @access  Private (Citizen, Admin)
export const createProblem = async (req, res) => {
  try {
    const {
      title,
      category,
      problemType,
      problem_type,
      description,
      location,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      severity,
      peopleAffected,
      dateObserved,
      videoUrl,
      additionalComments,
    } = req.body;

    const resolvedProblemType = problemType || problem_type || title || 'General Community Need';

    if (!title || !category || !resolvedProblemType || !description || !location || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, category, problem type, description, location, city, state).',
      });
    }

    let images = [];
    let documents = [];

    if (req.files) {
      if (req.files.images) {
        images = req.files.images.map((file) => `/uploads/${file.filename}`);
      }
      if (req.files.documents) {
        documents = req.files.documents.map((file) => `/uploads/${file.filename}`);
      }
    }

    const problemId = await generateProblemId();

    // Parse coordinates if provided
    const parsedLat = latitude !== undefined && latitude !== '' ? Number(latitude) : null;
    const parsedLng = longitude !== undefined && longitude !== '' ? Number(longitude) : null;

    const problemData = {
      problemId,
      citizen: req.user._id,
      title: title.trim(),
      category,
      problemType: resolvedProblemType.trim(),
      description: description.trim(),
      location: location.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode || '',
      severity: severity || 'Medium',
      peopleAffected: peopleAffected ? Number(peopleAffected) : 10,
      dateObserved: dateObserved ? new Date(dateObserved) : new Date(),
      images,
      documents,
      videoUrl: videoUrl || '',
      additionalComments: additionalComments || '',
      status: 'Submitted',
      progress: 10,
      timeline: [
        {
          status: 'Submitted',
          updatedBy: `${req.user?.name || 'Citizen'} (CITIZEN)`,
          note: 'Problem reported and logged into municipal queue.',
          timestamp: new Date(),
        },
      ],
    };

    if (parsedLat !== null && parsedLng !== null && !isNaN(parsedLat) && !isNaN(parsedLng)) {
      problemData.coordinates = {
        latitude: parsedLat,
        longitude: parsedLng,
      };
      problemData.geoPoint = {
        type: 'Point',
        coordinates: [parsedLng, parsedLat], // [longitude, latitude]
      };
    }

    const problem = await Problem.create(problemData);

    await CitizenProfile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { reportedCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: `Problem submitted successfully! Assigned Problem ID: ${problem.problemId}`,
      problemId: problem.problemId,
      problem,
    });
  } catch (error) {
    console.error('Error submitting problem:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting problem.',
    });
  }
};

// @desc    Get all problems with optional filters & optional geospatial search
// @route   GET /api/problems
// @access  Public
export const getProblems = async (req, res) => {
  try {
    const { category, severity, status, city, search, lat, lng, radiusKm } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (severity && severity !== 'All') {
      query.severity = severity;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (city) {
      query.city = { $regex: city,$options: 'i' };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search,$options: 'i' } },
        { description: { $regex: search,$options: 'i' } },
        { problemType: { $regex: search,$options: 'i' } },
        { problemId: { $regex: search,$options: 'i' } },
      ];
    }

    // Optional Geospatial Radius Filter
    if (lat && lng) {
      const maxDistanceMeters = (Number(radiusKm) || 25) * 1000;
      query.geoPoint = {
        $near: {
          $geometry: {             type: 'Point',             coordinates: [Number(lng), Number(lat)],           },$maxDistance: maxDistanceMeters,
        },
      };
    }

    const problems = await Problem.find(query)
      .populate('citizen', 'name email phone avatar')
      .populate('assignedUniversity', 'universityName location contactEmail')
      .populate('industryPartner', 'companyName industryType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching problems.',
    });
  }
};

// @desc    Get problems submitted by the logged-in citizen
// @route   GET /api/problems/my
// @access  Private (Citizen)
export const getMyProblems = async (req, res) => {
  try {
    const problems = await Problem.find({ citizen: req.user._id })
      .populate('assignedUniversity', 'universityName location')
      .populate('industryPartner', 'companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user problems.',
    });
  }
};

// @desc    Get a single problem by ID or Problem ID (SS-2026-XXXXXX)
// @route   GET /api/problems/:id
// @access  Public
export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    let problem;
    if (id && id.startsWith('SS-')) {
      problem = await Problem.findOne({ problemId: id });
    } else {
      problem = await Problem.findById(id);
    }

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with ID '${id}' not found.`,
      });
    }

    await problem.populate('citizen', 'name email phone');
    await problem.populate('assignedUniversity', 'universityName location departments contactEmail');
    await problem.populate('industryPartner', 'companyName industryType technologies contactEmail');

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving problem details.',
    });
  }
};

// @desc    Update problem workflow status & progress across 10-stage lifecycle
// @route   PUT /api/problems/:id/status
// @access  Private (Strict Role Enforcement - No Admin Overrides on Steps 8, 9, 10)
export const updateProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, impactMetrics, surveyResponse } = req.body;
    const userRole = req.user?.role;

    const progressMap = {
      Submitted: 10,
      'Under Review': 20,
      Accepted: 30,
      'University Assigned': 40,
      'Solution Development': 50,
      'Industry Collaboration': 65,
      'Pilot Implementation': 75,
      Implemented: 85,
      'Impact Measured': 95,
      Resolved: 100,
    };

    // Safe document lookup (supports custom problemId string and MongoDB ObjectId)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const problem = await Problem.findOne(
      isObjectId ? { $or: [{ _id: id }, { problemId: id }] } : { problemId: id }
    );

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    // --- Strict 10-Stage Lifecycle Validation & Admin Exclusion ---

    // Steps #2 & #3: Accepted (30%) - Government review
    if (status === 'Accepted') {
      if (!['government', 'admin'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Only Government department heads or platform admins can verify and accept problems.',
        });
      }
      if (!['Submitted', 'Under Review'].includes(problem.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid Transition: Problem must be 'Submitted' or 'Under Review' before being 'Accepted' (Current: ${problem.status}).`,
        });
      }
    }

    // Steps #4 & #5: Solution Development (50%) - University R&D
    if (status === 'Solution Development') {
      if (!['university', 'admin'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Only University research teams can claim challenges and propose solution blueprints.',
        });
      }
      if (!['Accepted', 'University Assigned'].includes(problem.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid Transition: Problem must be 'Accepted' before transitioning to 'Solution Development' (Current: ${problem.status}).`,
        });
      }
      if (req.user?.universityId) {
        problem.assignedUniversity = req.user.universityId;
      }
    }

    // Steps #6 & #7: Pilot Implementation (75%) - Industry sponsorship
    if (status === 'Pilot Implementation') {
      if (!['industry', 'admin'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Only Industry partners can sponsor prototypes and trigger pilot deployment.',
        });
      }
      if (!['Solution Development', 'Industry Collaboration'].includes(problem.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid Transition: Problem must be in 'Solution Development' before 'Pilot Implementation' (Current: ${problem.status}).`,
        });
      }
      if (req.user?.companyId) {
        problem.industryPartner = req.user.companyId;
      }
    }

    // Step #8: Implemented (85%) - Ground verification
    if (status === 'Implemented') {
      if (userRole === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Admin access is revoked for Step #8. Only on-ground Citizens or Municipal Authorities can confirm implementation.',
        });
      }
      if (!['citizen', 'government'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Step #8 (Implemented) can only be verified by Citizens or Government authorities.',
        });
      }
      if (problem.status !== 'Pilot Implementation') {
        return res.status(400).json({
          success: false,
          message: `Invalid Transition: Problem must be in 'Pilot Implementation' before verifying implementation (Current: ${problem.status}).`,
        });
      }
    }

    // Step #9: Impact Measured (95%) - Citizen community audit
    if (status === 'Impact Measured') {
      if (userRole === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Admin access is revoked for Step #9. Only affected Citizens can submit impact feedback.',
        });
      }
      if (userRole !== 'citizen') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Only affected Citizens can record observed reduction metrics and community surveys.',
        });
      }
      if (problem.status !== 'Implemented') {
        return res.status(400).json({
          success: false,
          message: `Invalid Transition: Problem must be 'Implemented' before measuring community impact (Current: ${problem.status}).`,
        });
      }
      if (impactMetrics) problem.impactMetrics = impactMetrics;
      if (surveyResponse) problem.surveyResponse = surveyResponse;
    }

    // Step #10: Resolved (100%) - Municipal official closure
    if (status === 'Resolved') {
      if (userRole === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Admin access is revoked for Step #10. Only Government/Municipal authorities can officially resolve and close challenges.',
        });
      }
      if (userRole !== 'government') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Only Government Authorities can officially close and resolve challenges.',
        });
      }
      if (problem.status !== 'Impact Measured') {
        return res.status(400).json({
          success: false,
          message: `Invalid Transition: Problem must have 'Impact Measured' before final closure as Resolved (Current: ${problem.status}).`,
        });
      }
      problem.resolvedAt = new Date();
    }

    // Apply updates
    problem.status = status;
    problem.progress = progressMap[status] !== undefined ? progressMap[status] : problem.progress;

    if (!problem.timeline) {
      problem.timeline = [];
    }

    problem.timeline.push({
      status,
      updatedBy: `${req.user?.name || 'Authorized User'} (${userRole?.toUpperCase() || 'USER'})`,
      note: note || `Status advanced to ${status} (${problem.progress}%)`,
      timestamp: new Date(),
    });

    await problem.save();

    res.status(200).json({
      success: true,
      message: `Challenge status successfully updated to '${status}' (${problem.progress}%).`,
      problem,
    });
  } catch (error) {
    console.error('Error updating problem status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed sample challenges across different categories and stages
// @route   POST /api/problems/seed-demo
// @access  Public (Dev Helper)
export const seedDemoProblems = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const UniversityProfile = (await import('../models/UniversityProfile.js')).default;
    const IndustryProfile = (await import('../models/IndustryProfile.js')).default;

    let citizen = await User.findOne({ role: 'citizen' });
    if (!citizen) {
      citizen = await User.create({
        name: 'Aarav Sharma',
        email: 'citizen@societysolve.org',
        password: 'password123',
        role: 'citizen',
        phone: '+91 98765 43210',
      });
    }

    const uniProfile = await UniversityProfile.findOne();
    const indProfile = await IndustryProfile.findOne();

    const sampleProblems = [
      {
        problemId: 'SS-2026-000001',
        citizen: citizen._id,
        title: 'Severe Groundwater Contamination & Fluoride Excess in Ward 8',
        category: 'Water & Sanitation',
        problemType: 'Water contamination',
        description: 'Local borewells exhibit heavy fluoride and dissolved solids exceeding safe WHO thresholds.',
        location: 'Indiranagar 8th Cross',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        coordinates: {
          latitude: 12.9716,
          longitude: 77.5946,
        },
        geoPoint: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
        },
        severity: 'Critical',
        peopleAffected: 420,
        status: 'Pilot Implementation',
        progress: 75,
        assignedUniversity: uniProfile?._id || null,
        industryPartner: indProfile?._id || null,
        timeline: [
          { status: 'Submitted', updatedBy: 'Aarav Sharma (CITIZEN)', note: 'Problem reported.', timestamp: new Date(Date.now() - 86400000 * 5) },
          { status: 'Accepted', updatedBy: 'Municipal Authority (GOVERNMENT)', note: 'Verified by water supply board.', timestamp: new Date(Date.now() - 86400000 * 4) },
          { status: 'Solution Development', updatedBy: 'NIT R&D Lab (UNIVERSITY)', note: 'Graphene filtration prototype designed.', timestamp: new Date(Date.now() - 86400000 * 3) },
          { status: 'Pilot Implementation', updatedBy: 'Apex Green Tech (INDUSTRY)', note: 'Sponsored IoT pilot units installed.', timestamp: new Date(Date.now() - 86400000 * 1) },
        ],
      },
    ];

    for (const prob of sampleProblems) {
      await Problem.findOneAndUpdate(
        { problemId: prob.problemId },
        { $set: prob },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Demo challenges seeded successfully!',
      count: sampleProblems.length,
    });
  } catch (error) {
    console.error('Error seeding demo problems:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};