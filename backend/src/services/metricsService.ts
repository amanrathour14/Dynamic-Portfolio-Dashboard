import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import { getCachedData, setCachedData } from '../utils/cache.js';
import { Metrics } from '../interfaces.js';

const CONCURRENCY_LIMIT = 3; // Limit concurrent requests for scraping
const METRICS_CACHE_TTL = 5 * 60; // Cache TTL for metrics in seconds (5-60 minutes)

const limit = pLimit(CONCURRENCY_LIMIT);

async function scrapeGoogleFinance(symbol: string): Promise<{ peRatio: number | null; earnings: number | null }> {
  const url = `https://www.google.com/finance/quote/${symbol}`;
  try {
    const { data } = await axios.get<string>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(data);

    let peRatio: number | null = null;
    let earnings: number | null = null;

    // Attempt to find P/E ratio
    // This is a common pattern, but might need adjustment based on actual Google Finance HTML structure
    $('div[data-attrid="PE_RATIO"]').each((i, el) => {
      const text = $(el).find('.P6K39c').text();
      if (text && text !== '-') {
        peRatio = parseFloat(text);
      }
    });

    // Attempt to find Earnings (EPS)
    // This is a placeholder, actual scraping might be more complex
    // Google Finance often shows EPS under "Key Stats" or similar sections
    // For simplicity, we'll assume a similar pattern or might need to refine this.
    // A more robust solution might involve looking for specific labels or data attributes.
    $('div:contains("EPS")').each((i, el) => {
      const parent = $(el).parent();
      const value = parent.find('.P6K39c').text();
      if (value && value !== '-') {
        earnings = parseFloat(value);
      }
    });


    return { peRatio, earnings };
  } catch (error) {
    console.error(`Error scraping Google Finance for ${symbol}:`, error);
    return { peRatio: null, earnings: null };
  }
}

export async function fetchMetrics(symbols: string[]): Promise<Metrics[]> {
  const metrics: Metrics[] = [];
  const fetchPromises = symbols.map((symbol) =>
    limit(async () => {
      const cacheKey = `metrics:${symbol}`;
      const cachedMetrics = await getCachedData<Metrics>(cacheKey);

      if (cachedMetrics) {
        metrics.push({ ...cachedMetrics, cached: true }); // Add a flag for debugging
        return;
      }

      try {
        const { peRatio, earnings } = await scrapeGoogleFinance(symbol);
        const newMetrics: Metrics = { symbol, peRatio, earnings };
        await setCachedData(cacheKey, newMetrics, METRICS_CACHE_TTL);
        metrics.push(newMetrics);
      } catch (error) {
        console.error(`Error fetching metrics for ${symbol}:`, error);
        metrics.push({ symbol, peRatio: null, earnings: null, error: 'Metrics unavailable' });
      }
    })
  );

  await Promise.allSettled(fetchPromises);
  return metrics;
}
