<p align="center">
  <img src="https://img.shields.io/badge/InterviewForge_AI-FF5C00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDFhMyAzIDAgMCAwLTMgM3YxMGEzIDMgMCAwIDAgNiAwVjRhMyAzIDAgMCAwLTMtM3oiLz48cGF0aCBkPSJNMTkgMTB2MmE3IDcgMCAwIDEtMTQgMHYtMiIvPjxsaW5lIHgxPSIxMiIgeDI9IjEyIiB5MT0iMTkiIHkyPSIyMyIvPjxsaW5lIHgxPSI4IiB4Mj0iMTYiIHkxPSIyMyIgeTI9IjIzIi8+PC9zdmc+&logoColor=white" alt="InterviewForge AI" height="40" />
</p>

<h1 align="center">InterviewForge AI</h1>
<h3 align="center">The Voice-First Agentic Interview Coach</h3>

<p align="center">
  <strong>Stop typing. Start speaking. Land the job.</strong>
</p>

<p align="center">
  <a href="https://interviewforge-ai-web.vercel.app"><img src="https://img.shields.io/badge/🔗_Live_Product-interviewforge--ai--web.vercel.app-FF5C00?style=for-the-badge" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/Gemini_1.5_Flash-AI_Engine-4285F4?style=flat-square&logo=google" />
  <img src="https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat-square&logo=postgresql" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000?style=flat-square&logo=vercel" />
</p>

---

## 📌 TL;DR

InterviewForge AI is a **real-time, voice-first mock interview simulator** powered by **Google Gemini 1.5 Flash**. It listens to you speak, evaluates your technical answers, and generates a brutally honest FAANG-grade performance audit — all in under 60 seconds.

> Think of it as a **Principal Engineer from Google sitting across from you**, available 24/7, for a fraction of the cost.

---

## 🧠 What Problem Does It Solve?

### The $2.5 Billion Broken System

The technical interview preparation industry is worth **$2.5B** and growing 22% YoY. Yet the core experience hasn't changed in a decade: candidates solve problems **in silence**, then walk into a room where they're expected to **think, code, and communicate simultaneously**.

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE COGNITIVE COLLAPSE                        │
│                                                                 │
│  1,000+ hours on LeetCode ──→ All in SILENCE                   │
│  Real interview arrives   ──→ Must SPEAK + THINK + CODE         │
│  Result                   ──→ 95% failure rate (not from logic, │
│                                but from communication collapse) │
└─────────────────────────────────────────────────────────────────┘
```

### Three Fatal Gaps in Today's Solutions

| Gap | The Pain | InterviewForge Fix |
|:---|:---|:---|
| **🔇 The Vocal Deficit** | Engineers practice in silence for months, then freeze when asked to explain their approach out loud | Voice-first loop forces you to **speak every answer**, building muscle memory for real panels |
| **🕳️ The Feedback Vacuum** | Human mock interviewers are inconsistent, expensive ($200-400/hr), and limited to 1-2 sessions/week | AI evaluator provides **instant, objective, 7-dimension scoring** after every exchange |
| **🔄 The Repetition Trap** | Without longitudinal tracking, candidates repeat the same architectural mistakes for months | **Persistent memory** tracks your weak spots across sessions and auto-prioritizes them |

---

## 💡 How Does It Work?

InterviewForge AI replicates the full experience of sitting in a FAANG interview panel — from the opening question to the final debrief.

```mermaid
sequenceDiagram
    participant U as 👤 Engineer
    participant S as 🎙️ Session Interface
    participant AI as 🧠 Gemini 1.5 Flash
    participant DB as 🗄️ Neon PostgreSQL

    U->>S: Selects Company + Round Type + Difficulty
    S->>DB: Creates Session Record
    S->>AI: Generate opening question
    AI-->>S: "Design a rate limiter for Stripe's API..."
    S-->>U: 🔊 AI speaks the question aloud (TTS)
    
    Note over U,S: Engineer speaks their answer into the mic
    
    U->>S: 🎤 Voice captured (Web Speech API → STT)
    S->>AI: Evaluate answer (7-dimension rubric)
    AI-->>S: Scores + Follow-up/Next Question
    S-->>U: 🔊 AI responds with probing follow-up
    
    Note over U,AI: Loop continues for 3-8 exchanges
    
    U->>S: Clicks "End Session & Grade"
    S->>AI: Full transcript → Comprehensive audit
    AI-->>DB: Store scores, summary, action plan
    S-->>U: 📊 Personalized Report Card
