/*
  # Add editable date fields to all tables

  1. Changes
    - Add `completion_date` field to all tables for user-editable dates
    - Keep `created_at` for record creation tracking
    - Update existing records to use `created_at` as default `completion_date`

  2. Security
    - Maintain existing RLS policies
    - No changes to authentication or permissions
*/

-- Add completion_date to tryhackme_rooms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tryhackme_rooms' AND column_name = 'completion_date'
  ) THEN
    ALTER TABLE tryhackme_rooms ADD COLUMN completion_date date DEFAULT CURRENT_DATE;
    
    -- Update existing records to use created_at date as completion_date
    UPDATE tryhackme_rooms 
    SET completion_date = created_at::date 
    WHERE completion_date IS NULL;
  END IF;
END $$;

-- Add completion_date to hackthebox_machines
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hackthebox_machines' AND column_name = 'completion_date'
  ) THEN
    ALTER TABLE hackthebox_machines ADD COLUMN completion_date date DEFAULT CURRENT_DATE;
    
    -- Update existing records to use created_at date as completion_date
    UPDATE hackthebox_machines 
    SET completion_date = created_at::date 
    WHERE completion_date IS NULL;
  END IF;
END $$;

-- Add completion_date to ctf_challenges
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ctf_challenges' AND column_name = 'completion_date'
  ) THEN
    ALTER TABLE ctf_challenges ADD COLUMN completion_date date DEFAULT CURRENT_DATE;
    
    -- Update existing records to use created_at date as completion_date
    UPDATE ctf_challenges 
    SET completion_date = created_at::date 
    WHERE completion_date IS NULL;
  END IF;
END $$;