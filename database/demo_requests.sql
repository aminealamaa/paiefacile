-- SQL Schema for Demo Requests Table in Supabase
-- This table stores demo request submissions from the landing page form

-- Create the demo_requests table
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
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'rejected')),
  notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests(email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_country ON demo_requests(country);

-- Create a function to automatically update the updated_at timestamp
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

-- Enable Row Level Security (RLS)
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Policy for authenticated users to read all demo requests
CREATE POLICY "Authenticated users can read demo requests" ON demo_requests
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert demo requests
CREATE POLICY "Anyone can insert demo requests" ON demo_requests
    FOR INSERT WITH CHECK (true);

-- Policy for authenticated users to update demo requests
CREATE POLICY "Authenticated users can update demo requests" ON demo_requests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON demo_requests TO authenticated;
GRANT ALL ON demo_requests TO anon;

-- Insert some sample data (optional - remove in production)
INSERT INTO demo_requests (
  first_name, 
  last_name, 
  email, 
  phone, 
  company, 
  country, 
  employee_count,
  status
) VALUES 
(
  'Ahmed', 
  'Benali', 
  'ahmed.benali@techmaroc.ma', 
  '+212 6 12 34 56 78', 
  'TechMaroc SARL', 
  'Morocco', 
  '10-50 employés',
  'pending'
),
(
  'Fatima', 
  'Alami', 
  'fatima.alami@atlasdist.com', 
  '+212 6 87 65 43 21', 
  'Atlas Distribution', 
  'Morocco', 
  '50-100 employés',
  'contacted'
);

-- Create a view for analytics (optional)
CREATE OR REPLACE VIEW demo_requests_analytics AS
SELECT 
  DATE(created_at) as date,
  country,
  employee_count,
  status,
  COUNT(*) as total_requests
FROM demo_requests 
GROUP BY DATE(created_at), country, employee_count, status
ORDER BY date DESC;

-- Grant access to the analytics view
GRANT SELECT ON demo_requests_analytics TO authenticated;
