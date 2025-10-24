# LetsReWise — AI Quiz Generation & Study Copilot (Next.js + Clerk + Supabase + OpenAI)

A minimal, fast, and reliable AI study copilot. Upload study materials, generate high-quality quizzes, and practice with spaced repetition—without bloat or confusion.

> Built for students, by builders who care about clarity and speed.

---

## ✨ Why LetsReWise?

Most “AI study” products fall into two traps:

1) **Bloat & distraction** (10 features, none delightful)  
2) **Flaky results** (hallucinations, slow UX, no trust)

**LetsReWise** focuses on *one* promise:  
**Turn your docs into trusted quizzes you can practice—quickly.**

### Our Principles

- **Minimalism** → Fewer screens, fewer clicks, faster flow.  
- **Determinism** → Same input → same quiz (hash-based caching, chunking policy).  
- **Ownership** → Your docs are yours; strict RLS, no cross-tenant leakage.  
- **Speed** → Local-first search where possible, smart caching, small payloads.  

---

## 🧭 What’s in this repo (today)

- **Next.js 16 (App Router)** with **Clerk** auth & route protection
- **Onboarding**: two-column, clean UI (light theme)
- **Geo autocomplete**:
  - `/api/geodb` backend proxy
  - **Countries**: local JSON + Fuse fuzzy search
  - **Cities**: local JSON (top set) → fallback to RapidAPI (GeoDB) with in-memory cache
- **Supabase integration** (SSR + browser clients) with **service-role pattern** (server-only)
- Strong **file/folder aliasing** (`@/…`) to keep imports stable
- Production-lean TS config, clean lint/build

> The core foundation for secure, high-confidence product features.

---

## 🚀 Roadmap (high-level)

**Phase A — Core Data & Billing**
- `onboarding_profiles` table + RLS ✅ (next: persistence)
- Plans & subscriptions (Stripe)
- Usage counters & hard limits

**Phase B — Documents & Vector Search**
- Upload → Storage (Supabase)
- Background processing (chunking + embeddings w/ pgvector)
- `/api/search` RAG over user-scoped vectors

**Phase C — Quiz Engine**
- `/api/quizzes` — generate questions from selected docs
- Quiz player UI with autosave + explanations
- Anti-abuse & plan enforcement

**Phase D — Admin / Analytics**
- Admin panel, logs, feature flags
- Product analytics (PostHog), error tracking (Sentry)

**Phase E — Security / Perf / Compliance**
- CSP, secure headers, PITR backups, status page

**Phase F — Deploy & Ops**
- Vercel deploy, health checks, cron for processing, incident playbook

---

## 🧩 Architecture
Next.js (App Router)
├─ Auth: Clerk (middleware protects non-public routes)
├─ UI: Tailwind minimal light theme
├─ API routes:
│  ├─ /api/geodb         ← local JSON + RapidAPI fallback (fuzzy)
│  ├─ /api/onboarding    ← (next) persist profile to Supabase (service role)
│  ├─ /api/upload        ← (next) presigned Storage URL
│  ├─ /api/process       ← (next) background text → chunks → embeddings
│  ├─ /api/quizzes       ← (next) generate/store quizzes
│  └─ /api/search        ← (next) vector search (pgvector)
└─ Supabase
├─ Postgres + RLS
├─ Storage (docs/)
└─ pgvector (document_chunks)
---

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (Turbopack), React 19, Tailwind
- **Auth**: Clerk (SSO-ready)
- **DB/Storage**: Supabase (Postgres, RLS, Storage, pgvector)
- **AI**: OpenAI (embeddings + quiz generation)
- **Billing**: Stripe (checkout + webhooks)
- **Search**: Fuse.js (local fuzzy), pgvector (semantic search)
- **Deploy**: Vercel
- **Observability**: Vercel Logs, PostHog, Sentry (planned)

---

## 📦 Project Structure
app/
api/
geodb/route.ts          # country/city proxy (local first + RapidAPI fallback)
onboarding/route.ts     # (next) save profile to Supabase
onboarding/page.tsx       # two-column onboarding
dashboard/page.tsx        # (next) landing after onboarding
components/
GeoSelect.tsx             # reusable autocomplete (fuzzy + async)
data/
countries.json            # local country list (normalized)
cities.json               # local top cities (compact), API fallback beyond
utils/
supabase/
client.ts               # browser client
server.ts               # SSR client (cookies-safe)
middleware.ts           # cookie bridging (internal)
types/
json.d.ts                 # JSON module typings

README.md
tsconfig.json
jsconfig.json
.next.config
> Imports use `@/…` aliases everywhere to keep paths stable across refactors.

---

## 🔐 Security & Privacy

- **Service-role key never exposed to the browser**. Server-only in API routes, background jobs, or server components.
- **RLS** on user tables; all queries scoped by `user_id = auth.uid()`.
- **Minimal PII**: name, email, academic context; docs are user-owned, never shared.

---

## 🧪 Local Development

### 1) Prereqs
- Node 18+
- Supabase project
- Clerk application

### 2) Env vars

Create `.env.local` (never commit this):

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_***
CLERK_SECRET_KEY=sk_***

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...   # server-only usage

# RapidAPI (for GeoDB fallback)
RAPIDAPI_KEY=xxxxxxxxxxxxxxxx

# OpenAI (for quiz generation later)
OPENAI_API_KEY=sk-********************************
3) Install & run
npm install
npm run dev
# App starts on http://localhost:3000 (or the next free port)
🌍 Geo Data Strategy
	•	Countries: served from local countries.json, fuzzy search via Fuse.js.
	•	Cities: local cities.json (compact, common cities). If not found or exhausted, backend falls back to GeoDB (RapidAPI) with a short in-memory cache to control usage/costs.

Why?
	•	Low latency for the 95% path.
	•	Resilient when external APIs throttle or are down.
	•	Predictable costs.

⸻

🧱 Next Up (MVP backbone)
	1.	Persist onboarding
	•	/app/api/onboarding/route.ts (POST)
	•	Supabase onboarding_profiles (SQL + RLS)
	•	Redirect to /dashboard when profile exists
	2.	Dashboard skeleton
	•	Shows profile summary, “Upload documents” CTA
	3.	Upload → Storage
	•	/api/upload issues presigned URL (size/type limits per plan)
	4.	Background processing
	•	Vercel Cron (or Supabase Functions) to: extract text → chunk → embed → pgvector
	5.	Quiz generation
	•	/api/quizzes → enforce plan limits → store quiz/questions
	6.	Billing
	•	Stripe products & webhooks → subscriptions table
	7.	Observability
	•	PostHog + Sentry + Vercel Logs hooks

⸻

🧾 Design Decisions (and why)
	•	Clerk over building auth: fast, secure, SSO-ready, customizable.
	•	Supabase DB + Storage: Postgres + RLS + pgvector in one toolchain.
	•	Local-first geo: speed and cost control; fallback only when needed.
	•	Minimal styling: clean light theme, black accents → reduces cognitive load.
	•	Strict boundaries: service role keys and sensitive ops only on the server.

⸻

🧪 Testing
	•	Unit tests (coming) for utility transforms & quiz schema validation.
	•	API tests (coming) for /api/geodb, /api/onboarding, /api/quizzes.
	•	Manual E2E flows through onboarding → dashboard until Playwright is added.

⸻

🧑‍💻 Contributing

We keep it lean:
	•	Small PRs with clear scope
	•	Include a short Loom/GIF for UI changes
	•	Never commit .env.local or credentials

⸻

📄 License

Proprietary © LetsReWise. All rights reserved.
Contact: hello@letsrewise.com
