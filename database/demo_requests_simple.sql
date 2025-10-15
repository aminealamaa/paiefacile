-- Simple SQL for Demo Requests Table
-- Copy and paste this into Supabase SQL Editor

-- Create the demo_requests table
CREATE TABLE demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  employee_count VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert demo requests
CREATE POLICY "Allow demo request inserts" ON demo_requests
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read demo requests
CREATE POLICY "Allow authenticated reads" ON demo_requests
    FOR SELECT USING (auth.role() = 'authenticated');
