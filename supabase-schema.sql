-- Create groups table
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  time TIMESTAMP WITH TIME ZONE NOT NULL,
  distance TEXT NOT NULL,
  pace_groups TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to groups" ON groups
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to members" ON members
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to events" ON events
  FOR SELECT USING (true);

-- Create policies for public insert/update/delete access
CREATE POLICY "Allow public insert to groups" ON groups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to groups" ON groups
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete from groups" ON groups
  FOR DELETE USING (true);

CREATE POLICY "Allow public insert to members" ON members
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to members" ON members
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete from members" ON members
  FOR DELETE USING (true);

CREATE POLICY "Allow public insert to events" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to events" ON events
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete from events" ON events
  FOR DELETE USING (true); 

-- Add role column to groups table
ALTER TABLE groups ADD COLUMN role TEXT NOT NULL DEFAULT 'GroupOwner' CHECK (role IN ('Admin', 'GroupOwner')); 