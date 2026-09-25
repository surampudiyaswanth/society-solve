import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    problemId: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorRole: {
      type: String,
      enum: ['citizen', 'university', 'industry', 'admin'],
      required: true,
    },
    commentType: {
      type: String,
      enum: [
        'General',
        'Project Update',
        'Funding Offer',
        'Mentorship Advice',
        'Milestone Report',
      ],
      default: 'General',
    },
    content: {
      type: String,
      required: [true, 'Please provide comment text'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
