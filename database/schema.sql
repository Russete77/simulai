-- =====================================================
-- SIMULAI OAB - DATABASE SCHEMA
-- PostgreSQL/Supabase Schema for OAB Exam Platform
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
    subscription_expires_at TIMESTAMPTZ,
    study_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User study statistics
CREATE TABLE public.user_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    total_questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_study_time_minutes INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]',
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- QUESTIONS & CONTENT
-- =====================================================

-- OAB Questions (imported from Hugging Face dataset)
CREATE TABLE public.questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    external_id TEXT UNIQUE, -- Original ID from dataset
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of options: [{"key": "A", "text": "..."}, ...]
    correct_answer TEXT NOT NULL, -- A, B, C, D, E
    explanation TEXT,
    category TEXT, -- Direito Civil, Penal, etc.
    subcategory TEXT,
    difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    exam_year INTEGER,
    exam_edition TEXT, -- 1ª fase, 2ª fase, etc.
    source TEXT DEFAULT 'FGV',
    tags TEXT[], -- Array of tags
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question statistics
CREATE TABLE public.question_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    total_attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    average_time_seconds INTEGER DEFAULT 0,
    difficulty_rating DECIMAL(3,2) DEFAULT 0.0, -- Calculated difficulty
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(question_id)
);

-- =====================================================
-- SIMULATIONS & EXAMS
-- =====================================================

-- Simulation templates
CREATE TABLE public.simulations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    question_count INTEGER NOT NULL,
    duration_minutes INTEGER NOT NULL,
    difficulty_level TEXT DEFAULT 'medium' CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    categories TEXT[], -- Filter by categories
    exam_type TEXT DEFAULT 'mixed' CHECK (exam_type IN ('mixed', 'first_phase', 'second_phase')),
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User simulation attempts
CREATE TABLE public.user_simulations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    simulation_id UUID REFERENCES public.simulations(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    score DECIMAL(5,2), -- Percentage score
    correct_answers INTEGER DEFAULT 0,
    total_questions INTEGER NOT NULL,
    time_taken_minutes INTEGER,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    answers JSONB DEFAULT '{}', -- {"question_id": {"answer": "A", "time_seconds": 30}, ...}
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER INTERACTIONS & HISTORY
-- =====================================================

-- User question history
CREATE TABLE public.user_question_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    simulation_id UUID REFERENCES public.user_simulations(id) ON DELETE SET NULL,
    selected_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds INTEGER,
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards created by users
CREATE TABLE public.flashcards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    front_content TEXT NOT NULL,
    back_content TEXT NOT NULL,
    category TEXT,
    difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    review_count INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ,
    next_review_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User study notes and summaries
CREATE TABLE public.study_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- GAMIFICATION & ACHIEVEMENTS
-- =====================================================

-- Achievement definitions
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT,
    category TEXT,
    points INTEGER DEFAULT 0,
    requirements JSONB NOT NULL, -- Conditions to unlock
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Daily study streaks
CREATE TABLE public.study_streaks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    questions_answered INTEGER DEFAULT 0,
    study_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Questions indexes
CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty_level);
CREATE INDEX idx_questions_exam_year ON public.questions(exam_year);
CREATE INDEX idx_questions_tags ON public.questions USING GIN(tags);
CREATE INDEX idx_questions_active ON public.questions(is_active);

-- User history indexes
CREATE INDEX idx_user_history_user_id ON public.user_question_history(user_id);
CREATE INDEX idx_user_history_question_id ON public.user_question_history(question_id);
CREATE INDEX idx_user_history_answered_at ON public.user_question_history(answered_at);

-- Simulations indexes
CREATE INDEX idx_user_simulations_user_id ON public.user_simulations(user_id);
CREATE INDEX idx_user_simulations_status ON public.user_simulations(status);
CREATE INDEX idx_user_simulations_completed_at ON public.user_simulations(completed_at);

