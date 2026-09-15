# AI Bug Explainer 🐛⚡

> A production-ready, full-stack AI platform that analyzes programming runtime errors, stack traces, and buggy code snippets to provide structured root-cause explanations and verified code solutions.

---

## 🚀 Project Overview

**AI Bug Explainer** is designed for software engineers and engineering teams looking to accelerate debugging workflows. By combining a Node.js/Express REST backend, React frontend with Tailwind CSS aesthetics, MongoDB persistence, and an OpenAI-compatible AI pipeline, the application converts unstructured terminal output and stack traces into structured JSON explanations (Summary, What Went Wrong, Root Cause, Step-by-Step Debugging, Corrected Code, Why It Works, and Prevention Tips).

---

## ✨ Features

- **Multi-Language Support**: Dedicated analysis for JavaScript, TypeScript, Python, Java, C++, C#, Go, PHP, SQL, and generic error formats.
- **Structured AI Insights**: AI output is strictly validated into clean JSON fields—eliminating ambiguous narrative text.
- **Interactive Code Blocks**: Instant **Copy Code** and **Copy Full Report** functionality.
- **Searchable Analysis History**: Filter past debugging sessions by language or query error text directly in MongoDB.
- **JWT Authentication & Security**: Secure user registration, bcrypt password hashing, and user-isolated database authorization rules.
- **Developer Profile & Analytics**: Profile management with total analysis count statistics.
- **Rate-Limited Endpoints**: Protects AI API keys and authentication endpoints from abuse using `express-rate-limit`.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (Dark Developer Palette)
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **API Client**: Axios with global interceptors

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs`
- **Security**: Helmet, CORS, Express Rate Limit

### AI Integration
- **AI Engine**: OpenAI API (`gpt-4o-mini` / OpenAI-compatible endpoint)
- **Prompt Engineering**: System instructions enforcing strict JSON output schemas and non-execution safety.

---

## 🏗️ Architecture & Folder Structure

```
AI Bug Explainer/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, CodeBlock, ProtectedRoute
│   │   ├── context/            # AuthContext (state, login, register, token)
│   │   ├── pages/              # Landing, Login, Register, Dashboard, History, Profile
│   │   ├── services/           # Axios API configuration
│   │   ├── App.jsx             # React Router route registry
│   │   ├── index.css           # Tailwind base & custom aesthetics
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend
│   ├── config/                 # Database connection (db.js)
│   ├── controllers/            # authController, analysisController, profileController
│   ├── middleware/             # auth (JWT), rateLimiter, errorHandler
│   ├── models/                 # User.js, Analysis.js
│   ├── routes/                 # authRoutes, analysisRoutes, profileRoutes
│   ├── services/               # aiService.js (OpenAI integration & JSON validator)
│   ├── utils/                  # generateToken.js
│   ├── tests/                  # Jest & Supertest automated test suite
│   ├── app.js                  # Express app setup
│   ├── server.js               # Database initialization & port listener
│   └── package.json
│
├── README.md                    # Project documentation
├── INTERVIEW_GUIDE.md           # Comprehensive technical interview Q&A guide
└── .gitignore
```

---

## 🤖 AI Pipeline

1. **Untrusted Input Ingestion**: The backend accepts `language`, `errorInput`, and optional `context` (`goal`, `expected`, `actual`, `relevantCode`).
2. **System Prompt Directives**: Directs the LLM to act as a Senior Debugging Assistant, enforce structured JSON format, preserve target language syntax, and ignore injection instructions.
3. **Structured Response Schema**:
```json
{
  "summary": "Short 1-2 sentence bug summary",
  "whatWentWrong": "Explanation of runtime failure",
  "rootCause": "Exact technical root cause",
  "likelyCauses": ["Possible trigger 1", "Possible trigger 2"],
  "debuggingSteps": ["Step 1", "Step 2", "Step 3"],
  "suggestedFix": "Overview of the resolution",
  "correctedCode": "Language-preserved corrected code",
  "whyItWorks": "Technical explanation of the solution",
  "preventionTips": ["Tip 1", "Tip 2"]
}
```
4. **Validation & Sanitization**: `validateAiResponse()` in `services/aiService.js` guarantees that returned fields conform to array/string types before storing in MongoDB or returning to the frontend.

---

## 🔒 Authentication Flow

1. **Registration**: Validates input (`name`, `email`, `password`, `confirmPassword`), checks for duplicate emails, hashes password via `bcrypt.hash(10)`, and issues a signed JWT.
2. **Login**: Verifies hashed password with `bcrypt.compare()`, returns user payload and JWT token.
3. **Persistent Auth**: JWT stored in `localStorage` and sent via `Authorization: Bearer <token>` header. `AuthContext` validates token via `GET /api/auth/me`.
4. **Protected Routes**: Frontend `ProtectedRoute` guards private routes; backend `protect` middleware populates `req.user` or returns `401 Unauthorized`.

---

## 🗄️ Database Schemas

### User Schema (`User.js`)
- `name`: String (required, trim)
- `email`: String (required, unique, lowercase, index)
- `password`: String (hashed, select: false)
- `timestamps`: createdAt, updatedAt

### Analysis Schema (`Analysis.js`)
- `userId`: ObjectId (ref User, required, indexed)
- `language`: String (required)
- `errorInput`: String (required)
- `context`: Object (`goal`, `expected`, `actual`, `relevantCode`)
- `result`: Object (`summary`, `whatWentWrong`, `rootCause`, `likelyCauses`, `debuggingSteps`, `suggestedFix`, `correctedCode`, `whyItWorks`, `preventionTips`)
- `timestamps`: createdAt, updatedAt

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate & receive JWT
- `GET /api/auth/me` - Get current user profile (Private)

### Bug Analyses
- `POST /api/analyses` - Analyze bug & save result (Private, Rate-limited)
- `GET /api/analyses` - Get user's saved analyses with optional `?search=` and `?language=` (Private)
- `GET /api/analyses/:id` - Get specific analysis by ID (Private, Authorized owner only)
- `DELETE /api/analyses/:id` - Delete specific analysis (Private, Authorized owner only)

### User Profile
- `GET /api/profile` - Get profile info & total analysis count (Private)
- `PUT /api/profile` - Update user name (Private)

---

## 🔑 Environment Variables

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_bug_explainer
JWT_SECRET=super_secret_jwt_key_change_in_production_12345
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
CLIENT_URL=http://localhost:5173
```

