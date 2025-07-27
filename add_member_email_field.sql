-- Add email field to members table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'members' AND column_name = 'email'
    ) THEN
        ALTER TABLE members ADD COLUMN email VARCHAR(255);
    END IF;
END $$;

-- Add unique constraint on email (allows NULL values but prevents duplicates)
-- Drop the index if it exists first
DROP INDEX IF EXISTS members_email_unique;
CREATE UNIQUE INDEX members_email_unique ON members (email) WHERE email IS NOT NULL;

-- Add comment to document the field
COMMENT ON COLUMN members.email IS 'Email address of the member (optional, must be unique if provided)';

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'members' AND column_name = 'email'; 