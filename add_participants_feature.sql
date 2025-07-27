-- Add secret_key field to events table
ALTER TABLE events ADD COLUMN secret_key VARCHAR(255);

-- Create event_participants table
CREATE TABLE event_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, member_id) -- Prevent duplicate participants
);

-- Enable Row Level Security for event_participants
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for event_participants
CREATE POLICY "Allow public read access to event_participants" ON event_participants
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to event_participants" ON event_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete from event_participants" ON event_participants
  FOR DELETE USING (true);

-- Generate secret keys for existing events (if any)
UPDATE events SET secret_key = substr(md5(random()::text), 1, 8) WHERE secret_key IS NULL;

-- Add comment to document the new fields
COMMENT ON COLUMN events.secret_key IS 'Secret key for adding participants to events';
COMMENT ON TABLE event_participants IS 'Tracks which members are participating in which events'; 