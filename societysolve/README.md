# SocietySolve Platform — Full-Stack Civic Problem Resolution Engine

A full-stack web platform connecting grassroots citizens, academic engineering teams, and industrial partners under municipal administrative oversight to solve community infrastructure and civic challenges.

---

## 1. Project Directory Structure

```
societysolve/
│
├── frontend/
│   └── index.html               # Preserved UI, SVG Donut Chart, Dashboards & REST API Client
│
├── backend/
│   ├── server.js                # Express Application entry point with Helmet, CORS & Multer
│   ├── package.json             # NPM dependencies & scripts
│   ├── .env                     # Environment variables (MongoDB URI, JWT Secret, Port)
│   ├── .env.example             # Environment template
│   ├── seed.js                  # Database seed script for demo data & admin setup
│   │
│   ├── config/
│   │   └── db.js                # Mongoose database connection
│   │
│   ├── models/
│   │   ├── User.js              # User schema (Citizen, University, Industry, Admin)
│   │   ├── Problem.js           # Problem schema with auto SS-XXXXX IDs & Milestones
│   │   ├── Milestone.js         # 7-stage lifecycle milestone model & schema
│   │   └── Collaboration.js     # Industrial co-sponsorship pledge model & schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth (register, login, me)
│   │   ├── problemRoutes.js     # /api/problems (categories, create, my, get, status)
│   │   ├── universityRoutes.js  # /api/university (problems, assign, advance stage)
│   │   ├── industryRoutes.js    # /api/industry (problems, collaborate)
│   │   └── adminRoutes.js       # /api/admin (stats, users, problems, audits, status toggle)
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication & JWT issuance logic
│   │   ├── problemController.js # Civic problem lifecycle and file uploads
│   │   ├── universityController.js # Academic capstone adoption logic
│   │   ├── industryController.js   # Corporate sponsorship and pledges
│   │   └── adminController.js   # Aggregated analytics and governance audits
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT Bearer token authentication guard
│   │   ├── roleMiddleware.js    # Role-Based Access Control (RBAC)
│   │   └── uploadMiddleware.js  # Multer file upload (JPG/PNG/WebP, PDF/DOC/DOCX up to 10MB)
│   │
│   └── uploads/                 # Local directory for photo & document evidence
│
└── README.md                    # Complete documentation and setup guide
```

---

## 2. Beginner Setup Guide

Follow these step-by-step instructions to get the application running on your computer.

### Step 1: Install Required Software (If Not Installed)

