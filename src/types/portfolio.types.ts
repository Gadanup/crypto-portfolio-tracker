export interface PortfolioHolding {
  id: string;
  coinId: number;
  coinSlug: string;
  coinName: string;
  coinSymbol: string;
  coinLogo: string;
  quantity: number;
  buyPricePerUnit: number;
  addedAt: string;
}

export interface PortfolioHoldingWithMetrics extends PortfolioHolding {
  currentPrice: number;
  currentValue: number;
  totalCost: number;
  profitLoss: number;
  profitLossPercentage: number;
  allocationPercentage: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  bestPerformer: PortfolioHoldingWithMetrics | null;
  worstPerformer: PortfolioHoldingWithMetrics | null;
  holdingsCount: number;
}

export interface AddHoldingFormData {
  coinId: number;
  quantity: number;
  buyPricePerUnit: number;
}
