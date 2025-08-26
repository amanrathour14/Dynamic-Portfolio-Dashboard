import app from './app.js';
import cron from 'node-cron';
import { initPortfolioFromExcel, getAllSymbols, getQuotes as warmQuotes, getMetrics as warmMetrics } from './services/data-service.js';

const PORT = process.env.PORT || 5000;

// Initialize portfolio from Excel if available (non-fatal)
initPortfolioFromExcel().catch((e) => console.warn('Init from Excel failed:', e));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Warm CMP cache every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    try {
      const symbols = getAllSymbols();
      if (symbols.length) {
        await warmQuotes(symbols);
      }
    } catch (err) {
      console.warn('Quote warmup failed:', err);
    }
  });

  // Warm metrics (P/E, earnings) every 15 minutes
  cron.schedule('0 */15 * * * *', async () => {
    try {
      const symbols = getAllSymbols();
      if (symbols.length) {
        await warmMetrics(symbols);
      }
    } catch (err) {
      console.warn('Metrics warmup failed:', err);
    }
  });
});
