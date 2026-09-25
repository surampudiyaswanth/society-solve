export const SOCIETAL_CATEGORIES = [
  {
    id: 'education',
    name: 'Education',
    color: '#3b82f6', // blue-500
    hoverColor: '#2563eb',
    gradient: 'from-blue-500 to-indigo-600',
    border: 'border-blue-500/40',
    activeBg: 'bg-blue-950/50',
    tagColor: 'text-blue-400',
    description: 'Empowering communities through accessible, modern, and equitable education.',
    exampleProblems: [
      {
        title: 'Lack of digital classrooms',
        desc: 'Schools lacking computers, projectors, and reliable internet connectivity for students.',
      },
      {
        title: 'School infrastructure',
        desc: 'Dilapidated classrooms, insufficient seating, inadequate roofs, or boundary walls.',
      },
      {
        title: 'Lack of learning resources',
        desc: 'Scarcity of textbooks, library materials, science kits, and educational supplies.',
      },
      {
        title: 'Dropout issues',
        desc: 'High student discontinuation rates due to socio-economic hurdles or transport constraints.',
      },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    color: '#f43f5e', // rose-500
    hoverColor: '#e11d48',
    gradient: 'from-rose-500 to-red-600',
    border: 'border-rose-500/40',
    activeBg: 'bg-rose-950/50',
    tagColor: 'text-rose-400',
    description: 'Vital health services, primary clinic access, and disease prevention support.',
    exampleProblems: [
      {
        title: 'Lack of nearby healthcare',
        desc: 'Absence of primary health centers within accessible travel radius for rural citizens.',
      },
      {
        title: 'Emergency response',
        desc: 'Long ambulance dispatch delays and poor critical care transit systems.',
      },
      {
        title: 'Medicine availability',
        desc: 'Stockouts of essential prescription drugs, diagnostics, and vaccines at local clinics.',
      },
      {
        title: 'Health awareness',
        desc: 'Low community knowledge regarding sanitation, nutrition, maternal care, and epidemics.',
      },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    color: '#10b981', // emerald-500
    hoverColor: '#059669',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/40',
    activeBg: 'bg-emerald-950/50',
    tagColor: 'text-emerald-400',
    description: 'Ecological preservation, waste management, and renewable sustainability.',
    exampleProblems: [
      {
        title: 'Waste management',
        desc: 'Illegal open dumping, inadequate garbage collection routes, and lack of segregation.',
      },
      {
        title: 'Water pollution',
        desc: 'Untreated industrial runoff or domestic sewage entering community lakes and rivers.',
      },
      {
        title: 'Air pollution',
        desc: 'Heavy particulate matter, factory emissions, or crop burning affecting respiratory health.',
      },
      {
        title: 'Plastic waste',
        desc: 'Severe accumulation of single-use plastics choking stormwater drains and public parks.',
      },
    ],
  },
  {
    id: 'transportation',
    name: 'Transportation',
    color: '#f59e0b', // amber-500
    hoverColor: '#d97706',
    gradient: 'from-amber-500 to-orange-600',
    border: 'border-amber-500/40',
    activeBg: 'bg-amber-950/50',
    tagColor: 'text-amber-400',
    description: 'Safe mobility, transit connectivity, and resilient municipal roads.',
    exampleProblems: [
      {
        title: 'Poor roads',
        desc: 'Deep potholes, unpaved neighborhood streets, and hazardous monsoon road cave-ins.',
      },
      {
        title: 'Traffic congestion',
        desc: 'Severe bottlenecks and lack of synchronized signaling causing long daily delays.',
      },
      {
        title: 'Public transport',
        desc: 'Infrequent buses, missing route links, and inaccessible transit stops for commuters.',
      },
      {
        title: 'Street lighting',
        desc: 'Non-functional or missing streetlights creating dangerous dark road corridors at night.',
      },
    ],
  },
  {
    id: 'public_safety',
    name: 'Public Safety',
    color: '#8b5cf6', // violet-500
    hoverColor: '#7c3aed',
    gradient: 'from-violet-500 to-indigo-600',
    border: 'border-violet-500/40',
    activeBg: 'bg-violet-950/50',
    tagColor: 'text-violet-400',
    description: 'Protecting citizens, safe streets, crime deterrents, and rapid emergency aid.',
    exampleProblems: [
      {
        title: 'Unsafe public areas',
        desc: 'Isolated, unpatrolled parks, underpasses, and alleys prone to anti-social activity.',
      },
      {
        title: 'Lack of CCTV',
        desc: 'Absence of surveillance monitoring at key community crossroads and transit hubs.',
      },
      {
        title: 'Emergency response',
        desc: 'Slow police or civic distress dispatch to reported neighborhood distress calls.',
      },
      {
        title: 'Women and child safety',
        desc: 'Lack of well-lit safe commuting routes, panic buttons, and dedicated community vigilance.',
      },
    ],
  },
  {
    id: 'water_sanitation',
    name: 'Water & Sanitation',
    color: '#06b6d4', // cyan-500
    hoverColor: '#0891b2',
    gradient: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-500/40',
    activeBg: 'bg-cyan-950/50',
    tagColor: 'text-cyan-400',
    description: 'Clean drinking water pipelines, sewage hygiene, and dignified sanitation.',
    exampleProblems: [
      {
        title: 'Water shortage',
        desc: 'Severe piped water supply deficits requiring costly dependence on private tankers.',
      },
      {
        title: 'Drainage problems',
        desc: 'Clogged storm drains leading to urban waterlogging and sewage overflow during rains.',
      },
      {
        title: 'Public toilets',
        desc: 'Broken, unhygienic, or non-existent public restroom facilities in dense market areas.',
      },
      {
        title: 'Water contamination',
        desc: 'Discolored or contaminated tap water causing recurring waterborne gastrointestinal illness.',
      },
    ],
  },
  {
    id: 'employment',
    name: 'Employment',
    color: '#eab308', // yellow-500
    hoverColor: '#ca8a04',
    gradient: 'from-yellow-500 to-amber-600',
    border: 'border-yellow-500/40',
    activeBg: 'bg-yellow-950/50',
    tagColor: 'text-yellow-400',
    description: 'Youth livelihoods, technical skilling, and micro-entrepreneurship incubators.',
    exampleProblems: [
      {
        title: 'Lack of local jobs',
        desc: 'Limited regional employment opportunities forcing distress youth migration to distant cities.',
      },
      {
        title: 'Skill development',
        desc: 'Missing vocational training institutes in modern technical, IT, and mechanical trades.',
      },
      {
        title: 'Career guidance',
        desc: 'Absence of mentorship and career counseling for high school and collegiate graduates.',
      },
      {
        title: 'Unemployment',
        desc: 'High rates of educated youth seeking structured internships and apprenticeships.',
      },
    ],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    color: '#84cc16', // lime-500
    hoverColor: '#65a30d',
    gradient: 'from-lime-500 to-emerald-600',
    border: 'border-lime-500/40',
    activeBg: 'bg-lime-950/50',
    tagColor: 'text-lime-400',
    description: 'Agritech empowerment, sustainable farming, irrigation, and market security.',
    exampleProblems: [
      {
        title: 'Irrigation',
        desc: 'Erratic rainfall dependence and lack of solar drip irrigation or canal connectivity.',
      },
      {
        title: 'Crop disease',
        desc: 'Pest infestations and fungal blights destroying harvest yields without rapid diagnostics.',
      },
      {
        title: 'Market access',
        desc: 'Excessive middlemen commissions and lack of direct farmer-to-buyer cold logistics.',
      },
      {
        title: 'Agricultural technology',
        desc: 'Low adoption of precision farming, drone soil testing, and modern post-harvest storage.',
      },
    ],
  },
];
