import { chunk } from '../utils/array';
import { sleep } from '../utils/async';
import { FetchPriceResult } from './types';
import { fetchSinglePrice } from './price';

interface BatchProcessorOptions {
  batchSize?: number;
  delayBetweenBatches?: number;
  maxConcurrent?: number;
}

const DEFAULT_OPTIONS: Required<BatchProcessorOptions> = {
  batchSize: 2,
  delayBetweenBatches: 2000,
  maxConcurrent: 2
};

export async function processPriceBatches(
  symbols: string[],
  options: BatchProcessorOptions = {}
): Promise<Map<string, FetchPriceResult>> {
  const { batchSize, delayBetweenBatches, maxConcurrent } = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const results = new Map<string, FetchPriceResult>();
  const batches = chunk(symbols, batchSize);

  for (let i = 0; i < batches.length; i += maxConcurrent) {
    const currentBatches = batches.slice(i, i + maxConcurrent);
    
    const batchResults = await Promise.all(
      currentBatches.map(async (batch) => {
        const batchResults = await Promise.all(
          batch.map(async (symbol) => {
            const result = await fetchSinglePrice(symbol);
            return { symbol, result };
          })
        );
        return batchResults;
      })
    );

    batchResults.flat().forEach(({ symbol, result }) => {
      results.set(symbol, result);
    });

    if (i + maxConcurrent < batches.length) {
      await sleep(delayBetweenBatches);
    }
  }

  return results;
}