# Smart To-Do List Manager — Implementation Plan

This document translates the requirements in [ROADMAP.md](./ROADMAP.md) into a phased, actionable build plan for a production-ready full-stack application.

---

## 1. Project Summary

| Item | Detail |
|------|--------|
| **Name** | Smart To-Do List Manager |
| **Type** | Full-stack web application |
| **Auth model** | Name + Email login (no password); JWT stored in local storage |
| **Core value** | Personal task dashboard with CRUD, completion tracking, and persistent storage |

### Success Criteria

- Users can log in with name and email and receive a JWT session.
- Authenticated users can create, edit, delete, and complete tasks.
- Tasks record `createdAt` on creation and `completedAt` when marked complete.
- Dashboard shows **Pending** and **Completed** tasks in separate sections.
- All data persists in MongoDB.
- UI is responsive and built with Tailwind CSS.
- Backend follows MVC; APIs are RESTful with validation and error handling.
- README includes complete setup instructions.

---

## 2. Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     React Client (client/)                   │
│  Login → JWT in localStorage → Axios (Bearer header)        │
│  Protected routes → Dashboard (Pending / Completed tasks)   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (REST)
┌──────────────────────────▼──────────────────────────────────┐
│                  Express Server (server/)                    │
│  Routes → Controllers → Models (Mongoose) → MongoDB           │
│  JWT middleware on protected task routes                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                        MongoDB                               │
│  Collections: users, tasks                                    │
└─────────────────────────────────────────────────────────────┘
```

### Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo layout | `client/` + `server/` + root `package.json` | Matches ROADMAP folder structure |
| Auth | JWT (no password) | Specified in roadmap; find-or-create user by email |
| Task status | `"Pending"` / `"Completed"` string field | Matches schema; `completedAt` set on complete |
| API style | REST with JSON | Standard, easy to consume from Axios |
| State on client | React state + localStorage for token/user | Simple; no Redux required for scope |

---

## 3. Repository Structure

```text
todo-app/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI (TaskCard, TaskForm, Navbar, etc.)
│   │   ├── pages/            # Login, Dashboard
│   │   ├── context/          # AuthContext (optional) or hooks
│   │   ├── services/         # api.js — Axios instance + API helpers
│   │   ├── utils/            # token helpers, date formatting
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css         # Tailwind directives
│   ├── package.json
│   ├── vite.config.js        # or CRA — Vite recommended
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js # Verify JWT, attach userId
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   └── server.js             # Entry point
├── README.md
├── plan.md
├── ROADMAP.md
└── package.json              # Optional root scripts (concurrently)
```

---

## 4. Database Schema (Mongoose)

### User Model

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercase |
| `createdAt` | Date | Default: `Date.now` |

**Indexes:** `email` (unique)

### Task Model

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Ref: `User`, required, indexed |
| `title` | String | Required, trimmed, max length |
| `description` | String | Optional |
| `status` | String | Enum: `Pending`, `Completed`; default `Pending` |
| `createdAt` | Date | Set on create |
| `completedAt` | Date | `null` until completed |

**Indexes:** `userId`, compound `{ userId, status }` for filtered queries

---

## 5. API Specification

Base URL: `http://localhost:5000/api` (configurable via env)

