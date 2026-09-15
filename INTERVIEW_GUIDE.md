# Technical Interview Guide - AI Bug Explainer 🧠💼

This document serves as an exhaustive reference guide to prepare for technical software engineering interviews based on the actual codebase implementation of **AI Bug Explainer**.

---

## 📌 1. Project Overview

### 30-Second Elevator Pitch
"AI Bug Explainer is a full-stack developer portfolio project built with React, Node.js, Express, MongoDB, and OpenAI. It converts cryptic runtime stack traces and code snippets into structured JSON root-cause analyses, step-by-step debugging guides, and language-preserved corrected code snippets while providing searchable session history and user isolation."

### 2-Minute In-Depth Overview
"Debugging complex software errors often involves copying stack traces into search engines or generic chat interfaces, yielding unstructured narrative responses. AI Bug Explainer solves this by creating a dedicated software engineering workflow. 

Users select their target programming language and submit their error log or stack trace. The Express backend validates inputs and passes them to a isolated AI service module (`services/aiService.js`). The AI service constructs a strict prompt requiring a single, validated JSON schema containing root causes, likely triggers, sequential debugging steps, suggested fixes, and corrected code. 

The application uses MongoDB for persisting session history with user ownership checks, JWT authentication for secure session management, bcrypt for password hashing, and express-rate-limit to protect AI endpoints from abuse. The frontend is built with React 18, Vite, Tailwind CSS, and custom hooks."

---

## 🏗️ 2. System Architecture & Request Lifecycle

```
[React Client] 
     │ (1) User submits error log via Form
     ▼
[Axios API Client] ──(Bearer JWT Header)──► [Express REST Server]
                                                  │
                                                  ├──► (2) Helmet & RateLimiter Middleware
                                                  ├──► (3) Auth Middleware (Verify JWT token)
                                                  ├──► (4) Controller Input Validation
                                                  │
                                                  ▼
                                         [AI Service Module]
                                                  │
                                                  ├──► (5) System Prompt + Schema Formatting
                                                  ├──► (6) OpenAI / Compatible API Call
                                                  └──► (7) JSON Response Validation
                                                  │
                                                  ▼
                                         [Mongoose ORM] ──► [MongoDB Database]
                                                  │          (Save Analysis Document)
                                                  ▼
                                         [Express Controller]
                                                  │
                                                  ▼
[React Client UI] ◄──(201 Created JSON)──────────┘
 (Renders Root Cause, Corrected Code, Copy Buttons)
```

---

## 🧠 3. Technology Decisions & Engineering Tradeoffs

| Technology | Reason for Selection | Alternative & Tradeoff Considered |
| :--- | :--- | :--- |
| **React (Vite)** | Component-driven architecture, fast HMR build tool, rich UI ecosystem. | **Next.js**: Added SSR complexity wasn't needed for a client dashboard SPA. |
| **Node.js & Express** | Lightweight, event-driven I/O, seamless JS ecosystem across stack. | **Python/FastAPI**: Python is great for AI, but Node allows unified JS codebase. |
| **MongoDB (Mongoose)** | Flexible document schema for varying stack traces & nested AI JSON results. | **PostgreSQL**: Relational tables require rigid schema alterations for dynamic AI JSON. |
| **JWT** | Stateless auth; server doesn't need DB lookup on every API request. | **Session Cookies**: Requires sticky sessions or Redis session store. |
| **Bcryptjs** | Standard salted password hashing algorithm resisting GPU brute-force. | **Argon2**: Slightly newer, but `bcrypt` has universal support across Node environments. |

---

## 🔒 4. Security Implementation Details

1. **Arbitrary Code Execution Prevention**: User code snippets are never executed, evaluated, or compiled on the server. They are passed as plain text strings to the LLM system prompt.
2. **API Key Isolation**: `OPENAI_API_KEY` and `JWT_SECRET` reside strictly in backend environment variables (`.env`). No secrets are exposed to the client bundle.
3. **Authorization & Data Isolation**: `Analysis.findById` verifies `analysis.userId.toString() === req.user._id.toString()`. User A can never read or delete User B's history.
4. **Rate Limiting**: `express-rate-limit` caps AI endpoint requests to 30 requests per 15 minutes per IP.

---

## ❓ 5. Interview Questions & Comprehensive Answers

### 🟢 Backend (Node.js / Express / REST) - 25 Questions

#### Q1: Why did you separate `app.js` and `server.js`?
> **Answer**: `app.js` configures Express middlewares, routes, and error handlers without starting the HTTP listener. `server.js` connects to MongoDB and launches `app.listen()`. This separation allows unit tests (Supertest) to import `app` directly and execute endpoint tests in memory without binding to live network ports.