1. **Node.js**:
   - Download the LTS version from [nodejs.org](https://nodejs.org/).
   - Verify installation in your terminal:
     ```powershell
     node -v
     npm -v
     ```
2. **MongoDB** (Choose Option A or Option B):
   - **Option A (Local MongoDB Community Server)**:
     - Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
     - Install MongoDB Compass (GUI) if prompted.
     - Ensure the Windows MongoDB service is running (`services.msc` -> `MongoDB Server` -> Running).
   - **Option B (Free Cloud Database with MongoDB Atlas — Recommended if no local MongoDB)**:
     - Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
     - Create a Free Shared Cluster (M0).
     - Under **Database Access**, add a user (e.g. `admin` and password `YourPassword123`).
     - Under **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`).
     - Click **Connect** -> **Drivers (Node.js)** -> copy your connection string (e.g., `mongodb+srv://admin:YourPassword123@cluster0.xxxxx.mongodb.net/societysolve?retryWrites=true&w=majority`).
3. **VS Code (Optional)**:
   - Download from [code.visualstudio.com](https://code.visualstudio.com/).

---

### Step 2: Configure Environment Variables

Navigate to the `backend` folder:
```powershell
cd backend
```
Make sure `.env` contains your settings:
```env
PORT=5000
NODE_ENV=development

# For Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/societysolve

# OR For MongoDB Atlas (replace with your credentials):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/societysolve?retryWrites=true&w=majority

JWT_SECRET=societysolve_jwt_secure_key_2026_change_in_production
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5000,http://127.0.0.1:5500,http://localhost:3000,http://localhost:5173

ADMIN_NAME="Chief Administrative Officer"
ADMIN_EMAIL=admin@societysolve.org
ADMIN_PASSWORD=Admin@12345
```

---

### Step 3: Install Backend Dependencies

Inside `societysolve/backend`:
```powershell
npm install
```

---

### Step 4: Seed the Database with Demo Data

Populate the database with demo citizens, universities, industries, admin credentials, and problems from the prototype:
```powershell
npm run seed
```
Or to setup only the admin account:
```powershell
npm run seed-admin
```

#### Pre-Configured Demo Credentials:
| Portal | Email | Password | Role / Name |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@societysolve.org` | `Admin@12345` | Chief Administrative Officer |
| **Citizen** | `ananya@citizen.org` | `Password@123` | Ananya Sharma |
| **Citizen** | `rahul@citizen.org` | `Password@123` | Rahul Verma |
| **University** | `director@nit.edu` | `Password@123` | National Institute of Technology (NIT) |
| **University** | `rnd@metrotech.edu` | `Password@123` | Metropolitan University of Technology |
| **Industry** | `csr@apexdynamics.com` | `Password@123` | Apex Industrial Dynamics Ltd |
| **Industry** | `partnerships@sensorycivic.io` | `Password@123` | SensoryCivic IoT Solutions |

---

### Step 5: Start the Backend Server

```powershell
npm run dev
# or: npm start
```
The server will boot up:
```
====================================================
  SocietySolve Server running on port 5000
  Gateway URL: http://localhost:5000
  API Health:  http://localhost:5000/api/health
====================================================
```

---

### Step 6: Launch the Frontend

You can run the frontend in either of two easy ways:

- **Method 1 (Built-in Express Host)**:
  Open your web browser and navigate directly to:
  ```
  http://localhost:5000
  ```
  The Express server automatically serves `frontend/index.html`!

- **Method 2 (Live Server / Direct File)**:
  Open `societysolve/frontend/index.html` using VS Code Live Server extension (port 5500) or by double-clicking the file in your file explorer.

---

## 3. Complete REST API Specification

### Authentication & Sessions (`/api/auth`)

| Method | Endpoint | Authentication | Role | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Any | Register Citizen, University, or Industry |
| `POST` | `/api/auth/login` | Public | Any | Authenticate user & receive signed JWT |
| `GET` | `/api/auth/me` | Bearer Token | Any | Retrieve active user profile on page refresh |
| `POST` | `/api/chat` | Public / Bearer | Any | SolveBot context-aware civic assistant AI |

### Civic Problems (`/api/problems`)

| Method | Endpoint | Authentication | Role | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/problems/categories` | Public | Any | List all 10 civic problem domains & colors |
| `POST` | `/api/problems` | Bearer Token | `citizen`, `admin` | Submit a problem ticket with photo/doc evidence |
| `GET` | `/api/problems/my` | Bearer Token | `citizen`, `admin` | List problems submitted by authenticated citizen |
| `GET` | `/api/problems/:problemId` | Bearer Token | Any authorized | View detailed problem record & audit trail |
| `PATCH` | `/api/problems/:problemId/status`| Bearer Token | `university`, `admin` | Update problem status and append milestone |

### University Workspace (`/api/university`)

| Method | Endpoint | Authentication | Role | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/university/problems` | Bearer Token | `university`, `admin` | List open & assigned problem pool |
| `GET` | `/api/university/problems/:id`| Bearer Token | `university`, `admin` | View academic feasibility dossier |
| `PATCH` | `/api/university/problems/:id/assign` | Bearer Token | `university`, `admin` | Adopt problem as primary technical lead |
| `PATCH` | `/api/university/problems/:id/status` | Bearer Token | `university`, `admin` | Advance problem through lifecycle stages |

### Industry Co-Sponsorship (`/api/industry`)

| Method | Endpoint | Authentication | Role | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/industry/problems` | Bearer Token | `industry`, `admin` | List academic challenges seeking sponsorship |
| `POST` | `/api/industry/problems/:id/collaborate` | Bearer Token | `industry`, `admin` | Pledge funding, hardware, and recommendations |
| `PATCH` | `/api/industry/problems/:id/collaboration` | Bearer Token | `industry`, `admin` | Update committed resources or specifications |

### Municipal Governance & Admin (`/api/admin`)

| Method | Endpoint | Authentication | Role | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/statistics` | Bearer Token | `admin` | Aggregated platform metrics and chart data |
| `GET` | `/api/admin/dashboard` | Bearer Token | `admin` | Alias for aggregated dashboard telemetry |
| `GET` | `/api/admin/users` | Bearer Token | `admin` | Complete registry of citizens, univs & industries |
| `GET` | `/api/admin/problems` | Bearer Token | `admin` | Master audit ledger of all civic problems |
| `PATCH` | `/api/admin/users/:userId/status` | Bearer Token | `admin` | Toggle institution status (Active / Inactive) |
| `PATCH` | `/api/admin/problems/:id/verify` | Bearer Token | `admin` | Audit and verify problem ticket integrity |
| `PATCH` | `/api/admin/problems/:id/assign` | Bearer Token | `admin` | Directly assign academic institution to problem |

---

## 4. Example Request & Response Payloads

### A. Citizen Registration (`POST /api/auth/register`)
**Request Body:**
```json
{
  "name": "Priya Nambiar",
  "email": "priya@citizen.org",
  "phone": "+91 98111 22334",
  "password": "Password@123",
  "role": "citizen"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "Citizen registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f8a9e0123456789abcdef",
    "name": "Priya Nambiar",
    "email": "priya@citizen.org",
    "phone": "+91 98111 22334",
    "role": "citizen",
    "status": "Active",
    "problemsReported": 0
  }
}
```

---

### B. User Login (`POST /api/auth/login`)
**Request Body:**
```json
{
  "email": "director@nit.edu",
  "password": "Password@123",
  "role": "university"
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673f8a9e0123456789abcde1",
    "name": "National Institute of Technology (NIT)",
    "email": "director@nit.edu",
    "role": "university",
    "location": "Tech Zone, Sector 4",
    "website": "https://nit.ac.in",
    "departments": ["Mechanical", "Civil", "IoT Lab"],
    "status": "Active"
  }
}
```

---

### C. Problem Submission (`POST /api/problems`)
**Headers:**
```
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data
```
**Form Fields:**
- `category`: `water`
- `title`: `Underground Pipe Rupture Flooding Sub-Ward 3`
- `description`: `Main drinking water conduit ruptured creating heavy waterlogging.`
- `location`: `Sector 4, Main Market Crossing`
- `priority`: `High`
- `contacts`: `Ward Counselor: +91 98765 11223`
- `imageEvidence`: *(File binary up to 10MB)*
- `documentEvidence`: *(PDF binary up to 10MB)*

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Problem submitted successfully.",
  "data": {
    "problemId": "SS-48921",
    "category": "water",
    "title": "Underground Pipe Rupture Flooding Sub-Ward 3",
    "description": "Main drinking water conduit ruptured creating heavy waterlogging.",
    "location": "Sector 4, Main Market Crossing",
    "priority": "High",
    "contacts": "Ward Counselor: +91 98765 11223",
    "submittedBy": "673f8a9e0123456789abcdef",
    "submittedByName": "Priya Nambiar",
    "submittedByEmail": "priya@citizen.org",
    "submittedAt": "2026-09-16 19:40:00",
    "status": "Submitted",
    "assignedUniversity": null,
    "leadProfessor": null,
    "collaborators": [],
    "milestones": [
      {
        "stage": "Submitted",
        "date": "2026-09-16 19:40:00",
        "note": "Verified grassroots ticket generated on SocietySolve ledger."
      }
    ],
    "imageEvidence": "/uploads/pipe_burst-1726500000-12345.jpg",
    "documentEvidence": null,
    "id": "SS-48921"
  }
}
```

