// @desc    SocietySolve Civic AI Chatbot Controller
// Provides context-aware, database-integrated answers for Citizens, Universities, Industries, and Admins
// Supports Google Gemini Generative AI with full offline database-backed semantic engine fallback.

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Problem = require('../models/Problem');
const User = require('../models/User');

// Platform Knowledge Base Reference
const PLATFORM_INFO = {
  name: 'SocietySolve',
  tagline: 'Civic Problem Resolution & Quad-Helix Collaboration Platform',
  stages: [
    '1. Submitted (Ticket logged on MongoDB ledger)',
    '2. Under Review (Municipal field inspection & verification)',
    '3. University Assigned (Engineering department adopts problem as Capstone)',
    '4. Solution Development (Lab testing, CAD blueprints, and prototype modeling)',
    '5. Industry Collaboration (Corporate CSR funding, IoT sensors, hardware manufacturing)',
    '6. Implementation (On-site deployment and civic testing)',
    '7. Completed (Permanent municipal handover & community signoff)'
  ],
  categories: [
    'Education (Blue)', 'Healthcare (Emerald)', 'Roads & Transportation (Amber)',
    'Water (Cyan)', 'Waste Management (Purple)', 'Environment (Teal)',
    'Agriculture (Lime)', 'Public Safety (Red)', 'Employment (Pink)', 'Other (Slate)'
  ],
  demoAccounts: {
    citizen: 'ananya@citizen.org / Password@123',
    university: 'director@nit.edu / Password@123',
    industry: 'csr@apexdynamics.com / Password@123',
    admin: 'admin@societysolve.org / Admin@12345'
  },
  fileLimits: 'Photos: JPG, PNG, WebP (up to 10MB). Documents: PDF, DOC, DOCX (up to 10MB).'
};

/**
 * Fetch live database snapshot for LLM grounding and offline responses
 */
const getDatabaseContext = async (queryText = '', specificTicketId = null) => {
  try {
    const totalProblems = await Problem.countDocuments();
    const completedProblems = await Problem.countDocuments({ status: 'Completed' });
    const activeProblems = totalProblems - completedProblems;

    const totalCitizens = await User.countDocuments({ role: 'citizen' });
    const totalUniversities = await User.countDocuments({ role: 'university' });
    const totalIndustries = await User.countDocuments({ role: 'industry' });

    let specificProblem = null;
    if (specificTicketId) {
      specificProblem = await Problem.findOne({ problemId: specificTicketId.toUpperCase() });
    }

    // Keyword problem search (top 3 relevant problems)
    let matchedProblems = [];
    if (queryText) {
      const cleanKeywords = queryText.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
      if (cleanKeywords.length > 0) {
        const regexes = cleanKeywords.map(k => new RegExp(k, 'i'));
        matchedProblems = await Problem.find({
          $or: [
            { title: { $in: regexes } },
            { category: { $in: regexes } },
            { location: { $in: regexes } }
          ]
        }).limit(3).select('problemId title category status priority location assignedUniversity');
      }
    }

    return {
      stats: {
        totalProblems,
        activeProblems,
        completedProblems,
        totalCitizens,
        totalUniversities,
        totalIndustries
      },
      specificProblem,
      matchedProblems
    };
  } catch (err) {
    console.error('[ChatController] DB context fetch error:', err.message);
    return { stats: null, specificProblem: null, matchedProblems: [] };
  }
};

/**
 * Gemini LLM Response Generator
 */