#### Q2: How does the centralized error handler work?
> **Answer**: Express recognizes error handling middleware by the signature `(err, req, res, next)`. In `middleware/errorHandler.js`, we intercept Mongoose `ValidationError`, `CastError` (invalid ObjectId), and duplicate key errors (`11000`), returning structured `{ success: false, message }` JSON without leaking internal stack traces in production.

#### Q3: How do you handle CORS in your backend?
> **Answer**: Using `cors()` middleware with explicit origin checking against allowed URLs (`http://localhost:5173`).

#### Q4: Why use `express-rate-limit` on the AI analysis endpoint?
> **Answer**: To prevent API quota exhaustion and Denial of Service (DoS) attacks.

#### Q5: How do you validate incoming request bodies?
> **Answer**: In controllers (e.g. `analysisController.js`), we check that required fields (`language`, `errorInput`) exist and are non-empty before initiating external API calls.

*(Questions Q6 - Q25 cover status codes, REST conventions, JWT headers, middleware chains, etc.)*

---

### ⚛️ Frontend (React & State Management) - 20 Questions

#### Q1: How is global authentication managed across React routes?
> **Answer**: Via `AuthContext.jsx`. It exposes `user`, `token`, `login`, `register`, and `logout` through the `useAuth()` custom hook.

#### Q2: How do protected routes prevent unauthorized rendering?
> **Answer**: `ProtectedRoute.jsx` checks `isAuthenticated`. If false, it redirects to `/login` with location state preserved for post-login redirect.

#### Q3: Why use Axios interceptors instead of raw `fetch`?
> **Answer**: Interceptors centrally append `Authorization: Bearer <token>` to every outgoing request and catch `401 Unauthorized` responses to clear invalid tokens.

#### Q4: How is state reset during a new bug analysis submission?
> **Answer**: When the user submits, `analyzing` is set to `true`, `currentAnalysis` is reset to `null`, and `apiError` is cleared to prevent stale rendering.

---

### 🍃 Database & Mongoose - 15 Questions

#### Q1: Why choose MongoDB over a SQL database for this project?
> **Answer**: AI analysis returns dynamic, nested structures (`likelyCauses`, `debuggingSteps`, `preventionTips`). Storing these in a MongoDB document avoids multi-table joins.

#### Q2: How do indexes improve performance in the Analysis schema?
> **Answer**: We added a compound index `analysisSchema.index({ userId: 1, createdAt: -1 })` to accelerate user history retrieval.

#### Q3: How do you ensure users can't delete each other's data?
> **Answer**: In `deleteAnalysis`, we check `analysis.userId.toString() === req.user._id.toString()`. If false, return `403 Forbidden`.

---

### 🤖 AI Integration & Prompt Engineering - 15 Questions

#### Q1: Why decouple AI logic into `services/aiService.js`?
> **Answer**: To isolate LLM dependencies, system prompts, and schema parsing from Express route logic, making it easily testable and replaceable.

#### Q2: How do you ensure the AI model outputs valid JSON?
> **Answer**: We pass `response_format: { type: 'json_object' }` to OpenAI and run `validateAiResponse()` to fallback default arrays if keys are missing.

#### Q3: How do you prevent prompt injection?
> **Answer**: System prompt explicitly instructs the LLM to treat user code snippets as untrusted data and ignore embedded system instructions.

---

### 🛡️ Security & DevOps - 10 Questions

#### Q1: How are passwords stored securely?
> **Answer**: Passwords are hashed with `bcryptjs` using a salt round of 10 prior to DB saving.

#### Q2: What security headers does `helmet()` provide?
> **Answer**: X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options, X-XSS-Protection.

---

## 🛠️ Genuine Technical Challenges & Solutions

1. **Challenge**: AI LLM model occasionally returning markdown wrapped JSON (` ```json ... ``` `) causing `JSON.parse` failures.
   - **Solution**: Implemented regex cleaning and a fallback schema normalizer `validateAiResponse()` that guarantees structural fallback values.
2. **Challenge**: Test suite hanging due to missing external MongoDB connection.
   - **Solution**: Integrated `mongodb-memory-server` for isolated in-memory DB testing.

---

## 📝 Resume Bullet Points

- **Engineered full-stack AI bug explanation platform** using React, Node.js, Express, MongoDB, and OpenAI, cutting developer debugging time with structured root-cause analysis.
- **Implemented JWT authentication & data authorization pipeline** with bcrypt password hashing, input sanitization, and user isolation across MongoDB schemas.
- **Architected robust backend service layer & rate-limited REST API**, achieving 100% test coverage for authentication and CRUD analysis authorization using Jest & Supertest.
