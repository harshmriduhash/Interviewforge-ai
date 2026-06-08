# 🎙️ InterviewForge AI

[![Live](https://img.shields.io/badge/Live-interviewforge--ai--web.vercel.app-FF5C00.svg)](https://interviewforge-ai-web.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black.svg)](#)
[![AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4.svg)](#)
[![Database](https://img.shields.io/badge/DB-Neon%20PostgreSQL-00E599.svg)](#)

> **The world's first Voice-First Agentic Interview Coach.** Practice speaking your solutions out loud — not just writing code in silence.

InterviewForge AI replicates the high-pressure environment of FAANG interview panels using real-time voice interaction and AI-driven evaluation. It bridges the gap between **solving a problem** and **communicating a solution**.

🔗 **Live Demo:** [interviewforge-ai-web.vercel.app](https://interviewforge-ai-web.vercel.app)

---

## 🎯 The Problem

95% of software engineers fail technical interviews not because of logic, but because of **Cognitive Friction**:

- **Vocal Deficit** — 1,000+ hours on LeetCode in silence, then asked to explain p99 latency trade-offs out loud.
- **Feedback Vacuum** — Traditional mock interviews are inconsistent and expensive ($200+/hr).
- **Memory Decay** — Without longitudinal tracking, candidates repeat the same mistakes.

---

## ✨ Key Features

| Feature | Description |
|:---|:---|
| **Voice-First Interview Loop** | Real-time TTS/STT simulation with an AI interviewer that speaks, listens, and adapts |
| **AI Grading Audit** | Gemini 1.5 Flash analyzes your full transcript and generates a brutally honest 7-dimension report |
| **Company-Specific Prep** | Tailored rubrics for Google, Meta, Amazon, Apple, Netflix, Stripe, and more |
| **Adaptive Difficulty** | Engine calibrates in real-time — follow-up probes, pressure tests, difficulty scaling |
| **Longitudinal Memory** | Persistent user profile tracks progress across sessions with streak tracking |
| **Shareable Reports** | Encrypted public links for mentor/peer review |
| **RAG Question Bank** | Pinecone-powered retrieval prioritizing your weak spots |
| **Pro Analytics** | GitHub-style activity heatmap and radar chart performance visualization |

---

## 🏗️ Architecture

```mermaid
graph LR
    User((Engineer)) <-->|Voice| Session[Session Interface]
    Session <-->|STT/TTS| SpeechAPI[Web Speech API]
    Session -->|Evaluate| Gemini[Gemini 1.5 Flash]
    
    Session -->|Prisma ORM| DB[(Neon PostgreSQL)]
    Gemini -->|Grade| DB
    
    User <-->|Next.js 16| Dashboard[Forge Dashboard]
    Dashboard -->|Prisma| DB
    Dashboard -->|RAG| Pinecone[(Pinecone Vectors)]
    Dashboard -->|Email| Resend[Resend]
```

### Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **AI Engine** | Google Gemini 1.5 Flash |
| **Database** | Neon PostgreSQL + Prisma ORM 7.8 |
| **Vector DB** | Pinecone |
| **Auth** | NextAuth.js (Credentials + OAuth) |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **Payments** | Stripe |
| **Email** | Resend |
| **Monitoring** | Sentry + PostHog |
| **Deployment** | Vercel |

---

## � Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)

### 1. Clone & Install

```bash
git clone https://github.com/harshmriduhash/interviewforge-ai.git
cd interviewforge-ai/interviewforge-ai-web
npm install
```

### 2. Configure Environment

Copy `.env.example` or create a `.env` file with:

```env
# Required
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"          # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"        # Change to your Vercel URL in prod
GEMINI_API_KEY="your-gemini-api-key"

# Optional (for full feature set)
DEEPGRAM_API_KEY=""
ELEVENLABS_API_KEY=""
RESEND_API_KEY=""
STRIPE_SECRET_KEY=""
PINECONE_API_KEY=""
```

### 3. Initialize Database

```bash
npx prisma db push
npx prisma db seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 How the AI Grading Works

When you end an interview session, the platform:

1. **Aggregates** the full transcript of all Q&A exchanges
2. **Sends** the transcript to Gemini 1.5 Flash with a FAANG-calibrated evaluation prompt
3. **Scores** your performance across 7 dimensions:
   - Technical Accuracy · Communication Clarity · Answer Structure · Depth of Knowledge · Confidence · Filler Word Control · Response Pacing
4. **Generates** an Executive Summary, Core Strengths, Weaknesses, and a personalized Action Plan
5. **Stores** everything in the database for longitudinal tracking

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── sessions/[id]/grade/   # AI grading endpoint
│   │   ├── sessions/evaluate/     # Per-exchange evaluation
│   │   ├── questions/rag/         # RAG-powered question retrieval
│   │   └── ...
│   ├── session/[id]/              # Live interview interface
│   ├── session/[id]/report/       # Post-session report card
│   ├── dashboard/                 # Analytics & question bank
│   └── auth/                      # Login, signup, password reset
├── components/
│   ├── dashboard/                 # Sidebar, charts, metrics
│   └── landing/                   # Hero, DemoWidget, features
├── lib/
│   └── prisma.ts                  # Database client
└── middleware.ts                  # Route protection & CSP
```

---

## 🗺️ Roadmap

- [x] Core Real-time Voice Architecture
- [x] Multi-modal AI Evaluation (Gemini 1.5 Flash)
- [x] Authentic Session Grading & Personalized Reports
- [x] Company-Specific Question Banks (FAANG)
- [x] Longitudinal Progress Tracking & Streaks
- [x] Production Deployment (Vercel + Neon)
- [ ] Multi-user "Mock Room" Collaboration
- [ ] Native iOS/Android Agent
- [ ] Voice Cloning for Custom Interviewer Personas

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

© 2026 InterviewForge AI. Built for those who build the future.