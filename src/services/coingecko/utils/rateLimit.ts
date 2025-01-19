class RateLimiter {
  private requests: number[] = [];
  private readonly limit: number = 10;
  private readonly window: number = 60 * 1000; // 1 minute window
  private readonly minDelay: number = 1000; // Minimum delay between requests

  async throttle(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests
    this.requests = this.requests.filter(time => time > now - this.window);

    // If we've hit the limit, wait until the oldest request expires
    if (this.requests.length >= this.limit) {
      const oldestRequest = this.requests[0];
      const waitTime = Math.max(
        oldestRequest + this.window - now,
        this.minDelay
      );
      await new Promise(resolve => setTimeout(resolve, waitTime));
    } else if (this.requests.length > 0) {
      // Ensure minimum delay between requests
      const lastRequest = this.requests[this.requests.length - 1];
      const timeSinceLastRequest = now - lastRequest;
      if (timeSinceLastRequest < this.minDelay) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minDelay - timeSinceLastRequest)
        );
      }
    }

    this.requests.push(Date.now());
  }

  reset(): void {
    this.requests = [];
  }
}

export const rateLimiter = new RateLimiter();