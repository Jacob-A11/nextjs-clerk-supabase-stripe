# LetsReWise: CTO Architecture & Business Plan
## £500k Pre-Seed Investable SaaS | £100k ARR Target

---

## Executive Summary

**Mission**: Transform LetsReWise from MVP foundation into a production-ready, investable SaaS platform capable of generating £100k ARR and scaling to £250k ARR within 18 months.

**Current State**: Strong foundation with authentication, onboarding, and landing page. Missing core quiz engine, billing, and AI orchestration.

**Target State**: Full-featured AI learning platform with credit-based pricing, intelligent document processing, adaptive learning, and comprehensive analytics.

---

## Business Model Analysis

### Revenue Model: Credit-Based Pricing (Manus-Inspired)

#### Pricing Tiers

**Starter Plan - £9/month (108 credits)**
- 3 document uploads (30 credits each = 90 credits)
- 6 quiz generations (3 credits each = 18 credits)
- Basic flashcards included
- Email support
- **Target**: Students, casual learners

**Pro Plan - £29/month (348 credits)**
- 10 document uploads (30 credits each = 300 credits)
- 16 quiz generations (3 credits each = 48 credits)
- Advanced AI features
- Priority support
- Export capabilities
- **Target**: Serious students, professionals

**Team Plan - £99/month (1,200 credits + shared pool)**
- Unlimited uploads for team
- 400 quiz generations
- Team analytics
- Dedicated support
- Custom integrations
- **Target**: Universities, corporate training

**Enterprise - Custom Pricing**
- White-label options
- Custom AI models
- SSO integration
- SLA guarantees
- **Target**: Large institutions

#### Credit System Economics

**Credit Allocation**:
- Document upload (PDF/DOCX): 30 credits
- Quiz generation (10 questions): 3 credits
- Flashcard set generation: 2 credits
- AI explanation request: 1 credit
- Document re-processing: 15 credits

**Cost Analysis** (per user/month on Pro Plan):
- OpenAI API costs: ~£2.50 (GPT-4-mini for generation)
- Supabase storage/compute: ~£0.80
- Clerk authentication: ~£0.20
- Infrastructure (Vercel): ~£0.30
- **Total cost**: ~£3.80 per user
- **Margin**: £29 - £3.80 = £25.20 (87% gross margin)
- **Target**: <20% cost ratio ✅ (13% achieved)

#### Extra Credit Purchase
- 100 credits: £5 (one-time)
- 250 credits: £10 (one-time)
- 600 credits: £20 (one-time)
- Credits never expire
- **Margin**: 85%+ on credit purchases

---

## ARR Projections

### £100k ARR Target (Year 1)

**Customer Mix**:
- 200 Pro users @ £29/month = £5,800/month
- 50 Team users @ £99/month = £4,950/month
- 500 Starter users @ £9/month = £4,500/month
- 5 Enterprise @ £500/month = £2,500/month
- Credit purchases: £1,250/month

**Monthly Revenue**: £19,000
**Annual Revenue**: £228,000 (exceeds £100k target) ✅

**Conservative Scenario** (50% of above):
- 100 Pro, 25 Team, 250 Starter, 2 Enterprise
- **Monthly**: £9,500
- **Annual**: £114,000 (still exceeds £100k) ✅

### £250k ARR Target (18 months)

**Growth Strategy**:
- 500 Pro users @ £29/month = £14,500/month
- 120 Team users @ £99/month = £11,880/month
- 800 Starter users @ £9/month = £7,200/month
- 12 Enterprise @ £500/month = £6,000/month
- Credit purchases: £3,000/month

**Monthly Revenue**: £42,580
**Annual Revenue**: £510,960 (exceeds £250k target) ✅

**Key Growth Drivers**:
1. University partnerships (Team/Enterprise)
2. Professional certification market (SQE, ACCA, CFA)
3. Corporate training programs
4. Viral referral program
5. Content marketing (SEO)

---

## Technical Architecture

### System Design Principles

1. **Scalability**: Serverless-first, edge-optimized
2. **Security**: Zero-trust, RLS everywhere, encrypted at rest
3. **Performance**: <2s page loads, <5s quiz generation
4. **Reliability**: 99.9% uptime, graceful degradation
5. **Cost-efficiency**: Optimize AI calls, cache aggressively

### Technology Stack (Optimized for Vercel Free Tier)

#### Frontend
- **Next.js 16** (App Router, Turbopack)
- **React 19** (Server Components where possible)
- **shadcn/ui** (Radix UI primitives)
- **Tailwind CSS 4** (JIT compilation)
- **Framer Motion** (60fps animations)

