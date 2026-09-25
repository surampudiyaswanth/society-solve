import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema(
  {
    solutionTitle: {
      type: String,
      required: [true, 'Please provide a solution title'],
      trim: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    problemId: {
      type: String,
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UniversityProfile',
      required: true,
    },
    leadFaculty: {
      type: String,
      required: [true, 'Please specify the lead faculty coordinator'],
      trim: true,
    },
    studentTeam: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
      trim: true,
      default: 'Engineering & Research',
    },
    description: {
      type: String,
      required: [true, 'Please describe the proposed solution'],
      trim: true,
    },
    proposedTechnology: {
      type: String,
      required: [true, 'Please specify the proposed technology stack / hardware'],
      trim: true,
    },
    requiredResources: {
      type: String,
      trim: true,
      default: '',
    },
    estimatedCost: {
      type: Number,
      required: [true, 'Please provide an estimated budget'],
      default: 5000,
    },
    timeline: {
      type: String,
      required: [true, 'Please provide an estimated project timeline'],
      default: '6 months',
    },
    expectedImpact: {
      type: String,
      required: [true, 'Please describe the expected community impact'],
      trim: true,
    },
    documents: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    videoLink: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Proposed',
        'Under Review',
        'Industry Sponsored',
        'In Development',
        'Field Tested',
        'Deployed',
      ],
      default: 'Proposed',
    },
    collaboratingIndustries: [
      {
        industry: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'IndustryProfile',
        },
        contributionType: {
          type: String,
          enum: ['Funding', 'Mentorship', 'Technology', 'Implementation'],
          default: 'Funding',
        },
        amount: {
          type: Number,
          default: 0,
        },
        note: {
          type: String,
          default: '',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Solution = mongoose.model('Solution', solutionSchema);
export default Solution;
