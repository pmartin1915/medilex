/**
 * App Constants
 * Centralized configuration and metadata for the Healthcare Vocabulary App
 */

export const APP_CONFIG = {
  // App Metadata
  NAME: 'Medilex',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  
  // Data Constraints
  MIN_TERMS_COUNT: 20,
  MAX_ERROR_LOGS: 50,
  MAX_STORAGE_ITEMS: 1000,
  
  // Feature Flags
  ENABLE_SPEECH: true,
  ENABLE_SHARE: true,
  ENABLE_HAPTICS: true,
  ENABLE_ANALYTICS: false, // Will be enabled in production
  
  // Timing
  SWIPE_THRESHOLD: 100, // pixels
  TOAST_DURATION: 2000, // milliseconds
  ERROR_POLL_INTERVAL: 2000, // milliseconds
  
  // Storage Keys
  STORAGE_KEYS: {
    TERMS: '@vocab_app:terms',
    USER_PROGRESS: '@vocab_app:user_progress',
    STREAK_DATA: '@vocab_app:streak',
    ERROR_LOGS: '@vocab_app:error_logs',
    APP_SETTINGS: '@vocab_app:settings',
  },
  
  // URLs (for future use)
  SUPPORT_URL: 'https://medilex.app/support',
  PRIVACY_URL: 'https://medilex.app/privacy',
  TERMS_URL: 'https://medilex.app/terms',
  
  // Limits
  MAX_TERM_LENGTH: 100,
  MAX_DEFINITION_LENGTH: 1000,
  MAX_EXAMPLE_LENGTH: 500,
} as const;

// Type-safe access to app config
export type AppConfig = typeof APP_CONFIG;

// Helper functions
export const getAppVersion = () => `${APP_CONFIG.VERSION} (${APP_CONFIG.BUILD_NUMBER})`;
export const isFeatureEnabled = (feature: keyof typeof APP_CONFIG) => {
  return APP_CONFIG[feature] === true;
};
