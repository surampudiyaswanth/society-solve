# SocietySolve — Complete Beginner's Production Deployment Guide

This step-by-step guide explains how to deploy the entire **SocietySolve** full-stack application to the cloud for free using modern industry-standard hosting:
- **Database**: MongoDB Atlas (Free Cloud Cluster)
- **Backend API**: Render.com (Free Web Service)
- **Frontend Web App**: Vercel.com (Free Edge Deployment)

---

## Architecture Overview

```
[ Browser Client ]  ----(HTTPS / React 18)---->  [ Vercel CDN Frontend ]
        |
        +----(Axios REST API calls)------------>  [ Render Express Server ]
                                                           |
                                                (Mongoose TLS Connection)
                                                           v
                                                [ MongoDB Atlas Cloud DB ]
```

---

## Step 1: Set Up MongoDB Atlas (Free Cloud Database)

1. **Sign Up / Log In**:
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Create a Free Cluster**:
   - Select the **M0 Free Cluster** tier.
   - Choose a cloud provider (AWS recommended) and a region closest to your users.
   - Click **Create Cluster**.
3. **Set Up Database Access (Credentials)**:
   - In the left sidebar, click **Database Access** under Security.
   - Click **Add New Database User**.
   - Choose **Password Authentication**.
   - Username: `societysolve_admin`
   - Password: Choose a strong password (e.g. `SolveSociety2026!`). Note it down.
   - Set Database User Privileges to **Read and write to any database**.
   - Click **Add User**.
4. **Set Up Network Access (IP Whitelist)**:
   - In the left sidebar, click **Network Access**.
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`). *(This allows your Render backend server to connect to your database).*
   - Click **Confirm**.
5. **Get Your Connection String**:
   - Go to **Database** in the left sidebar.
   - Click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string. It looks like:
     ```
     mongodb+srv://societysolve_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<password>` with your database user password, and append the database name `/societysolve` before the `?`:
     ```
     mongodb+srv://societysolve_admin:SolveSociety2026!@cluster0.abcde.mongodb.net/societysolve?retryWrites=true&w=majority&appName=Cluster0
     ```

---

## Step 2: Deploy the Backend API to Render.com

1. **Push Your Code to GitHub**:
   - Make sure your project repository is pushed to your personal GitHub account.
2. **Create a New Web Service on Render**:
   - Sign up/log in at [https://render.com](https://render.com).
   - Click **New +** in the top navigation and select **Web Service**.
   - Connect your GitHub repository.
3. **Configure the Service Settings**:
   - **Name**: `societysolve-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. **Add Environment Variables**:
   Under the **Environment Variables** section on Render, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(Your MongoDB Atlas connection string from Step 1)*
   - `JWT_SECRET`: *(A random 32-character secret key, e.g. `super_secret_jwt_key_society_solve_2026_secure`)*
   - `CLIENT_URL`: `https://your-frontend-domain.vercel.app` *(You will update this with your actual Vercel URL in Step 4)*
5. **Click "Deploy Web Service"**:
   - Render will build your server and provide you with a live URL (e.g. `https://societysolve-api.onrender.com`).
   - Test your server in the browser: visit `https://societysolve-api.onrender.com/api/health`. You should see `status: "OK"`.

---

## Step 3: Deploy the Frontend to Vercel

1. **Sign Up / Log In to Vercel**:
   - Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. **Import Project**:
   - Click **Add New...** -> **Project**.
   - Select your SocietySolve repository.
3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and select `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Configure Environment Variables on Vercel**:
   - In the **Environment Variables** section, add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://societysolve-api.onrender.com/api` *(Your Render backend URL with `/api`)*
5. **Click "Deploy"**:
   - Vercel will build and deploy your React app in ~60 seconds.
   - You will get a live production URL (e.g. `https://societysolve.vercel.app`).

---

## Step 4: Connect Frontend & Backend (CORS & Linking)

1. **Update Backend `CLIENT_URL`**:
   - Go back to your [Render.com](https://render.com) dashboard -> your `societysolve-api` service.
   - Go to **Environment**.
   - Update `CLIENT_URL` to match your live Vercel URL (e.g. `https://societysolve.vercel.app`).
   - Render will automatically re-deploy with updated CORS permissions.
2. **Verify Full Application**:
   - Open your live Vercel URL in the browser.
   - Click **Sign In** -> use 1-click Demo Account or click **Seed Demo Data**.
   - Verify that you can browse challenges, submit a new problem, explore the **Solutions Hub**, view the **10-stage timeline**, and open the **Impact Report Certificate**!

---

## Production Environment Variables Reference Table

### Backend (`server/.env`)
| Variable | Value Description | Example |
|---|---|---|
| `PORT` | Listening port on host | `5000` |
| `NODE_ENV` | Environment identifier | `production` |
| `MONGO_URI` | Atlas TLS connection string | `mongodb+srv://user:pass@cluster.mongodb.net/societysolve` |
| `JWT_SECRET` | 256-bit secret token key | `jwt_secret_token_key_change_in_prod` |
| `CLIENT_URL` | Approved CORS origin frontend | `https://societysolve.vercel.app` |

### Frontend (`client/.env`)
| Variable | Value Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Full backend API prefix | `https://societysolve-api.onrender.com/api` |

---

## Troubleshooting FAQ

- **Q: Render free tier takes 30-50 seconds to respond on first load.**
  - *A:* Free tier instances on Render spin down after 15 minutes of inactivity. The first request wakes the server up; subsequent requests are instantaneous.
- **Q: CORS error in browser console (`Access-Control-Allow-Origin`).**
  - *A:* Ensure the `CLIENT_URL` variable in Render matches your exact Vercel frontend URL without trailing slashes.
- **Q: Database connection error (`MongooseServerSelectionError`).**
  - *A:* In MongoDB Atlas -> Network Access, ensure you have whitelisted `0.0.0.0/0` (Allow from anywhere) so Render's cloud servers can connect.
