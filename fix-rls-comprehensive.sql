-- Comprehensive RLS Policy Fix for PaieFacile
-- This script ensures proper user isolation and company creation flow

-- =====================================================
-- 1. ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. DROP ALL EXISTING POLICIES
-- =====================================================

-- Drop all existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public' 
              AND tablename IN ('companies', 'employees', 'leave_requests', 'payroll_records')) 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- =====================================================
-- 3. CREATE COMPREHENSIVE RLS POLICIES
-- =====================================================

-- Companies policies - users can only access their own companies
CREATE POLICY "companies_select_own" ON companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "companies_insert_own" ON companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "companies_update_own" ON companies
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "companies_delete_own" ON companies
    FOR DELETE USING (auth.uid() = user_id);

-- Employees policies - users can only access employees of their companies
CREATE POLICY "employees_select_company" ON employees
    FOR SELECT USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "employees_insert_company" ON employees
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "employees_update_company" ON employees
    FOR UPDATE USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "employees_delete_company" ON employees
    FOR DELETE USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

-- Leave requests policies - users can only access leave requests of their employees
CREATE POLICY "leave_requests_select_company" ON leave_requests
    FOR SELECT USING (
        employee_id IN (
            SELECT e.id FROM employees e
            JOIN companies c ON e.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "leave_requests_insert_company" ON leave_requests
    FOR INSERT WITH CHECK (
        employee_id IN (
            SELECT e.id FROM employees e
            JOIN companies c ON e.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "leave_requests_update_company" ON leave_requests
    FOR UPDATE USING (
        employee_id IN (
            SELECT e.id FROM employees e
            JOIN companies c ON e.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "leave_requests_delete_company" ON leave_requests
    FOR DELETE USING (
        employee_id IN (
            SELECT e.id FROM employees e
            JOIN companies c ON e.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- Payroll records policies - users can only access their own payroll records
CREATE POLICY "payroll_records_select_company" ON payroll_records
    FOR SELECT USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "payroll_records_insert_company" ON payroll_records
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "payroll_records_update_company" ON payroll_records
    FOR UPDATE USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "payroll_records_delete_company" ON payroll_records
    FOR DELETE USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 4. VERIFICATION QUERIES
-- =====================================================

-- Check if RLS is enabled on all tables
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled' 
        ELSE '❌ RLS Disabled' 
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'employees', 'leave_requests', 'payroll_records')
ORDER BY tablename;

-- Check all current policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'employees', 'leave_requests', 'payroll_records')
ORDER BY tablename, policyname;

-- Test query to verify policies work
-- This should only return companies for the current user
SELECT 'RLS Test' as test_name, COUNT(*) as company_count 
FROM companies 
WHERE user_id = auth.uid();
