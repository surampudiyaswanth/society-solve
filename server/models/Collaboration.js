import mongoose from 'mongoose';

const collaborationSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    solution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Solution',
    },
    problemId: {
      type: String,
      required: true,
    },
    solutionTitle: {
      type: String,
      default: '',
    },
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IndustryProfile',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UniversityProfile',
    },
    contributionType: {
      type: String,
      enum: ['Funding', 'Mentorship', 'Technology', 'Comprehensive CSR Support'],
      default: 'Funding',
    },
    fundingAmount: {
      type: Number,
      default: 10000,
    },
    technologiesProvided: {
      type: [String],
      default: [],
    },
    mentorshipDetails: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Proposed', 'Active', 'Completed'],
      default: 'Active',
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Collaboration = mongoose.model('Collaboration', collaborationSchema);
export default Collaboration;
