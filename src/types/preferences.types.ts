export type SupportedCurrency = 'USD' | 'EUR' | 'BTC';
export type ThemeMode = 'light' | 'dark' | 'system';
export type SortDirection = 'asc' | 'desc';

export interface UserPreferences {
  currency: SupportedCurrency;
  theme: ThemeMode;
  dashboardPerPage: number;
}

export interface TableSortState {
  column: string;
  direction: SortDirection;
}

export interface PaginationState {
  currentPage: number;
  perPage: number;
  totalItems: number;
}
