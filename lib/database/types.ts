export interface DatabaseAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  insert(table: string, data: Record<string, unknown>): Promise<unknown>;
  update(table: string, id: string, data: Record<string, unknown>): Promise<unknown>;
  delete(table: string, id: string): Promise<unknown>;
  findById(table: string, id: string): Promise<unknown>;
  findBy(table: string, conditions: Record<string, unknown>): Promise<unknown[]>;
  count(table: string, conditions?: Record<string, unknown>): Promise<number>;
}

export interface Employee {
  id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  position: string;
  hire_date: string;
  salary: number;
  marital_status: string;
  children_count: number;
  created_at: string;
  updated_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  base_salary: number;
  overtime_hours: number;
  overtime_pay: number;
  bonuses: number;
  gross_salary: number;
  cnss_employee: number;
  cnss_employer: number;
  amo_employee: number;
  amo_employer: number;
  net_taxable: number;
  igr: number;
  net_salary: number;
  total_employer_cost: number;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  rc_number: string;
  if_number: string;
  cnss_number: string;
  ice: string;
  patente: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface DemoRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  employee_count: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}
