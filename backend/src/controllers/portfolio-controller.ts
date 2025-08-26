import { Request, Response } from 'express';
import * as DataService from '../services/data-service.js';
import { Stock } from '../interfaces.js';

export const getPortfolioHandler = async (req: Request, res: Response) => {
  const groupBySector = req.query.groupBySector === 'true';
  try {
    const portfolio = await DataService.getPortfolioData(groupBySector);
    res.json(portfolio);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching portfolio data', error: error.message });
  }
};

export const getPortfolioByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const stockDetails = await DataService.getStockById(id);
    if (!stockDetails) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.json(stockDetails);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching stock details', error: error.message });
  }
};

export const addStockHandler = async (req: Request, res: Response) => {
  const newStock: Stock = req.body;
  try {
    const addedStock = await DataService.addStock(newStock);
    res.status(201).json(addedStock);
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding stock', error: error.message });
  }
};

export const updateStockHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedStock: Partial<Stock> = req.body;
  try {
    const result = await DataService.updateStock(id, updatedStock);
    if (!result) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating stock', error: error.message });
  }
};

export const deleteStockHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await DataService.deleteStock(id);
    if (!result) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting stock', error: error.message });
  }
};

export const getQuotesHandler = async (req: Request, res: Response) => {
  try {
    const symbols = (req.query.symbols as string).split(',');
    if (!symbols || symbols.length === 0) {
      return res.status(400).json({ message: 'Symbols query parameter is required' });
    }
    const quotes = await DataService.getQuotes(symbols);
    res.json(quotes);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching quotes', error: error.message });
  }
};

export const getMetricsHandler = async (req: Request, res: Response) => {
  try {
    const symbols = (req.query.symbols as string).split(',');
    if (!symbols || symbols.length === 0) {
      return res.status(400).json({ message: 'Symbols query parameter is required' });
    }
    const metrics = await DataService.getMetrics(symbols);
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching metrics', error: error.message });
  }
};