```

### The Three-Phase Engine

**Phase 1 — Real-time Voice Loop**
The AI interviewer speaks questions aloud. You respond with your voice. No typing. No hiding behind a text box. Pure vocal communication under simulated pressure.

**Phase 2 — Adaptive Calibration**
After each answer, Gemini evaluates your response and dynamically decides:
- `FOLLOWUP` → Probes deeper into your specific design choices
- `INCREASE_DIFFICULTY` → Elevates complexity if you're performing well
- `PRESSURE_TEST` → Injects curveballs ("What if the network partition is permanent?")
- `END_SESSION` → Concludes when sufficient signal has been collected

**Phase 3 — AI Grading Audit**
When the session ends, the **entire transcript** is sent to Gemini for a comprehensive performance audit across 7 dimensions — producing a personalized Executive Summary, Strengths, Weaknesses, and an Action Plan with specific resource recommendations.

---

## 💰 Does It Save Time & Money?

### Yes. Dramatically.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     COST COMPARISON                                 │
│                                                                     │
│  Traditional Mock Interview     InterviewForge AI                   │
│  ─────────────────────────      ──────────────────                  │
│  💵 $200-400 per session        💵 $0 (free tier) / $29.99/mo Pro   │
│  📅 24-48hr scheduling lag      ⚡ Instant — available 24/7         │
│  📝 Subjective human feedback   🎯 Objective 7-dimension scoring    │
│  🔄 No memory between sessions  🧠 Longitudinal progress tracking   │
│  👤 1 interviewer style          🏢 Company-specific rubrics         │
│  📊 No analytics                📈 Radar charts, streaks, heatmaps  │
│                                                                     │
│  10 sessions = $2,000-4,000     10 sessions = $0-29.99             │
│                                                                     │
│  SAVINGS: Up to $3,970 per month                                    │
│  TIME SAVED: ~20 hours/month (no scheduling, travel, or waiting)    │
└─────────────────────────────────────────────────────────────────────┘
```

| Metric | Without InterviewForge | With InterviewForge |
|:---|:---|:---|
| **Cost per mock interview** | $200-400 | **$0 – $3** |
| **Time to schedule** | 24-48 hours | **0 seconds** |
| **Feedback turnaround** | 1-3 days | **< 60 seconds** |
| **Sessions per week** | 1-2 (limited by availability) | **Unlimited** |
| **Feedback consistency** | Varies by interviewer | **Mathematical precision** |
| **Weak-spot tracking** | Manual notes | **Automated & prioritized** |
| **Monthly savings** | — | **Up to $3,970** |
| **Time savings** | — | **~20 hours/month** |

---

## 🏗️ Software Architecture

