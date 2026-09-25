import { generateSocietySolveReply } from '../services/chatbotServices.js';

const ROLE_GUIDANCE = {
  visitor: `
You are assisting a public visitor on SocietySolve.
Help explain how the platform works, how citizens, universities, industries,
and government collaborate to solve community problems across 10 resolution stages.
Encourage them to explore challenges or sign up.
`,

  citizen: `
You are assisting a Citizen.
Help with understanding problem categories, reporting community issues,
and explaining how to track the Citizen's own submissions.
Do not reveal another Citizen's private information.
`,

  university: `
You are assisting a University user.
Help explain university workflows, reviewing assigned problems,
developing solutions, and collaboration processes.
Do not reveal records unless the backend has explicitly authorized
and supplied that information.
`,

  industry: `
You are assisting an Industry user.
Help explain industry collaboration workflows and how to participate
in authorized solution development.
Do not reveal private university, citizen, or industry records.
`,

  admin: `
You are assisting an Admin user.
Explain administrative workflows and platform features.
Do not claim to perform administrative actions.
Do not reveal restricted data unless the backend has explicitly
authorized and supplied it.
`,

  government: `
You are assisting a Government user.
Explain government-related platform workflows and authorized access.
Do not assume that Government users have Admin permissions.
Do not reveal restricted data unless the backend has explicitly
authorized and supplied it.
`,
};

export const chatWithAI = async (req, res) => {
  try {
    // Fallback to 'visitor' if unauthenticated or role is missing
    const rawRole = String(req.user?.role || 'visitor').toLowerCase();
    const role = ROLE_GUIDANCE[rawRole] ? rawRole : 'visitor';

    const { message } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a message.',
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be 2000 characters or fewer.',
      });
    }

    const roleGuidance = ROLE_GUIDANCE[role];

    const prompt = `
You are the SocietySolve Assistant.

MANDATORY OUTPUT FORMAT:
- Every numbered step MUST begin on a new line preceded by an empty line.
- Never output consecutive numbers on the same line (e.g. do not write "1. ... 2. ...").
- Always format like this:
  1. First action point.

  2. Second action point.

  3. Third action point.
- Keep each point brief and direct.
- Do not output markdown headers (###) or dividers (---).

User Role Context: ${role}

Role Guidance:
${roleGuidance}

User Message:
${message.trim()}
`;

    const rawReply = await generateSocietySolveReply(prompt);

    // Backend sanitation: force linebreaks before any inline numbered points or bullets
    const reply = (rawReply || '')
      .replace(/([.!?])\s+(\d+\.\s+)/g, '$1\n\n$2')
      .replace(/([.!?])\s+([•*-]\s+)/g, '$1\n\n$2');

    return res.status(200).json({
      success: true,
      reply,
      data: {
        reply,
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'The chatbot could not process your message. Please try again.',
    });
  }
};