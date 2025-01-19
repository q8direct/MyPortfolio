export class CoinGeckoError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'CoinGeckoError';
  }
}

export class RateLimitError extends CoinGeckoError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT');
  }
}

export class NetworkError extends CoinGeckoError {
  constructor(message = 'Network request failed') {
    super(message, 'NETWORK_ERROR');
  }
}

export function handleApiError(error: unknown): CoinGeckoError {
  if (error instanceof CoinGeckoError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('rate limit')) {
      return new RateLimitError();
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new NetworkError();
    }
    return new CoinGeckoError(error.message, 'UNKNOWN', error);
  }

  return new CoinGeckoError('Unknown error occurred', 'UNKNOWN', error);
}