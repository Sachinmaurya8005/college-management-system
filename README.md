# 🎓 Government Polytechnic Bansdeeh, Ballia
## Complete Institutional Enterprise College Management System (CMS)

[![Django](https://img.shields.io/badge/Backend-Django%205.x%20%7C%20DRF-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel%20Serverless-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![BTEUP Code](https://img.shields.io/badge/BTEUP%20Code-4412-F59E0B?style=for-the-badge)](https://bteup.ac.in/)

An enterprise-grade, high-performance, real-time **College Management System** purpose-built for **Government Polytechnic Bansdeeh, Ballia (Affiliated to BTEUP Lucknow & Approved by AICTE, New Delhi)**. The system includes full-featured portals for **Administrators & Principals**, **Teaching & Non-Teaching Faculty**, **Students**, and the **Public Website**.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture & Structure](#️-system-architecture--structure)
- [🔑 Demo Login Credentials](#-demo-login-credentials)
- [💻 Local Development Quickstart](#-local-development-quickstart)
- [🚀 GitHub & Vercel Deployment](#-github--vercel-deployment)
- [🔐 Environment Variables](#-environment-variables)
- [🧪 Automated Test Verification](#-automated-test-verification)
- [🏛️ Institutional Info](#️-institutional-info)

---

## ✨ Key Features

### 🏛️ 1. Principal & Administrative Operations
- **Institutional Treasury Management**: Live tracking of the State Bank of India institutional treasury account (`₹85,50,000+` balance) with dynamic NPCI UPI QR code generation and 1-click IMPS/NEFT disbursals.
- **7th Central Pay Commission (CPC) Payroll**: Automated salary calculation with attendance multiplier, casual leave, absent deductions, and 1-click bulk monthly salary disbursal.
- **All-Inclusive Staff Registry**: Complete 360° dossiers for Teaching Faculty, Central Library, Administration & Registry (Peon/MTS), Transport (Bus Drivers), Central Workshop, Finance/Accounts, and Hostel/Security.
- **Student Admissions & Registry**: Comprehensive admission desk with roll number assignment, branch transfers, documents, and real-time student lifecycle tracking.
- **Dynamic Content Management (CMS)**: Manage public notices, fee structures, faculty rosters, syllabus, tenders, and photo galleries without writing code.

### 👨‍🏫 2. Faculty & Staff Portal
- **50-Meter Campus Geo-Fenced Attendance**: HTML5 Geolocation with real-time distance calculation to the campus center (`25.8692° N, 84.2255° E`) with anti-spoofing and biometric photo verification.
- **Strict Attendance Privacy Isolation**: Confidential 1-to-31 date attendance calendar matrix showing exclusively the logged-in staff member's presence, leaves, and accrued salary.
- **Printable BTEUP Payslips**: Official Government salary slips with BTEUP institutional seal, Level 10/11/12 breakdown, DA, HRA, TA, PF deductions, and Principal signature.
- **Classroom Mark Entry & Student Attendance**: Single-click student attendance marking and semester examination marksheet submissions.

### 🎓 3. Student Self-Service Hub
- **Student Privacy & Object-Level Protection**: Strict isolation ensuring students can only view their own records, attendance meter, and academic scores.
- **Digital Fee Counter & Printable Receipts**: Online fee payment simulations, partial fee tracking, and instant PDF-ready Government receipts with unique receipt numbers.
- **Official BTEUP Marksheets**: Semester grade cards with theory/practical marks, total aggregate, division, and BTEUP Lucknow verification seals.
- **Grievance & Online Applications**: Submit applications (Character Certificate, Bonafide, Leave) with real-time staff resolution status.

### 🤖 4. Real-Time Sync & 24/7 AI Campus Assistant
- **Zero-Delay Cross-Tab Real-Time Sync**: Instant synchronization across all tabs and devices via HTML5 `BroadcastChannel` for notices, attendance punches, and payments.
- **Antigravity AI Campus Assistant**: Multilingual (Hindi/English) conversational assistant guiding new admissions, syllabus lookup, fee schedules, and campus navigation.

---

## 🏗️ System Architecture & Structure

```
college-management-system/
├── .gitignore              # Master root gitignore (strictly protects .env, db.sqlite3, node_modules)
├── vercel.json             # Unified root Vercel build & route rules (monorepo support)
├── README.md               # Project documentation
├── DEPLOYMENT.md           # Step-by-step GitHub & Vercel deployment guide
│
├── backend/                # Django 5.x REST Framework Backend
│   ├── api/
│   │   └── index.py        # Vercel Python Serverless function entrypoint
│   ├── config/             # Django settings, URLs, WSGI, OpenAPI
│   │   ├── settings.py     # Production settings (WhiteNoise, Cloud PostgreSQL, CORS)
│   │   ├── urls.py         # REST API root router
│   │   └── wsgi.py         # WSGI application export (app = application)
│   ├── accounts/           # Custom User model (Admin, Teacher, Student), JWT Auth
│   ├── students/           # Student admissions, profile management, serializer ViewSets
│   ├── teachers/           # Faculty & staff dossier, designations, qualifications
│   ├── courses/            # Diploma engineering branches & semester courses
│   ├── attendance/         # Geo-fenced attendance sessions & matrix registers
│   ├── fees/               # Treasury ledger, student fee records & receipt generators
│   ├── examinations/       # Examination schedules & official BTEUP marksheets
│   ├── timetable/          # Weekly branch timetable schedules
│   ├── notices/            # Administrative circulars & student notice boards
│   ├── dashboard/          # Aggregated live metrics & charts analytics
│   ├── core/               # College settings & database seeding commands
│   ├── website/            # Public CMS endpoints (About, Gallery, Facilities, Links)
│   ├── .env.example        # Template for backend environment variables
│   ├── .gitignore          # Backend-specific exclusions
│   ├── vercel.json         # Standalone backend Vercel configuration
│   ├── requirements.txt    # Production dependencies (whitenoise, dj-database-url, gunicorn)
│   └── test_system.py      # Automated 6-suite verification test script
│
└── frontend/               # React 18 + TypeScript + Tailwind CSS Frontend
    ├── public/             # Static assets & college emblems
    ├── src/
    │   ├── components/     # UI components (dashboard, attendance, fees, payroll, modals)
    │   ├── context/        # AuthContext & CollegeDataContext (Real-time BroadcastChannel)
    │   ├── services/       # Centralized Axios API service layer (apiClient)
    │   ├── types/          # Strict TypeScript interfaces
    │   ├── utils/          # Indian Currency (₹) formatters, IFSC lookups, CSV exports
    │   ├── App.tsx         # Main application routes & portal view orchestrator
    │   └── main.tsx        # React DOM entrypoint
    ├── .env.example        # Template for frontend environment variables
    ├── .gitignore          # Frontend-specific exclusions
    ├── vercel.json         # SPA client-side route rewrites
    ├── package.json        # Node dependencies & build script
    └── vite.config.ts      # Vite bundler configuration
```

---

## 🔑 Demo Login Credentials

| Portal Role | Username / Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin (Principal)** | `admin@polytechnic.edu` | `admin123` | Full institutional control, Treasury, Payroll, Staff & Student registers |
| 👨‍🏫 **Faculty (Teacher)** | `alok.rai@gpbansdeeh.ac.in` | `teacher123` | Geo-attendance, Mark entry, Timetable, Private confidential payslip |
| 🎓 **Student** | `rahul.cse22@gpbansdeeh.ac.in` | `student123` | Attendance meter, Fee receipts, BTEUP marksheets, Applications |
| 🎓 **Student (Alt)** | `E224412355001` (Enrollment No) | `2004-05-14` (DOB) | Direct roll number and DOB login |

---

## 💻 Local Development Quickstart

### Prerequisites
- **Python**: 3.10+ installed
- **Node.js**: 18+ and `npm` installed
- **Git**: Installed

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment (optional)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# (Optional) Seed realistic Polytechnic dataset
python manage.py seed_data

# Start Django development server
python manage.py runserver 127.0.0.1:8000
```

- **Backend API**: `http://127.0.0.1:8000/api/`
- **Swagger Documentation**: `http://127.0.0.1:8000/api/docs/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`

### 2. Frontend Setup

```bash
# Open a new terminal in the frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```

- **Frontend Portal**: `http://localhost:3000/`

---

## 🚀 GitHub & Vercel Deployment

### Step 1: Push to GitHub

```bash
# In the root directory (F:\college-management-system):
git init
git add .
git commit -m "feat: production-ready college management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/college-management-system.git
git push -u origin main
```

*(All `.env` files, local SQLite databases, `node_modules`, and cache are safely excluded by `.gitignore`)*

---

### Step 2: Deploy Backend on Vercel

1. In [Vercel Dashboard](https://vercel.com/dashboard) -> Click **Add New...** -> **Project**.
2. Select your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Framework Preset**: `Other`
4. Add **Environment Variables**:
   - `SECRET_KEY`: `your-random-50-character-secret-key`
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `*`
   - `DATABASE_URL`: `postgres://user:pass@host/dbname?sslmode=require` *(from [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com))*
   - `USE_SQLITE`: `False`
   - `CORS_ALLOW_ALL_ORIGINS`: `True`
5. Click **Deploy**. Note your backend URL (e.g. `https://gpb-backend.vercel.app`).

---

### Step 3: Deploy Frontend on Vercel

1. In Vercel Dashboard -> Click **Add New...** -> **Project**.
2. Select the same GitHub repository.
3. Configure settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_BASE_URL`: `https://gpb-backend.vercel.app/api`
5. Click **Deploy**. Your college portal is now live! 🎉

> For detailed deployment options, see [**`DEPLOYMENT.md`**](DEPLOYMENT.md).

---

## 🔐 Environment Variables

### Backend Variables (`backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `SECRET_KEY` | Django Cryptographic Secret Key | `django-insecure-production-key-2026` |
| `DEBUG` | Enable/Disable Debug Mode | `False` (Production) / `True` (Local) |
| `ALLOWED_HOSTS` | Allowed Domain Hostnames | `localhost,127.0.0.1,.vercel.app` |
| `DATABASE_URL` | Cloud PostgreSQL Connection URI | `postgres://user:pass@ep-xyz.neon.tech/gpb_db?sslmode=require` |
| `USE_SQLITE` | Use SQLite instead of PostgreSQL | `False` (Production) / `True` (Local) |
| `CORS_ALLOW_ALL_ORIGINS` | Allow cross-origin requests | `True` |

### Frontend Variables (`frontend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend REST API Root URL | `https://gpb-backend.vercel.app/api` |

---

## 🧪 Automated Test Verification

Run the full end-to-end verification suite locally before committing:

```bash
# Run backend 6-suite verification
cd backend
python test_system.py

# Test Django system & static assets
python manage.py check
python manage.py collectstatic --noinput

# Run frontend build
cd ../frontend
npm run build
```

**Verification Results**:
- ✅ Backend End-to-End Suite: **6/6 Tests Passed (100%)**
- ✅ Django System Check: **0 Issues**
- ✅ Frontend Production Build: **2,407 Modules Compiled, 0 Errors**

---

## 🏛️ Institutional Info

- **Institution**: Government Polytechnic Bansdeeh, Ballia (राजकीय पॉलिटेक्निक बांसडीह, बलिया)
- **Affiliation**: Board of Technical Education, Uttar Pradesh (BTEUP Lucknow)
- **BTEUP Institution Code**: `4412`
- **Approval**: All India Council for Technical Education (AICTE), New Delhi
- **Location**: Bansdeeh, Ballia, Uttar Pradesh - 277202
- **Website**: `https://gpbansdeeh.up.gov.in`

---

Developed with ❤️ for Government Polytechnic Bansdeeh, Ballia.
