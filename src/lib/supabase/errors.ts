export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export function handleSupabaseError(error: unknown): SupabaseError {
  if (error instanceof SupabaseError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      return new SupabaseError(
        'Connection failed. Please check your internet connection.',
        'CONNECTION_ERROR'
      );
    }
    return new SupabaseError(error.message, 'UNKNOWN_ERROR', error);
  }

  return new SupabaseError('An unknown error occurred', 'UNKNOWN_ERROR', error);
}