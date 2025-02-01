/*
  # Add ticket fields to registrations table

  1. Changes
    - Add `ticket_id` column to store unique ticket identifiers
    - Add index on ticket_id for faster lookups

  2. Notes
    - ticket_id format: CCT-XXXXXXXX (where X is alphanumeric)
*/

ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS ticket_id text UNIQUE NOT NULL;

-- Create index for faster ticket lookups
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_id 
ON registrations(ticket_id);