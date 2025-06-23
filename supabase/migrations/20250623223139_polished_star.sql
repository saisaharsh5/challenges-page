/*
  # Create cybersecurity portfolio database tables

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
    - Enable RLS on all new tables
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

-- Create update triggers for static_content
CREATE OR REPLACE FUNCTION update_static_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_static_content_updated_at'
  ) THEN
    CREATE TRIGGER update_static_content_updated_at
      BEFORE UPDATE ON static_content
      FOR EACH ROW
      EXECUTE FUNCTION update_static_content_updated_at();
  END IF;
END $$;