#### Backend
- **Vercel Edge Functions** (geo-distributed)
- **Vercel Serverless Functions** (API routes)
- **Supabase** (Postgres + Storage + Realtime)
- **Upstash Redis** (rate limiting, caching) - FREE tier
- **Vercel KV** (session storage) - FREE tier

#### AI & ML
- **OpenAI GPT-4o-mini** (cost-optimized, fast)
- **OpenAI text-embedding-3-small** (512 dimensions)
- **Supabase pgvector** (vector similarity search)
- **LangChain** (orchestration, streaming)

#### Authentication & Payments
- **Clerk** (10k free users)
- **Stripe** (standard pricing)

#### Analytics & Monitoring
- **PostHog** (free tier: 1M events)
- **Vercel Analytics** (included)
- **Sentry** (free tier: 5k errors)

#### Storage & CDN
- **Supabase Storage** (free: 1GB)
- **Vercel Edge Network** (global CDN)

### Database Schema

```sql
-- User Profiles (already exists)
user_profiles (
  id uuid PRIMARY KEY,
  user_id text UNIQUE NOT NULL,
  full_name text,
  email text,
  credits integer DEFAULT 0,
  plan_type text DEFAULT 'free',
  subscription_id text,
  created_at timestamp,
  updated_at timestamp
)

-- Documents
documents (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size integer,
  status text DEFAULT 'processing',
  processed_at timestamp,
  chunk_count integer,
  created_at timestamp,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
)

-- Document Chunks (for RAG)
document_chunks (
  id uuid PRIMARY KEY,
  document_id uuid NOT NULL,
  content text NOT NULL,
  embedding vector(512),
  chunk_index integer,
  metadata jsonb,
  created_at timestamp,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
)

-- Quizzes
quizzes (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  document_id uuid,
  title text NOT NULL,
  difficulty text DEFAULT 'medium',
  question_count integer,
  status text DEFAULT 'draft',
  created_at timestamp,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
)

-- Questions
questions (
  id uuid PRIMARY KEY,
  quiz_id uuid NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL,
  options jsonb,
  correct_answer text NOT NULL,
  explanation text,
  difficulty text,
  order_index integer,
  created_at timestamp,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
)

-- Quiz Attempts
quiz_attempts (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  quiz_id uuid NOT NULL,
  score integer,
  total_questions integer,
  time_taken integer,
  answers jsonb,
  completed_at timestamp,
  created_at timestamp,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
)

-- Flashcards
flashcards (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  document_id uuid,
  front_text text NOT NULL,
  back_text text NOT NULL,
  difficulty integer DEFAULT 0,
  next_review timestamp,
  review_count integer DEFAULT 0,
  created_at timestamp,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
)

-- Credit Transactions
credit_transactions (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  amount integer NOT NULL,
  transaction_type text NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamp,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
)

-- Subscriptions
subscriptions (
  id uuid PRIMARY KEY,
  user_id text NOT NULL,
  stripe_subscription_id text UNIQUE,
  plan_type text NOT NULL,
  status text NOT NULL,
  current_period_start timestamp,
  current_period_end timestamp,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp,
  updated_at timestamp,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
)

-- Analytics Events
analytics_events (
  id uuid PRIMARY KEY,
  user_id text,
  event_name text NOT NULL,
  event_data jsonb,
  created_at timestamp
)
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Documents: users can only see their own
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Similar policies for all other tables...
```

---

## AI Agentic Features & Orchestration

### Intelligent Document Processing Pipeline

**Phase 1: Upload & Extraction**
1. User uploads document (PDF/DOCX/TXT)
2. Validate file type, size, virus scan
3. Store in Supabase Storage
4. Trigger async processing job

**Phase 2: Text Extraction & Chunking**
1. Extract text using pdf-parse or mammoth
2. Clean and normalize text
3. Intelligent chunking (semantic boundaries)
4. Generate embeddings for each chunk
5. Store in pgvector

**Phase 3: AI Analysis**
1. Analyze document structure
2. Identify key concepts and topics
3. Determine difficulty level
4. Extract learning objectives
5. Store metadata

### Adaptive Quiz Generation

**AI Agent: QuizMaster**
- **Input**: Document chunks, user preferences, difficulty
- **Process**:
  1. Retrieve relevant chunks via semantic search
  2. Generate questions using GPT-4o-mini with structured output
  3. Validate question quality (no hallucinations)
  4. Ensure answer correctness
  5. Generate detailed explanations
- **Output**: Structured quiz with 10-50 questions

**Question Types**:
- Multiple choice (4 options)
- True/False
- Short answer
- Fill in the blank
- Matching

