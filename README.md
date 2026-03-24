# SkillNexa

A full-stack MERN project for interview practice, mock tests, coding rounds, AI-based feedback, analytics, bookmarks, and progress tracking for students and job seekers.

## Folder Structure

```text
frontend/
  src/
    api/
    components/
    context/
    pages/
backend/
  src/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    utils/
```

## Core Features Included

- Email/password signup and login
- Google OAuth hooks with Passport
- JWT-protected APIs
- Dashboard analytics with Chart.js
- Question bank with filters
- Topic-wise practice mode with instant feedback
- Timed mock tests with result analysis
- AI interviewer with dynamic questions and answer evaluation
- Monaco code editor with backend execution endpoint
- Bookmarking and attempt history
- Dark/light mode toggle and responsive UI

## Database Design

- Users: profile, auth, bookmarks, progress
- Questions: DSA, Aptitude, HR, Core Subjects; MCQ, Coding, Subjective
- Tests: timed sections and question mapping
- Results: submitted answers, score, accuracy, weak topics, strengths

## API Overview

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/auth/google`
- GET `/api/auth/google/callback`
- GET `/api/users/profile`
- PUT `/api/users/profile/avatar`
- GET `/api/users/bookmarks`
- POST `/api/users/bookmarks/:questionId`
- GET `/api/users/history`
- GET `/api/questions`
- POST `/api/questions/:id/evaluate`
- GET `/api/tests`
- POST `/api/tests`
- POST `/api/tests/:id/submit`
- POST `/api/ai/questions`
- POST `/api/ai/evaluate`
- POST `/api/ai/recommendations`
- POST `/api/code/run`

## Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai_interview_platform
JWT_SECRET=replace_with_secure_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true
JUDGE0_API_KEY=your_judge0_api_key
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Expo-Friendly Notes

- The backend auto-seeds a larger question set on first start.
- If `OPENAI_API_KEY` is missing, AI interviewer falls back to heuristic feedback so the demo still works.
- If Judge0 credentials are missing, code execution returns a mocked setup message instead of failing.
