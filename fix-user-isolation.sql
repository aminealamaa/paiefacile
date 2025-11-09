-- =====================================================
-- Fix User Data Isolation - Critical Security Update
-- =====================================================

-- 1. ADD USER_ID TO COMPANIES TABLE
-- This links each company to the user who created it
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. UPDATE EXISTING COMPANIES TO HAVE USER_ID
-- You'll need to manually assign existing companies to users
-- For now, we'll set a default, but you should update this properly
-- UPDATE companies SET user_id = 'your-user-id-here' WHERE user_id IS NULL;

-- 3. MAKE USER_ID NOT NULL (after updating existing records)
-- ALTER TABLE companies ALTER COLUMN user_id SET NOT NULL;

-- 4. CREATE INDEX FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);

-- 5. DROP EXISTING RLS POLICIES
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

-- 6. CREATE PROPER RLS POLICIES WITH USER ISOLATION

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

-- 7. VERIFICATION QUERIES
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

-- =====================================================
-- NOTES FOR MANUAL STEPS
-- =====================================================
/*
IMPORTANT: After running this script, you need to:

1. UPDATE EXISTING COMPANIES:
   - Find the user_id for each existing company
   - Run: UPDATE companies SET user_id = 'actual-user-id' WHERE id = 'company-id';

2. MAKE USER_ID REQUIRED:
   - After updating all existing records, run:
   - ALTER TABLE companies ALTER COLUMN user_id SET NOT NULL;

3. UPDATE APPLICATION CODE:
   - Ensure all company creation includes the user_id
   - Update queries to rely on RLS instead of manual filtering

4. TEST ISOLATION:
   - Create test accounts
   - Verify each user only sees their own data
   - Test all CRUD operations
*/
