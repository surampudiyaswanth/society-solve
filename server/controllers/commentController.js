import Comment from '../models/Comment.js';
import Problem from '../models/Problem.js';

// @desc    Add a collaborative comment or milestone update to a problem
// @route   POST /api/problems/:id/comments
// @access  Private (All authenticated roles)
export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, commentType = 'General' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty.',
      });
    }

    const problem = await Problem.findOne({
      $or: [{ problemId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    const comment = await Comment.create({
      problem: problem._id,
      problemId: problem.problemId,
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      commentType,
      content,
    });

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding comment.',
    });
  }
};

// @desc    Get all collaborative comments for a problem
// @route   GET /api/problems/:id/comments
// @access  Public
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({
      $or: [{ problemId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    const comments = await Comment.find({ problem: problem._id })
      .populate('author', 'name role avatar')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving comments.',
    });
  }
};