const generateGeminiResponse = async (apiKey, message, role, context, dbContext) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try preferred fast models with fallback
  const modelNames = [
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
    'gemini-flash-latest',
    'gemini-3.6-flash',
    'gemini-1.5-flash'
  ];
  let lastError = null;

  const systemInstruction = `You are SolveBot, the official intelligent AI Assistant embedded in the SocietySolve Platform.
You have two core capabilities:
1. General Intelligence: You can answer ANY general knowledge questions (science, history, philosophy, coding, math, languages, jokes, advice) intelligently, accurately, and politely.
2. SocietySolve Civic Expertise: You are the master guide for the SocietySolve Platform.

SocietySolve Platform Overview:
SocietySolve is a 4-way civic problem resolution platform connecting:
1. Citizens: Report local problems (potholes, water leaks, waste) with photo/document evidence and GPS.
2. Universities: Engineering research departments adopt open community challenges as capstone projects.
3. Industry Partners: Corporates co-sponsor capstones through CSR funding, IoT hardware, and manufacturing.
4. Municipal Admins: Verify institutional credentials and govern the civic problem ledger.

Platform 7 Lifecycle Stages:
${PLATFORM_INFO.stages.join('\n')}

10 Civic Problem Domains:
${PLATFORM_INFO.categories.join(', ')}

Demo Credentials:
• Citizen: ${PLATFORM_INFO.demoAccounts.citizen}
• University: ${PLATFORM_INFO.demoAccounts.university}
• Industry: ${PLATFORM_INFO.demoAccounts.industry}
• Admin: ${PLATFORM_INFO.demoAccounts.admin}

Live Platform Database Facts (Ground Truth):
• Total Problems Registered: ${dbContext.stats ? dbContext.stats.totalProblems : 4}
• Active / In-Progress Problems: ${dbContext.stats ? dbContext.stats.activeProblems : 3}
• Completed / Commissioned: ${dbContext.stats ? dbContext.stats.completedProblems : 1}
• Total Verified Citizens: ${dbContext.stats ? dbContext.stats.totalCitizens : 2}
• Total Academic Institutions: ${dbContext.stats ? dbContext.stats.totalUniversities : 2}
• Total Corporate Partners: ${dbContext.stats ? dbContext.stats.totalIndustries : 2}
${dbContext.specificProblem ? `\nFocused Ticket Details:\n` + JSON.stringify(dbContext.specificProblem, null, 2) : ''}
${dbContext.matchedProblems.length > 0 ? `\nMatching Database Tickets:\n` + JSON.stringify(dbContext.matchedProblems, null, 2) : ''}

Current User Context:
• User Role: ${role || 'guest / citizen'}
• User Name: ${context.userName || 'Anonymous User'}
• Current Screen / View: ${context.currentView || 'dashboard'}
• Focused Ticket: ${context.activeTicket || 'None'}

Instructions for your responses:
- Be direct, professional, encouraging, and accurate.
- If the user asks about a ticket ID, cite the exact live details from the database.
- Use markdown formatting with bullet points and bold text for readability.
- Guide users step-by-step according to their role.
- Keep responses concise (under 250 words) unless detailed walkthrough is requested.`;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 600,
        }
      });

      const prompt = `User (${role}) asks: "${message}"`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      console.warn(`[ChatController] Gemini model ${modelName} failed:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models failed to generate response.');
};

/**
 * Intelligent Offline Semantic Intent & DB Grounding Engine
 */
const generateOfflineResponse = async (message, role, context, dbContext) => {
  const query = message.toLowerCase().trim();

  // Helper for token match count
  const hasWord = (...words) => words.some(w => query.includes(w));
  const scoreWords = (...words) => words.reduce((acc, w) => acc + (query.includes(w) ? 1 : 0), 0);

  // 1. Direct Ticket Lookup (e.g. SS-10245 or numeric 10245)
  if (dbContext.specificProblem) {
    const p = dbContext.specificProblem;
    const latestMilestone = p.milestones && p.milestones.length > 0
      ? p.milestones[p.milestones.length - 1]
      : null;

    return `🔍 **Live Database Record: Ticket ${p.problemId}**\n\n` +
      `• **Title**: ${p.title}\n` +
      `• **Category**: ${p.category.toUpperCase()}\n` +
      `• **Current Stage**: **${p.status}**\n` +
      `• **Priority**: ${p.priority} | **Ward/Location**: ${p.location}\n` +
      `• **Lead Academic Institution**: ${p.assignedUniversity || 'Pending Academic Feasibility Review'}\n` +
      `• **Industry Collaborators**: ${p.collaborators ? p.collaborators.length : 0} partner(s) pledged\n` +
      (latestMilestone ? `• **Latest Milestone**: *"${latestMilestone.note}"* (${latestMilestone.date})\n\n` : '\n') +
      `💡 *Tip: Click "My Submitted Issues" in the navigation to view the live 7-stage pulse stepper and full audit log!*`;
  }

  // 2. Greetings & Introductions
  if (query.match(/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste|yo|hola)\b/i) || query === 'hi' || query === 'hello') {
    const roleGreetings = {
      citizen: `Hello! 👋 I am **SolveBot**, your civic assistant. I can help you report an issue, track your tickets through the 7 lifecycle stages, or answer any questions about community improvements.`,
      university: `Welcome, Professor! 🎓 I am **SolveBot**. I can help you find open capstone challenges, accept community problems as tech lead, or guide you on stage advancement.`,
      industry: `Hello! 💼 I am **SolveBot**. I can help your team explore academic capstones needing co-sponsorship, pledge CSR funds/hardware, and review telemetry specs.`,
      admin: `Greetings Administrator! 🛡️ I can help clarify governance metrics, audit verification, and civic problem ledger oversight.`
    };
    return (roleGreetings[role] || roleGreetings.citizen) + `\n\nWhat would you like to do today?`;
  }

  // 2b. Conversational Small Talk (How are you, thanks, jokes, etc.)
  if (hasWord('how are you', 'how r u', 'how do you do', "what's up", 'whats up', 'how is it going')) {
    return `I'm doing great, thank you for asking! 😊 I'm always ready to help you navigate SocietySolve, file issues, track community challenges, or look up live civic tickets. How are you doing today?`;
  }

  if (hasWord('thank you', 'thanks', 'thx', 'appreciate it', 'thank u', 'good job')) {
    return `You're very welcome! 🙌 I'm glad I could help. If you have any other questions about civic issues, ticket tracking, or platform features, feel free to ask anytime!`;
  }

  if (hasWord('bye', 'goodbye', 'see you', 'cya', 'exit', 'quit')) {
    return `Goodbye! 👋 Thanks for visiting **SocietySolve** and contributing to a better community. Reach out whenever you need assistance!`;
  }

  if (hasWord('joke', 'funny', 'make me laugh', 'tell a joke')) {
    const jokes = [
      `Why did the pothole go to engineering university? 🎓\n...To get a little more grounded! 😄 On SocietySolve, universities adopt real road problems to build permanent asphalt and sensor solutions!`,
      `Why do programmers prefer dark mode? 💻\n...Because light attracts bugs! Fortunately, SolveBot's civic ledger keeps things bug-free!`,
      `What did the municipal water pipe say to the telemetry sensor? 💧\n..."Thanks for keeping the pressure off me!"`
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  if (hasWord('what is ai', 'artificial intelligence', 'define ai')) {
    return `🤖 **What is Artificial Intelligence (AI)?**\n\n` +
      `Artificial Intelligence refers to computer systems capable of performing tasks that typically require human reasoning—such as natural language processing, visual recognition, and multi-variable optimization.\n\n` +
      `In **SocietySolve**, AI is used to classify community complaints into the 10 civic domains, match engineering universities with capstone projects, and power this conversational assistant!`;
  }

  // 2c. Direct answer: Why can't it answer general questions / How to enable Gemini
  if (hasWord('general question', 'general knowledge', 'why cant you answer', "why can't you answer", 'why it cant answer', 'other questions', 'enable gemini', 'enable ai', 'google gemini', 'api key')) {
    return `🤖 **Why SolveBot focuses on civic and platform questions right now:**\n\n` +
      `Currently, I am operating in **Local Civic Mode** without an active LLM cloud connection. My built-in offline engine is specialized specifically for:\n` +
      `• Live SocietySolve tickets, milestones, and database lookups\n` +
      `• Step-by-step problem reporting (potholes, water leaks, power outages)\n` +
      `• University capstone adoptions & Industry CSR co-sponsorships\n\n` +
      `✨ **How to enable general question answering (100% Free):**\n` +
      `1. Visit [Google AI Studio](https://aistudio.google.com/) and click **Get API key** (no credit card needed).\n` +
      `2. Open \`backend/.env\` and add: \`GEMINI_API_KEY=AIzaSy...\`\n` +
      `3. Restart the server!\n\n` +
      `Once connected, I will use Google's cutting-edge Gemini LLM to answer **ANY general question** in the world (science, history, coding, creative writing, translations, etc.)! 🚀`;
  }

  // 2d. Basic Math Calculator
  const mathMatch = query.match(/(?:what is|calculate|evaluate|solve)?\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/x])\s*(\d+(?:\.\d+)?)/i);
  if (mathMatch && mathMatch[1] && mathMatch[2] && mathMatch[3]) {
    const num1 = parseFloat(mathMatch[1]);
    const op = mathMatch[2].toLowerCase();
    const num2 = parseFloat(mathMatch[3]);
    let result;
    if (op === '+') result = num1 + num2;
    else if (op === '-') result = num1 - num2;
    else if (op === '*' || op === 'x') result = num1 * num2;
    else if (op === '/') result = num2 !== 0 ? num1 / num2 : 'undefined (division by zero)';
    
    return `🧮 **Calculation Result:**\n\n\`${num1} ${op} ${num2} = ${result}\``;
  }

  // 3. Who are you / Capabilities
  if (hasWord('who are you', 'what are you', 'your name', 'what can you do', 'how can you help', 'capabilities')) {
    return `I am **SolveBot**, the intelligent AI assistant for the **SocietySolve Civic-Tech Platform**! 🤖\n\n` +
      `Here is what I can do for you:\n` +
      `• **Ticket Lookups**: Enter any ID like \`SS-10245\` to retrieve live progress and milestones.\n` +
      `• **Problem Reporting**: Step-by-step guidance on selecting categories, taking photos, and filing complaints.\n` +
      `• **7-Stage Lifecycle**: Explain how an issue moves from citizen report to municipal completion.\n` +
      `• **Platform Statistics**: Query live counts of problems, institutions, and solved cases.\n` +
      `• **Role Guidance**: Specialized advice for Citizens, Universities, Industries, and Municipal Admins.`;
  }

  // 4. Live Database Statistics & Counts
  if (hasWord('how many problem', 'total problem', 'total issue', 'how many issues', 'platform stats', 'statistics', 'how many solved', 'how many active', 'how many citizen', 'how many university', 'how many industry')) {
    const s = dbContext.stats;
    if (s) {
      return `📊 **Live SocietySolve Platform Ledger Statistics:**\n\n` +
        `• **Total Problems Registered**: **${s.totalProblems}**\n` +
        `• **Active / In Progress**: **${s.activeProblems}** issues\n` +
        `• **Successfully Completed**: **${s.completedProblems}** projects\n` +
        `• **Registered Citizens**: **${s.totalCitizens}**\n` +
        `• **Partner Universities**: **${s.totalUniversities}**\n` +
        `• **Industry Sponsors**: **${s.totalIndustries}**\n\n` +
        `💡 *All metrics are synchronized in real-time with the MongoDB civic ledger.*`;
    }
  }

  // 5. What is SocietySolve / Mission / Overview
  if (hasWord('what is societysolve', 'about societysolve', 'what does this app do', 'how does this work', 'how does it work', 'platform purpose', 'mission', 'concept', 'about this platform')) {
    return `🌐 **About SocietySolve:**\n\n` +
      `**SocietySolve** bridges grassroots community complaints with engineering and corporate resources through a **Quad-Helix Model**:\n\n` +
      `1. **Citizens**: File geo-tagged civic problems with photo/document proof.\n` +
      `2. **Universities**: Engineering faculties and students adopt problems as capstone research projects.\n` +
      `3. **Industries**: Corporate partners co-sponsor with CSR funds, IoT sensors, and hardware fabrication.\n` +
      `4. **Municipal Administration**: Verify project audits and authorize final on-site commissioning.\n\n` +
      `Instead of lingering as passive complaints, civic problems are systematically engineered into permanent solutions!`;
  }

  // 6. How to Report / Add / Create a Problem
  const reportScore = scoreWords('report', 'submit', 'create', 'add', 'file', 'lodge', 'post', 'raise', 'new issue', 'problem', 'pothole', 'leak');
  if (reportScore >= 2 || hasWord('how to report', 'how to submit', 'how to add an issue', 'report a problem', 'submit issue', 'file complaint')) {
    return `📝 **How to Report a Civic Problem:**\n\n` +
      `1. **Log in as Citizen** (or use demo \`ananya@citizen.org\` / \`Password@123\`).\n` +
      `2. Click **"Select Problem Domain"** on the home screen.\n` +
      `3. Click on the corresponding sector on the **interactive 10-sector Donut Chart** (e.g. Roads, Water, Healthcare).\n` +
      `4. Fill in the problem **Title**, **Description**, **Ward / GPS Location**, and **Priority** (Low / Medium / High / Critical).\n` +
      `5. (Optional) Drag and drop **Photo Evidence** (JPG/PNG up to 10MB) or a **Document** (PDF/DOC up to 10MB).\n` +
      `6. Click **"Submit Problem to Network"**.\n\n` +
      `✅ You will immediately receive a unique tracking ticket (like \`SS-10245\`)!`;
  }

  // 7. 7 Lifecycle Stages Explanation
  if (hasWord('stage', 'stages', '7 stage', 'lifecycle', 'phases', 'pipeline', 'workflow', 'steps')) {
    return `🔄 **The 7 Problem Lifecycle Stages:**\n\n` +
      `1. **Submitted**: Issue registered and timestamped on the MongoDB ledger.\n` +
      `2. **Under Review**: Field inspection team verifies location and severity.\n` +
      `3. **University Assigned**: Engineering university capstone team adopts the problem as tech lead.\n` +
      `4. **Solution Development**: CAD blueprints, lab prototypes, and sensor calibration.\n` +
      `5. **Industry Collaboration**: Corporate partners provide CSR funding, IoT components, and fabrication.\n` +
      `6. **Implementation**: System deployed on-site with municipal oversight.\n` +
      `7. **Completed**: Final audit passed, project handed over for permanent public operation!`;
  }

  // 8. Can I edit / modify / delete a problem
  if (hasWord('edit', 'delete', 'cancel', 'remove', 'modify') && hasWord('problem', 'issue', 'ticket', 'submission', 'post')) {
    return `ℹ️ **Civic Ledger Immutability Policy:**\n\n` +
      `Once an issue is submitted to the **SocietySolve Ledger**, it cannot be deleted to preserve municipal audit transparency.\n` +
      `• Field inspectors and Academic Tech Leads append clarifications and status updates via **Milestone Entries**.\n` +
      `• If you need to make a correction, contact the municipal administrator at \`admin@societysolve.org\` with your ticket ID.`;
  }

  // 9. How to Track My Issues / Status
  if (hasWord('track', 'where is my', 'check status', 'tracking', 'view status', 'my submitted issues') || 
     (hasWord('my ticket', 'my issue', 'my problem') && !hasWord('edit', 'delete', 'change', 'modify', 'report', 'create', 'add'))) {
    return `📍 **How to Track Your Civic Issue:**\n\n` +
      `• Click the **"My Issues"** or **"My Submitted Issues"** button in the top navigation bar.\n` +
      `• You will see your tickets with an interactive **7-stage pulse stepper** displaying exact live progress.\n` +
      `• View the chronological **Milestone Audit Log** on the left.\n` +
      `• Inspect assigned **Academic Lead** and **Industry Sponsors** on the right.\n` +
      `• You can also type any ticket ID (e.g. \`SS-10245\`) right here in this chat to see its current status!`;
  }

  // 9. Login, Authentication & Demo Credentials
  if (hasWord('login', 'sign in', 'log in', 'password', 'credentials', 'account', 'demo', 'register', 'how to login', 'test account')) {
    return `🔐 **Portal Access & Demo Credentials:**\n\n` +
      `• **Citizen Portal**: \`ananya@citizen.org\` / \`Password@123\`\n` +
      `• **University Portal**: \`director@nit.edu\` / \`Password@123\`\n` +
      `• **Industry Console**: \`csr@apexdynamics.com\` / \`Password@123\`\n` +
      `• **Municipal Admin**: \`admin@societysolve.org\` / \`Admin@12345\`\n\n` +
      `💡 *You can also click "Register" on any portal card to create your own custom account!*`;
  }

  // 10. University Capstone Workflow
  if (hasWord('university', 'capstone', 'tech lead', 'professor', 'faculty', 'student', 'research', 'adopt', 'advance stage')) {
    return `🎓 **University Collaboration Workflow:**\n\n` +
      `1. Log in with University credentials (e.g. \`director@nit.edu\`).\n` +
      `2. Go to the **University Dashboard** and inspect the **Problem Directory**.\n` +
      `3. Click **"Accept as Tech Lead"** on any open issue to claim the capstone project.\n` +
      `4. Assign student researchers and faculty advisors.\n` +
      `5. Once prototypes or blueprints are ready, click **"Advance Stage"** to push the ticket into *Solution Development* or *Industry Collaboration* while appending technical audit notes!`;
  }

  // 11. Industry Sponsorship & CSR Workflow
  if (hasWord('industry', 'sponsor', 'csr', 'pledge', 'corporate', 'donate', 'hardware', 'sensor', 'fund', 'co-sponsorship')) {
    return `💼 **Industry Co-Sponsorship Workflow:**\n\n` +
      `1. Log in with Industry credentials (e.g. \`csr@apexdynamics.com\`).\n` +
      `2. Browse the **Open Academic Initiatives** list.\n` +
      `3. Click **"Join Collaboration"** on a project requiring resources.\n` +
      `4. Specify:\n` +
      `   • **Pledged Budget / Hardware** (e.g. \`$15,000 in IoT sensors\` or \`CNC fabrication\`).\n` +
      `   • **Engineering Support** (e.g. PCB review, manufacturing guidance).\n` +
      `5. Your sponsorship is logged in the public immutable milestone trail!`;
  }

  // 12. Municipal Admin Governance
  if (hasWord('admin', 'governance', 'audit', 'metrics', 'clearance', 'verify institution', 'toggle status')) {
    return `🛡️ **Municipal Admin Governance Features:**\n\n` +
      `• **Live Metrics Aggregator**: Monitor active vs completed problems and registered institutions.\n` +
      `• **Analytics Visualizations**: Category breakdown donut and stage distribution bar charts.\n` +
      `• **Institution Verification**: Verify or toggle active/inactive status for academic and corporate partners.\n` +
      `• **Master Ledger Oversight**: Inspect every ticket's milestone logs, evidence documents, and sponsor pledges.`;
  }

  // 13. File Uploads & Guidelines
  if (hasWord('upload', 'file', 'photo', 'picture', 'image', 'document', 'pdf', 'size limit', 'evidence', 'format')) {
    return `📁 **Upload Guidelines & Limits:**\n\n` +
      `• **Photo Evidence**: Supported formats: \`JPG\`, \`JPEG\`, \`PNG\`, \`WebP\` (max **10 MB** per file).\n` +
      `• **Document Reports**: Supported formats: \`PDF\`, \`DOC\`, \`DOCX\` (max **10 MB** per file).\n` +
      `• **Storage & Security**: Uploaded assets are securely saved with timestamped hashes and served over protected paths.`;
  }

  // 14. 10 Problem Categories
  if (hasWord('category', 'categories', 'domain', 'sectors', 'donut', 'what problems')) {
    return `🎨 **10 Problem Categories on SocietySolve:**\n\n` +
      `1. **Education** (Blue): School infrastructure, smart labs, digital classrooms.\n` +
      `2. **Healthcare** (Emerald): Primary health centers, vaccine cold-chains, diagnostic gear.\n` +
      `3. **Roads & Transportation** (Amber): Potholes, street signals, flyovers, pedestrian safety.\n` +
      `4. **Water** (Cyan): Pipeline leaks, contamination, drinking water supply.\n` +
      `5. **Waste Management** (Purple): Garbage overflow, bio-waste, recycling plants.\n` +
      `6. **Environment** (Teal): Air quality monitors, urban tree canopy, lake restoration.\n` +
      `7. **Agriculture** (Lime): Irrigation channels, soil testing kits, rural micro-cold storage.\n` +
      `8. **Public Safety** (Red): Streetlights, surveillance blind spots, disaster drainage.\n` +
      `9. **Employment** (Pink): Skill training centers, vocational tooling.\n` +
      `10. **Other** (Slate): General community municipal infrastructure.`;
  }

  // 15. Context-Aware Screen Guidance
  if (context.currentView && hasWord('where am i', 'what is this page', 'how to use this page', 'what to do next', 'help on this page', 'this screen', 'this page', 'what can i do', 'what should i do', 'current view', 'current screen', 'here')) {
    const viewGuides = {
      'view-landing': 'You are on the **Main Landing View**. Select one of the 4 stakeholder cards (Citizen, University, Industry, Admin) to explore or log in.',
      'view-category-select': 'You are on the **Category Selection** view. Click any sector slice on the interactive Donut chart to select your problem domain and proceed to the submission form.',
      'view-problem-form': 'You are on the **Problem Submission Form**. Enter a descriptive title, location/ward, priority, and optional photos/documents, then click Submit.',
      'view-citizen-issues': 'You are on the **My Submitted Issues** view. Select an issue from the list to see its live 7-stage pulse stepper and milestones.',
      'view-university': 'You are on the **University Portal**. Review open community problems and click "Accept as Tech Lead" to adopt one for your research team.',
      'view-industry': 'You are on the **Industry Console**. Browse academic capstone projects and pledge CSR sponsorship or IoT sensors.',
      'view-admin': 'You are on the **Admin Governance Console**. Review aggregate platform metrics and verify partner institutions.'
    };
    if (viewGuides[context.currentView]) {
      return `📌 **Screen Guidance (${context.currentView}):**\n\n${viewGuides[context.currentView]}`;
    }
  }


  // 17. Keyword-based matching from Database (e.g. user asks about "water", "roads", "hospital", "solar")
  if (dbContext.matchedProblems && dbContext.matchedProblems.length > 0) {
    const list = dbContext.matchedProblems.map(p => 
      `• **[${p.problemId}] ${p.title}**\n  - Category: *${p.category}* | Stage: **${p.status}** | Priority: *${p.priority}*\n  - Location: *${p.location}*`
    ).join('\n\n');

    return `🔍 **Found ${dbContext.matchedProblems.length} Relevant Ticket(s) in Database:**\n\n${list}\n\n` +
      `💡 *You can type any ticket ID like \`${dbContext.matchedProblems[0].problemId}\` to see its full milestone trail!*`;
  }

  // 18. Intelligent Contextual Fallback
  return `I am currently operating in **Local Civic Mode**, which is specialized specifically in **SocietySolve** community problems, live ticket tracking, and platform workflows.\n\n` +
    `💡 **To unlock general question answering (100% Free):**\n` +
    `You can connect me to **Google Gemini AI**! Get a free key at [Google AI Studio](https://aistudio.google.com/) and paste it as \`GEMINI_API_KEY=\` in \`backend/.env\`.\n\n` +
    `📌 **What you can ask me right now:**\n` +
    `• **Live Tickets**: *"Status of SS-10245"* or *"Show ticket SS-10246"*\n` +
    `• **Report an Issue**: *"How do I report a pothole or water leak?"*\n` +
    `• **Platform Statistics**: *"How many problems are registered?"*\n` +
    `• **Lifecycle Stages**: *"Explain the 7 lifecycle stages"*\n` +
    `• **Stakeholder Portals**: *"How does university adopt a capstone?"*\n` +
    `• **Small Talk & Math**: *"How are you?"*, *"Tell me a joke"*, *"What is 25 * 4?"*`;
};

