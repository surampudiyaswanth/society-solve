import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/genai';

export const matchStakeholdersForProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const stakeholders = await User.find({
      role: { $in: ['university', 'industry'] },
      isActive: true,
    }).select('name email role domain focusAreas location');

    if (!stakeholders.length) {
      return res.status(200).json({ success: true, matches: [], message: 'No stakeholders registered.' });
    }

    const prompt = `
You are an expert civic matching algorithm for the platform SocietySolve.
Evaluate this community issue and score the suitability of the candidate stakeholders.

Problem Details:
- Title: ${problem.title}
- Category: ${problem.category}
- Description: ${problem.description}
- Location: ${problem.location || 'Not specified'}

Available Stakeholders:
${JSON.stringify(stakeholders, null, 2)}

Instructions:
1. Compare each stakeholder's focus areas, domain, and location with the problem requirements.
2. Return ONLY a valid JSON array of objects representing matches with matchScore >= 60.
3. Use this exact JSON structure:
[
  {
    "stakeholderId": "<_id of stakeholder>",
    "matchScore": 85,
    "role": "<university or industry>",
    "reason": "<1-2 sentence concise explanation>"
  }
]
Do not wrap in markdown quotes or extra text. Output raw JSON only.
`;

    const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    let rawText = (response.text || '').trim();
    rawText = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    const matches = JSON.parse(rawText);

    return res.status(200).json({
      success: true,
      problemId,
      matches,
    });
  } catch (error) {
    console.error('Matching Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute AI matches.',
      error: error.message,
    });
  }
};