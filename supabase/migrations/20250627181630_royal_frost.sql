/*
  # Create section content table

  1. New Tables
    - `section_content`
      - `id` (uuid, primary key)
      - `section_key` (text, unique)
      - `title` (text, not null with default)
      - `description` (text, not null with default)
      - `updated_at` (timestamptz, default now)
  2. Security
    - Enable RLS on `section_content` table
    - Add policy for authenticated users to manage content
    - Add policy for public read access
  3. Default Data
    - Insert default section content for TryHackMe, Hack The Box, and CTF sections
  4. Triggers
    - Create function and trigger to auto-update timestamp on updates
*/

CREATE TABLE IF NOT EXISTS section_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users full access to section_content" ON section_content;
DROP POLICY IF EXISTS "Allow public read access on section_content" ON section_content;

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

-- Insert default section content
INSERT INTO section_content (section_key, title, description) VALUES
  ('tryhackme', 'TryHackMe Rooms', 'Hands-on cybersecurity challenges and learning paths'),
  ('hackthebox', 'Hack The Box Machines', 'Advanced penetration testing challenges and machine exploitation'),
  ('ctf', 'CTF Challenges', 'Competitive cybersecurity challenges and tournament results')
ON CONFLICT (section_key) DO NOTHING;

-- Create or replace trigger function to update timestamp
CREATE OR REPLACE FUNCTION update_section_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS update_section_content_updated_at ON section_content;

-- Create trigger to update timestamp
CREATE TRIGGER update_section_content_updated_at
  BEFORE UPDATE ON section_content
  FOR EACH ROW
  EXECUTE FUNCTION update_section_content_updated_at();