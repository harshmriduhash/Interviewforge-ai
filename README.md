# 🎙️ InterviewForge AI

> **"Practice Until You Can't Fail."**  
> The premier, voice-first agentic technical interview coach designed to scale human preparation to FAANG expectations.

---

## 🚀 The Vision

Software engineers fail 95% of first-time technical interviews—not from lack of knowledge, but from lack of deliberate, feedback-rich spoken practice. Peer-dependent platforms are inconsistent, and human mock interview panels cost upwards of $200 per session.

**InterviewForge AI** bridges this gap. By utilizing a high-fidelity, dual-mode, real-time voice synthesis and speech-to-text pipeline, InterviewForge plays the role of a seasoned L6/L7 technical interviewer. It dynamically adapts question difficulty, gauges conceptual tradeoffs, and generates dynamic audit reports across 7 key engineering and communication dimensions.

---

## 🛠️ Tech Stack & Systems Architecture

InterviewForge AI is engineered as a robust, decoupled, enterprise-grade architecture:

```mermaid
graph TD
    Client[Next.js Client app] -->|HTTPS REST| NextAPI[Next.js Route Handlers]
    Client -->|WebSockets| VoiceService[Voice WebSocket Microservice]
    NextAPI -->|Prisma Client| Postgres[(PostgreSQL + pgvector)]
    VoiceService -->|Gemini/Claude Grader| LLM[AI Evaluation Engines]
    Client -->|Fallback API| BrowserSpeech[Browser HTML5 Web Speech]
```

### Core Architecture Specifications:
* **Frontend**: Next.js 15+ App Router, TypeScript, TailwindCSS, Framer Motion, and Recharts.
* **Database & ORM**: PostgreSQL, Prisma ORM, and pgvector for semantic question retrieval.
* **Real-time Pipeline**: Standalone WebSocket Node microservice (`voice-service`) running on port 3003.
* **Dual-Mode Audio Engine**:
  1. **Production Pipeline**: Integrates Deepgram Streaming (STT) + ElevenLabs (TTS) + Gemini/Claude (LLM).
  2. **Browser-Native Pipeline**: Automatic fallback leveraging HTML5 Speech Recognition (`webkitSpeechRecognition`) + Speech Synthesis (`speechSynthesis`) to guarantee zero-latency offline execution with no external API keys required.

---

## 🔥 Elite Features

### 1. Multi-Dimensional Performance Radar
Tracks and audits candidates across **7 critical parameters** formulated from real FAANG loops:
* **Technical Precision**: Mathematical correctness, algorithms, space-time complexities, and design tradeoffs.
* **Communication Flow**: Clear structures, concise answers, and executive presence.
* **System Structure**: Clean component separation, isolation of concerns, and security.
* **Depth & Rationale**: Trade-off reasoning, scaling, and database bottleneck mitigations.
* **Confidence & Tone**: Controlled speech speed, confidence levels, and speech cadence.
* **Filler Word Control**: Active reduction of filler indicators (`um`, `like`, `uh`, `you know`).
* **Pacing & Speed**: Timely delivery and structured timing.

### 2. The Forge Activity Matrix
A GitHub-style training heat map recording historical mock session counts over a longitudinal calendar to motivate consistent preparation.

### 3. Sourced Company Prep Tracks
Customized preparation tracks targeting specific company patterns (e.g. Google Currents consistency models, Meta Live Streaming scaling, Stripe Idempotency architectures) complete with question counts and target levels.

### 4. Interactive Q&A Transcripts
Detailed review report sheets listing chronological question transcripts, user audio outputs, and granular AI annotations.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18+ 
* **Database**: PostgreSQL (running locally or hosted on Supabase/Railway)

### Installation & Database Setup

1. **Clone and install dependencies**:
   ```bash
   # Install Next.js client dependencies
   cd interviewforge-ai-web
   npm install

   # Install voice service microservice dependencies
   cd ../voice-service
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file under `interviewforge-ai-web`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/interviewforge"
   NEXTAUTH_SECRET="super-secure-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Initialize and Seed the Database**:
   ```bash
   cd interviewforge-ai-web
   # Push schema to PostgreSQL
   npx prisma db push

   # Seed FAANG Questions and Companies
   npx prisma db seed
   ```

### Running the Services

* **Start the Next.js Web App** (Port 3000):
  ```bash
  cd interviewforge-ai-web
  npm run dev
  ```

* **Start the Standalone Voice Microservice** (Port 3003):
  ```bash
  cd voice-service
  npm start
  ```

---

## 📊 Database Schema Summary

We utilize a robust relational structure to log persistent user onboarding configurations, session analytics, and transcripts:

* `User`: Profiles, subscription status, target company and level, and onboarding completed indicators.
* `Session`: Logs overall dynamic dimensions, duration, round type, and computed scores.
* `SessionExchange`: Records each dynamic verbal question, transcription output, and conversational grade.
* `Question`: Bank of verified Algorithmic, System Design, and Behavioral challenges.
* `UserProgress`: Aggregates Streaks, streaks longest limits, and company-specific readiness parameters.

---

## 🌟 Security & Quality Controls
* **Validation**: Input validation using Zod on registration and onboarding endpoints.
* **Authentication**: Credentials authentication via NextAuth secured with Bcrypt hashed passwords.
* **TypeScript Compliance**: Strict compilation checks ensuring zero runtime syntax errors.