---

### D. Industrial Partnership Pledge (`POST /api/industry/problems/:id/collaborate`)
**Request Body:**
```json
{
  "resources": "$25,000 High-grade composite piping and acoustic leak detectors",
  "techContribution": "Continuous ultrasound flow-rate sensors with 4G telemetry",
  "recommendations": "Ensure pipeline bedding has 150mm gravel backfill to mitigate subsidence."
}
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Industrial pledge committed successfully for SS-48921.",
  "data": {
    "problemId": "SS-48921",
    "status": "Industry Collaboration",
    "collaborators": [
      {
        "companyName": "Apex Industrial Dynamics Ltd",
        "resources": "$25,000 High-grade composite piping and acoustic leak detectors",
        "techContribution": "Continuous ultrasound flow-rate sensors with 4G telemetry",
        "recommendations": "Ensure pipeline bedding has 150mm gravel backfill to mitigate subsidence.",
        "pledgedDate": "2026-09-16"
      }
    ]
  }
}
```

---

### E. Admin Platform Statistics (`GET /api/admin/statistics`)
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalCitizens": 2,
    "totalUniversities": 2,
    "totalIndustries": 2,
    "totalProblems": 4,
    "activeProblems": 3,
    "completedProblems": 1,
    "totalCollaborations": 3,
    "categoryCounts": {
      "water": 1,
      "roads": 1,
      "waste": 1,
      "healthcare": 1
    },
    "stageCounts": {
      "Submitted": 0,
      "Under Review": 1,
      "University Assigned": 0,
      "Solution Development": 1,
      "Industry Collaboration": 1,
      "Implementation": 0,
      "Completed": 1
    }
  }
}
```

---

## 5. Security & Architectural Standards

1. **Authentication**: JWT signed tokens stored in frontend `localStorage` and verified via `authMiddleware.js`.
2. **Password Security**: Passwords are encrypted with `bcryptjs` using a salt work factor of 10. Passwords are never returned in queries or responses (`select: false`).
3. **Role-Based Authorization**: Protected endpoints require appropriate roles (`citizen`, `university`, `industry`, or `admin`).
4. **Rate Limiting**: Authentication endpoints are rate-limited with `express-rate-limit` to prevent brute force.
5. **File Security**: Strict Multer filter restricting extensions to approved images and documents, capping size at 10MB per file with sanitized filenames.
6. **Cross-Origin Resource Sharing (CORS)**: Configured to support frontend access across local development ports.
7. **HTTP Headers**: Enforced using `helmet` for defense-in-depth protection.
8. **Session Persistence**: Automated re-authentication via `GET /api/auth/me` on page reload.
