import { Router } from 'express';
import {
    getPortfolioHandler,
    getQuotesHandler,
    getMetricsHandler,
    getPortfolioByIdHandler,
    addStockHandler,
    updateStockHandler,
    deleteStockHandler
} from '../controllers/portfolio-controller.js';

const router = Router();

router.get('/portfolio', getPortfolioHandler);
router.get('/portfolio/:id', getPortfolioByIdHandler);
router.post('/portfolio', addStockHandler);
router.put('/portfolio/:id', updateStockHandler);
router.delete('/portfolio/:id', deleteStockHandler);
router.get('/quotes', getQuotesHandler);
router.get('/metrics', getMetricsHandler);

export { router as portfolioRouter };
