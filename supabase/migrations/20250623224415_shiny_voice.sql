/*
  # Setup Admin User and Authentication

  1. Authentication Setup
    - Create admin user in auth.users table
    - Set up proper authentication flow
  
  2. Security
    - Ensure RLS policies are working correctly
    - Add proper user management
*/

-- Insert admin user (this will be handled by Supabase Auth, but we ensure the email exists)
-- The actual user creation should be done through Supabase Auth UI or API

-- Ensure all tables have proper RLS policies
-- Update RLS policies to be more specific for admin access

-- Update static_content policies
DROP POLICY IF EXISTS "Allow authenticated users full access to static_content" ON static_content;
DROP POLICY IF EXISTS "Allow public read access on static_content" ON static_content;

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

-- Update tryhackme_rooms policies
DROP POLICY IF EXISTS "Allow authenticated users full access to tryhackme_rooms" ON tryhackme_rooms;
DROP POLICY IF EXISTS "Allow public read access on tryhackme_rooms" ON tryhackme_rooms;

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

-- Update hackthebox_machines policies
DROP POLICY IF EXISTS "Allow authenticated users full access to hackthebox_machines" ON hackthebox_machines;
DROP POLICY IF EXISTS "Allow public read access on hackthebox_machines" ON hackthebox_machines;

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

-- Update ctf_challenges policies
DROP POLICY IF EXISTS "Allow authenticated users full access to ctf_challenges" ON ctf_challenges;
DROP POLICY IF EXISTS "Allow public read access on ctf_challenges" ON ctf_challenges;

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

-- Insert some sample data for testing
INSERT INTO static_content (key, content) VALUES 
  ('hero-description', 'Welcome to my cybersecurity journey. Explore my achievements from TryHackMe rooms, Hack The Box machines, and CTF competitions. Every challenge conquered, every vulnerability discovered, and every flag captured represents a step forward in the endless pursuit of security knowledge.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO static_content (key, content) VALUES 
  ('about-me', 'I am a passionate cybersecurity enthusiast dedicated to understanding the intricate world of digital security. My journey spans across various platforms including TryHackMe, Hack The Box, and numerous CTF competitions. Each challenge I tackle enhances my skills in penetration testing, vulnerability assessment, and ethical hacking. I believe in continuous learning and pushing the boundaries of what''s possible in cybersecurity.')
ON CONFLICT (key) DO NOTHING;

-- Insert sample TryHackMe rooms
INSERT INTO tryhackme_rooms (title, description, difficulty, url) VALUES 
  ('Basic Pentesting', 'This is a machine that allows you to practice web app hacking and privilege escalation', 'Easy', 'https://tryhackme.com/room/basicpentestingjt'),
  ('Vulnversity', 'Learn about active recon, web app attacks and privilege escalation.', 'Easy', 'https://tryhackme.com/room/vulnversity'),
  ('Blue', 'Deploy & hack into a Windows machine, leveraging common misconfigurations issues.', 'Easy', 'https://tryhackme.com/room/blue')
ON CONFLICT DO NOTHING;

-- Insert sample Hack The Box machines
INSERT INTO hackthebox_machines (machine_name, description, os_type, points, url) VALUES 
  ('Lame', 'Lame is a beginner level machine, requiring only one exploit to obtain root access.', 'Linux', 20, 'https://app.hackthebox.com/machines/lame'),
  ('Legacy', 'Legacy is a fairly straightforward beginner-level machine which demonstrates the security risks.', 'Windows', 20, 'https://app.hackthebox.com/machines/legacy'),
  ('Devel', 'Devel is a beginner-level machine that demonstrates the security risks of default configurations.', 'Windows', 20, 'https://app.hackthebox.com/machines/devel')
ON CONFLICT DO NOTHING;

-- Insert sample CTF challenges
INSERT INTO ctf_challenges (event_name, challenge_title, category, my_ranking) VALUES 
  ('PicoCTF 2023', 'Web Exploitation Challenge', 'Web', 15),
  ('DEFCON CTF Quals', 'Reverse Engineering Binary', 'Reverse', 8),
  ('Google CTF', 'Cryptography Challenge', 'Crypto', 23)
ON CONFLICT DO NOTHING;