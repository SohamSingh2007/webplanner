-- CA Inter Group 2 Study Tracker Schema
-- Run this in your Supabase SQL Editor

-- 1. Create chapter_progress table
CREATE TABLE IF NOT EXISTS chapter_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('costing', 'fm', 'audit', 'sm')),
  chapter_index INT NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  rev1 BOOLEAN DEFAULT FALSE,
  rev2 BOOLEAN DEFAULT FALSE,
  rev3 BOOLEAN DEFAULT FALSE,
  test_done BOOLEAN DEFAULT FALSE,
  notes TEXT DEFAULT '',
  date_completed DATE,
  UNIQUE(user_id, subject, chapter_index)
);

-- 2. Create day_plans table
CREATE TABLE IF NOT EXISTS day_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  subject TEXT CHECK (subject IN ('costing', 'fm', 'audit', 'sm', '')),
  topic TEXT DEFAULT '',
  target TEXT DEFAULT '',
  hours FLOAT DEFAULT 0.0,
  done BOOLEAN DEFAULT FALSE
);

-- 3. Create revision_entries table
CREATE TABLE IF NOT EXISTS revision_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('costing', 'fm', 'audit', 'sm')),
  date_studied DATE NOT NULL,
  rev1_date DATE,
  rev2_date DATE,
  rev3_date DATE,
  rev4_date DATE,
  notes TEXT DEFAULT ''
);

-- 4. Create sa_tracker table
CREATE TABLE IF NOT EXISTS sa_tracker (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  sa_code TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, sa_code)
);

-- 5. Create study_hours table
CREATE TABLE IF NOT EXISTS study_hours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  total_hours FLOAT DEFAULT 0.0,
  UNIQUE(user_id, date)
);

-- 6. Create test_scores table
CREATE TABLE IF NOT EXISTS test_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('costing', 'fm', 'audit', 'sm')),
  chapter TEXT NOT NULL,
  test_type TEXT NOT NULL, -- 'Chapter', 'STP', 'RTP', 'PYQ', 'Mock', 'Other'
  marks FLOAT DEFAULT 0.0,
  total FLOAT DEFAULT 100.0,
  remarks TEXT DEFAULT ''
);

-- 7. Create mock_tests table
CREATE TABLE IF NOT EXISTS mock_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  test_name TEXT NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('costing', 'fm', 'audit', 'sm')),
  marks FLOAT DEFAULT 0.0,
  total FLOAT DEFAULT 100.0,
  remarks TEXT DEFAULT ''
);

-- 8. Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  priorities JSONB DEFAULT '[]'::jsonb,
  weak_topics TEXT DEFAULT '',
  weekly_review TEXT DEFAULT '',
  weekly_target FLOAT DEFAULT 42.0,
  productivity_rating INT DEFAULT 3,
  habits_today JSONB DEFAULT '{"woke_up":false,"no_social_media":false,"targets_met":false,"revised_yesterday":false,"active_posture":false}'::jsonb
);

-- 9. Enable Row Level Security (RLS) on all tables
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE revision_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sa_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS Policies allowing full access to owner
-- Check policies before creating them
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all actions for user' AND tablename = 'chapter_progress') THEN
        CREATE POLICY "Allow all actions for user" ON chapter_progress FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all actions for user' AND tablename = 'day_plans') THEN
        CREATE POLICY "Allow all actions for user" ON day_plans FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all actions for user' AND tablename = 'revision_entries') THEN
        CREATE POLICY "Allow all actions for user" ON revision_entries FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all actions for user' AND tablename = 'sa_tracker') THEN
        CREATE POLICY "Allow all actions for user" ON sa_tracker FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all actions for user' AND tablename = 'study_hours') THEN
        CREATE POLICY "Allow all actions for user" ON study_hours FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all actions for user' AND tablename = 'test_scores') THEN
        CREATE POLICY "Allow all actions for user" ON test_scores FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all actions for user' AND tablename = 'mock_tests') THEN
        CREATE POLICY "Allow all actions for user" ON mock_tests FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all actions for user' AND tablename = 'user_preferences') THEN
        CREATE POLICY "Allow all actions for user" ON user_preferences FOR ALL USING (user_id = auth.uid()::text) WITH CHECK (user_id = auth.uid()::text);
    END IF;
END
$$;

-- 11. Add all tables to the supabase_realtime publication to enable live updates
-- In Supabase, you can run this or enable it via the Dashboard.
-- If the publication exists, we can add tables to it.
BEGIN;
  -- Add table to publication if it is not already added
  -- Ignore duplicate table errors
  ALTER PUBLICATION supabase_realtime ADD TABLE chapter_progress;
  ALTER PUBLICATION supabase_realtime ADD TABLE day_plans;
  ALTER PUBLICATION supabase_realtime ADD TABLE revision_entries;
  ALTER PUBLICATION supabase_realtime ADD TABLE sa_tracker;
  ALTER PUBLICATION supabase_realtime ADD TABLE study_hours;
  ALTER PUBLICATION supabase_realtime ADD TABLE test_scores;
  ALTER PUBLICATION supabase_realtime ADD TABLE mock_tests;
  ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;
COMMIT;
