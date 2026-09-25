const mongoose = require('mongoose');
const { milestoneSchema } = require('./Milestone');
const { collaborationSchema } = require('./Collaboration');

const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    contacts: {
      type: String,
      default: 'Not specified',
      trim: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submittedByName: {
      type: String,
      default: '',
    },
    submittedByEmail: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'University Assigned',
        'Solution Development',
        'Industry Collaboration',
        'Implementation',
        'Completed',
      ],
      default: 'Submitted',
    },
    assignedUniversity: {
      type: String,
      default: null,
    },
    leadProfessor: {
      type: String,
      default: null,
    },
    collaborators: {
      type: [collaborationSchema],
      default: [],
    },
    milestones: {
      type: [milestoneSchema],
      default: [],
    },
    imageEvidence: {
      type: String,
      default: null,
    },
    documentEvidence: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property 'id' to map to 'problemId' for seamless frontend compatibility
problemSchema.virtual('id').get(function () {
  return this.problemId || this._id.toString();
});

// Virtual 'submittedByFormatted' to match existing UI string format "Name (email)"
problemSchema.virtual('submittedByText').get(function () {
  if (this.submittedByName && this.submittedByEmail) {
    return `${this.submittedByName} (${this.submittedByEmail})`;
  }
  return this.submittedByName || 'Citizen Reporter';
});

// Auto-generate unique SS-XXXXX Problem ID before validation if not set
problemSchema.pre('validate', async function (next) {
  if (!this.problemId) {
    let unique = false;
    let generatedId = '';
    while (!unique) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      generatedId = `SS-${randomNum}`;
      const existing = await mongoose.models.Problem.findOne({ problemId: generatedId });
      if (!existing) {
        unique = true;
      }
    }
    this.problemId = generatedId;
  }
  next();
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
