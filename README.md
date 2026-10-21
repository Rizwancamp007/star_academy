# Star Educational Academy — Full-Stack LMS

A complete **MERN-stack learning management system** for a coaching academy — public
website plus role-based dashboards for students, teachers, clerks, and admins.
Built by [Rizwan Khan](https://rizwankhan.tech).

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19 · Vite · Tailwind CSS 4 · React Router 7 · Zustand · Framer Motion |
| Backend | Node.js · Express 5 · MongoDB (Mongoose) · JWT auth (httpOnly cookies) |
| Extras | Google Gemini API (AI test generation) · Mammoth / pdf-parse (DOCX/PDF MCQ import) · Multer (uploads) · Helmet + rate limiting |

## Features

- **Public site** — home, about, faculty, lectures, contact, success stories, WhatsApp chat button
- **Admin dashboard** — manage students, faculty, fees/challans, announcements, hero media, success stories, staff accounts, site settings, full audit log
- **Teacher dashboard** — create/grade tests, MCQ bank, auto-generate tests from PDF/Word via Gemini AI, upload lectures
- **Student dashboard** — attempt tests with instant results, view lectures, download fee challans, analytics
- **Clerk dashboard** — fee records, challans, student records, success stories

## Project structure

```
star_academy/
├── client/            # React + Vite frontend (proxies /api → localhost:5000)
│   └── src/
│       ├── pages/     # public/, auth/, admin/, teacher/, clerk/, student/
│       ├── services/  # API clients per domain
│       └── store/     # Zustand auth store
└── server/            # Express REST API
    ├── models/        # Mongoose models (User, Test, MCQ, Lecture, ...)
    ├── routes/       # /api/auth, /api/tests, /api/admin, ...
    ├── controllers/
    ├── middleware/    # JWT auth, audit logger
    └── utils/seed.js  # database reset + demo admin seed
```

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in your values
npm run dev            # or: npm start
```

API runs on **http://localhost:5000** · health check: `GET /api/health`

### 2. Seed the demo admin

```bash
cd server
npm run seed
```

This resets the database and creates one admin account:

| Field | Value |
|---|---|
| Email | `admin@star.com` |
| Password | `StarDemo@1234` (demo only — change before any real use) |

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App runs on **http://localhost:5173** (proxies `/api` to the backend).

## Environment variables

See `server/.env.example` for the full list:

| Variable | Purpose |
|---|---|
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | Frontend origin for CORS (default `http://localhost:5173`) |
| `JWT_SECRET` | Secret for signing auth tokens — use a long random value |
| `JWT_EXPIRE` | Token lifetime (e.g. `7d`) |
| `GEMINI_API_KEY` | Google Gemini key for AI test generation |
| `NODE_ENV` | `development` / `production` |

> ⚠️ Never commit a real `.env` — `.gitignore` already blocks `.env*`.

## API routes (prefix `/api`)

| Route | Area |
|---|---|
| `/auth` | login/register, profile |
| `/lectures` | lecture library |
| `/tests` · `/attempts` | tests, attempts, results |
| `/admin` | students, fees, announcements, settings, audit logs |
| `/faculty` · `/hero-slides` · `/success-stories` | public content |
| `/settings` · `/messages` · `/milestones` | site content + inbox |

