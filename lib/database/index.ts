import { SupabaseAdapter } from './supabase-adapter';
import { DatabaseAdapter } from './types';
import { config } from '../config';

// Use Supabase adapter for web deployment
const dbAdapter: DatabaseAdapter = new SupabaseAdapter();

// Initialize the database connection
export const initializeDatabase = async (): Promise<void> => {
  try {
    await dbAdapter.connect();
    console.log(`Database connected: ${config.database.type}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
};

// Export the database adapter
export const db = dbAdapter;

// Export types for use in other modules
export * from './types';
