export const SUPABASE_CONFIG = {
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 5000
  },
  ERROR_MESSAGES: {
    CONNECTION: 'Unable to connect to the database. Please check your connection.',
    AUTHENTICATION: 'Authentication error. Please try logging in again.',
    GENERIC: 'An error occurred. Please try again.'
  }
} as const;