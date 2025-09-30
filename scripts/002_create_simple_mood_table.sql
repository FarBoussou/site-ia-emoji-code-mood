-- Simplified table structure without session complexity
CREATE TABLE IF NOT EXISTS mood_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  mood_emoji TEXT NOT NULL,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 0 AND energy_level <= 100),
  preferred_ai_tool TEXT,
  preferred_language TEXT,
  code_snippet TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE mood_responses ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read and insert (no authentication required)
CREATE POLICY "Allow public read access" ON mood_responses
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON mood_responses
  FOR INSERT WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_mood_responses_created_at ON mood_responses(created_at DESC);
