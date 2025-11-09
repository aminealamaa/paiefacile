-- Fix RLS policies for proper user isolation
-- This script fixes the Row Level Security policies to ensure users can only access their own data

-- =====================================================
-- 1. DROP EXISTING POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their company" ON companies;
DROP POLICY IF EXISTS "Users can update their company" ON companies;
DROP POLICY IF EXISTS "Users can insert company" ON companies;

DROP POLICY IF EXISTS "Users can view employees in their company" ON employees;
DROP POLICY IF EXISTS "Users can create employees in their company" ON employees;
DROP POLICY IF EXISTS "Users can update employees in their company" ON employees;
DROP POLICY IF EXISTS "Users can delete employees in their company" ON employees;

DROP POLICY IF EXISTS "Users can view leave requests for their company employees" ON leave_requests;
DROP POLICY IF EXISTS "Users can create leave requests for their company employees" ON leave_requests;
DROP POLICY IF EXISTS "Users can update leave requests for their company employees" ON leave_requests;

DROP POLICY IF EXISTS "Users can view payroll records for their company" ON payroll_records;
DROP POLICY IF EXISTS "Users can create payroll records for their company" ON payroll_records;

-- =====================================================
-- 2. CREATE PROPER RLS POLICIES WITH USER ISOLATION
-- =====================================================

-- Companies policies - users can only access their own companies
CREATE POLICY "Users can view their own companies" ON companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own companies" ON companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own companies" ON companies
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own companies" ON companies
    FOR DELETE USING (auth.uid() = user_id);

-- Employees policies - users can only access employees of their companies
CREATE POLICY "Users can view employees in their companies" ON employees
    FOR SELECT USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create employees in their companies" ON employees
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update employees in their companies" ON employees
    FOR UPDATE USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete employees in their companies" ON employees
    FOR DELETE USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

-- Leave requests policies - users can only access leave requests of their employees
CREATE POLICY "Users can view leave requests for their employees" ON leave_requests
    FOR SELECT USING (
        employee_id IN (
            SELECT e.id FROM employees e
            JOIN companies c ON e.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create leave requests for their employees" ON leave_requests
    FOR INSERT WITH CHECK (
        employee_id IN (
            SELECT e.id FROM employees e
            JOIN companies c ON e.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update leave requests for their employees" ON leave_requests
    FOR UPDATE USING (
        employee_id IN (
            SELECT e.id FROM employees e
            JOIN companies c ON e.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- Payroll records policies - users can only access their own payroll records
CREATE POLICY "Users can view their payroll records" ON payroll_records
    FOR SELECT USING (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their payroll records" ON payroll_records
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT id FROM companies WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 3. VERIFICATION QUERIES
-- =====================================================

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'employees', 'leave_requests', 'payroll_records');

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'employees', 'leave_requests', 'payroll_records')
ORDER BY tablename, policyname;
