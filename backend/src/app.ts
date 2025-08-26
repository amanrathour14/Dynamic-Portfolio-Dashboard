import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { portfolioRouter } from './routes/routes.js';
import { connectRedis } from './utils/cache.js';

dotenv.config(); // Load environment variables

const app = express();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(express.json());
app.use(limiter); // Apply the rate limiting middleware to all requests

// Connect to Redis
connectRedis().catch((err) => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1); // Exit if Redis connection fails
});

app.use('/api', portfolioRouter);

// Basic error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
