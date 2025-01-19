class RateLimiter {
  private requests: number[] = [];
  private readonly limit: number = 10; // requests per window
  private readonly window: number = 1000; // 1 second window

  async throttle(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => time > now - this.window);

    if (this.requests.length >= this.limit) {
      const oldestRequest = this.requests[0];
      const waitTime = oldestRequest + this.window - now;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
  }
}

export const rateLimiter = new RateLimiter();