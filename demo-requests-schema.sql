-- Create demo_requests table for storing demo form submissions
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  employee_count VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);

-- Enable Row Level Security (RLS)
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for demo form submissions)
CREATE POLICY "Allow public demo requests" ON demo_requests
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read all demo requests
CREATE POLICY "Allow authenticated users to read demo requests" ON demo_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update demo requests
CREATE POLICY "Allow authenticated users to update demo requests" ON demo_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_demo_requests_updated_at 
  BEFORE UPDATE ON demo_requests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE demo_requests IS 'Stores demo request form submissions from the landing page';
COMMENT ON COLUMN demo_requests.status IS 'Current status of the demo request: pending, contacted, scheduled, completed, cancelled';
COMMENT ON COLUMN demo_requests.assigned_to IS 'User ID of the team member assigned to handle this demo request';
COMMENT ON COLUMN demo_requests.notes IS 'Internal notes about the demo request';