### High-Level System Design

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        Browser["Next.js 16 App<br/>(React 19, Turbopack)"]
        Voice["Web Speech API<br/>(STT + TTS)"]
    end

    subgraph Edge["⚡ Edge Layer (Vercel)"]
        Middleware["Auth Middleware<br/>(JWT Validation)"]
        SSR["Server-Side Rendering<br/>(App Router)"]
    end

    subgraph API["🔌 API Layer (Next.js Route Handlers)"]
        SessionAPI["Session Management<br/>/api/sessions/*"]
        GradeAPI["AI Grading Engine<br/>/api/sessions/[id]/grade"]
        EvalAPI["Real-time Evaluator<br/>/api/sessions/evaluate"]
        QuestionAPI["Question Bank + RAG<br/>/api/questions/*"]
        AuthAPI["Auth System<br/>/api/auth/*"]
        BillingAPI["Billing & Subscriptions<br/>/api/subscriptions/*"]
    end

    subgraph AI["🧠 AI Intelligence Layer"]
        Gemini["Google Gemini 1.5 Flash<br/>(Evaluation + Grading)"]
        Pinecone["Pinecone Vector DB<br/>(RAG Retrieval)"]
    end

    subgraph Data["🗄️ Data Layer"]
        NeonDB["Neon PostgreSQL<br/>(Prisma ORM 7.8)"]
    end

    subgraph Services["📡 External Services"]
        Stripe["Stripe<br/>(Payments)"]
        Resend["Resend<br/>(Transactional Email)"]
        Sentry["Sentry<br/>(Error Tracking)"]
        PostHog["PostHog<br/>(Product Analytics)"]
    end

    Browser <--> Voice
    Browser --> Middleware --> SSR
    SSR --> SessionAPI & GradeAPI & EvalAPI & QuestionAPI & AuthAPI & BillingAPI
    
    EvalAPI --> Gemini
    GradeAPI --> Gemini
    QuestionAPI --> Pinecone
    
    SessionAPI --> NeonDB
    GradeAPI --> NeonDB
    AuthAPI --> NeonDB
    
    BillingAPI --> Stripe
    AuthAPI --> Resend
    Browser -.-> PostHog
    API -.-> Sentry
