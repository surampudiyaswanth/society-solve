const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Problem = require('./models/Problem');

const seedDataInternal = async () => {
  const isAdminOnly = process.argv.includes('--admin-only');

  // 1. Create or Update Admin Account
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@societysolve.org').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'Chief Administrative Officer';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      phone: '+91 11 9988 7766',
      status: 'Active',
    });
    console.log(`[Seed] Created Admin: ${adminEmail} (password: ${adminPassword})`);
  } else {
    admin.password = adminPassword;
    admin.role = 'admin';
    await admin.save();
    console.log(`[Seed] Updated Admin password: ${adminEmail} (password: ${adminPassword})`);
  }

  if (isAdminOnly) {
    console.log('[Seed] Admin account setup complete.');
    return;
  }

  // 2. Clear existing demo problems and regular users (preserve admin)
  console.log('[Seed] Refreshing demo users and problems...');
  await Problem.deleteMany({});
  await User.deleteMany({ email: { $ne: adminEmail } });

  // 3. Seed Citizens
  const citizen1 = await User.create({
    name: 'Ananya Sharma',
    email: 'ananya@citizen.org',
    password: 'Password@123',
    phone: '+91 98765 43210',
    role: 'citizen',
    problemsReported: 2,
  });

  const citizen2 = await User.create({
    name: 'Rahul Verma',
    email: 'rahul@citizen.org',
    password: 'Password@123',
    phone: '+91 98450 12345',
    role: 'citizen',
    problemsReported: 1,
  });

  // 4. Seed Universities
  const univ1 = await User.create({
    name: 'National Institute of Technology (NIT)',
    email: 'director@nit.edu',
    password: 'Password@123',
    phone: '+91 11 2345 6789',
    role: 'university',
    location: 'Tech Zone, Sector 4',
    website: 'https://nit.ac.in',
    departments: ['Mechanical', 'Civil', 'IoT Lab'],
    status: 'Active',
  });

  const univ2 = await User.create({
    name: 'Metropolitan University of Technology',
    email: 'rnd@metrotech.edu',
    password: 'Password@123',
    phone: '+91 22 8765 4321',
    role: 'university',
    location: 'City Campus South',
    website: 'https://metrotech.edu',
    departments: ['Environmental Engg', 'Biotech'],
    status: 'Active',
  });

  // 5. Seed Industries
  const ind1 = await User.create({
    name: 'Apex Industrial Dynamics Ltd',
    email: 'csr@apexdynamics.com',
    password: 'Password@123',
    phone: '+91 44 4900 1100',
    role: 'industry',
    sector: 'Advanced Manufacturing & Heavy Engineering',
    headquarters: 'Apex Tech Hub, Tower 2',
    status: 'Active',
  });

  const ind2 = await User.create({
    name: 'SensoryCivic IoT Solutions',
    email: 'partnerships@sensorycivic.io',
    password: 'Password@123',
    phone: '+91 80 6554 9988',
    role: 'industry',
    sector: 'Smart Sensors & Urban Telemetry',
    headquarters: 'Silicon Enclave Phase 2',
    status: 'Active',
  });

  // 6. Seed Problems
  const problemsData = [
    {
      problemId: 'SS-10245',
      category: 'water',
      title: 'Heavy Lead Contamination & Burst Trunk Pipe in Ward 14',
      description:
        'A 40-year-old cast iron pipeline supplying 4,500 homes has suffered fractures causing muddy wastewater inflow and heavy turbidity. Water quality strips show unsafe contaminant spikes.',
      location: 'Ward 14, Old Municipal Waterworks, Near Tank 3',
      priority: 'Critical',
      contacts: 'Residents Welfare Association, Secretary Phone: +91 98111 22334',
      submittedBy: citizen1._id,
      submittedByName: citizen1.name,
      submittedByEmail: citizen1.email,
      submittedAt: '2026-08-14 09:30 AM',
      status: 'Solution Development',
      assignedUniversity: 'National Institute of Technology (NIT)',
      leadProfessor: 'Dr. S. K. Bhattacharya (Dept of Civil & Fluid Mechanics)',
      collaborators: [
        {
          companyName: 'Apex Industrial Dynamics Ltd',
          resources: '$18,000 High-pressure polymer piping and valve actuators',
          techContribution: 'Automated pressure control valves with remote shutoff sensors',
          recommendations: 'Ensure pressure tolerances accommodate nighttime water hammer spikes.',
          pledgedDate: '2026-08-28',
          industryUser: ind1._id,
        },
      ],
      milestones: [
        {
          stage: 'Submitted',
          date: '2026-08-14 09:30 AM',
          note: 'Issue submitted with citizen water test reports and geo-tagged images.',
          updatedBy: citizen1._id,
        },
        {
          stage: 'Under Review',
          date: '2026-08-16 11:15 AM',
          note: 'Public Works inspector confirmed structural failure of main pipeline segment.',
          updatedBy: admin._id,
        },
        {
          stage: 'University Assigned',
          date: '2026-08-20 03:00 PM',
          note: 'NIT Civil Engineering capstone selected the problem for low-cost filtration telemetry.',
          updatedBy: univ1._id,
        },
        {
          stage: 'Solution Development',
          date: '2026-09-02 04:45 PM',
          note: 'Pilot lab testing of modular electro-coagulation prototype underway.',
          updatedBy: univ1._id,
        },
      ],
    },
    {
      problemId: 'SS-10246',
      category: 'roads',
      title: 'Severe Structural Subsidence on South Market Flyover Pier 8',
      description:
        'Large surface cracks and concrete spalling along the expansion joints. Heavy commercial truck vibrations are worsening fissure width weekly.',
      location: 'South Ring Market Flyover, Mile Marker 4.2',
      priority: 'High',
      contacts: 'Merchant Truckers Union Rep: +91 98222 33445',
      submittedBy: citizen2._id,
      submittedByName: citizen2.name,
      submittedByEmail: citizen2.email,
      submittedAt: '2026-08-25 11:20 AM',
      status: 'Industry Collaboration',
      assignedUniversity: 'Metropolitan University of Technology',
      leadProfessor: 'Prof. Rita Sen (Structural Dynamics Lab)',
      collaborators: [
        {
          companyName: 'SensoryCivic IoT Solutions',
          resources: '$9,500 Wireless strain gauge sensors and LTE gateways',
          techContribution: 'Real-time structural stress telemetry dashboard',
          recommendations: 'Deploy solar harvesting battery attachments to avoid grid reliance.',
          pledgedDate: '2026-09-04',
          industryUser: ind2._id,
        },
      ],
      milestones: [
        {
          stage: 'Submitted',
          date: '2026-08-25 11:20 AM',
          note: 'High priority alert logged by daily commuter.',
          updatedBy: citizen2._id,
        },
        {
          stage: 'Under Review',
          date: '2026-08-26 02:00 PM',
          note: 'Verified by Municipal Road Safety Committee.',
          updatedBy: admin._id,
        },
        {
          stage: 'University Assigned',
          date: '2026-08-29 10:00 AM',
          note: 'MetroTech Structural Dynamics Lab adopted challenge for finite element modeling.',
          updatedBy: univ2._id,
        },
        {
          stage: 'Solution Development',
          date: '2026-09-01 12:30 PM',
          note: 'Computer simulation created of resonant vibration modes.',
          updatedBy: univ2._id,
        },
        {
          stage: 'Industry Collaboration',
          date: '2026-09-04 05:00 PM',
          note: 'SensoryCivic installed pilot wireless vibration sensors on Pier 8.',
          updatedBy: ind2._id,
        },
      ],
    },
    {
      problemId: 'SS-10247',
      category: 'waste',
      title: 'Unsegregated Organic Waste Fermentation near Lake Wetland',
      description:
        'Over 8 tons of mixed commercial restaurant waste dumped adjacent to migratory bird sanctuary, causing toxic runoff during rain.',
      location: 'Bluebell Lake Eco-Buffer Zone, Gate 4',
      priority: 'High',
      contacts: 'Lake Conservation Alliance: contact@lakeclean.org',
      submittedBy: citizen1._id,
      submittedByName: citizen1.name,
      submittedByEmail: citizen1.email,
      submittedAt: '2026-09-02 02:15 PM',
      status: 'Under Review',
      assignedUniversity: null,
      leadProfessor: null,
      collaborators: [],
      milestones: [
        {
          stage: 'Submitted',
          date: '2026-09-02 02:15 PM',
          note: 'Report logged with soil moisture and pH records.',
          updatedBy: citizen1._id,
        },
        {
          stage: 'Under Review',
          date: '2026-09-05 10:00 AM',
          note: 'Admin assigned field auditor for verification.',
          updatedBy: admin._id,
        },
      ],
    },
    {
      problemId: 'SS-10248',
      category: 'healthcare',
      title: 'Vaccine Cold-Chain Power Dropout at Rural Primary Health Clinic',
      description:
        'Unreliable grid power causes vaccine storage fridges to breach temperature thresholds (above 8°C) multiple nights weekly.',
      location: 'Kalyan Primary Health Centre, Sub-district 2',
      priority: 'Critical',
      contacts: 'Dr. M. Joseph (Medical Officer)',
      submittedBy: citizen1._id,
      submittedByName: 'Public Health Volunteer (Ananya Sharma)',
      submittedByEmail: citizen1.email,
      submittedAt: '2026-07-10 08:00 AM',
      status: 'Completed',
      assignedUniversity: 'National Institute of Technology (NIT)',
      leadProfessor: 'Dr. A. Rao (Solar & Energy Storage Research Group)',
      collaborators: [
        {
          companyName: 'Apex Industrial Dynamics Ltd',
          resources: '$12,000 LiFePO4 battery storage bank and hybrid solar inverters',
          techContribution: 'Off-grid micro-UPS with GSM emergency alert module',
          recommendations: 'Recommended biannual battery electrolyte calibration.',
          pledgedDate: '2026-07-28',
          industryUser: ind1._id,
        },
      ],
      milestones: [
        {
          stage: 'Submitted',
          date: '2026-07-10 08:00 AM',
          note: 'Initial problem registered.',
          updatedBy: citizen1._id,
        },
        {
          stage: 'Under Review',
          date: '2026-07-12 11:00 AM',
          note: 'Health Directorate validation completed.',
          updatedBy: admin._id,
        },
        {
          stage: 'University Assigned',
          date: '2026-07-15 03:00 PM',
          note: 'NIT renewable energy team designed backup power blueprint.',
          updatedBy: univ1._id,
        },
        {
          stage: 'Solution Development',
          date: '2026-07-22 01:00 PM',
          note: 'Smart charge controller breadboard validated.',
          updatedBy: univ1._id,
        },
        {
          stage: 'Industry Collaboration',
          date: '2026-07-28 10:30 AM',
          note: 'Apex Industrial supplied and installed industrial battery pack.',
          updatedBy: ind1._id,
        },
        {
          stage: 'Implementation',
          date: '2026-08-08 09:00 AM',
          note: 'System commissioned on-site with zero power drops over 2 weeks.',
          updatedBy: univ1._id,
        },
        {
          stage: 'Completed',
          date: '2026-08-25 04:00 PM',
          note: 'Handed over to clinic staff with automated SMS telemetry live.',
          updatedBy: admin._id,
        },
      ],
    },
  ];

  for (const prob of problemsData) {
    await Problem.create(prob);
  }

  console.log(`[Seed] Seeded ${problemsData.length} problems successfully.`);
  console.log('\n================ DEMO CREDENTIALS ================');
  console.log('Admin:      admin@societysolve.org          / Admin@12345');
  console.log('Citizen:    ananya@citizen.org              / Password@123');
  console.log('Citizen:    rahul@citizen.org               / Password@123');
  console.log('University: director@nit.edu                / Password@123');
  console.log('University: rnd@metrotech.edu               / Password@123');
  console.log('Industry:   csr@apexdynamics.com            / Password@123');
  console.log('Industry:   partnerships@sensorycivic.io    / Password@123');
  console.log('===================================================\n');
};

const runStandaloneSeed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/societysolve';
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log(`[Seed] Connected to MongoDB at ${mongoUri}`);
    } catch (e) {
      console.log(`[Seed] Could not reach primary MongoDB at ${mongoUri}. Connecting via in-process engine...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      console.log(`[Seed] Connected to in-process MongoDB.`);
    }

    await seedDataInternal();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  runStandaloneSeed();
}

module.exports = { seedDataInternal };