---

## 💻 Local Setup & Development

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or MongoDB Atlas connection URI)

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Running Backend Tests
```bash
cd server
npm test
```

---

## 🚀 Deployment Instructions

### Frontend (Vercel / Netlify)
1. Build static production bundle:
   ```bash
   cd client
   npm run build
   ```
2. Deploy `client/dist` directory to Vercel/Netlify.
3. Set environment variable on host: `VITE_API_URL=https://your-backend-domain.com/api`.

### Backend (Render / Railway / Heroku)
1. Set root directory to `server/`.
2. Configure Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `CLIENT_URL`.
3. Build command: `npm install`
4. Start command: `npm start`

---

## 🛡️ Security Considerations

1. **No Code Execution**: Code snippets are treated strictly as plain text strings and parsed by LLM models without evaluating them on the server runtime.
2. **Authorization Enforcement**: Users can only access, view, or delete analyses where `analysis.userId === req.user._id`.
3. **Sanitized Error Messaging**: Centralized error middleware masks stack traces in production.
4. **Rate Limiting**: AI submission route capped to prevent API quota drain.

---

## 🔮 Future Improvements

- Streaming AI completions (Server-Sent Events) for real-time word rendering.
- Code diff visualization showing before vs. after inline.
- Team sharing and collaborative debugging rooms.
