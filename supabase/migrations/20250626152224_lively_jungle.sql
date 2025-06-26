/*
  # Add Section Content Management Table

  1. New Tables
    - `section_content`
      - `id` (uuid, primary key)
      - `section_key` (text, unique)
      - `title` (text)
      - `description` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `section_content` table
    - Add policies for authenticated users and public read access

  3. Initial Data
    - Pre-populate with default section content
*/

CREATE TABLE IF NOT EXISTS section_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE section_content ENABLE ROW LEVEL SECURITY;

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

-- Create trigger to update timestamp
CREATE OR REPLACE FUNCTION update_section_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_section_content_updated_at
  BEFORE UPDATE ON section_content
  FOR EACH ROW
  EXECUTE FUNCTION update_section_content_updated_at();