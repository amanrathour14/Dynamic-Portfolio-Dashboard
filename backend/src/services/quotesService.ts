import yahooFinance from 'yahoo-finance2';
import pLimit from 'p-limit';
import { getCachedData, setCachedData } from '../utils/cache.js';
import { Quote } from '../interfaces.js';

const CONCURRENCY_LIMIT = 5; // Limit concurrent requests to Yahoo Finance
const CMP_CACHE_TTL = 15; // Cache TTL for CMPs in seconds

const limit = pLimit(CONCURRENCY_LIMIT);

export async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  const quotes: Quote[] = [];
  const fetchPromises = symbols.map((symbol) =>
    limit(async () => {
      const cacheKey = `quote:${symbol}`;
      const cachedQuote = await getCachedData<Quote>(cacheKey);

      if (cachedQuote) {
        quotes.push({ ...cachedQuote, cached: true }); // Add a flag for debugging
        return;
      }

      try {
        const result = await yahooFinance.quote(symbol, { fields: ['regularMarketPrice'] });
        const cmp = result?.regularMarketPrice || null;
        const newQuote: Quote = { symbol, cmp };
        await setCachedData(cacheKey, newQuote, CMP_CACHE_TTL);
        quotes.push(newQuote);
      } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        quotes.push({ symbol, cmp: null, error: 'Quote unavailable' });
      }
    })
  );

  await Promise.allSettled(fetchPromises);
  return quotes;
}
