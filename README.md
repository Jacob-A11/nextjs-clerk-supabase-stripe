# LetsReWise — AI Study & Upskill Copilot for Students

(Next.js • Clerk • Supabase • OpenAI • Stripe)

LetsReWise is an AI-powered learning and upskilling platform that transforms any document into contextual quizzes, flashcards, and revision workflows — helping users learn, retain, and master topics faster.

⸻

# Upload → Learn → Revise → Retake → Master

⸻

# ✨ Why LetsReWise?

Most “AI study” tools fall into two traps:
	1.	Bloat & distraction — many features, none delightful
	2.	Flaky results — hallucinations, slow UX, no trust

# LetsReWise focuses on one promise:
Turn your documents into trusted quizzes you can practice—quickly.

# Product Principles
	•	Minimalism — fewer screens, fewer clicks, faster flow
	•	Determinism — same input → same quiz (hashing, consistent chunking)
	•	Ownership — strict RLS; your content stays yours
	•	Speed — local-first search, small payloads, smart caching

⸻

# ✅ What’s implemented (today)
	•	Auth & Protection — Clerk on Next.js App Router with modern middleware
	•	Onboarding — two-column, clean light UI (black accents)
	•	Geo Autocomplete — /api/geodb
	•	Countries: local JSON + Fuse.js fuzzy search
	•	Cities: local JSON (compact) → fallback RapidAPI (GeoDB) with cache
	•	Supabase wiring — SSR & browser clients; service-role only on server
	•	Stable imports — @/… aliases across app/components/data/lib/utils

This is the secure, reliable foundation for the AI quiz engine.

⸻

# 🧭 Roadmap

Phase A — Core Data & Billing
	•	onboarding_profiles + RLS ✅ (next: persist call)
	•	Plans & subscriptions (Stripe)
	•	Usage counters & hard limits

Phase B — Documents & Vector Search
	•	Upload → Storage (Supabase)
	•	Background processing (extract → chunk → embed via pgvector)
	•	/api/search RAG over user-scoped vectors

Phase C — Quiz Engine
	•	/api/quizzes — generate/store questions from selected docs
	•	Quiz player UI with autosave & explanations
	•	Anti-abuse & plan enforcement

Phase D — Admin / Analytics
	•	Admin panel, logs, feature flags
	•	Product analytics (PostHog), error tracking (Sentry)

Phase E — Security / Perf / Compliance
	•	CSP & secure headers, PITR backups, status page

Phase F — Deploy & Ops
	•	Vercel deploy, health checks, cron for processing, incident playbook

⸻

# 🧩 Architecture
Next.js (App Router)
├─ Auth: Clerk (middleware protects non-public routes)
├─ UI: Tailwind (light, minimal, black accents)
├─ API routes:
│  ├─ /api/geodb        ← local JSON + RapidAPI fallback (fuzzy)
│  ├─ /api/onboarding   ← (next) persist profile (server-only service role)
│  ├─ /api/upload       ← (next) presigned Storage URL
│  ├─ /api/process      ← (next) background: text → chunks → embeddings
│  ├─ /api/quizzes      ← (next) generate/store quizzes
│  └─ /api/search       ← (next) pgvector semantic search
└─ Supabase
   ├─ Postgres + RLS
   ├─ Storage (docs/)
   └─ pgvector (document_chunks)
   

   # 🛠 Tech Stack
	•	Frontend: Next.js 16 (Turbopack), React 19, Tailwind
	•	Auth: Clerk (email OTP + social; no passwords)
	•	DB/Storage: Supabase (Postgres, RLS, Storage, pgvector)
	•	AI: OpenAI (embeddings + quiz generation)
	•	Billing: Stripe (checkout + webhooks)
	•	Search: Fuse.js (local fuzzy), pgvector (semantic)
	•	Deploy: Vercel
	•	Observability: Vercel Logs, PostHog, Sentry (planned)

⸻

# 📦 Project Structure
app/
  api/
    geodb/route.ts         # country/city proxy (local-first + RapidAPI fallback + cache)
    onboarding/route.ts    # (next) save profile to Supabase (server-only)
  onboarding/page.tsx      # two-column onboarding UI
  dashboard/page.tsx       # (next) after onboarding
components/
  GeoSelect.tsx            # reusable autocomplete (fuzzy + async + keyboard nav)
data/
  countries.json           # all countries (normalized)
  cities.json              # compact top cities (fallback to API for rare)
utils/
  supabase/
    client.ts              # browser client
    server.ts              # SSR client (cookies bridge)
    middleware.ts          # cookie sync (internal)
types/
  json.d.ts                # JSON module typings

  All imports use @/… aliases (see tsconfig.json / jsconfig.json).

⸻

# 🔐 Security & Privacy
	•	Service-role key is server-only (API routes, server components, jobs)
	•	RLS on user tables; every query scoped by user_id = auth.uid()
	•	Minimal PII (name, email, academic context). No cross-tenant leakage

⸻

# 🌍 Geo Data Strategy
	•	Countries: local countries.json + Fuse.js fuzzy search
	•	Cities: local cities.json for common cases; if not found, backend falls back to GeoDB (RapidAPI) with a short in-memory cache to reduce cost

# Why this approach?
	•	Low latency for the 95% path
	•	Resilience when external APIs throttle or fail
	•	Predictable costs without sacrificing global coverage

⸻

# 🧱 Next Up (MVP Backbone)
	1.	Persist onboarding
	•	app/api/onboarding/route.ts (POST)
	•	Supabase onboarding_profiles (SQL + RLS)
	•	Redirect to /dashboard if profile exists
	2.	Dashboard skeleton
	•	Profile summary + Upload documents CTA
	3.	Upload → Storage
	•	/api/upload issues presigned URL (size/type limits per plan)
	4.	Background processing
	•	Vercel Cron or Supabase Functions:
	•	extract text → chunk → embed → pgvector
	5.	Quiz generation
	•	/api/quizzes → enforce limits → store quiz & questions
	6.	Billing
	•	Stripe products/webhooks → subscriptions table
	7.	Observability
	•	PostHog, Sentry, Vercel Logs wiring

⸻

# 🧾 Design Decisions (and why)
	•	Clerk over custom auth — faster, secure, passwordless, SSO-ready
	•	Supabase for Postgres + RLS + Storage + pgvector in one stack
	•	Local-first geo to stay fast and keep API costs sane
	•	Minimal UI (light, black accents) to reduce cognitive load
	•	Hard boundaries — service role & sensitive ops are server-only

⸻

# 🧪 Testing
	•	Unit tests (soon) for transforms & quiz schema validation
	•	API tests (soon) for /api/geodb, /api/onboarding, /api/quizzes
	•	E2E (soon) via Playwright

⸻

# 🧑‍💻 Contributing

We keep it lean:
	•	Small PRs with clear scope
	•	Include a short Loom/GIF for UI changes
	•	Never commit .env.local or credentials

⸻

# Screenshots

We will add onboarding and dashboard screenshots here once available.