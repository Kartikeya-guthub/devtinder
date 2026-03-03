<div align="center">

# 💘 DevTinder

> **Tinder, but for Developers.** — Swipe, connect, and build together.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 🌍 Live

| | URL |
|--|-----|
| 🌐 **Frontend** | [https://devtinder-henna.vercel.app](https://devtinder-henna.vercel.app) |
| ⚙️ **Backend API** | [https://devetinder.onrender.com](https://devetinder.onrender.com) |
| 📖 **Swagger UI** | [https://devetinder.onrender.com/api-docs](https://devetinder.onrender.com/api-docs) |
| 🩺 **Health Check** | [https://devetinder.onrender.com/health](https://devetinder.onrender.com/health) |

> **Hosting:** Frontend → [Vercel](https://vercel.com) · Backend → [Render](https://render.com) · Database → [MongoDB Atlas](https://www.mongodb.com/atlas)
>
> ⚠️ Render free tier spins down after 15 min of inactivity. First request may take ~30s. UptimeRobot pings `/health` every 5 min to keep it warm.

---

## 🚀 What is DevTinder?

DevTinder is a full-stack developer networking platform. Developers can discover each other, send connection requests, accept/reject them, and manage their profiles — like Tinder, but for finding your next co-founder, collaborator, or open-source buddy.

---

## ✨ Features

| # | Feature | Details |
|---|---------|---------|
| 1 | 🔐 **Auth** | Signup, Login, Logout — JWT Bearer token, stored in `localStorage` |
| 2 | 👤 **Profile** | View & edit profile, change password |
| 3 | 💌 **Connection Requests** | Send `Interested`/`Ignore`, respond `Accepted`/`Rejected` |
| 4 | 🌐 **Developer Feed** | Paginated — excludes already-interacted users |
| 5 | 🤝 **Connections** | List all accepted connections |
| 6 | 🛡️ **Security** | Helmet + CORS + Rate Limiting |
| 7 | 📖 **Swagger UI** | Interactive API docs |
| 8 | 🩺 **Health Check** | `/health` endpoint for uptime monitoring |
| 9 | 🧪 **Integration Tests** | Jest + Supertest + Docker MongoDB |
| 10 | ⚙️ **CI/CD** | GitHub Actions — runs tests on every push |

---

## 🏗️ Monorepo Structure

```
devtinder/
├── Devtinder-Backend/          # Node.js + Express REST API
│   ├── src/
│   │   ├── app.js              # Express app (middleware, routes, swagger)
│   │   ├── server.js           # DB connect + app.listen
│   │   ├── config/             # database.js, swagger.js
│   │   ├── middlewares/        # auth.js — JWT Bearer middleware
│   │   ├── models/             # user.js, connectionRequest.js
│   │   ├── router/             # auth.js, profile.js, request.js, user.js
│   │   ├── services/           # user.service.js, request.service.js
│   │   ├── utils/              # validation.js
│   │   └── __tests__/          # app.test.js — integration tests
│   ├── seed.js                 # Seeds 55 mock developer profiles
│   ├── render.yaml             # Render deployment config
│   ├── docker-compose.yml      # Local MongoDB for dev/tests
│   └── .env.example
│
├── Devtinder-Frontend/         # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── App.jsx             # Routes + protected route guard
│   │   ├── pages/              # Auth, Feed, Profile, Connections, Requests
│   │   ├── components/         # Navbar, Card, Button, Input, Toast, Skeleton
│   │   ├── context/            # AuthContext, ToastContext
│   │   └── services/           # api.js — axios instance with Bearer token
│   └── vite.config.js
│
└── vercel.json                 # Vercel deployment config (frontend)
```

---

## 📡 API Reference

> 🔒 = requires `Authorization: Bearer <token>` header

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | — | Register a new account |
| `POST` | `/login` | — | Login — returns `{ token, user }` |
| `POST` | `/logout` | 🔒 | Logout |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/profile/view` | 🔒 | Get own profile |
| `PATCH` | `/profile/edit` | 🔒 | Update profile fields |
| `PATCH` | `/profile/password` | 🔒 | Change password |

### Requests & Feed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/request/send/:status/:toUserId` | 🔒 | `Interested` or `Ignore` |
| `POST` | `/request/respond/:status/:requestId` | 🔒 | `Accepted` or `Rejected` |
| `GET` | `/user/requests/received` | 🔒 | Pending requests sent to you |
| `GET` | `/user/connections` | 🔒 | All accepted connections |
| `GET` | `/feed?page=1&limit=10` | 🔒 | Paginated developer feed |
| `GET` | `/health` | — | Health check (UptimeRobot) |

---

## 🔄 Request Flow

```
Client (Vercel)
    │
    │  Authorization: Bearer <token>
    ▼
helmet() → cors() → rateLimit() → requestId
    │
    ▼
Router (auth / profile / request / user)
    │
    ▼
userAuth middleware — verify JWT → attach req.user
    │
    ▼
Mongoose models (MongoDB Atlas)
    │
    ▼
JSON Response  { data }  |  { requestId, error, status }
```

---

## 🧠 Design Decisions

| Decision | Why |
|----------|-----|
| Bearer token over `httpOnly` cookie | Cross-origin (Vercel → Render) — third-party cookies blocked by modern browsers; Bearer header works everywhere |
| `app.js` separate from `server.js` | Supertest imports app without binding a port or connecting DB |
| Feed `$nin` filter at DB level | No in-memory filtering — MongoDB excludes already-interacted users at query time |
| Compound index on `(fromUserId, toUserId)` | DB-level duplicate request prevention |
| `crypto.randomUUID()` per request | Zero-dependency request tracing — every error is traceable |

---

## 🐳 Local Development

### Prerequisites
- Node.js v18+
- Docker Desktop

### Backend

```bash
cd Devtinder-Backend
cp .env.example .env          # fill in values
docker compose up -d          # start local MongoDB
npm install
npm run dev                   # http://localhost:3000
```

### Frontend

```bash
cd Devtinder-Frontend
npm install
# create .env.local:
# VITE_API_URL=http://localhost:3000
npm run dev                   # http://localhost:5173
```

### Tests

```bash
cd Devtinder-Backend
docker compose up -d
npm test
```

### Seed Data

```bash
cd Devtinder-Backend
node seed.js                  # inserts 55 mock profiles (password: Seed@1234)
```

---

## 🚀 Deployment

### Backend → Render

| Setting | Value |
|---------|-------|
| Root Directory | `Devtinder-Backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| `MONGO_URI` | MongoDB Atlas URI |
| `jwt_secret` | Long random string |
| `CLIENT_URL` | `https://devtinder-henna.vercel.app` |
| `NODE_ENV` | `production` |

### Frontend → Vercel

| Setting | Value |
|---------|-------|
| Root Directory | `/` (repo root) |
| `VITE_API_URL` | `https://devetinder.onrender.com` |

> `vercel.json` at the repo root is auto-detected — no extra config needed.

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router, Axios |
| **Backend** | Node.js, Express 5, Mongoose 9 |
| **Database** | MongoDB Atlas |
| **Auth** | JWT (Bearer token) + bcrypt |
| **Security** | Helmet, CORS, express-rate-limit |
| **Docs** | Swagger UI (OpenAPI 3.0) |
| **Testing** | Jest, Supertest, Docker MongoDB |
| **CI/CD** | GitHub Actions |
| **Hosting** | Vercel (frontend) + Render (backend) |

---

## 👨‍💻 Author

**Kartikeya Sharma**

[![GitHub](https://img.shields.io/badge/GitHub-Kartikeya--guthub-181717?style=flat-square&logo=github)](https://github.com/Kartikeya-guthub)

---

<div align="center">

*Found this useful? Drop a ⭐ on the repo!*

</div>
