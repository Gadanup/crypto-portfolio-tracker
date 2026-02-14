import { API_CONFIG } from '@/helpers/constants';

import type { CMCStatus } from '@/types';

interface RawCMCStatus {
  timestamp: string;
  error_code: number;
  error_message: string | null;
  elapsed: number;
  credit_count: number;
}

interface RawCMCResponse<TData> {
  status: RawCMCStatus;
  data: TData;
}

export class CMCApiError extends Error {
  status: CMCStatus;

  constructor(cmcStatus: CMCStatus) {
    super(
      cmcStatus.errorMessage ?? `CMC API error (code ${cmcStatus.errorCode})`,
    );
    this.name = 'CMCApiError';
    this.status = cmcStatus;
  }
}

const mapRawStatus = (raw: RawCMCStatus): CMCStatus => ({
  timestamp: raw.timestamp,
  errorCode: raw.error_code,
  errorMessage: raw.error_message,
  elapsed: raw.elapsed,
  creditCount: raw.credit_count,
});

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
  const url = `${API_CONFIG.CMC.BASE_URL}${path}${queryString}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': API_CONFIG.CMC.API_KEY,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as RawCMCResponse<unknown> | null;

    if (errorBody?.status) {
      throw new CMCApiError(mapRawStatus(errorBody.status));
    }

    throw new Error(`CMC API request failed with status ${response.status}`);
  }

  const json = (await response.json()) as RawCMCResponse<TData>;

  if (json.status.error_code !== 0) {
    throw new CMCApiError(mapRawStatus(json.status));
  }

  return json.data;
};

export const cmcClient = { get };
