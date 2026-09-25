import mongoose from 'mongoose';

const industryProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide the company/organization name'],
      trim: true,
    },
    industryType: {
      type: String,
      trim: true,
      default: 'Technology & Innovation',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    areasOfExpertise: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    services: {
      type: [String],
      default: [],
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    sponsoredProjectsCount: {
      type: Number,
      default: 0,
    },
    totalFundingProvided: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const IndustryProfile = mongoose.model('IndustryProfile', industryProfileSchema);
export default IndustryProfile;