**Prompt Engineering**:
```
You are an expert educator creating quiz questions from study materials.

Context: {document_chunks}
Difficulty: {difficulty_level}
Topic: {topic}

Generate {num_questions} high-quality quiz questions that:
1. Test understanding, not memorization
2. Have clear, unambiguous correct answers
3. Include distractors that reveal common misconceptions
4. Provide detailed explanations

Output format: JSON array of questions
```

### Adaptive Learning Engine

**AI Agent: LearningCoach**
- Tracks user performance across quizzes
- Identifies weak areas
- Recommends targeted revision
- Adjusts difficulty dynamically
- Implements spaced repetition

**Algorithm**:
1. Calculate mastery score per topic
2. Identify topics with <70% accuracy
3. Generate targeted quizzes for weak areas
4. Schedule reviews using SM-2 algorithm
5. Provide personalized study plans

### Intelligent Flashcard Generation

**AI Agent: FlashcardGenerator**
- Extracts key facts from documents
- Creates question-answer pairs
- Implements spaced repetition
- Adapts to user performance

### AI Orchestration Layer

**Workflow Manager**:
- Queues AI tasks (document processing, quiz generation)
- Manages rate limits
- Handles retries and failures
- Monitors costs
- Provides progress updates to users

**Cost Optimization**:
- Cache common queries
- Batch API calls where possible
- Use cheaper models for simple tasks
- Implement request deduplication

---

## Feature Roadmap

### Phase 1: Core Infrastructure (CRITICAL)
- ✅ Authentication (Clerk)
- ✅ Onboarding
- ✅ Landing page
- 🔨 Database schema with RLS
- 🔨 Credit system foundation
- 🔨 Subscription management

### Phase 2: Document Processing (CRITICAL)
- 🔨 File upload UI (drag-drop)
- 🔨 Supabase Storage integration
- 🔨 Text extraction pipeline
- 🔨 Chunking and embedding
- 🔨 Vector search setup

### Phase 3: Quiz Engine (CRITICAL)
- 🔨 AI quiz generation
- 🔨 Question validation
- 🔨 Quiz player UI
- 🔨 Answer checking
- 🔨 Explanation display

### Phase 4: Dashboard (HIGH PRIORITY)
- 🔨 User dashboard
- 🔨 Document library
- 🔨 Quiz history
- 🔨 Performance analytics
- 🔨 Credit balance display

### Phase 5: Billing (CRITICAL)
- 🔨 Stripe integration
- 🔨 Subscription checkout
- 🔨 Webhook handling
- 🔨 Credit purchase flow
- 🔨 Usage enforcement

### Phase 6: Flashcards (HIGH PRIORITY)
- 🔨 Flashcard generation
- 🔨 Study session UI
- 🔨 Spaced repetition
- 🔨 Progress tracking

### Phase 7: AI Features (MEDIUM PRIORITY)
- 🔨 Adaptive learning
- 🔨 Personalized recommendations
- 🔨 AI study coach
- 🔨 Performance insights

### Phase 8: Admin & Analytics (MEDIUM PRIORITY)
- 🔨 Admin dashboard
- 🔨 User management
- 🔨 Analytics overview
- 🔨 System monitoring

### Phase 9: Polish & Optimization (HIGH PRIORITY)
- 🔨 Performance optimization
- 🔨 Error handling
- 🔨 Loading states
- 🔨 Mobile optimization
- 🔨 Accessibility

### Phase 10: Production Readiness (CRITICAL)
- 🔨 Security audit
- 🔨 Environment variables
- 🔨 Error tracking (Sentry)
- 🔨 Rate limiting
- 🔨 GDPR compliance

---

## Landing Page Customization

### Retain Current Design ✅
- Keep minimalist black/white aesthetic
- Maintain smooth animations
- Preserve responsive layout
- Keep shadcn/ui components

### Enhancements Needed
1. **Add Credit System Messaging**
   - Update pricing section with credit details
   - Add "How Credits Work" section
   - Show credit calculator

2. **Strengthen Value Proposition**
   - Add ROI calculator (time saved)
   - Include success metrics
   - Add video demo

3. **Social Proof**
   - Add university logos (if partnerships exist)
   - Include case studies
   - Show live user count

4. **Trust Signals**
   - Add security badges
   - Include privacy policy link
   - Show compliance certifications

5. **CTA Optimization**
   - A/B test button text
   - Add urgency (limited beta spots)
   - Include free trial messaging

---

## Security & Compliance

### Security Measures
1. **Authentication**: Clerk with MFA support
2. **Authorization**: RLS on all database queries
3. **Encryption**: TLS in transit, AES-256 at rest
4. **API Security**: Rate limiting, CORS, CSP headers
5. **Input Validation**: Zod schemas everywhere
6. **File Upload**: Virus scanning, type validation
7. **Secrets Management**: Vercel environment variables

