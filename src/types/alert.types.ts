export type AlertDirection = 'above' | 'below';
export type AlertStatus = 'active' | 'triggered' | 'dismissed';

export interface PriceAlert {
  id: string;
  coinId: number;
  coinSlug: string;
  coinName: string;
  coinSymbol: string;
  coinLogo: string;
  targetPrice: number;
  direction: AlertDirection;
  status: AlertStatus;
  createdAt: string;
  triggeredAt: string | null;
}

export interface CreateAlertFormData {
  coinId: number;
  targetPrice: number;
  direction: AlertDirection;
}
