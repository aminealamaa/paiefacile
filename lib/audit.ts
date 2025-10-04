// Français: Système d'audit et de logging pour la traçabilité des actions
import { createSupabaseServerClient } from './supabaseServer';

export interface AuditLog {
  id?: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at?: Date;
}

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SIGNUP = 'SIGNUP',
  
  // Employee Management
  EMPLOYEE_CREATED = 'EMPLOYEE_CREATED',
  EMPLOYEE_UPDATED = 'EMPLOYEE_UPDATED',
  EMPLOYEE_DELETED = 'EMPLOYEE_DELETED',
  
  // Payroll
  PAYROLL_CALCULATED = 'PAYROLL_CALCULATED',
  PAYROLL_DOWNLOADED = 'PAYROLL_DOWNLOADED',
  
  // Leave Management
  LEAVE_REQUESTED = 'LEAVE_REQUESTED',
  LEAVE_APPROVED = 'LEAVE_APPROVED',
  LEAVE_REJECTED = 'LEAVE_REJECTED',
  
  // Company Management
  COMPANY_CREATED = 'COMPANY_CREATED',
  COMPANY_UPDATED = 'COMPANY_UPDATED',
  
  // Security
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_INPUT = 'INVALID_INPUT',
}

export enum ResourceType {
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
  PAYROLL = 'PAYROLL',
  LEAVE_REQUEST = 'LEAVE_REQUEST',
  COMPANY = 'COMPANY',
}

/**
 * Log an audit event
 * Français: Enregistrer un événement d'audit
 */
export async function logAuditEvent(
  action: AuditAction,
  resourceType: ResourceType,
  resourceId: string,
  details: Record<string, unknown> = {},
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Cannot log audit event: No authenticated user');
      return;
    }

    const auditLog: Omit<AuditLog, 'id' | 'created_at'> = {
      user_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: ipAddress,
      user_agent: userAgent,
    };

    const { error } = await supabase
      .from('audit_logs')
      .insert(auditLog);

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Error in logAuditEvent:', error);
  }
}

/**
 * Get audit logs for a user
 * Français: Récupérer les logs d'audit pour un utilisateur
 */
export async function getAuditLogs(
  userId: string,
  limit: number = 100,
  offset: number = 0
): Promise<AuditLog[]> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to get audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAuditLogs:', error);
    return [];
  }
}

/**
 * Get audit logs for a specific resource
 * Français: Récupérer les logs d'audit pour une ressource spécifique
 */
export async function getResourceAuditLogs(
  resourceType: ResourceType,
  resourceId: string,
  limit: number = 50
): Promise<AuditLog[]> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to get resource audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getResourceAuditLogs:', error);
    return [];
  }
}

/**
 * Create audit log table if it doesn't exist
 * Français: Créer la table d'audit si elle n'existe pas
 */
export async function createAuditLogTable(): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.rpc('create_audit_log_table');
    
    if (error) {
      console.error('Failed to create audit log table:', error);
    }
  } catch (error) {
    console.error('Error creating audit log table:', error);
  }
}
