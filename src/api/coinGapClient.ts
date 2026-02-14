import { API_CONFIG } from '@/helpers/constants';

interface RawCoinCapResponse<TData> {
  data: TData;
  timestamp: number;
}

export class CoinCapApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'CoinCapApiError';
    this.statusCode = statusCode;
  }
}

const buildQueryString = (
  params: Record<string, string | number | boolean>,
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });

  return searchParams.toString();
};

const get = async <TData>(
  path: string,
  params?: Record<string, string | number | boolean>,
): Promise<TData> => {
  const queryString = params ? `?${buildQueryString(params)}` : '';
  const url = `${API_CONFIG.COINCAP.BASE_URL}${path}${queryString}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new CoinCapApiError(
      response.status,
      `CoinCap API request failed with status ${response.status}`,
    );
  }

  const json = (await response.json()) as RawCoinCapResponse<TData>;

  return json.data;
};

export const coinCapClient = { get };
