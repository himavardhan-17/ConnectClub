/*
  # Create registrations table

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `roll_number` (text)
      - `section` (text)
      - `year` (text)
      - `department` (text)
      - `game` (text)
      - `referred_by` (text)
      - `transaction_id` (text)
      - `qr_code_url` (text)
      - `payment_screenshot_url` (text)
      - `registration_date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `registrations` table
    - Add policy for authenticated users to insert their own data
    - Add policy for admin users to read all data
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  roll_number text NOT NULL,
  section text NOT NULL,
  year text NOT NULL,
  department text NOT NULL,
  game text NOT NULL,
  referred_by text,
  transaction_id text NOT NULL,
  qr_code_url text NOT NULL,
  payment_screenshot_url text NOT NULL,
  registration_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting data (anyone can register)
CREATE POLICY "Anyone can insert registrations"
  ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for admin users to read all data
CREATE POLICY "Admin users can read all registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email IN ('admin@connectclub.com')
  ));