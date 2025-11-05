-- LetsReWise Database Schema
-- Version: 1.0.0
-- Description: Complete database schema with RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  
  -- Profile details
  country TEXT,
  country_code TEXT,
  city TEXT,
  university TEXT,
  course TEXT,
  purpose TEXT,
  referral_source TEXT,
  role TEXT DEFAULT 'student',
  
  -- Credits and subscription
  credits INTEGER DEFAULT 0,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'starter', 'pro', 'team', 'enterprise')),
  subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  
  -- Preferences
  privacy_consent BOOLEAN DEFAULT false,
  marketing_opt_in BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Index for faster lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_plan_type ON user_profiles(plan_type);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  
  -- Document details
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'txt', 'md')),
  file_size INTEGER NOT NULL,
  
  -- Processing status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processing_error TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Content metadata
  chunk_count INTEGER DEFAULT 0,
  word_count INTEGER,
  page_count INTEGER,
  language TEXT DEFAULT 'en',
  topics JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- ============================================
-- DOCUMENT CHUNKS TABLE (for RAG)
-- ============================================
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL,
  
  -- Chunk content
  content TEXT NOT NULL,
  embedding vector(512),
  
  -- Chunk metadata
  chunk_index INTEGER NOT NULL,
  chunk_type TEXT DEFAULT 'paragraph',
  tokens INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops);

-- ============================================
-- QUIZZES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  document_id UUID,
  
  -- Quiz details
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  question_count INTEGER DEFAULT 0,
  
  -- Quiz configuration
  time_limit INTEGER, -- in seconds
  passing_score INTEGER DEFAULT 70,
  shuffle_questions BOOLEAN DEFAULT true,
  shuffle_options BOOLEAN DEFAULT true,
  show_explanations BOOLEAN DEFAULT true,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_public BOOLEAN DEFAULT false,
  
  -- Metadata
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX idx_quizzes_document_id ON quizzes(document_id);
CREATE INDEX idx_quizzes_status ON quizzes(status);
CREATE INDEX idx_quizzes_created_at ON quizzes(created_at DESC);

-- ============================================
-- QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL,
  
  -- Question content
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'fill_blank', 'matching')),
  
  -- Options and answers
  options JSONB DEFAULT '[]'::jsonb, -- Array of options for MCQ
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  
  -- Question metadata
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  
  -- Source reference
  source_chunk_id UUID,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (source_chunk_id) REFERENCES document_chunks(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_order_index ON questions(order_index);

-- ============================================
-- QUIZ ATTEMPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  quiz_id UUID NOT NULL,
  
  -- Attempt results
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  incorrect_answers INTEGER NOT NULL,
  skipped_answers INTEGER DEFAULT 0,
  
  -- Time tracking
  time_taken INTEGER, -- in seconds
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Detailed answers
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Status
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  passed BOOLEAN,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_status ON quiz_attempts(status);
CREATE INDEX idx_quiz_attempts_created_at ON quiz_attempts(created_at DESC);

-- ============================================
-- FLASHCARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  document_id UUID,
  
  -- Flashcard content
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  hint TEXT,
  
  -- Spaced repetition (SM-2 algorithm)
  difficulty INTEGER DEFAULT 0, -- 0-5 scale
  interval INTEGER DEFAULT 0, -- days until next review
  repetitions INTEGER DEFAULT 0,
  ease_factor NUMERIC(3,2) DEFAULT 2.5,
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_reviewed TIMESTAMP WITH TIME ZONE,
  
  -- Statistics
  review_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  
  -- Metadata
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX idx_flashcards_document_id ON flashcards(document_id);
CREATE INDEX idx_flashcards_next_review ON flashcards(next_review);

-- ============================================
-- CREDIT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  
  -- Transaction details
  amount INTEGER NOT NULL, -- positive for credits, negative for deductions
  balance_after INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'purchase', 'subscription', 'bonus', 'refund',
    'document_upload', 'quiz_generation', 'flashcard_generation',
    'ai_explanation', 'document_reprocess'
  )),
  
  -- Description and metadata
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Related entities
  related_entity_type TEXT,
  related_entity_id UUID,
  
  -- Payment reference
  stripe_payment_intent_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  
  -- Stripe details
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  
  -- Subscription details
  plan_type TEXT NOT NULL CHECK (plan_type IN ('starter', 'pro', 'team', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  
  -- Billing period
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  
  -- Cancellation
  cancel_at_period_end BOOLEAN DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  
  -- Event details
  event_name TEXT NOT NULL,
  event_category TEXT,
  event_data JSONB DEFAULT '{}'::jsonb,
  
  -- Session tracking
  session_id TEXT,
  
  -- Device and location
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- ============================================
-- STUDY SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  
  -- Session details
  session_type TEXT NOT NULL CHECK (session_type IN ('quiz', 'flashcards', 'reading')),
  duration INTEGER, -- in seconds
  items_reviewed INTEGER DEFAULT 0,
  
  -- Performance
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_created_at ON study_sessions(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Documents Policies
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid()::text = user_id);

-- Document Chunks Policies
CREATE POLICY "Users can view own document chunks"
  ON document_chunks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM documents
    WHERE documents.id = document_chunks.document_id
    AND documents.user_id = auth.uid()::text
  ));

-- Quizzes Policies
CREATE POLICY "Users can view own quizzes"
  ON quizzes FOR SELECT
  USING (auth.uid()::text = user_id OR is_public = true);

CREATE POLICY "Users can insert own quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own quizzes"
  ON quizzes FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own quizzes"
  ON quizzes FOR DELETE
  USING (auth.uid()::text = user_id);

