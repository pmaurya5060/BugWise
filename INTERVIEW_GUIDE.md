# BugWise - Interview Guide

## 30-Second Project Explanation
BugWise is a full-stack web application that helps developers debug their code using AI. Instead of just giving the fixed code, BugWise acts as a senior engineer, generating a visual root-cause timeline, security and performance scans, regression tests, and even mock interview questions based on the exact bug submitted. It's built with React, Node.js, Express, and MongoDB, leveraging the OpenAI API.

## 2-Minute Explanation
BugWise solves the problem of developers relying blindly on AI-generated code by focusing on education and deep analysis. It takes buggy code or stack traces via a professional Monaco editor interface. The backend uses Express and Node.js to route the request to a dedicated AI service, which uses strict prompt engineering to force OpenAI to return a complex, 15-field JSON payload. This payload contains everything from alternative solutions to specific security vulnerabilities. The data is safely parsed, saved to MongoDB Atlas using Mongoose, and returned to a highly modular React frontend. The frontend uses TailwindCSS for a premium dark glassmorphic design, dividing the AI data into clean tabs like "Fix & Diff", "Security & Perf", and an interactive "Interview" panel.

## Architecture & Flows
- **Frontend Flow**: Users interact with modular React components (`OverviewPanel`, `FixPanel`). State is managed locally. Protected API calls include JWTs.
- **Backend & Database Flow**: Express routers pipe requests through JWT authentication and rate-limiting middleware. Controllers handle business logic and database persistence (MongoDB via Mongoose).
- **AI Flow**: The `aiService` is isolated from the controllers. It builds context-aware prompts, interacts with OpenAI using `response_format: { type: 'json_object' }`, and rigorously validates the output schema to prevent frontend crashes from malformed JSON.
- **Authentication Flow**: User registers -> bcrypt hashes password -> saved to MongoDB. User logs in -> bcrypt compares hash -> server signs and returns a stateless JWT -> client stores JWT and attaches it to future requests.
- **Security Decisions**: User code is NEVER executed on the backend to prevent RCE (Remote Code Execution). OpenAI API keys are kept strictly on the backend. Rate limiting prevents API abuse.

## Technology Decisions & Tradeoffs
- **MongoDB vs SQL**: MongoDB was chosen because the structure of AI responses can evolve, and storing complex nested JSON (like `performanceScan` and `alternativeSolutions`) is much more natural in a document database than heavily normalized SQL tables.
- **React (Vite)**: Vite provides instant HMR and faster build times than CRA, significantly improving developer velocity.
- **Monaco Editor**: Selected over simple textareas for professional syntax highlighting and formatting, though it adds to the bundle size.

## Major Challenges Encountered
1. **Enforcing AI Response Structure**: LLMs often inject markdown backticks or conversational filler even when asked for JSON. The challenge was solved by using OpenAI's `json_object` response format and writing a strict validation/normalization function on the backend that supplies safe fallbacks if the AI hallucinates missing schema fields.
2. **Managing Frontend Complexity**: Rendering 15 different data points (diffs, tests, timelines) in a single view was overwhelming. Refactored the monolithic `DashboardPage` into a tabbed interface with dedicated subcomponents (`FixPanel`, `LearningPanel`, etc.), drastically improving maintainability.

## Project-Specific Interview Questions and Answers
**Q: How do you ensure the AI API key isn't stolen?**
*A: The API key is securely stored in the backend `.env` file and is never exposed to the client. The frontend only communicates with my Node.js API, which acts as a secure proxy.*

**Q: What happens if OpenAI is down?**
*A: I implemented a `generateFallbackAnalysis` function in the `aiService`. If the API call fails or times out, the server catches the error and returns a gracefully formatted fallback JSON object to the frontend so the application doesn't completely crash.*

**Q: How does the Context-Aware Follow-up Chat work?**
*A: The chat drawer relies on an array of `chatHistory` persisted in the MongoDB `Analysis` document. When a user sends a message, the backend appends it to the history, sends the entire thread context (including the original bug) to OpenAI, and persists the new response.*
