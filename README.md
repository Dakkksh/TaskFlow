# TaskFlow — Task Management System

A full-stack Task Management System built with **Node.js + TypeScript** (backend) and **Next.js + TypeScript** (frontend).

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | SQLite (easily swappable to PostgreSQL) |
| Auth | JWT (Access + Refresh Tokens), bcrypt |
| Frontend | Next.js 14 (App Router), TypeScript |
| Forms | React Hook Form |
| HTTP Client | Axios (with auto token refresh interceptor) |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
task-management/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # DB schema (User, Task, RefreshToken)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── task.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── task.routes.ts
│   │   ├── lib/
│   │   │   ├── prisma.ts       # Prisma client singleton
│   │   │   └── jwt.ts          # JWT utilities
│   │   └── index.ts            # Express app entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx         # Redirects to /login or /dashboard
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── dashboard/
    │   ├── components/
    │   │   ├── TaskCard.tsx
    │   │   ├── TaskModal.tsx
    │   │   └── FilterBar.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── hooks/
    │   │   └── useTasks.ts
    │   ├── lib/
    │   │   └── api.ts           # Axios with refresh interceptor
    │   └── types/
    │       └── index.ts
    ├── .env.local.example
    ├── package.json
    └── tsconfig.json
```

---

## ⚙️ Setup & Running

### 1. Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# (Edit .env if needed — defaults work for local dev)

# Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev --name init

# Start dev server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local

# Start dev server (runs on http://localhost:3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 API Endpoints

### Auth (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, get tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate refresh token |

### Tasks (`/tasks`) — all require `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks (pagination, filter, search) |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get single task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/toggle` | Cycle status: PENDING → IN_PROGRESS → COMPLETED |

#### Query params for GET `/tasks`:
- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `status` — `PENDING` | `IN_PROGRESS` | `COMPLETED`
- `priority` — `LOW` | `MEDIUM` | `HIGH`
- `search` — searches by title

---

## ✅ Features

- **JWT Authentication** with short-lived access tokens (15m) and long-lived refresh tokens (7d)
- **Automatic token refresh** via Axios interceptor — seamless UX
- **Token rotation** on refresh for security
- **Password hashing** with bcrypt (12 rounds)
- **Full CRUD** for tasks with ownership validation
- **Pagination** with `hasNext` / `hasPrev` metadata
- **Filtering** by status and priority
- **Search** by title
- **Responsive UI** works on mobile and desktop
- **Toast notifications** for all actions
- **Form validation** on both client and server

---

## 🗄️ Database Schema

```prisma
User       — id, email, name, passwordHash, createdAt, updatedAt
Task       — id, title, description, status, priority, dueDate, userId, createdAt, updatedAt
RefreshToken — id, token, userId, expiresAt, createdAt
```

---

## 🔒 Security Notes

- Change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in production
- Use PostgreSQL instead of SQLite for production
- Add rate limiting (e.g., `express-rate-limit`) for auth endpoints in production
- Use HTTPS in production
