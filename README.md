# SocietySolve 🌐

> **“A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.”**

---

## 🌟 Ecosystem Triad Flow

$$\text{Citizen} \longrightarrow \text{SocietySolve} \longrightarrow \text{University} \longrightarrow \text{Industry} \longrightarrow \text{Solution} \longrightarrow \text{Community Impact}$$

SocietySolve connects four distinct stakeholders in an accountable, transparent, and collaborative problem-solving loop:

1. 👥 **Citizens**: Report real-world community challenges across 8 societal categories with photos, documents, and severity levels.
2. 🎓 **Universities**: Research teams, faculty leads, and student fellows adopt challenges, draft technical blueprints, and engineer field solutions.
3. 🏢 **Industries**: Corporate sponsors provide grant funding, enterprise hardware/telemetry sensors, and executive engineering mentorship.
4. 🛡️ **Administrators**: Moderate challenges, verify academic accreditation and corporate legitimacy, and monitor platform-wide societal impact.

---

## 🚀 Key Features

- 🍩 **Interactive 8-Category Problem Donut**: Visual interactive SVG chart allowing citizens to choose categories and explore 32+ pre-populated community challenges with 1-click autofill.
- 📈 **10-Stage Visual Progression Timeline**: Real-time tracking from *Submitted (10%)* through *University Assigned (40%)*, *Industry Collaboration (65%)*, to *Resolved (100%)*.
- 💡 **Solutions Hub**: Public engineering directory at `/solutions` showcasing multidisciplinary technologies, team budgets, and corporate sponsorship buttons.
- 💬 **Cross-Actor Discussion & Milestone Updates**: Embedded collaborative feed on every problem page with color-coded badges for University, Corporate, Citizen, and Admin updates.
- 🔔 **In-App Notification Center**: Interactive navbar bell with live unread counter badges, timestamped notifications, and 1-click navigation to challenges.
- 📜 **Community Impact Certificate & PDF Export**: Printable high-resolution impact certificate featuring full stakeholder credits, quantified metrics, and `@media print` styling.
- 🛡️ **Ecosystem Governance Dashboard**: 8 macro platform metrics, challenge moderation (*"Approve to Accepted 30%"*), and institutional verification controls.
- 🔒 **Security Hardened**: In-memory brute-force rate limiters on `/api/auth`, strict HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`), JWT authentication, and bcrypt password hashing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide React, React Router v6, Axios |
| **Backend** | Node.js (v24), Express.js (v4), CORS, Morgan, Multer |
| **Database** | MongoDB & Mongoose (with offline-resilient fallbacks) |
| **Authentication** | JWT (JsonWebToken) + Bcrypt.js password hashing |
| **Testing** | Automated verification suite (`node scripts/verify_ecosystem.js`) |

---

## 📁 Repository Structure

```
societysolve/
├── client/                      # React 18 + Vite Frontend (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/          # InteractiveProblemDonut.jsx
│   │   │   ├── common/          # Navbar, Timeline, DiscussionThread, NotificationBell, ImpactReportModal
│   │   │   └── forms/           # ProblemSubmissionModal, ClaimProblemModal, SolutionProposalModal, SponsorModal
│   │   ├── context/             # AuthContext.jsx
│   │   ├── data/                # categoriesData.js (8 societal categories, 32 sample challenges)
│   │   ├── pages/               # LandingPage, LoginPage, RegisterPage, Dashboards (Citizen, University, Industry, Admin)
│   │   ├── services/            # Axios API services (auth, problem, solution, collaboration, admin, notification)
│   │   └── App.jsx              # Route definitions & layout
│   └── package.json
│
├── server/                      # Express REST API Backend (Port 5000)
│   ├── config/                  # MongoDB resilient connection (db.js)
│   ├── controllers/             # auth, problem, solution, collaboration, admin, comment, notification
│   ├── middleware/              # authMiddleware, uploadMiddleware, securityMiddleware, errorMiddleware
│   ├── models/                  # User, CitizenProfile, UniversityProfile, IndustryProfile, Problem, Solution, Collaboration, Comment, Notification
│   ├── routes/                  # REST endpoints
│   ├── scripts/                 # verify_ecosystem.js (Automated Test Suite)
│   ├── utils/                   # problemIdGenerator.js (SS-2026-XXXXXX)
│   ├── server.js                # Express entrypoint
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md          # Step-by-step production deployment (Atlas, Render, Vercel)
└── README.md                    # Platform documentation
```

---

## ⚡ Quickstart Guide

### 1. Start the Backend API Server
Open a terminal in the root directory:
```powershell
cd server
npm install
npm run dev
```
- Server URL: **`http://localhost:5000`**
- Health Check: **`http://localhost:5000/api/health`**

### 2. Start the Frontend Application
Open a second terminal:
```powershell
cd client
npm install
npm run dev
```
- Web Application: **`http://localhost:5173`**

---

## 🔑 Demo Login Accounts

SocietySolve includes **1-Click Demo Login** buttons directly on the Login Page (`/login`), as well as manual demo credentials:

| Role | Email | Password | Primary Feature |
|---|---|---|---|
| 👥 **Citizen** | `citizen@demo.com` | `password123` | Interactive Donut, Problem Reporting, Tracking |
| 🎓 **University** | `university@demo.com` | `password123` | Adopt Challenges, Submit Solutions, Student Teams |
| 🏢 **Industry** | `industry@demo.com` | `password123` | Fund Projects, Sponsor Solutions Hub, Mentorship |
| 🛡️ **Administrator** | `admin@demo.com` | `password123` | Challenge Moderation, Accreditation, Platform Stats |

---

## 🧪 Automated Testing

SocietySolve includes a built-in automated verification suite that runs across all 10 ecosystem stages without external dependencies:

```powershell
cd server
npm test
```

Expected output:
```
=======================================================
       SOCIETYSOLVE AUTOMATED VERIFICATION SUITE       
=======================================================
Test Suite 1: Problem ID Generator & Format
  ✔ [PASS] generateProblemId() returns a string
  ✔ [PASS] Generated ID matches pattern SS-2026-XXXXXX
  ✔ [PASS] Sequential calls generate unique identifiers
Test Suite 2: Mongoose Data Models
  ✔ [PASS] User Model loaded with role discriminator
  ✔ [PASS] Problem Model loaded with 10-stage timeline
  ✔ [PASS] Solution Model loaded with academic proposal fields
  ✔ [PASS] Collaboration Model loaded with sponsorship grants
  ✔ [PASS] Comment Model loaded with multi-role tags
  ✔ [PASS] Notification Model loaded with alert types
Test Suite 3: Security Hardening & Headers
  ✔ [PASS] X-Content-Type-Options is nosniff
  ✔ [PASS] X-Frame-Options set to SAMEORIGIN (clickjacking defense)
  ✔ [PASS] X-XSS-Protection enabled
  ✔ [PASS] Referrer policy is strict-origin
Test Suite 4: Rate Limiting Defense
  ✔ [PASS] Rate limiter blocks rapid requests after exceeding threshold (HTTP 429)
Test Suite 5: 10-Stage Progression Sequence
  ✔ [PASS] Problem schema defines all 10 canonical Societal Problem stages
=======================================================
  VERIFICATION RESULTS: 15 PASSED, 0 FAILED
=======================================================
```

---

## 🌐 Production Cloud Deployment

Follow the comprehensive beginner guide in [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) to deploy free to:
- **MongoDB Atlas** (Database)
- **Render.com** (Backend Web Service)
- **Vercel.com** (Frontend Web Application)
