# BugWise - AI-Powered Bug Explanation Tool

## Project Overview
BugWise is a full-stack, AI-powered developer tool designed to analyze code snippets, detect bugs, explain root causes, and propose corrected code solutions. By leveraging large language models (OpenAI), BugWise accelerates the debugging process by not only fixing the code but by providing deep technical context, visual root-cause timelines, security scanning, performance analysis, and mock interview practice based on the bug.

## Features
- **Advanced Structured AI Bug Analysis**: Deep root cause identification and step-by-step debugging plans.
- **Root-Cause Visual Timeline**: Step-by-step visual chain of events leading to the error.
- **AI Fix Generator**: Code correction with before/after Diff Viewer.
- **Security & Performance Scanner**: Static analysis for vulnerabilities and algorithmic bottlenecks.
- **Regression Test Generator**: Automated test generation to prevent bug recurrence.
- **Monaco Editor Integration**: Professional syntax-highlighted code input.
- **Stack Trace Analyzer**: Smart parsing of raw terminal logs.
- **Context-Aware Follow-up Chat**: Interactive chatbot bounded to the context of the current bug analysis.
- **Learning Mode (Teach Me)**: Tiered conceptual explanations (Beginner, Intermediate, Advanced).
- **Interview Mode**: Interactive mock interview practice related to the diagnosed bug.
- **Bug History & Analytics**: Persistent history with filtering and real-data dashboard analytics via Recharts.

## Complete Technology Stack
- **Frontend**: React, Vite, TailwindCSS (for dark glassmorphic styling), Monaco Editor, Recharts, React Router, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas, Mongoose.
- **Authentication**: JSON Web Tokens (JWT), bcrypt (password hashing).
- **AI Integration**: OpenAI SDK (gpt-4o-mini).

## Architecture & Request Lifecycle
1. **Frontend State/API Flow**: A user submits buggy code in the `DashboardPage` via the `MonacoEditor`. React state handles loading UI. `axios` sends a POST request with the JWT in the `Authorization` header.
2. **REST APIs & Middleware**: The request hits Express. `auth` middleware verifies the JWT. `aiRateLimiter` ensures fair usage. 
3. **Controllers & Services**: `analysisController` receives the payload and passes it to `aiService`. 
4. **AI Flow**: `aiService` constructs a strict `systemPrompt` enforcing JSON format and calls OpenAI. `validateAiResponse` safely parses and normalizes the AI response.
5. **Database**: `Analysis` Mongoose schema validates the data and saves the document to MongoDB.
6. **Response**: The API returns the persisted `Analysis` object to the React frontend, which distributes the data to modular subcomponents (`OverviewPanel`, `FixPanel`, `SecurityPerformancePanel`, etc.) inside `DashboardPage`.

## Setup Instructions

### Environment Variables (.env)
Create a `.env` file in the `server` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster...
JWT_SECRET=your_super_secret_jwt_key
OPENAI_API_KEY=sk-proj-...
```

### Installation
1. Install server dependencies: `cd server && npm install`
2. Install client dependencies: `cd client && npm install`

### Local Run Commands
1. Start Backend: `cd server && npm run dev`
2. Start Frontend: `cd client && npm run dev`

## Limitations & Future Improvements
- **Execution Limits**: The system intentionally *never* executes user code on the server. Test generation is static and requires the developer to run the tests locally.
- **AI Hallucinations**: While tightly constrained via JSON schemas and prompt engineering, the AI may occasionally hallucinate variable names or invent complexity metrics.
- **Future Improvements**: Add collaborative team workspaces and direct GitHub repository integrations.
