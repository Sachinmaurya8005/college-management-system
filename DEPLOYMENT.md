# 🚀 Production Deployment Guide: GitHub & Vercel
## Government Polytechnic Bansdeeh, Ballia • College Management System

This document provides step-by-step instructions to deploy the complete **College Management System** (Vite + React Frontend and Django REST Framework Backend) to **GitHub** and **Vercel**.

---

## 📑 Table of Contents
1. [Project Architecture Overview](#1-project-architecture-overview)
2. [Step 1: Push Code to GitHub](#2-step-1-push-code-to-github)
3. [Step 2: Database Setup (Cloud PostgreSQL)](#3-step-2-database-setup-cloud-postgresql)
4. [Step 3: Deploy Backend to Vercel](#4-step-3-deploy-backend-to-vercel)
5. [Step 4: Deploy Frontend to Vercel](#5-step-4-deploy-frontend-to-vercel)
6. [Alternative: Deploy as Unified Monorepo](#6-alternative-deploy-as-unified-monorepo)
7. [Environment Variables Reference](#7-environment-variables-reference)
8. [Verification & Health Check](#8-verification--health-check)
9. [Troubleshooting & FAQs](#9-troubleshooting--faqs)

---

## 1. Project Architecture Overview

```
college-management-system/
├── .gitignore              # Master root gitignore (protects .env, db.sqlite3, node_modules)
├── vercel.json             # Unified root Vercel build & route rules
├── DEPLOYMENT.md           # This deployment guide
│
├── backend/                # Django 5.x REST Framework Backend
│   ├── api/index.py        # Vercel Serverless Function entry point
│   ├── config/             # Django settings, URLs, WSGI
│   │   ├── settings.py     # Production settings (WhiteNoise, Cloud DB, CORS)
│   │   └── wsgi.py         # WSGI application & app export
│   ├── .env.example        # Template for backend environment variables
│   ├── .gitignore          # Backend-specific exclusions
│   ├── vercel.json         # Standalone backend Vercel configuration
│   ├── requirements.txt    # Python dependencies (whitenoise, dj-database-url, etc.)
│   └── test_system.py      # Automated verification suite
│
└── frontend/               # Vite 5 + React 18 + Tailwind CSS Frontend
    ├── dist/               # Production compiled bundle (generated on build)
    ├── src/
    │   └── services/api.ts # API client with dynamic host resolution
    ├── .env.example        # Template for frontend environment variables
    ├── .gitignore          # Frontend-specific exclusions
    ├── vercel.json         # SPA client-side route rewrites
    ├── package.json        # Node dependencies & build script
    └── vite.config.ts      # Vite bundler configuration
```

---

## 2. Step 1: Push Code to GitHub

### 2.1. Check that Sensitive Files are Ignored
Make sure you never commit `.env` or `db.sqlite3`. The `.gitignore` files configured in this project already safeguard these files.

### 2.2. Initialize Git and Push to GitHub
Open your terminal in the root directory (`F:\college-management-system`):

```bash
# 1. Initialize git repository
git init

# 2. Check status to verify .env and db.sqlite3 are NOT staged
git status

# 3. Add all files
git add .

# 4. Commit changes
git commit -m "feat: production-ready college management system for GitHub and Vercel"

# 5. Set main branch
git branch -M main

# 6. Link to your GitHub repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/college-management-system.git

# 7. Push to GitHub
git push -u origin main
```

---

## 3. Step 2: Database Setup (Cloud PostgreSQL)

For serverless deployment on Vercel, a persistent cloud PostgreSQL database is recommended. You can create a **100% Free PostgreSQL Database** in 1 minute using any of the following providers:

### Option A: Neon Tech (Recommended - 100% Free)
1. Go to [https://neon.tech](https://neon.tech) and sign up with GitHub.
2. Click **Create Project** -> Name it `gpb-polytechnic-db`.
3. Copy the **Connection String** (`postgres://...`).

### Option B: Supabase (Free Tier)
1. Go to [https://supabase.com](https://supabase.com) -> **New Project**.
2. Go to **Project Settings > Database > Connection String** -> Copy URI.

---

## 4. Step 3: Deploy Backend to Vercel

### 4.1. Import Project in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository (`college-management-system`).

### 4.2. Configure Backend Project Settings
- **Project Name**: `gpb-polytechnic-api` (or your preferred name)
- **Framework Preset**: `Other`
- **Root Directory**: Click `Edit` and select `backend`
- **Build Command**: Leave default (or `pip install -r requirements.txt`)
- **Output Directory**: Leave default

### 4.3. Set Backend Environment Variables
In the **Environment Variables** section, add:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `SECRET_KEY` | `django-insecure-gpb-polytechnic-prod-2026-xyz` | 50+ character random string |
| `DEBUG` | `False` | Production debug mode |
| `ALLOWED_HOSTS` | `*` | Or `.vercel.app,your-domain.com` |
| `DATABASE_URL` | `postgres://user:pass@host/db?sslmode=require` | Your Neon/Supabase DB URI |
| `USE_SQLITE` | `False` | Set to `False` when using `DATABASE_URL` |
| `CORS_ALLOW_ALL_ORIGINS` | `True` | Allows frontend access |

4. Click **Deploy**.
5. Once deployed, note your backend URL: `https://gpb-polytechnic-api.vercel.app`.

---

## 5. Step 4: Deploy Frontend to Vercel

### 5.1. Import Frontend Project in Vercel
1. In the Vercel Dashboard, click **Add New...** -> **Project**.
2. Select the same GitHub repository (`college-management-system`).

### 5.2. Configure Frontend Project Settings
- **Project Name**: `gpb-polytechnic-portal`
- **Framework Preset**: `Vite`
- **Root Directory**: Click `Edit` and select `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5.3. Set Frontend Environment Variables
In the **Environment Variables** section, add:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://gpb-polytechnic-api.vercel.app/api` | Your deployed backend API URL |

4. Click **Deploy**.
5. Your frontend is now live at `https://gpb-polytechnic-portal.vercel.app`! 🎉

---

## 6. Alternative: Deploy as Unified Monorepo

If you want both Frontend and Backend to deploy together in **a single Vercel project**:

1. In Vercel, import the root directory `.` of the repository.
2. Vercel will automatically read the root `vercel.json`.
3. Add the Backend environment variables (`DATABASE_URL`, `SECRET_KEY`, etc.) in the project settings.
4. All `/api/*` requests will be routed to Django, and all other URLs will serve the React app.

---

## 7. Environment Variables Reference

### Backend Environment Variables (`backend/.env`)

```env
# Security
SECRET_KEY=your-secure-production-key-min-50-characters
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,.vercel.app

# Database (Cloud PostgreSQL connection URI)
DATABASE_URL=postgres://username:password@ep-xyz.us-east-2.aws.neon.tech/gpb_polytechnic_db?sslmode=require
USE_SQLITE=False

# CORS (Frontend domains allowed to interact with the API)
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://gpb-polytechnic-portal.vercel.app
```

### Frontend Environment Variables (`frontend/.env`)

```env
# Backend API Base URL
VITE_API_BASE_URL=https://gpb-polytechnic-api.vercel.app/api
```

---

## 8. Verification & Health Check

### Local Test Verification
Before deploying, you can run the automated test suite locally:

```bash
# Test backend
cd backend
python test_system.py
# Result: ALL VERIFICATION CHECKS PASSED (6/6 Suites)

# Test frontend build
cd ../frontend
npm run build
# Result: dist/ created with 0 errors
```

### Production Endpoints Health Check
After deployment, verify that these endpoints return HTTP `200 OK`:

- **Public Home Page**: `https://your-frontend.vercel.app/`
- **Backend API Root**: `https://your-backend.vercel.app/api/public/home/`
- **Swagger Documentation**: `https://your-backend.vercel.app/api/docs/`
- **Django Admin**: `https://your-backend.vercel.app/admin/`

---

## 9. Troubleshooting & FAQs

### Q1: CORS Error when making requests from Frontend to Backend
- **Cause**: Backend does not allow the frontend origin domain.
- **Fix**: In Vercel Backend environment variables, ensure `CORS_ALLOW_ALL_ORIGINS=True` or add your exact frontend URL to `CORS_ALLOWED_ORIGINS`.

### Q2: 404 Error when refreshing page on Frontend routes (e.g. `/portal-admin`)
- **Cause**: Static hosting needs to rewrite client routes to `/index.html`.
- **Fix**: The `frontend/vercel.json` already contains the SPA rewrite rule:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```

### Q3: Admin Portal static styles (CSS/JS) missing
- **Cause**: Static files not served in production.
- **Fix**: `whitenoise` is configured in `backend/config/settings.py` with `STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'`. Run `python manage.py collectstatic --noinput` to generate static files.

### Q4: Database data resets after server restart
- **Cause**: SQLite on Vercel is stateless and runs in an ephemeral `/tmp` container.
- **Fix**: Attach a persistent PostgreSQL database via `DATABASE_URL` (using Neon or Supabase as outlined in Step 2).

---

🎓 **Government Polytechnic Bansdeeh, Ballia** • BTEUP Code: `4412` • All Systems Ready for Deployment!