-- Questions Policies
CREATE POLICY "Users can view questions from accessible quizzes"
  ON questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quizzes
    WHERE quizzes.id = questions.quiz_id
    AND (quizzes.user_id = auth.uid()::text OR quizzes.is_public = true)
  ));

-- Quiz Attempts Policies
CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own quiz attempts"
  ON quiz_attempts FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Flashcards Policies
CREATE POLICY "Users can view own flashcards"
  ON flashcards FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own flashcards"
  ON flashcards FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own flashcards"
  ON flashcards FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own flashcards"
  ON flashcards FOR DELETE
  USING (auth.uid()::text = user_id);

-- Credit Transactions Policies
CREATE POLICY "Users can view own credit transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid()::text = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid()::text = user_id);

-- Analytics Events Policies
CREATE POLICY "Users can view own analytics events"
  ON analytics_events FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Study Sessions Policies
CREATE POLICY "Users can view own study sessions"
  ON study_sessions FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own study sessions"
  ON study_sessions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own study sessions"
  ON study_sessions FOR UPDATE
  USING (auth.uid()::text = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON flashcards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update question count in quizzes
CREATE OR REPLACE FUNCTION update_quiz_question_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE quizzes
  SET question_count = (
    SELECT COUNT(*) FROM questions WHERE quiz_id = NEW.quiz_id
  )
  WHERE id = NEW.quiz_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quiz_question_count_trigger
  AFTER INSERT OR DELETE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_quiz_question_count();

-- Function to update chunk count in documents
CREATE OR REPLACE FUNCTION update_document_chunk_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE documents
  SET chunk_count = (
    SELECT COUNT(*) FROM document_chunks WHERE document_id = NEW.document_id
  )
  WHERE id = NEW.document_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_document_chunk_count_trigger
  AFTER INSERT OR DELETE ON document_chunks
  FOR EACH ROW EXECUTE FUNCTION update_document_chunk_count();

-- ============================================
-- INITIAL DATA / SEED DATA
-- ============================================

-- Insert default credit costs (for reference)
CREATE TABLE IF NOT EXISTS credit_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type TEXT UNIQUE NOT NULL,
  credit_cost INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO credit_costs (action_type, credit_cost, description) VALUES
  ('document_upload', 30, 'Upload and process a document (PDF, DOCX, TXT)'),
  ('quiz_generation', 3, 'Generate a quiz with 10 questions'),
  ('flashcard_generation', 2, 'Generate a set of flashcards'),
  ('ai_explanation', 1, 'Request AI explanation for a question'),
  ('document_reprocess', 15, 'Reprocess an existing document')
ON CONFLICT (action_type) DO NOTHING;

-- Insert default plan configurations
CREATE TABLE IF NOT EXISTS plan_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_type TEXT UNIQUE NOT NULL,
  monthly_price_gbp NUMERIC(10,2) NOT NULL,
  monthly_credits INTEGER NOT NULL,
  features JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO plan_configs (plan_type, monthly_price_gbp, monthly_credits, features) VALUES
  ('free', 0.00, 0, '{"uploads": 0, "quizzes": 0, "support": "community"}'::jsonb),
  ('starter', 9.00, 108, '{"uploads": 3, "quizzes": 6, "support": "email"}'::jsonb),
  ('pro', 29.00, 348, '{"uploads": 10, "quizzes": 16, "support": "priority", "export": true}'::jsonb),
  ('team', 99.00, 1200, '{"uploads": "unlimited", "quizzes": 400, "support": "dedicated", "analytics": true}'::jsonb),
  ('enterprise', 0.00, 0, '{"custom": true}'::jsonb)
ON CONFLICT (plan_type) DO NOTHING;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- User stats view
CREATE OR REPLACE VIEW user_stats AS
SELECT
  up.user_id,
  up.full_name,
  up.email,
  up.plan_type,
  up.credits,
  COUNT(DISTINCT d.id) as document_count,
  COUNT(DISTINCT q.id) as quiz_count,
  COUNT(DISTINCT qa.id) as quiz_attempt_count,
  COUNT(DISTINCT f.id) as flashcard_count,
  up.created_at as user_since
FROM user_profiles up
LEFT JOIN documents d ON up.user_id = d.user_id
LEFT JOIN quizzes q ON up.user_id = q.user_id
LEFT JOIN quiz_attempts qa ON up.user_id = qa.user_id
LEFT JOIN flashcards f ON up.user_id = f.user_id
GROUP BY up.user_id, up.full_name, up.email, up.plan_type, up.credits, up.created_at;

-- Quiz performance view
CREATE OR REPLACE VIEW quiz_performance AS
SELECT
  qa.user_id,
  qa.quiz_id,
  q.title as quiz_title,
  COUNT(*) as attempt_count,
  AVG(qa.score) as average_score,
  MAX(qa.score) as best_score,
  AVG(qa.time_taken) as average_time,
  SUM(CASE WHEN qa.passed THEN 1 ELSE 0 END) as passed_count
FROM quiz_attempts qa
JOIN quizzes q ON qa.quiz_id = q.id
WHERE qa.status = 'completed'
GROUP BY qa.user_id, qa.quiz_id, q.title;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'LetsReWise database schema created successfully!';
  RAISE NOTICE 'Tables: 11 core tables + 2 config tables';
  RAISE NOTICE 'RLS: Enabled on all user-facing tables';
  RAISE NOTICE 'Indexes: Optimized for common queries';
  RAISE NOTICE 'Triggers: Auto-update timestamps and counts';
END $$;
