import mongoose from 'mongoose';

const universityProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    universityName: {
      type: String,
      required: [true, 'Please provide the institution name'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    departments: {
      type: [String],
      default: [],
    },
    areasOfExpertise: {
      type: [String],
      default: [],
    },
    facultyCount: {
      type: Number,
      default: 0,
    },
    studentTeams: {
      type: [String],
      default: [],
    },
    researchAreas: {
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
    activeProjectsCount: {
      type: Number,
      default: 0,
    },
    completedSolutionsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const UniversityProfile = mongoose.model('UniversityProfile', universityProfileSchema);
export default UniversityProfile;
