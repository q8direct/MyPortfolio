const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://cors-proxy.fringe.zone/',
  'https://cors-anywhere.herokuapp.com/'
];

let currentProxyIndex = 0;

export async function proxyFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const maxRetries = CORS_PROXIES.length;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const proxy = CORS_PROXIES[currentProxyIndex];
      const proxiedUrl = `${proxy}${encodeURIComponent(url)}`;
      
      const response = await fetch(proxiedUrl, {
        ...options,
        headers: {
          ...options.headers,
          'Origin': window.location.origin,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      currentProxyIndex = (currentProxyIndex + 1) % CORS_PROXIES.length;
      
      if (attempt === maxRetries - 1) {
        throw new Error('All proxies failed - please try again later');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw lastError || new Error('Failed to connect to Binance API');
}