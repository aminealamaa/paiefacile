-- =====================================================
-- VERIFICATION SCRIPT FOR ATTENDANCE TABLES
-- Run this in Supabase SQL Editor to verify tables exist
-- =====================================================

-- Check if attendance_records table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'attendance_records'
ORDER BY ordinal_position;

-- Check if work_schedules table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'work_schedules'
ORDER BY ordinal_position;

-- Check if attendance_check_ins table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'attendance_check_ins'
ORDER BY ordinal_position;

-- Check constraints (especially the UNIQUE constraint)
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'attendance_records';

-- Check RLS (Row Level Security) status
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('attendance_records', 'work_schedules', 'attendance_check_ins');

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('attendance_records', 'work_schedules', 'attendance_check_ins');

-- Test query: Count records (replace with your company_id)
-- SELECT COUNT(*) FROM attendance_records WHERE company_id = 'YOUR_COMPANY_ID';

-- Test query: View recent records (replace with your company_id)
-- SELECT * FROM attendance_records 
-- WHERE company_id = 'YOUR_COMPANY_ID' 
-- ORDER BY date DESC 
-- LIMIT 10;

