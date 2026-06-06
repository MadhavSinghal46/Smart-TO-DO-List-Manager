# Smart To-Do List Manager - Complete Development Roadmap

## Project Overview

### Project Name
**Smart To-Do List Manager**

### Objective
Develop a full-stack web application where users can:

- Login using Name and Email
- Access a personal dashboard
- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Automatically store completion date and time
- View pending and completed tasks separately
- Persist data in a database

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- Local Storage

---

## Core Features

1. Login with Name and Email
2. Dashboard with task management
3. Add/Edit/Delete Tasks
4. Mark Tasks as Completed
5. Save Completion Date and Time
6. Separate Pending and Completed Tasks
7. Responsive UI
8. MongoDB Data Persistence

---

## Database Schema

### User

```json
{
  "_id": "ObjectId",
  "name": "Madhav",
  "email": "madhav@gmail.com",
  "createdAt": "2026-06-06T10:00:00Z"
}
```

### Task

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "Learn React",
  "description": "Complete basics",
  "status": "Pending",
  "createdAt": "2026-06-06T10:00:00Z",
  "completedAt": null
}
```

---

## API Endpoints

### Login

```http
POST /api/auth/login
```

### Create Task

```http
POST /api/tasks
```

### Get Tasks

```http
GET /api/tasks
```

### Update Task

```http
PUT /api/tasks/:id
```

### Complete Task

```http
PUT /api/tasks/:id/complete
```

### Delete Task

```http
DELETE /api/tasks/:id
```

---

## Folder Structure

```text
todo-app/
├── client/
├── server/
├── README.md
└── package.json
```

---

## Final AI Instructions

Build a production-ready full-stack To-Do List application using React, Tailwind CSS, Node.js, Express.js, MongoDB, JWT authentication, and MVC architecture.

Mandatory Features:

1. Login using Name and Email.
2. Store users in MongoDB.
3. Create JWT-based sessions.
4. Add, edit, delete, and complete tasks.
5. Save task creation timestamp.
6. Save task completion timestamp.
7. Show pending and completed tasks separately.
8. Create responsive UI using Tailwind CSS.
9. Implement REST APIs.
10. Implement protected routes.
11. Follow MVC architecture.
12. Add validation and error handling.
13. Provide complete frontend and backend implementation.
14. Include setup instructions in README.md.
15. Use modern coding standards and best practices.