### Auth

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/auth/login` | No | `{ name, email }` | `{ token, user: { id, name, email } }` |

**Behavior:** Validate name/email → find user by email or create new user → return JWT.

### Tasks (all protected)

| Method | Endpoint | Body / Params | Response |
|--------|----------|---------------|----------|
| GET | `/tasks` | — | `{ pending: Task[], completed: Task[] }` or flat list grouped client-side |
| POST | `/tasks` | `{ title, description? }` | Created task |
| PUT | `/tasks/:id` | `{ title?, description? }` | Updated task |
| PUT | `/tasks/:id/complete` | — | Task with `status: Completed`, `completedAt` set |
| DELETE | `/tasks/:id` | — | Success message |

### Error Response Shape (consistent)

```json
{
  "success": false,
  "message": "Human-readable error",
  "errors": []
}
```

### HTTP Status Codes

- `200` — Success (GET, PUT, DELETE)
- `201` — Created (POST task, new user on first login)
- `400` — Validation error
- `401` — Missing/invalid JWT
- `404` — Task not found or not owned by user
- `500` — Server error

---

## 6. Authentication Flow

1. User submits **name** and **email** on Login page.
2. `POST /api/auth/login` validates input.
3. Server finds user by email; if none, creates user with name + email.
4. Server signs JWT payload: `{ userId, email }` with secret + expiry (e.g. 7d).
5. Client stores `token` and `user` in `localStorage`.
6. Axios interceptor attaches `Authorization: Bearer <token>` on every request.
7. Protected React routes redirect to `/login` if no token.
8. On `401` response, clear storage and redirect to login.

---

## 7. Frontend Plan

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Form: name, email; public |
| Dashboard | `/` or `/dashboard` | Protected; task management hub |

### Dashboard Features

- Header: welcome message (user name), logout button.
- **Add task** form: title (required), description (optional).
- **Pending tasks** section: list with Edit, Delete, Complete actions.
- **Completed tasks** section: list with title, description, completion timestamp; optional un-complete or delete only (roadmap specifies complete — delete/edit on completed tasks is a nice-to-have).
- Empty states for both sections.
- Loading and error states for API calls.
- Responsive layout: single column on mobile, wider cards on desktop.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `LoginForm` | Validation, submit to auth API |
| `ProtectedRoute` | Guard routes using token |
| `TaskForm` | Add / edit task modal or inline form |
| `TaskList` | Renders tasks for a given status |
| `TaskCard` | Single task with actions |
| `Navbar` | Branding, user info, logout |

### Styling (Tailwind)

- Consistent spacing, rounded cards, subtle shadows.
- Color distinction: pending (neutral/blue), completed (green/muted).
- Focus states and accessible form labels.
- Mobile-first breakpoints (`sm`, `md`, `lg`).

---

## 8. Backend Plan (MVC)

### Layer Responsibilities

| Layer | Role |
|-------|------|
| **Routes** | Map HTTP paths to controller methods; apply `authMiddleware` on task routes |
| **Controllers** | Request validation, call models, format JSON responses |
| **Models** | Mongoose schemas and hooks |
| **Middleware** | JWT verification, centralized error handler |
| **Config** | DB connection, env variables |

### Controller Logic Highlights

**authController.login**

- Validate `name` (non-empty) and `email` (valid format).
- `User.findOne({ email })` or `User.create({ name, email })`.
- Return token + user sans password.

**taskController**

- All queries scoped by `req.user.userId` from JWT.
- **create:** set `status: Pending`, `createdAt: now`, `completedAt: null`.
- **complete:** set `status: Completed`, `completedAt: new Date()`; reject if already completed.
- **update:** only allow edits on user's own tasks; typically pending only.
- **delete:** verify ownership before delete.

### Environment Variables (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

---

## 9. Implementation Phases

### Phase 1 — Project Scaffolding

- [ ] Initialize root `package.json` with scripts to run client + server (`concurrently`).
- [ ] Scaffold **server**: Express, Mongoose, dotenv, cors, jsonwebtoken, express-validator.
- [ ] Scaffold **client**: React (Vite), Tailwind CSS, React Router, Axios.
- [ ] Add `.env.example` files; document env vars in README.
- [ ] Configure CORS for client origin.

**Deliverable:** Both apps start locally; server connects to MongoDB.

---

### Phase 2 — Backend Core

- [ ] Implement `User` and `Task` Mongoose models.
- [ ] Implement `generateToken` utility and `authMiddleware`.
- [ ] Implement `authController` + `POST /api/auth/login`.
- [ ] Implement `taskController` + all task routes.
- [ ] Add `express-validator` rules on auth and task bodies.
- [ ] Add global `errorMiddleware` for consistent errors.
- [ ] Manual API testing (Postman, Thunder Client, or curl).

**Deliverable:** All ROADMAP endpoints working with JWT protection.

---

### Phase 3 — Frontend Core

- [ ] Create Axios `api` service with base URL and auth interceptor.
- [ ] Implement auth helpers (get/set/clear token in localStorage).
- [ ] Build Login page with form validation and error display.
- [ ] Implement `ProtectedRoute` and React Router setup.
- [ ] Build Dashboard: fetch tasks, split pending/completed.
- [ ] Wire Add, Edit, Delete, Complete actions to API.
- [ ] Implement logout (clear storage, redirect).

**Deliverable:** End-to-end user flow from login to full task CRUD.

---

### Phase 4 — UI Polish & UX

- [ ] Responsive Tailwind layout for all breakpoints.
- [ ] Loading spinners/skeletons during API calls.
- [ ] Toast or inline messages for success/error feedback.
- [ ] Format `createdAt` and `completedAt` for display (e.g. `Jun 6, 2026, 10:00 AM`).
- [ ] Confirm dialog before delete.
- [ ] Empty states and basic accessibility (labels, keyboard focus).

**Deliverable:** Production-quality, responsive UI.

---

### Phase 5 — Documentation & Hardening

- [ ] Write **README.md**: prerequisites, MongoDB setup, install steps, run commands, env setup, API summary.
- [ ] Add input sanitization / length limits on server.
- [ ] Ensure tasks cannot be accessed across users (ownership checks).
- [ ] Handle edge cases: invalid task ID, expired JWT, network errors on client.
- [ ] Optional: `npm run build` for client; serve static in production notes.

**Deliverable:** Project ready for demo/deployment with clear setup docs.

---

## 10. Validation Rules

### Login

| Field | Rules |
|-------|-------|
| `name` | Required, 2–50 chars, trimmed |
| `email` | Required, valid email format, normalized lowercase |

### Task

| Field | Rules |
|-------|-------|
| `title` | Required, 1–200 chars, trimmed |
| `description` | Optional, max 1000 chars |

---

## 11. Security Checklist

- [ ] JWT secret stored in environment variable only.
- [ ] Never log or expose JWT secret.
- [ ] CORS restricted to `CLIENT_URL` in production.
- [ ] All task routes require valid JWT.
- [ ] Task queries always filter by authenticated `userId`.
- [ ] Validate MongoDB ObjectId format on `:id` params.
- [ ] Rate limiting (optional enhancement for production).

---

## 12. README Outline (to write in Phase 5)

1. Project title and description
2. Features list
3. Tech stack
4. Prerequisites (Node.js, MongoDB)
5. Clone and install (`client` + `server`)
6. Environment configuration
7. Start MongoDB
8. Run development (`npm run dev` or separate terminals)
9. Default URLs (client port, API port)
10. API endpoint reference (brief table)
11. Folder structure
12. License / author (optional)

---

## 13. Optional Future Enhancements (Out of Scope for MVP)

- Password-based auth or OAuth (Google/GitHub).
- Task categories, priorities, or due dates.
- Search and filter tasks.
- Mark completed task as pending again (reopen).
- Dark mode toggle.
- Unit/integration tests (Jest, Supertest, React Testing Library).
- Docker Compose for MongoDB + app.
- Deployment guides (Vercel + Render/Railway).

---

## 14. Estimated Build Order (Quick Reference)

```text
1. Server scaffold + DB connection
2. User model + login API + JWT
3. Task model + CRUD APIs + auth middleware
4. Client scaffold + Tailwind + Router
5. Login page + token storage
6. Dashboard + task lists + API integration
7. Polish UI + error handling
8. README + final testing
```

---

## 15. Definition of Done

The project is complete when all **15 mandatory items** from ROADMAP.md are satisfied:

1. Login using Name and Email
2. Users stored in MongoDB
3. JWT-based sessions
4. Add, edit, delete, and complete tasks
5. Task creation timestamp saved
6. Task completion timestamp saved
7. Pending and completed tasks shown separately
8. Responsive Tailwind UI
9. REST APIs implemented
10. Protected routes (API + frontend)
11. MVC architecture on backend
12. Validation and error handling
13. Complete frontend and backend code
14. Setup instructions in README.md
15. Modern coding standards and best practices

---

*Generated from [ROADMAP.md](./ROADMAP.md) — use this plan as the step-by-step guide for implementation.*
