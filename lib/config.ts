export interface AppConfig {
  isLocal: boolean;
  isElectron: boolean;
  database: {
    type: 'supabase';
    url?: string;
  };
  storage: {
    type: 'cloud';
  };
  features: {
    offlineMode: boolean;
    realTimeSync: boolean;
    multiUser: boolean;
  };
}

export const config: AppConfig = {
  isLocal: false, // Always use web mode
  isElectron: false, // No desktop version
  database: {
    type: 'supabase',
    url: process.env.SUPABASE_URL
  },
  storage: {
    type: 'cloud'
  },
  features: {
    offlineMode: false, // Web version doesn't support offline mode
    realTimeSync: true, // Web version supports real-time sync
    multiUser: true // Web version supports multi-user
  }
};

// Helper functions
export const isWebVersion = () => !config.isLocal;
export const isDesktopVersion = () => config.isLocal;
export const isOfflineMode = () => config.features.offlineMode;
export const isMultiUser = () => config.features.multiUser;
