import { v4 as uuidv4 } from 'uuid';
import { Stock, StockWithComputed, Quote, Metrics } from '../interfaces.js';
import { fetchQuotes } from './quotesService.js';
import { fetchMetrics } from './metricsService.js';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

// In-memory store for portfolio holdings (will be replaced by a repository later)
let portfolioHoldings: Stock[] = [
  { id: uuidv4(), symbol: 'HDFCBANK.NS', name: 'HDFC Bank', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 1490, quantity: 50, purchaseDate: '2023-01-15' },
  { id: uuidv4(), symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 6466, quantity: 15, purchaseDate: '2022-11-20' },
  { id: uuidv4(), symbol: 'ICICIBANK.NS', name: 'ICICI Bank', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 780, quantity: 84, purchaseDate: '2024-03-10' },
  { id: uuidv4(), symbol: 'AFFLE.NS', name: 'Affle India', exchange: 'NSE', sector: 'Technology', purchasePrice: 1151, quantity: 50, purchaseDate: '2023-06-01' },
  { id: uuidv4(), symbol: 'LTIM.NS', name: 'LTI Mindtree', exchange: 'NSE', sector: 'Technology', purchasePrice: 4775, quantity: 16, purchaseDate: '2024-01-05' },
  { id: uuidv4(), symbol: 'KPITTECH.NS', name: 'KPIT Tech', exchange: 'NSE', sector: 'Technology', purchasePrice: 672, quantity: 61, purchaseDate: '2023-09-22' },
  { id: uuidv4(), symbol: 'DMART.NS', name: 'Dmart', exchange: 'NSE', sector: 'Consumer', purchasePrice: 3777, quantity: 27, purchaseDate: '2022-10-01' },
  { id: uuidv4(), symbol: 'TATACONSUM.NS', name: 'Tata Consumer', exchange: 'NSE', sector: 'Consumer', purchasePrice: 845, quantity: 90, purchaseDate: '2023-04-18' },
  { id: uuidv4(), symbol: 'PIDILITEIND.NS', name: 'Pidilite', exchange: 'NSE', sector: 'Consumer', purchasePrice: 2376, quantity: 36, purchaseDate: '2024-02-28' },
  { id: uuidv4(), symbol: 'TATAPOWER.NS', name: 'Tata Power', exchange: 'NSE', sector: 'Power', purchasePrice: 224, quantity: 225, purchaseDate: '2023-07-11' },
  { id: uuidv4(), symbol: 'SUZLON.NS', name: 'Suzlon', exchange: 'NSE', sector: 'Power', purchasePrice: 44, quantity: 450, purchaseDate: '2024-01-20' },
  { id: uuidv4(), symbol: 'POLYCAB.NS', name: 'Polycab', exchange: 'NSE', sector: 'Manufacturing', purchasePrice: 2818, quantity: 28, purchaseDate: '2023-03-05' },
  { id: uuidv4(), symbol: 'DEEPAKNTR.NS', name: 'Deepak Nitrite', exchange: 'NSE', sector: 'Chemicals', purchasePrice: 2248, quantity: 27, purchaseDate: '2022-12-12' },
  { id: uuidv4(), symbol: 'FINEORG.NS', name: 'Fine Organic', exchange: 'NSE', sector: 'Chemicals', purchasePrice: 4284, quantity: 16, purchaseDate: '2023-08-08' },
  { id: uuidv4(), symbol: 'SBILIFE.NS', name: 'SBI Life', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 1197, quantity: 49, purchaseDate: '2024-04-25' },
];

