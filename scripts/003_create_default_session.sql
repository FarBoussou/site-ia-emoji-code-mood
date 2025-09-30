-- Create a default session for all mood responses
INSERT INTO sessions (id, title, description, session_code, teacher_name, is_active, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Session Publique',
  'Session par défaut pour partager les humeurs',
  'PUBLIC',
  'Système',
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Make session_id nullable in mood_responses table
ALTER TABLE mood_responses ALTER COLUMN session_id DROP NOT NULL;

-- Set default session_id for existing records without one
UPDATE mood_responses 
SET session_id = '00000000-0000-0000-0000-000000000000' 
WHERE session_id IS NULL;