### GDPR Compliance
1. **Data Minimization**: Collect only necessary data
2. **Right to Access**: Export user data API
3. **Right to Deletion**: Cascade delete on user removal
4. **Consent Management**: Cookie banner, privacy policy
5. **Data Processing Agreement**: With Supabase, OpenAI

### Monitoring & Alerts
1. **Error Tracking**: Sentry for exceptions
2. **Performance**: Vercel Analytics
3. **User Behavior**: PostHog
4. **Uptime**: Better Uptime (free tier)
5. **Cost Alerts**: OpenAI usage alerts

---

## Go-to-Market Strategy

### Launch Plan

**Week 1-2: Beta Launch**
- Invite 50 beta users
- Collect feedback
- Fix critical bugs
- Iterate on UX

**Week 3-4: Public Launch**
- Product Hunt launch
- Reddit (r/GetStudying, r/LawSchool)
- Twitter/X announcement
- Email to waitlist

**Month 2-3: Growth**
- Content marketing (SEO)
- University partnerships
- Affiliate program
- Referral incentives

### Marketing Channels

**Organic**:
1. SEO content (study tips, exam prep)
2. YouTube tutorials
3. TikTok study tips
4. Reddit community engagement

**Paid** (when funded):
1. Google Ads (exam prep keywords)
2. Facebook/Instagram (student targeting)
3. LinkedIn (professional certifications)
4. Sponsorships (study YouTubers)

**Partnerships**:
1. Universities (Team/Enterprise plans)
2. Professional bodies (ACCA, Law Society)
3. Corporate training providers
4. EdTech platforms

### Pricing Strategy

**Launch Offer**:
- First 100 users: 50% off first 3 months
- Lifetime deal for early adopters
- Referral credits (50 credits per referral)

**Upsell Strategy**:
- Free → Starter (after 3 uploads)
- Starter → Pro (when credits run out)
- Pro → Team (for study groups)

---

## Investment Readiness

### Why £500k Pre-Seed?

**Use of Funds**:
- Engineering (2 FTE): £150k
- Marketing & Growth: £150k
- Infrastructure & AI costs: £50k
- Operations & Legal: £50k
- Runway: 18 months

**Traction Needed**:
- 1,000+ registered users
- 200+ paying customers
- £10k MRR
- 20% MoM growth
- <5% churn

### Key Metrics to Track

**Product**:
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Documents uploaded
- Quizzes generated
- Quiz completion rate

**Business**:
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC ratio (target: 3:1)
- Churn rate (target: <5%)
- Net Revenue Retention (NRR)

**Engagement**:
- Time spent per session
- Quizzes per user per week
- Credit usage rate
- Feature adoption

---

## Risk Mitigation

### Technical Risks
1. **AI Hallucinations**: Implement validation, human review
2. **Scaling Costs**: Optimize prompts, cache aggressively
3. **Performance**: Edge caching, lazy loading
4. **Downtime**: Multi-region deployment, graceful degradation

### Business Risks
1. **Competition**: Focus on UX, AI quality, pricing
2. **Market Fit**: Continuous user feedback, rapid iteration
3. **Churn**: Engagement features, value delivery
4. **Unit Economics**: Monitor costs, optimize margins

### Legal Risks
1. **Copyright**: User-uploaded content only
2. **AI Liability**: Disclaimers, terms of service
3. **GDPR**: Full compliance from day 1
4. **Accessibility**: WCAG 2.1 AA compliance

---

## Success Criteria

### MVP Launch (Week 4)
- ✅ All core features working
- ✅ <2s page load times
- ✅ 99% uptime
- ✅ Zero critical bugs
- ✅ Mobile responsive

### £100k ARR (Month 12)
- ✅ 750+ paying customers
- ✅ £8,500+ MRR
- ✅ <£30 CAC
- ✅ >£250 LTV
- ✅ <5% churn

### £250k ARR (Month 18)
- ✅ 1,500+ paying customers
- ✅ £21,000+ MRR
- ✅ 3+ Enterprise customers
- ✅ Profitable unit economics
- ✅ Ready for Series A

---

## Conclusion

LetsReWise has a strong foundation and clear path to £100k ARR. The credit-based pricing model ensures healthy margins (87%), and the AI-powered features provide defensible differentiation. With focused execution on the roadmap above, this can become a £500k pre-seed investable startup within 4 months of full development.

**Next Steps**: Execute Phases 1-10 systematically, launch beta, iterate based on feedback, and scale to £100k ARR.

---

**Prepared by**: AI CTO
**Date**: November 2025
**Status**: Ready for Implementation
