# Smart To-Do List Manager

A full-stack web application for managing personal tasks. Users sign in with their name and email, then create, edit, delete, and complete tasks — with all data persisted in MongoDB.

## Features

- Login with name and email (JWT-based sessions)
- Personal dashboard with task management
- Add, edit, delete, and complete tasks
- Automatic creation and completion timestamps
- Separate pending and completed task sections
- Responsive UI built with Tailwind CSS
- RESTful API with validation and error handling

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Tailwind CSS, React Router, Axios, Vite |
| Backend | Node.js, Express.js (MVC architecture) |
| Database | MongoDB, Mongoose |
| Auth | JWT + Local Storage |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

## Getting Started

### 1. Clone and install dependencies

```bash
cd "To Do List Project"
npm run install:all
```

Or install manually:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Copy the server environment example file:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your machine. If using a local install:

```bash
mongod
```

Or use MongoDB Atlas and set `MONGODB_URI` to your Atlas connection string.

### 4. Run the application

From the project root:

```bash
npm run dev
```

This starts both the API server and the React client concurrently.

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

To run them separately:

```bash
npm run dev:server   # API only
npm run dev:client   # Frontend only
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Login with `{ name, email }` |
| GET | `/api/tasks` | Yes | Get pending and completed tasks |
| POST | `/api/tasks` | Yes | Create a new task |
| PUT | `/api/tasks/:id` | Yes | Update a pending task |
| PUT | `/api/tasks/:id/complete` | Yes | Mark task as completed |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |

Protected routes require a `Bearer` token in the `Authorization` header.

## Project Structure

```text
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Login, Dashboard
│   │   ├── services/       # Axios API client
│   │   └── utils/          # Auth helpers, date formatting
│   └── package.json
├── server/                 # Express backend (MVC)
│   ├── config/             # Database connection
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── package.json
├── README.md
├── plan.md
└── ROADMAP.md
```

## Usage

1. Open http://localhost:5173
2. Enter your name and email on the login page
3. Use the dashboard to add tasks with a title and optional description
4. Edit, complete, or delete pending tasks
5. View completed tasks with their completion timestamps in the right panel

## Production Build

Build the frontend:

```bash
cd client && npm run build
```

The output is in `client/dist/`. Serve it with any static file host and deploy the Express server separately, updating `CLIENT_URL` and `MONGODB_URI` for production.
