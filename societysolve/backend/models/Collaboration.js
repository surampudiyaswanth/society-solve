const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    resources: {
      type: String,
      required: [true, 'Pledged resources description is required'],
      trim: true,
    },
    techContribution: {
      type: String,
      required: [true, 'Technical contribution description is required'],
      trim: true,
    },
    recommendations: {
      type: String,
      default: '',
      trim: true,
    },
    pledgedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    industryUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Collaboration = mongoose.model('Collaboration', collaborationSchema);

module.exports = {
  Collaboration,
  collaborationSchema,
};
