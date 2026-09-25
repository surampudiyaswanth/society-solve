const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      required: true,
      enum: [
        'Submitted',
        'Under Review',
        'University Assigned',
        'Solution Development',
        'Industry Collaboration',
        'Implementation',
        'Completed',
      ],
    },
    date: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = {
  Milestone,
  milestoneSchema,
};
