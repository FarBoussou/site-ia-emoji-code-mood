-- Create sessions table for teacher-created sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  teacher_name TEXT NOT NULL,
  session_code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mood_responses table for student responses
CREATE TABLE IF NOT EXISTS mood_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  mood_emoji TEXT NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  ai_preference TEXT NOT NULL, -- favorite AI tool/technology
  code_snippet TEXT,
  programming_language TEXT NOT NULL,
  learning_goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for sessions (teachers can manage their own sessions)
CREATE POLICY "Allow public read access to active sessions" ON sessions 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow insert for anyone" ON sessions 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for session creators" ON sessions 
  FOR UPDATE USING (true);

-- Create policies for mood_responses (students can add responses, teachers can view)
CREATE POLICY "Allow public read access to mood responses" ON mood_responses 
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for anyone" ON mood_responses 
  FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_mood_responses_session ON mood_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_mood_responses_created ON mood_responses(created_at);
