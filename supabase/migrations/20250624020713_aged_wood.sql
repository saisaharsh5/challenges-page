/*
  # Create cybersecurity portfolio database

  1. New Tables
    - `static_content`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `content` (text)
      - `updated_at` (timestamp)
    - `tryhackme_rooms`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `difficulty` (text)
      - `url` (text)
      - `created_at` (timestamp)
    - `hackthebox_machines`
      - `id` (uuid, primary key)
      - `machine_name` (text)
      - `description` (text)
      - `os_type` (text)
      - `points` (integer)
      - `url` (text)
      - `created_at` (timestamp)
    - `ctf_challenges`
      - `id` (uuid, primary key)
      - `event_name` (text)
      - `challenge_title` (text)
      - `category` (text)
      - `my_ranking` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to have full access
    - Add policies for anonymous users to have read access
*/

-- Create static_content table
CREATE TABLE IF NOT EXISTS static_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  content text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE static_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to static_content"
  ON static_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on static_content"
  ON static_content
  FOR SELECT
  TO anon
  USING (true);

-- Create tryhackme_rooms table
CREATE TABLE IF NOT EXISTS tryhackme_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Easy',
  url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tryhackme_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to tryhackme_rooms"
  ON tryhackme_rooms
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on tryhackme_rooms"
  ON tryhackme_rooms
  FOR SELECT
  TO anon
  USING (true);

-- Create hackthebox_machines table
CREATE TABLE IF NOT EXISTS hackthebox_machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_name text NOT NULL,
  description text DEFAULT '',
  os_type text NOT NULL DEFAULT 'Linux',
  points integer NOT NULL DEFAULT 20,
  url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hackthebox_machines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to hackthebox_machines"
  ON hackthebox_machines
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on hackthebox_machines"
  ON hackthebox_machines
  FOR SELECT
  TO anon
  USING (true);

-- Create ctf_challenges table
CREATE TABLE IF NOT EXISTS ctf_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  challenge_title text NOT NULL,
  category text DEFAULT '',
  my_ranking integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ctf_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to ctf_challenges"
  ON ctf_challenges
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access on ctf_challenges"
  ON ctf_challenges
  FOR SELECT
  TO anon
  USING (true);

-- Create update trigger function for static_content
CREATE OR REPLACE FUNCTION update_static_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for static_content
CREATE TRIGGER update_static_content_updated_at
  BEFORE UPDATE ON static_content
  FOR EACH ROW
  EXECUTE FUNCTION update_static_content_updated_at();

-- Insert default content
INSERT INTO static_content (key, content) VALUES 
  ('hero-description', 'Welcome to my cybersecurity journey. Explore my achievements from TryHackMe rooms, Hack The Box machines, and CTF competitions. Every challenge conquered, every vulnerability discovered, and every flag captured represents a step forward in the endless pursuit of security knowledge.'),
  ('about-me', 'I am a passionate cybersecurity enthusiast dedicated to understanding the intricate world of digital security. My journey spans across various platforms including TryHackMe, Hack The Box, and numerous CTF competitions. Each challenge I tackle enhances my skills in penetration testing, vulnerability assessment, and ethical hacking. I believe in continuous learning and pushing the boundaries of what''s possible in cybersecurity.')
ON CONFLICT (key) DO NOTHING;

-- Insert sample data
INSERT INTO tryhackme_rooms (title, description, difficulty, url) VALUES 
  ('Basic Pentesting', 'This is a machine that allows you to practice web app hacking and privilege escalation', 'Easy', 'https://tryhackme.com/room/basicpentestingjt'),
  ('Vulnversity', 'Learn about active recon, web app attacks and privilege escalation.', 'Easy', 'https://tryhackme.com/room/vulnversity'),
  ('Blue', 'Deploy & hack into a Windows machine, leveraging common misconfigurations issues.', 'Easy', 'https://tryhackme.com/room/blue')
ON CONFLICT DO NOTHING;

INSERT INTO hackthebox_machines (machine_name, description, os_type, points, url) VALUES 
  ('Lame', 'Lame is a beginner level machine, requiring only one exploit to obtain root access.', 'Linux', 20, 'https://app.hackthebox.com/machines/lame'),
  ('Legacy', 'Legacy is a fairly straightforward beginner-level machine which demonstrates the security risks.', 'Windows', 20, 'https://app.hackthebox.com/machines/legacy'),
  ('Devel', 'Devel is a beginner-level machine that demonstrates the security risks of default configurations.', 'Windows', 20, 'https://app.hackthebox.com/machines/devel')
ON CONFLICT DO NOTHING;

INSERT INTO ctf_challenges (event_name, challenge_title, category, my_ranking) VALUES 
  ('PicoCTF 2023', 'Web Exploitation Challenge', 'Web', 15),
  ('DEFCON CTF Quals', 'Reverse Engineering Binary', 'Reverse', 8),
  ('Google CTF', 'Cryptography Challenge', 'Crypto', 23)
ON CONFLICT DO NOTHING;