/**
 * Main Controller Handler
 * Orchestrates Gemini AI -> Grounded DB Engine -> Semantic Offline Fallback
 */
const handleChatMessage = async (req, res) => {
  try {
    const { message, role = 'citizen', context = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.',
      });
    }

    const cleanMessage = message.trim();

    // Check for explicit ticket ID pattern (e.g. SS-10245, ss-10245, or 5-digit number like 10245)
    let ticketId = null;
    const ticketMatch = cleanMessage.match(/SS-\d{4,6}/i);
    if (ticketMatch) {
      ticketId = ticketMatch[0].toUpperCase();
    } else if (context.activeTicket && cleanMessage.match(/(this|current|status|stage|progress|ticket|update)/i)) {
      ticketId = context.activeTicket.toUpperCase();
    }

    // 1. Fetch live database facts for real grounding
    const dbContext = await getDatabaseContext(cleanMessage, ticketId);

    let reply = '';
    let engineSource = 'offline-semantic';

    // 2. Try Gemini Generative AI if key is configured
    const geminiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
    if (geminiKey && geminiKey.length > 10) {
      try {
        reply = await generateGeminiResponse(geminiKey, cleanMessage, role, context, dbContext);
        engineSource = 'gemini-ai';
      } catch (geminiError) {
        console.warn('[ChatController] Gemini invocation failed, falling back to local engine:', geminiError.message);
      }
    }

    // 3. Fallback to intelligent database-backed offline engine if no reply yet
    if (!reply) {
      reply = await generateOfflineResponse(cleanMessage, role, context, dbContext);
    }

    res.status(200).json({
      success: true,
      data: {
        reply,
        engine: engineSource,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    });
  } catch (error) {
    console.error('[ChatController] Unhandled Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate assistant response.',
    });
  }
};

module.exports = {
  handleChatMessage,
};
