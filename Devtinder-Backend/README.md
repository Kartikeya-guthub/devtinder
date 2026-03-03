<div align="center">

# 💘 DevTinder Backend

> **Tinder, but for Developers.** — Swipe, connect, and build together.

[![CI](https://github.com/Kartikeya-guthub/devtinder-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/Kartikeya-guthub/devtinder-backend/actions/workflows/ci.yml)
![Tests](https://img.shields.io/badge/tests-4%20passing-brightgreen?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

</div>

---

## 🚀 What is DevTinder?

DevTinder is a **production-grade REST API** for a developer networking platform. Developers can discover each other, send connection requests, accept/reject them, and manage their profiles — like Tinder, but for finding your next co-founder, collaborator, or open-source buddy.

**Built to showcase:** authentication, domain modeling, pagination, security hardening, API documentation, integration testing, and CI/CD — all in one clean Node.js project.

---

## 🎯 Why This Project?

Most backend tutorials stop at CRUD. This project goes further:

- **Secure auth from scratch** — JWT in `httpOnly` cookies, bcrypt hashing, no third-party auth service
- **Real-world domain modeling** — a `ConnectionRequest` state machine with guards, not just a join table
- **Feed algorithm** — excludes already-interacted users at the query level using MongoDB `$nin`, not in-memory filtering
- **Production security habits** — Helmet headers, CORS policy, rate limiting wired in from day one
- **Testable architecture** — `app.js` exports only the Express app; `server.js` owns DB + listen, so Supertest can import cleanly
- **CI that actually runs** — GitHub Actions spins a real `mongo:7` container and runs integration tests on every push

> 👉 The goal: a codebase a recruiter can read in 10 minutes and understand every decision.

---

## ✨ Feature Overview

| # | Feature | Details |
|---|---------|---------|
| 1 | 🔐 **Auth** | Signup, Login, Logout — JWT returned in response body, sent as `Authorization: Bearer` header |
| 2 | 👤 **Profile** | View, edit fields, change password |
| 3 | 💌 **Connection Requests** | Send `Interested`/`Ignore`, respond `Accepted`/`Rejected` |
| 4 | 🌐 **Developer Feed** | Paginated — excludes users already interacted with |
| 5 | 🤝 **Connections** | List all accepted connections |
| 6 | 📊 **Error Envelope** | Every error includes `requestId`, `error`, `status` |
| 7 | 🛡️ **Security** | Helmet + CORS + Rate Limiting |
| 8 | 📖 **Swagger UI** | Interactive API docs at `/api-docs` |
| 9 | � **Health Check** | `GET /health` — used by UptimeRobot to keep Render free tier warm |
| 10 | 🧪 **Integration Tests** | 4 tests with Jest + Supertest + Docker MongoDB |
| 11 | ⚙️ **CI/CD** | GitHub Actions — runs tests on every push |

---

## 🏗️ Project Structure

```
Devtinder-Backend/
├── src/
│   ├── app.js                  # Express app (security, middleware, routes, swagger)
│   ├── server.js               # DB connect + app.listen (entry point)
│   ├── config/
│   │   ├── database.js         # Mongoose connection
│   │   └── swagger.js          # Full OpenAPI 3.0 spec
│   ├── middlewares/
│   │   └── auth.js             # JWT Bearer token auth middleware |
│   ├── models/
│   │   ├── user.js             # User schema, getJWT(), validatePassword()
│   │   └── connectionRequest.js# ConnectionRequest schema + pre-save guard
│   ├── router/
│   │   ├── auth.js             # POST /signup /login /logout
│   │   ├── profile.js          # GET+PATCH /profile/*
│   │   ├── request.js          # POST /request/send /request/respond
│   │   └── user.js             # GET /user/requests/received /connections /feed
│   ├── utils/
│   │   └── validation.js       # validateSignupData, validateEditProfileData
│   └── __tests__/
│       └── app.test.js         # Integration tests (Jest + Supertest)
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── docker-compose.yml          # MongoDB container for local dev + tests
├── .env                        # Environment variables (not committed)
└── package.json
```

---

## 🔄 Request Flow

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                     │
└───────────────────────────┬─────────────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │  helmet()  cors()          │  Security layer
              │  rateLimit()  requestId   │
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │         ROUTER            │  auth / profile
              │   (Express Router)        │  request / user
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │      userAuth MW          │  Verify JWT cookie
              │  (protected routes only)  │  → attach req.user
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │      MODEL LAYER          │  Mongoose schemas
              │   (MongoDB via Mongoose)  │  + domain guards
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │       JSON RESPONSE       │  { data }
              │                           │  { requestId, error, status }
              └───────────────────────────┘
```

---

## 📡 API Reference

> 🔒 = requires Bearer token. Try everything live at **[https://devetinder.onrender.com/api-docs](https://devetinder.onrender.com/api-docs)**

### 🔑 Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | — | Register a new developer account |
| `POST` | `/login` | — | Login — returns JWT token in response body |
| `POST` | `/logout` | 🔒 | Invalidates session |

**`POST /signup` body + response:**
```json
// Request
{
  "firstName": "Kartikeya",
  "lastName": "Sharma",
  "emailId": "kartikeya@example.com",
  "password": "MyStr0ng@Pass",
  "age": 22,
  "gender": "Male",
  "skills": ["JavaScript", "Node.js", "React"],
  "bio": "Full-stack dev who loves open source",
  "photoUrl": "https://example.com/photo.jpg"
}

// Response 200
{ "message": "User registered successfully" }
```

**`POST /login` response:**
```json
// Response 200
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "firstName": "Kartikeya", ... }
}
```
> Store the `token` in `localStorage` and send it as `Authorization: Bearer <token>` on all subsequent requests.

---

### 👤 Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/profile/view` | 🔒 | Get logged-in user's full profile |
| `PATCH` | `/profile/edit` | 🔒 | Update: `firstName` `lastName` `age` `gender` `skills` `photoUrl` `bio` `emailId` |
| `PATCH` | `/profile/password` | 🔒 | Change password (`oldPassword` + `newPassword`) |

---

### 💌 Connection Requests

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/request/send/:status/:toUserId` | 🔒 | `status`: `Interested` or `Ignore` |
| `POST` | `/request/respond/:status/:requestId` | 🔒 | `status`: `Accepted` or `Rejected` |

> **Guards enforced:**
> - Cannot send a request to yourself *(pre-save hook at model level)*
> - Duplicate requests in either direction are blocked
> - Only the **recipient** of an `Interested` request can respond to it

---

### 🌐 User & Feed

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user/requests/received` | 🔒 | All pending `Interested` requests sent to you |
| `GET` | `/user/connections` | 🔒 | All `Accepted` connections |
| `GET` | `/feed?page=1&limit=10` | 🔒 | Paginated feed — excludes you + all already-interacted users (max 50/page) |

**`GET /feed` response:**
```json
{
  "data": [
    {
      "_id": "64abc123def456",
      "firstName": "Jane",
      "lastName": "Doe",
      "skills": ["Python", "FastAPI"],
      "bio": "Backend engineer, open to collabs",
      "photoUrl": "https://example.com/jane.jpg"
    }
  ]
}
```

---

### 👤 User

| Field | Type | Constraints |
|-------|------|-------------|
| `firstName` | String | Required, indexed |
| `lastName` | String | Optional |
| `emailId` | String | Required, unique, lowercase, format-validated |
| `password` | String | bcrypt hashed, strong-password policy enforced |
| `age` | Number | Optional |
| `gender` | String | Enum: `Male` / `Female` / `Other` |
| `skills` | [String] | Max 10, no duplicates |
| `bio` | String | Default: *"Hey there! I'm using DevTinder."* |
| `photoUrl` | String | Default: 👦 |

**Instance methods:** `getJWT()` · `validatePassword(input)`

### 🤝 ConnectionRequest

| Field | Type | Notes |
|-------|------|-------|
| `fromUserId` | ObjectId → User | Required |
| `toUserId` | ObjectId → User | Required |
| `status` | String | Enum: `Interested` / `Ignore` / `Accepted` / `Rejected` |

> Compound index on `(fromUserId, toUserId)`. Pre-save hook throws if `fromUserId === toUserId`.

---

## 📊 Error Handling

Every error response follows a consistent envelope:

```json
{
  "requestId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "error": "Invalid email or password",
  "status": 400
}
```

`requestId` is generated via `crypto.randomUUID()` on every incoming request — making errors instantly traceable in logs.

| Status | Meaning |
|--------|---------|
| `400` | Bad input / validation failure |
| `401` | Missing or invalid JWT cookie |
| `404` | Resource not found |
| `429` | Rate limit exceeded |

---

## 🛡️ Security

| Layer | Tool | Detail |
|-------|------|--------|
| **HTTP Headers** | `helmet` | CSP, HSTS, X-Frame-Options, MIME sniff prevention |
| **CORS** | `cors` | Restricted to `CLIENT_URL`, `credentials: true` for cookies |
| **Rate Limiting** | `express-rate-limit` | 100 req / IP / 15 min — `429` on breach |
| **Password Hashing** | `bcrypt` | 10 salt rounds — never stored in plaintext |
| **Auth Tokens** | `jsonwebtoken` | 7d expiry, returned in response body — sent as `Authorization: Bearer` header |
| **Input Validation** | `validator` | Email format + strong password on signup |
| **Auth Middleware** | custom | JWT decoded + live user fetched on every protected route |
| **Self-connection guard** | Mongoose pre-save | Model-level enforcement — cannot connect to yourself |

---

## 📖 Swagger UI

Interactive docs — try every endpoint live:

```
https://devetinder.onrender.com/api-docs
```

> **To authenticate:** call `POST /login`, copy the `token` value from the response, paste it into the **Authorize** dialog (prefix with `Bearer `).

All 11 endpoints documented with schemas, examples, and error codes.

---

## 🧪 Integration Tests

4 tests covering the core user journey — run against a real MongoDB Docker container:

```
PASS  src/__tests__/app.test.js
  POST /signup
    ✓ registers a new user and returns success message
  POST /login
    ✓ logs in a user and sets an httpOnly auth cookie
  POST /request/send/:status/:toUserId
    ✓ sends an Interested connection request to another user
  GET /feed
    ✓ returns paginated feed and excludes already-interacted users

Tests: 4 passed  |  Time: ~1.4s
```

```bash
docker compose up -d    # start MongoDB
npm test                # run all 4 tests
docker compose down     # stop MongoDB
```

---

## ⚙️ CI/CD — GitHub Actions

Every `push` or pull request to `main`/`master` automatically:

1. Spins up a `mongo:7` service container on GitHub's servers
2. Installs Node.js 20 + `npm ci`
3. Runs all 4 integration tests
4. ✅ green check or ❌ failed build — before anything reaches production

See [.github/workflows/ci.yml](.github/workflows/ci.yml)

---

## 🧠 Design Decisions

| Decision | Why |
|----------|-----|
| Bearer token in `localStorage` over `httpOnly` cookie | Cross-origin deployments (Vercel → Render) have third-party cookie blocked by modern browsers; Bearer header works reliably across all origins |
| Separate `app.js` and `server.js` | Supertest can import the app without starting the DB or binding a port |
| Feed filtering with `$nin` at DB level | Avoids loading all users into memory; MongoDB handles exclusion efficiently |
| Compound index on `(fromUserId, toUserId)` | Prevents duplicate requests with a DB-level guarantee, not just application logic |
| `async` pre-save hook (Mongoose 9) | Mongoose 9 dropped the `next()` callback pattern — using `async` avoids silent failures |
| `crypto.randomUUID()` on every request | Built-in Node.js, zero dependencies — every error is traceable without a logging library |
| Rate limit at app level, not route level | Protects all endpoints including auth routes from brute-force by default |

---

## 🌍 Live Demo

| | URL |
|--|-----|
| 🌐 Frontend | [https://devtinder-henna.vercel.app](https://devtinder-henna.vercel.app) |
| ⚙️ Backend API | [https://devetinder.onrender.com](https://devetinder.onrender.com) |
| 📖 Swagger UI | [https://devetinder.onrender.com/api-docs](https://devetinder.onrender.com/api-docs) |
| 🩺 Health Check | [https://devetinder.onrender.com/health](https://devetinder.onrender.com/health) |
| 💻 Local API | `http://localhost:3000/api-docs` |

> **Hosting:** Frontend on [Vercel](https://vercel.com) · Backend on [Render](https://render.com) (free tier) · DB on [MongoDB Atlas](https://www.mongodb.com/atlas)
> 
> ⚠️ Render free tier spins down after 15 min of inactivity. First request may take ~30s to wake up. UptimeRobot pings `/health` every 5 min to keep it warm.

---

## 🐳 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Clone & Install

```bash
git clone https://github.com/Kartikeya-guthub/devtinder-backend.git
cd devtinder-backend
npm install
```

### 2. Environment Variables

Create `.env` in the project root (see `.env.example`):

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/devtinder
jwt_secret=your_super_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Start MongoDB (Docker)

```bash
docker compose up -d
```

### 4. Run the Dev Server

```bash
npm run dev
```

| URL | |
|-----|---|
| `http://localhost:3000` | API base |
| `http://localhost:3000/api-docs` | Swagger UI |

### 5. Run Tests

```bash
npm test
```

---

## 📦 Tech Stack

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web framework |
| `mongoose` | ^9.0.2 | MongoDB ODM |
| `bcrypt` | ^6.0.0 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT tokens |
| `cookie-parser` | ^1.4.7 | Parse request cookies |
| `dotenv` | ^17.2.3 | Environment variables |
| `validator` | ^13.15.26 | Email & password validation |
| `helmet` | ^8.1.0 | Secure HTTP headers |
| `cors` | ^2.8.6 | Cross-origin requests |
| `express-rate-limit` | ^8.2.1 | Rate limiting |
| `swagger-ui-express` | ^5.0.1 | Interactive API docs |
| `node-cron` | ^4.2.1 | Scheduled tasks |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `jest` | ^30.2.0 | Test runner |
| `supertest` | ^7.2.2 | HTTP integration testing |
| `nodemon` | latest | Auto-restart on change |
| `prettier` | 3.8.0 | Code formatting |

---

## � Deployment

### Backend → Render

| Key | Value |
|-----|-------|
| Root Directory | `Devtinder-Backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `jwt_secret` | Random secret string |
| `CLIENT_URL` | `https://devtinder-henna.vercel.app` |
| `NODE_ENV` | `production` |

### Frontend → Vercel

| Key | Value |
|-----|-------|
| Root Directory | `/` (repo root — `vercel.json` auto-detected) |
| `VITE_API_URL` | `https://devetinder.onrender.com` |

---

## �👨‍💻 Author

**Kartikeya Sharma**  
Built with attention to reliability, security, and maintainability.

[![GitHub](https://img.shields.io/badge/GitHub-Kartikeya--guthub-181717?style=flat-square&logo=github)](https://github.com/Kartikeya-guthub)

---

<div align="center">

*Found this useful? Drop a ⭐ on the repo!*

</div>