```

### Database Schema (Entity Relationship)

```mermaid
erDiagram
    User ||--o{ Session : "has many"
    User ||--o| UserProgress : "has one"
    Company ||--o{ Session : "targets"
    Company ||--o{ Question : "has many"
    Session ||--o{ SessionExchange : "contains"
    Question ||--o{ SessionExchange : "referenced in"

    User {
        string id PK
        string email UK
        string name
        string tier "free | pro | enterprise"
        string targetRole
        string experienceLevel
        datetime createdAt
    }

    Session {
        string id PK
        string userId FK
        string companyId FK
        string roundType "algorithms | system_design | behavioral"
        string difficulty "easy | medium | hard | uber_hard"
        string status "pending | active | completed"
        decimal overallScore "0-100"
        decimal scoreTechnical "0-100"
        decimal scoreCommunication "0-100"
        text aiSummary "AI Executive Summary"
        json aiActionPlan "Personalized next steps"
        string[] aiStrengths
        string[] aiWeaknesses
        int durationSeconds
    }

    SessionExchange {
        string id PK
        string sessionId FK
        int exchangeOrder
        text aiQuestion
        text userAnswerText "STT transcript"
        decimal scoreTechnical
        decimal scoreCommunication
        text aiFeedback
        text modelAnswer
    }

    UserProgress {
        string userId PK
        int totalSessions
        int totalDurationMinutes
        decimal readinessScore
        int currentStreak
        int longestStreak
    }

    Company {
        string id PK
        string name
        string slug UK
        string tier "faang | tier1 | tier2"
        int questionCount
    }
```

### AI Grading Pipeline

```mermaid
flowchart LR
    subgraph Input["📥 Input"]
        T["Full Session<br/>Transcript"]
        C["Interview Context<br/>(Company, Role, Difficulty)"]
    end

    subgraph Processing["🧠 Gemini 1.5 Flash Processing"]
        P["FAANG-Calibrated<br/>Evaluation Prompt"]
        E["7-Dimension<br/>Scoring Engine"]
    end

    subgraph Output["📊 Structured Output"]
        S["Overall Score<br/>(0-100)"]
        R["Radar Chart Data<br/>(7 axes)"]
        SU["Executive<br/>Summary"]
        ST["Strengths &<br/>Weaknesses"]
        AP["Personalized<br/>Action Plan"]
    end

    T --> P
    C --> P
    P --> E
    E --> S & R & SU & ST & AP
```

**The 7 Evaluation Dimensions:**

| # | Dimension | What It Measures |
|:--|:---|:---|
| 1 | **Technical Accuracy** | Correctness of algorithms, data structures, and system design decisions |
| 2 | **Communication Clarity** | How clearly and concisely the candidate explains their thought process |
| 3 | **Answer Structure** | Use of frameworks (STAR, trade-off matrices) to organize responses |
| 4 | **Depth of Knowledge** | Ability to go beyond surface-level answers into implementation details |
| 5 | **Confidence** | Vocal certainty, decisiveness, and composure under pressure |
| 6 | **Filler Word Control** | Frequency of "um", "uh", "like", "you know" — a key signal to interviewers |
| 7 | **Response Pacing** | Speed and rhythm of delivery — not too fast, not too slow |

### Request Flow (Session Lifecycle)

```mermaid
stateDiagram-v2
    [*] --> QuestionBank: User browses questions
    QuestionBank --> SessionCreated: Clicks "Practice"
    SessionCreated --> AIPresenting: AI speaks first question (TTS)
    AIPresenting --> UserSpeaking: User responds via microphone (STT)
    UserSpeaking --> AIEvaluating: Gemini scores the exchange
    AIEvaluating --> AIPresenting: Follow-up or next question
    AIEvaluating --> GradingAudit: User clicks "End Session"
    GradingAudit --> ReportCard: Full transcript → Gemini audit
    ReportCard --> [*]: User reviews personalized report

    note right of AIEvaluating
        Adaptive decisions:
        • FOLLOWUP
        • INCREASE_DIFFICULTY  
        • PRESSURE_TEST
        • END_SESSION
    end note
```

---

## ✨ Feature Deep-Dive

### For Engineers
- **Voice-first practice** — Build the verbal muscle memory that LeetCode can't
- **Company-specific prep** — Google, Meta, Amazon, Apple, Netflix, Stripe rubrics
- **Instant AI feedback** — No waiting 48 hours for a human reviewer
- **Progress tracking** — Streaks, radar charts, and session history
- **Shareable reports** — Send encrypted audit links to mentors

### For Recruiters & Hiring Managers
- **Objective candidate signal** — Data-driven scores across 7 dimensions
- **Standardized evaluation** — Same rubric, every time, zero bias
- **Communication assessment** — The #1 skill gap that resumes can't show

### For Startup Founders
- **Full-stack AI SaaS** — Production-grade architecture on Next.js 16 + Gemini
- **Subscription-ready** — Stripe billing with free/pro/enterprise tiers
- **Scalable infrastructure** — Serverless on Vercel, managed DB on Neon
- **Growth loops** — Digest emails (Resend), analytics (PostHog), error tracking (Sentry)

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|:---|:---|:---|
| **Frontend** | Next.js 16.2 (App Router + Turbopack) | Fastest React framework with server components |
| **AI Engine** | Google Gemini 1.5 Flash | Best latency-to-intelligence ratio for real-time evaluation |
| **Database** | Neon PostgreSQL + Prisma ORM 7.8 | Serverless Postgres with type-safe queries |
| **Vector Search** | Pinecone | Sub-100ms semantic retrieval for RAG question bank |
| **Auth** | NextAuth.js v4 | Flexible auth with credentials + OAuth providers |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with `@theme` design tokens |
| **Charts** | Recharts | Composable charting for radar plots and analytics |
| **Payments** | Stripe | Industry-standard billing and subscription management |
| **Email** | Resend | Developer-first transactional email |
| **Monitoring** | Sentry + PostHog | Error tracking + product analytics |
| **Deployment** | Vercel | Zero-config, edge-optimized hosting |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **Neon** PostgreSQL database ([neon.tech](https://neon.tech))
- **Gemini API Key** ([aistudio.google.com](https://aistudio.google.com))

### Quick Start

```bash
# 1. Clone
git clone https://github.com/harshmriduhash/interviewforge-ai.git
cd interviewforge-ai/interviewforge-ai-web

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your keys (see Environment Variables below)

# 4. Initialize database
npx prisma db push
npx prisma db seed

# 5. Launch
npm run dev
```

Open **http://localhost:3000** and start practicing.

### Environment Variables

```env
# ─── Required ────────────────────────────────────────────
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"

# ─── Optional (Full Feature Set) ─────────────────────────
DEEPGRAM_API_KEY=""          # Enhanced speech-to-text
ELEVENLABS_API_KEY=""        # Premium voice synthesis
PINECONE_API_KEY=""          # RAG question retrieval
STRIPE_SECRET_KEY=""         # Subscription billing
RESEND_API_KEY=""            # Transactional emails
SENTRY_DSN=""                # Error monitoring
NEXT_PUBLIC_POSTHOG_KEY=""   # Product analytics
```

### Deploy to Production

```bash
# Set environment variables on Vercel
npx vercel env add DATABASE_URL production
npx vercel env add NEXTAUTH_SECRET production
npx vercel env add NEXTAUTH_URL production
npx vercel env add GEMINI_API_KEY production

# Deploy
npx vercel --prod
```

---

## 📁 Project Structure

```
interviewforge-ai-web/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Session, Exchange, Company)
│   └── seed.ts                # Seed data for companies and questions
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth config, register, forgot/reset password
│   │   │   ├── sessions/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── grade/ # 🧠 AI Grading Audit (full transcript → Gemini)
│   │   │   │   │   ├── exchanges/ # Per-exchange CRUD
│   │   │   │   │   ├── pdf/   # PDF report generation
│   │   │   │   │   └── share/ # Encrypted shareable links
│   │   │   │   └── evaluate/  # Real-time per-answer evaluation
│   │   │   ├── questions/     # Question bank + RAG retrieval
│   │   │   ├── subscriptions/ # Stripe checkout, portal, webhooks
│   │   │   └── users/         # Dashboard data, progress, onboarding
│   │   ├── auth/              # Login, Signup, Password Reset pages
│   │   ├── dashboard/         # Analytics, Questions, Sessions, Settings
│   │   ├── session/
│   │   │   ├── [id]/          # 🎙️ Live interview interface
│   │   │   └── [id]/report/   # 📊 Post-session report card
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── dashboard/         # Sidebar, DashboardContent, charts
│   │   └── landing/           # Hero, DemoWidget, Features, Pricing
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   └── middleware.ts          # Route protection + security headers
├── tailwind.config.ts         # Tailwind v4 configuration
└── package.json
```

---

## 🗺️ Roadmap

- [x] **Core Voice Architecture** — Real-time STT/TTS interview loop
- [x] **AI Evaluation Engine** — Gemini 1.5 Flash per-exchange scoring
- [x] **Authentic Session Grading** — Full-transcript audit with personalized reports
- [x] **Company-Specific Prep** — FAANG question banks with tailored rubrics
- [x] **Longitudinal Progress** — Streak tracking, radar charts, session history
- [x] **Production Deployment** — Vercel + Neon + Stripe billing
- [ ] **Multi-user Mock Rooms** — Collaborative interview practice
- [ ] **Voice Cloning** — Custom interviewer personas (ElevenLabs)
- [ ] **Native Mobile Apps** — iOS + Android agents
- [ ] **Enterprise SSO** — SAML/OIDC for team deployments

---

## 🤝 Contributing

```bash
# Fork → Clone → Branch → Commit → PR
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

---

<p align="center">
  <strong>InterviewForge AI</strong><br/>
  <em>Built for engineers who refuse to fail in silence.</em><br/><br/>
  <a href="https://interviewforge-ai-web.vercel.app">Try it live →</a>
</p>
to be completely 
<p align="center">
  © 2026 InterviewForge AI. All rights reserved.
</p>