-- Flashcards indexes
CREATE INDEX idx_flashcards_user_id ON public.flashcards(user_id);
CREATE INDEX idx_flashcards_next_review ON public.flashcards(next_review_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- User stats policies
CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR ALL USING (auth.uid() = user_id);

-- User simulations policies
CREATE POLICY "Users can manage own simulations" ON public.user_simulations
    FOR ALL USING (auth.uid() = user_id);

-- User history policies
CREATE POLICY "Users can manage own history" ON public.user_question_history
    FOR ALL USING (auth.uid() = user_id);

-- Flashcards policies
CREATE POLICY "Users can manage own flashcards" ON public.flashcards
    FOR ALL USING (auth.uid() = user_id);

-- Study notes policies
CREATE POLICY "Users can manage own notes" ON public.study_notes
    FOR ALL USING (auth.uid() = user_id OR is_public = true);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- Study streaks policies
CREATE POLICY "Users can manage own streaks" ON public.study_streaks
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at BEFORE UPDATE ON public.flashcards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_notes_updated_at BEFORE UPDATE ON public.study_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user level based on XP
CREATE OR REPLACE FUNCTION calculate_user_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level = sqrt(XP / 100) + 1
    RETURN FLOOR(SQRT(xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to update user stats after question answer
CREATE OR REPLACE FUNCTION update_user_stats_after_answer()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user stats
    INSERT INTO public.user_stats (user_id, total_questions_answered, correct_answers, last_activity_at)
    VALUES (NEW.user_id, 1, CASE WHEN NEW.is_correct THEN 1 ELSE 0 END, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        total_questions_answered = user_stats.total_questions_answered + 1,
        correct_answers = user_stats.correct_answers + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
        experience_points = user_stats.experience_points + CASE WHEN NEW.is_correct THEN 10 ELSE 2 END,
        level = calculate_user_level(user_stats.experience_points + CASE WHEN NEW.is_correct THEN 10 ELSE 2 END),
        last_activity_at = NOW(),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats after answering questions
CREATE TRIGGER update_stats_after_answer
    AFTER INSERT ON public.user_question_history
    FOR EACH ROW EXECUTE FUNCTION update_user_stats_after_answer();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, category, points, requirements) VALUES
('First Steps', 'Answer your first question', '🎯', 'milestone', 10, '{"questions_answered": 1}'),
('Getting Started', 'Answer 10 questions', '📚', 'milestone', 50, '{"questions_answered": 10}'),
('Dedicated Student', 'Answer 100 questions', '🎓', 'milestone', 200, '{"questions_answered": 100}'),
('Master Student', 'Answer 500 questions', '👨‍🎓', 'milestone', 500, '{"questions_answered": 500}'),
('Perfectionist', 'Get 10 questions correct in a row', '💯', 'streak', 100, '{"correct_streak": 10}'),
('Week Warrior', 'Study for 7 days in a row', '🔥', 'streak', 150, '{"daily_streak": 7}'),
('Month Master', 'Study for 30 days in a row', '🏆', 'streak', 500, '{"daily_streak": 30}'),
('Speed Demon', 'Answer a question in under 10 seconds', '⚡', 'speed', 25, '{"answer_time_seconds": 10}'),
('Civil Law Expert', 'Get 50 Civil Law questions correct', '⚖️', 'subject', 200, '{"category_correct": {"Direito Civil": 50}}'),
('Criminal Law Expert', 'Get 50 Criminal Law questions correct', '🚔', 'subject', 200, '{"category_correct": {"Direito Penal": 50}}');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- User performance view
CREATE VIEW user_performance AS
SELECT 
    p.id as user_id,
    p.full_name,
    us.total_questions_answered,
    us.correct_answers,
    ROUND((us.correct_answers::DECIMAL / NULLIF(us.total_questions_answered, 0)) * 100, 2) as accuracy_percentage,
    us.current_streak,
    us.longest_streak,
    us.level,
    us.experience_points,
    us.last_activity_at
FROM public.profiles p
LEFT JOIN public.user_stats us ON p.id = us.user_id;

-- Question difficulty view
CREATE VIEW question_difficulty AS
SELECT 
    q.id,
    q.question_text,
    q.category,
    q.difficulty_level,
    qs.total_attempts,
    qs.correct_attempts,
    ROUND((qs.correct_attempts::DECIMAL / NULLIF(qs.total_attempts, 0)) * 100, 2) as success_rate,
    CASE 
        WHEN qs.total_attempts = 0 THEN q.difficulty_level
        WHEN (qs.correct_attempts::DECIMAL / qs.total_attempts) > 0.8 THEN 'easy'
        WHEN (qs.correct_attempts::DECIMAL / qs.total_attempts) > 0.5 THEN 'medium'
        ELSE 'hard'
    END as calculated_difficulty
FROM public.questions q
LEFT JOIN public.question_stats qs ON q.id = qs.question_id
WHERE q.is_active = true;
