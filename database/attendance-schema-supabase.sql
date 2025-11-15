-- =====================================================
-- ATTENDANCE SYSTEM SCHEMA (Pointage) for Supabase
-- Phase 1: Clock in/out, Daily hours, Monthly reports, Basic absence tracking
-- 
-- PREREQUISITES:
-- - Companies table must have a 'user_id' column
--   If not, run this first:
--   ALTER TABLE companies ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
--
-- Instructions:
-- 1. Copy this entire file
-- 2. Open Supabase Dashboard > SQL Editor
-- 3. Paste and run this script
-- 4. Tables will be created with proper security policies
-- 5. Verify tables were created successfully
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. WORK_SCHEDULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS work_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    schedule_type VARCHAR(20) NOT NULL DEFAULT 'full_time' CHECK (schedule_type IN ('full_time', 'part_time', 'flexible')),
    daily_hours DECIMAL(4,2) NOT NULL DEFAULT 8.00,
    start_time TIME,
    end_time TIME,
    break_duration INTEGER DEFAULT 0, -- in minutes
    days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5], -- 1=Monday, 7=Sunday
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id)
);

-- Add comments for documentation
COMMENT ON TABLE work_schedules IS 'Employee work schedules and hours configuration';
COMMENT ON COLUMN work_schedules.daily_hours IS 'Expected daily working hours';
COMMENT ON COLUMN work_schedules.break_duration IS 'Break duration in minutes';
COMMENT ON COLUMN work_schedules.days_of_week IS 'Array of days (1=Monday to 7=Sunday)';

-- =====================================================
-- 2. ATTENDANCE_RECORDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    break_duration INTEGER DEFAULT 0, -- in minutes
    total_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'early_leave', 'on_leave', 'conge')),
    is_late BOOLEAN DEFAULT FALSE,
    is_early_leave BOOLEAN DEFAULT FALSE,
    late_minutes INTEGER DEFAULT 0,
    early_leave_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Add comments for documentation
COMMENT ON TABLE attendance_records IS 'Daily attendance records for employees';
COMMENT ON COLUMN attendance_records.total_hours IS 'Total hours worked (excluding breaks)';
COMMENT ON COLUMN attendance_records.overtime_hours IS 'Overtime hours (>8h/day or >44h/week)';
COMMENT ON COLUMN attendance_records.status IS 'Attendance status for the day';

-- =====================================================
-- 3. ATTENDANCE_CHECK_INS TABLE (for multiple check-ins per day)
-- =====================================================
CREATE TABLE IF NOT EXISTS attendance_check_ins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    attendance_record_id UUID NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
    check_type VARCHAR(10) NOT NULL CHECK (check_type IN ('in', 'out')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    location VARCHAR(255), -- Optional: IP address or GPS coordinates
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE attendance_check_ins IS 'Individual check-in/check-out events';
COMMENT ON COLUMN attendance_check_ins.check_type IS 'Type: in or out';

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_attendance_records_employee_date ON attendance_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_company_date ON attendance_records(company_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_status ON attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_work_schedules_employee ON work_schedules(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_check_ins_record ON attendance_check_ins(attendance_record_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Drop existing triggers if they exist (to avoid errors on re-run)
DROP TRIGGER IF EXISTS update_attendance_records_updated_at ON attendance_records;
DROP TRIGGER IF EXISTS update_work_schedules_updated_at ON work_schedules;

-- Trigger for attendance_records
CREATE TRIGGER update_attendance_records_updated_at 
    BEFORE UPDATE ON attendance_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_attendance_updated_at();

-- Trigger for work_schedules
CREATE TRIGGER update_work_schedules_updated_at 
    BEFORE UPDATE ON work_schedules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_attendance_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_check_ins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Users can view their own work schedule" ON work_schedules;
DROP POLICY IF EXISTS "Users can manage work schedules for their employees" ON work_schedules;
DROP POLICY IF EXISTS "Users can view attendance records for their employees" ON attendance_records;
DROP POLICY IF EXISTS "Users can manage attendance records for their employees" ON attendance_records;
DROP POLICY IF EXISTS "Users can view check-ins for their employees" ON attendance_check_ins;
DROP POLICY IF EXISTS "Users can manage check-ins for their employees" ON attendance_check_ins;

-- Policies for work_schedules
CREATE POLICY "Users can view their own work schedule" ON work_schedules
    FOR SELECT USING (
        employee_id IN (
            SELECT id FROM employees 
            WHERE company_id IN (
                SELECT id FROM companies WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage work schedules for their employees" ON work_schedules
    FOR ALL USING (
        employee_id IN (
            SELECT id FROM employees 
            WHERE company_id IN (
                SELECT id FROM companies WHERE user_id = auth.uid()
            )
        )
    );

-- Policies for attendance_records
CREATE POLICY "Users can view attendance records for their employees" ON attendance_records
    FOR SELECT USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage attendance records for their employees" ON attendance_records
    FOR ALL USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

-- Policies for attendance_check_ins
CREATE POLICY "Users can view check-ins for their employees" ON attendance_check_ins
    FOR SELECT USING (
        attendance_record_id IN (
            SELECT id FROM attendance_records 
            WHERE company_id IN (
                SELECT id FROM companies WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage check-ins for their employees" ON attendance_check_ins
    FOR ALL USING (
        attendance_record_id IN (
            SELECT id FROM attendance_records 
            WHERE company_id IN (
                SELECT id FROM companies WHERE user_id = auth.uid()
            )
        )
    );

-- =====================================================
-- VERIFICATION QUERIES (Optional - run these to verify)
-- =====================================================

-- Check if tables were created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('work_schedules', 'attendance_records', 'attendance_check_ins');

-- Check if indexes were created
-- SELECT indexname FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('work_schedules', 'attendance_records', 'attendance_check_ins');

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('work_schedules', 'attendance_records', 'attendance_check_ins');

-- =====================================================
-- NOTES
-- =====================================================
/*
This schema creates:

1. WORK_SCHEDULES:
   - Stores employee work schedules
   - Default: 8 hours/day, Monday-Friday
   - Can be customized per employee

2. ATTENDANCE_RECORDS:
   - Daily attendance records
   - Tracks check-in/check-out times
   - Calculates total hours and overtime
   - One record per employee per day

3. ATTENDANCE_CHECK_INS:
   - Individual check-in/check-out events
   - Supports multiple check-ins per day (for breaks)
   - Links to attendance_records

SECURITY:
- Row Level Security (RLS) enabled on all tables
- Users can only access data for their own company's employees
- Policies ensure data isolation between companies

USAGE:
After running this script, employees can:
- Clock in/out via the attendance page
- View their attendance history
- See monthly summaries

The system automatically:
- Calculates total hours worked
- Tracks overtime (>8h/day)
- Records late arrivals and early departures

MIGRATION NOTE:
If you already have the attendance_records table, run this to add 'conge' status:
ALTER TABLE attendance_records 
DROP CONSTRAINT IF EXISTS attendance_records_status_check;

ALTER TABLE attendance_records 
ADD CONSTRAINT attendance_records_status_check 
CHECK (status IN ('present', 'absent', 'late', 'early_leave', 'on_leave', 'conge'));
*/

