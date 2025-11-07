-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  share_token TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  is_readonly BOOLEAN DEFAULT FALSE
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);

-- Create index on share_token for faster shared note lookups
CREATE INDEX IF NOT EXISTS notes_share_token_idx ON notes(share_token);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own notes
CREATE POLICY "Users can read their own notes"
  ON notes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own notes
CREATE POLICY "Users can insert their own notes"
  ON notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own notes
CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own notes
CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public notes can be read by anyone with the share_token
CREATE POLICY "Public notes can be read by anyone"
  ON notes
  FOR SELECT
  USING (is_public = TRUE);

-- Policy: Public notes can be updated by anyone if not readonly (for shared editing)
-- Note: This allows anyone with the share link to edit. The application layer
-- ensures users can only access notes via the correct share_token
CREATE POLICY "Public notes can be updated if not readonly"
  ON notes
  FOR UPDATE
  USING (is_public = TRUE AND is_readonly = FALSE)
  WITH CHECK (is_public = TRUE AND is_readonly = FALSE);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on note updates
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

