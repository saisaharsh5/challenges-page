/*
  # Add Section Content Management (Safe Migration)

  1. New Tables
    - `section_content` (if not exists)
      - `id` (uuid, primary key)
      - `section_key` (text, unique)
      - `title` (text)
      - `description` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `section_content` table (if not already enabled)
    - Add policies for authenticated users and public read access (if not exists)

  3. Initial Data
    - Pre-populate with default section content (if not exists)
*/

-- Create section_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS section_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'section_content' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist, then create new ones
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'section_content' 
    AND policyname = 'Allow authenticated users full access to section_content'
  ) THEN
    DROP POLICY "Allow authenticated users full access to section_content" ON section_content;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'section_content' 
    AND policyname = 'Allow public read access on section_content'
  ) THEN
    DROP POLICY "Allow public read access on section_content" ON section_content;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Allow authenticated users full access to section_content"
  ON section_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on section_content"
  ON section_content
  FOR SELECT
  TO anon
  USING (true);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_section_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create new one
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_section_content_updated_at'
    AND tgrelid = 'section_content'::regclass
  ) THEN
    DROP TRIGGER update_section_content_updated_at ON section_content;
  END IF;
END $$;

-- Create trigger
CREATE TRIGGER update_section_content_updated_at
  BEFORE UPDATE ON section_content
  FOR EACH ROW
  EXECUTE FUNCTION update_section_content_updated_at();

-- Insert default section content (only if not exists)
INSERT INTO section_content (section_key, title, description) VALUES
  ('tryhackme', 'TryHackMe Rooms', 'Hands-on cybersecurity challenges and learning paths'),
  ('hackthebox', 'Hack The Box Machines', 'Advanced penetration testing challenges and machine exploitation'),
  ('ctf', 'CTF Challenges', 'Competitive cybersecurity challenges and tournament results')
ON CONFLICT (section_key) DO NOTHING;