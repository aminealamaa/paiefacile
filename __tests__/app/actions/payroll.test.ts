// Mock Supabase before importing the module
jest.mock('@/lib/supabaseServer', () => ({
  createSupabaseServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } }
      })
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'test-company-id',
          name: 'Test Company',
          ice: '123456789012345',
          patente: '123456789',
          cnss_affiliation_number: 'CNSS123',
          address: 'Test Address'
        }
      })
    }))
  }))
}));

import { calculatePayroll } from '@/app/actions/payroll';

describe('Payroll Calculations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate payroll for valid input', async () => {
    const formData = new FormData();
    formData.append('employeeId', 'test-employee-id');
    formData.append('month', '1');
    formData.append('year', '2024');
    formData.append('bonuses', '1000');
    formData.append('overtimeHours', '5');

    const result = await calculatePayroll({}, formData);
    
    expect(result).toHaveProperty('result');
    expect(result.result).toHaveProperty('grossSalary');
    expect(result.result).toHaveProperty('netSalary');
  });

  it('should return error for invalid input', async () => {
    const formData = new FormData();
    formData.append('employeeId', '');
    formData.append('month', 'invalid');
    formData.append('year', '2024');

    const result = await calculatePayroll({}, formData);
    
    expect(result).toHaveProperty('error');
    expect(result.error).toBeDefined();
  });

  it('should return error for unauthorized user', async () => {
    // Mock unauthorized user
    const { createSupabaseServerClient } = require('@/lib/supabaseServer');
    createSupabaseServerClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null }
        })
      }
    });

    const formData = new FormData();
    formData.append('employeeId', 'test-employee-id');
    formData.append('month', '1');
    formData.append('year', '2024');

    const result = await calculatePayroll({}, formData);
    
    expect(result).toHaveProperty('error');
    expect(result.error).toBe('Unauthorized');
  });
});