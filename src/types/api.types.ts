export interface CMCApiResponse<TData> {
  status: CMCStatus;
  data: TData;
}

export interface CMCStatus {
  timestamp: string;
  errorCode: number;
  errorMessage: string | null;
  elapsed: number;
  creditCount: number;
}

export interface CoinCapApiResponse<TData> {
  data: TData;
  timestamp: number;
}

export interface ApiRequestConfig {
  params?: Record<string, string | number | boolean>;
}
