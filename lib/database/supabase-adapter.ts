import { DatabaseAdapter } from './types';

// This file is disabled for desktop builds to avoid type issues
// Desktop version uses SQLite adapter instead

export class SupabaseAdapter implements DatabaseAdapter {
  // Placeholder implementation for desktop builds
  async connect(): Promise<void> {
    throw new Error('Supabase adapter not available in desktop version');
  }
  
  async disconnect(): Promise<void> {
    // No-op
  }
  
  async query<T = unknown>(): Promise<T[]> {
    throw new Error('Supabase adapter not available in desktop version');
  }
  
  async insert(): Promise<unknown> {
    throw new Error('Supabase adapter not available in desktop version');
  }
  
  async update(): Promise<unknown> {
    throw new Error('Supabase adapter not available in desktop version');
  }
  
  async delete(): Promise<unknown> {
    throw new Error('Supabase adapter not available in desktop version');
  }
  
  async findById(): Promise<unknown> {
    throw new Error('Supabase adapter not available in desktop version');
  }
  
  async findBy(): Promise<unknown[]> {
    throw new Error('Supabase adapter not available in desktop version');
  }
  
  async count(): Promise<number> {
    throw new Error('Supabase adapter not available in desktop version');
  }
}