// Attempt to seed portfolio from Excel at startup (non-fatal)
export async function initPortfolioFromExcel() {
  try {
    const root = path.resolve(process.cwd());
    const excelPathCandidates = [
      path.join(root, 'Sample_Portfolio_BE_1EC0654C9A.xlsx'),
      path.join(root, 'backend', 'Sample_Portfolio_BE_1EC0654C9A.xlsx'),
    ];
    const excelPath = excelPathCandidates.find(p => fs.existsSync(p));
    if (!excelPath) {
      return; // no file found, keep fallback data
    }
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(excelPath);
    const ws = wb.worksheets[0];
    if (!ws) return;

    const header: Record<string, number> = {};
    const rows: Stock[] = [];
    ws.getRow(1).eachCell((cell: ExcelJS.Cell, col: number) => {
      header[String(cell.value).toLowerCase()] = col;
    });

    ws.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      if (rowNumber === 1) return;
      const getVal = (name: string) => row.getCell(header[name]).value as any;
      const symbol = String(getVal('symbol') ?? '').trim();
      if (!symbol) return;
      const name = String(getVal('name') ?? symbol);
      const exchange = String(getVal('exchange') ?? 'NSE');
      const sector = String(getVal('sector') ?? 'Others');
      const purchasePrice = Number(getVal('purchaseprice') ?? getVal('purchase_price') ?? 0);
      const quantity = Number(getVal('quantity') ?? 0);
      const purchaseDate = String(getVal('purchasedate') ?? getVal('purchase_date') ?? '');
      rows.push({ id: uuidv4(), symbol, name, exchange, sector, purchasePrice, quantity, purchaseDate });
    });

    if (rows.length > 0) {
      portfolioHoldings = rows;
      console.log(`Seeded ${rows.length} holdings from Excel`);
    }
  } catch (err) {
    console.warn('Excel seeding skipped due to error:', err);
  }
}

export async function getPortfolioData(groupBySector: boolean = false): Promise<StockWithComputed[] | { [sector: string]: StockWithComputed[] }> {
  const symbols = portfolioHoldings.map(h => h.symbol);
  const quotes = await fetchQuotes(symbols);
  const metrics = await fetchMetrics(symbols);

  const totalInvestment = portfolioHoldings.reduce((sum, h) => sum + (h.purchasePrice * h.quantity), 0);

  const fullPortfolio: StockWithComputed[] = portfolioHoldings.map(h => {
    const liveQuote = quotes.find(q => q.symbol === h.symbol);
    const liveMetrics = metrics.find(m => m.symbol === h.symbol);

    const cmp = liveQuote?.cmp || null;
    const investment = h.purchasePrice * h.quantity;
    const presentValue = cmp !== null ? cmp * h.quantity : null;
    const gainLoss = presentValue !== null ? presentValue - investment : null;
    const portfolioPercent = (investment / totalInvestment) * 100;

    return {
      ...h,
      cmp,
      investment,
      presentValue,
      gainLoss,
      portfolioPercent,
      peRatio: liveMetrics?.peRatio || null,
      earnings: liveMetrics?.earnings || null,
    };
  });

  if (groupBySector) {
    return fullPortfolio.reduce((acc, stock) => {
      (acc[stock.sector] = acc[stock.sector] || []).push(stock);
      return acc;
    }, {} as { [sector: string]: StockWithComputed[] });
  }

  return fullPortfolio;
}

export function getAllSymbols(): string[] {
  return portfolioHoldings.map(h => h.symbol);
}

export async function getStockById(id: string): Promise<StockWithComputed | null> {
  const stock = portfolioHoldings.find(h => h.id === id);
  if (!stock) return null;

  const quotes = await fetchQuotes([stock.symbol]);
  const metrics = await fetchMetrics([stock.symbol]);

  const liveQuote = quotes[0];
  const liveMetrics = metrics[0];

  const cmp = liveQuote?.cmp || null;
  const investment = stock.purchasePrice * stock.quantity;
  const presentValue = cmp !== null ? cmp * stock.quantity : null;
  const gainLoss = presentValue !== null ? presentValue - investment : null;
  // Portfolio percent requires total portfolio, so it's not computed for single stock detail

  return {
    ...stock,
    cmp,
    investment,
    presentValue,
    gainLoss,
    portfolioPercent: null, // Not applicable for single stock view
    peRatio: liveMetrics?.peRatio || null,
    earnings: liveMetrics?.earnings || null,
  };
}

export async function addStock(newStock: Stock): Promise<Stock> {
  const stockWithId = { ...newStock, id: uuidv4() };
  portfolioHoldings.push(stockWithId);
  return stockWithId;
}

export async function updateStock(id: string, updatedStock: Partial<Stock>): Promise<Stock | null> {
  const index = portfolioHoldings.findIndex(h => h.id === id);
  if (index === -1) return null;

  portfolioHoldings[index] = { ...portfolioHoldings[index], ...updatedStock };
  return portfolioHoldings[index];
}

export async function deleteStock(id: string): Promise<boolean> {
  const initialLength = portfolioHoldings.length;
  portfolioHoldings = portfolioHoldings.filter(h => h.id !== id);
  return portfolioHoldings.length < initialLength;
}

export { fetchQuotes as getQuotes, fetchMetrics as getMetrics };
