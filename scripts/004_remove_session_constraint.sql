-- Remove the foreign key constraint and make session_id optional
ALTER TABLE mood_responses DROP CONSTRAINT IF EXISTS mood_responses_session_id_fkey;
ALTER TABLE mood_responses ALTER COLUMN session_id DROP NOT NULL;
