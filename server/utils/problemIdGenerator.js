import Problem from '../models/Problem.js';

export const generateProblemId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `SS-${currentYear}-`;

  let nextSequence = Math.floor(100000 + Math.random() * 900000);

  try {
    // Only query DB if mongoose is connected (readyState === 1)
    if (Problem.db && Problem.db.readyState === 1) {
      const lastProblem = await Problem.findOne({
        problemId: { $regex: `^${prefix}` },
      })
        .sort({ createdAt: -1 })
        .select('problemId')
        .maxTimeMS(1500);

      if (lastProblem && lastProblem.problemId) {
        const parts = lastProblem.problemId.split('-');
        if (parts.length === 3) {
          const lastSeqNum = parseInt(parts[2], 10);
          if (!isNaN(lastSeqNum)) {
            nextSequence = lastSeqNum + 1;
          }
        }
      } else {
        nextSequence = 1;
      }
    }
  } catch (err) {
    // Fallback to random sequence
  }

  // Format as SS-2026-000123
  const paddedSequence = String(nextSequence).padStart(6, '0');
  return `${prefix}${paddedSequence}`;
};
