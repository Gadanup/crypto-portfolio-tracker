# Crypto Portfolio Tracker — Project Specification

## App Overview

A real-time cryptocurrency portfolio tracker that lets users monitor live prices, build and manage a personal portfolio, set price alerts, and analyze market trends through interactive charts. Think of it as a lightweight CoinStats or Blockfolio — built entirely on the frontend with CoinMarketCap's free API for market data and CoinCap's free API for historical charts, persisted via LocalStorage, and designed to feel like a polished financial product.

**Target users**: Crypto enthusiasts and investors who want a clean, fast dashboard to track their holdings and market movements without creating an account.

**Core value proposition**: Real price data, real charts, real portfolio math — not a toy demo. The app handles thousands of coins with debounced search, auto-refreshing prices, and a finance-grade UI that works flawlessly on mobile.

**Interview story**: "I built a real-time portfolio tracker with live price feeds, interactive charts, and optimistic state management."

---

## Features

### MVP (Must Ship)

| Feature | Description |
|---------|-------------|
| **Live Price Table** | Paginated, sortable, filterable table of top coins by market cap. Auto-refreshes every 90s via TanStack Query polling. Columns: rank, name/symbol, price, 24h %, 7d %, market cap, volume. |
| **Coin Search** | Debounced search input (300ms) filtering against the CMC coin map (cached locally). Results appear in a dropdown with coin name, symbol, rank. Keyboard navigable. |
| **Coin Detail Page** | Price chart (line) with time range selector (24h, 7d, 30d, 90d, 1y) using CoinCap history data. Key stats: market cap, volume, circulating supply, price change percentages. |
| **Portfolio Builder** | Add coins with quantity and buy price. View total portfolio value, individual P&L (amount, percentage), allocation breakdown. Add/remove/edit holdings. Persisted to LocalStorage. |
| **Portfolio Table** | Table of holdings with: coin name, quantity, avg buy price, current price, P&L, allocation %. Sortable by any column. |
| **Multi-Currency** | Toggle display currency between USD, EUR, and BTC. Persisted preference. All prices and P&L update accordingly. CMC supports `convert` param natively. |
| **Dark/Light Mode** | Theme toggle with system preference detection on first visit. Persisted to LocalStorage. Smooth transition between modes. |
| **Responsive Design** | Mobile-first layout. Dashboard table collapses to card view on small screens. Navigation adapts from sidebar to bottom nav or hamburger menu. |
| **Skeleton Loaders** | Skeleton placeholders that match the exact shape of the content they replace (table rows, chart area, stat cards). |
| **Error Handling** | Error boundaries around every feature section. Retry buttons on failed API calls. Graceful fallback UI. Toast notifications for user actions. |

### Nice-to-Have (Ship if Time Allows)

| Feature | Description |
|---------|-------------|
| **Price Alerts** | Set upper/lower price thresholds per coin. Visual notification (toast + badge) when a threshold is crossed during a polling cycle. Alerts persisted to LocalStorage. Manage alerts from a dedicated panel. |
| **Sparkline Mini-Charts** | Inline 7-day sparkline SVG charts in portfolio table rows, fetched from CoinCap history endpoint. |
| **Animated Page Transitions** | Smooth route transitions using Framer Motion or CSS transitions. |
| **Pagination Controls** | Full pagination component for the price table: page numbers, per-page selector, "showing X of Y" text. |
| **CoinCap WebSocket** | Real-time streaming price updates via `wss://ws.coincap.io/prices` for top coins on dashboard. |

### Stretch (Bonus / Post-Launch)

| Feature | Description |
|---------|-------------|
| **Portfolio Allocation Chart** | Donut/pie chart showing allocation percentages by coin. |
| **CSV Export** | Export portfolio holdings and P&L data to CSV. |
| **PWA Support** | Service worker for offline access to cached data. |
| **Compare Coins** | Side-by-side chart comparison of two coins. |

---

## Design & UI Direction

### Visual Style

The app should feel like a real financial product — clean, data-dense, and professional. Dark mode is the primary design target (crypto users overwhelmingly prefer dark UIs), with a well-crafted light mode as an alternative.

**Design references**: CoinMarketCap, CoinStats, Blockfolio, Delta app, TradingView's dark theme.

### Color Palette

**Dark Mode (Primary)**:
- Background: `#0B0E11` (near-black), Surface: `#1E2329` (dark gray), Elevated: `#2B3139`
- Text primary: `#EAECEF`, Text secondary: `#848E9C`
- Accent/brand: `#F0B90B` (gold/amber — crypto-native feel)
- Success/profit: `#0ECB81` (green)
- Danger/loss: `#F6465D` (red)
- Chart line: `#F0B90B` (brand gold)

**Light Mode**:
- Background: `#FAFAFA`, Surface: `#FFFFFF`, Elevated: `#F5F5F5`
- Text primary: `#1E2329`, Text secondary: `#707A8A`
- Same accent, success, and danger colors (these work on both backgrounds)

### Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Header: Logo | Search Bar | Currency | Theme   │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │         Main Content Area            │
│ (Nav)    │                                      │
│          │                                      │
│ Dashboard│   [Dashboard / Coin Detail /          │
│ Portfolio│    Portfolio / Alerts]                │
│ Alerts   │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

**Mobile (< 768px)**: Sidebar collapses to bottom tab bar with icons. Header simplifies — search becomes an expandable icon. Tables switch to card-based layouts.

**Tablet (768px–1024px)**: Sidebar collapses to icon-only rail. Content area takes full width.

**Desktop (> 1024px)**: Full sidebar with labels. Content area with comfortable max-width.

### Key Page Layouts

**Dashboard (Home)**:
- Top row: Global stats bar (total market cap, 24h volume, BTC dominance, active cryptocurrencies)
- Search bar (prominent, always visible)
- Main price table with sorting indicators, pagination
- Table columns collapse progressively on smaller screens

**Coin Detail**:
- Hero section: coin icon, name, symbol, current price, 24h change badge
- Interactive chart with time range pills (24h / 7D / 30D / 90D / 1Y) — data from CoinCap
- Stats grid: market cap, volume, supply, rank, price change percentages
- "Add to Portfolio" CTA button
- Back navigation

**Portfolio**:
- Summary cards row: total value, total P&L (amount + %), best/worst performer
- Holdings table with sorting, edit/remove actions
- Empty state when no holdings: illustration + CTA to browse coins
- "Add Holding" modal/drawer with coin search, quantity, buy price fields

**Alerts (Nice-to-Have)**:
- List of active alerts with coin, threshold, direction (above/below), status
- "Create Alert" form: coin search, price input, direction toggle
- Alert notification toast appears over any page when triggered

### Loading, Error, and Empty States

Every async section has three alternative states:

- **Loading**: Skeleton placeholders matching the exact shape of content. Table rows show skeleton rows. Charts show a pulsing rectangle. Stat cards show skeleton text blocks.
- **Error**: Centered error message with an icon, description text, and a "Try Again" button that retriggers the query. Wrapped in ErrorBoundary at the feature level.
- **Empty**: Friendly illustration or icon, descriptive text, and a CTA. For example, empty portfolio shows "No holdings yet — browse coins to start building your portfolio."

### Animations & Micro-Interactions

- Price change flash: brief green/red background flash on price cells when value changes between polls
- Theme toggle: smooth color transition (CSS `transition` on background/color properties)
- Table row hover: subtle background highlight
- Button press: scale-down effect on active state
- Chart tooltip: follows cursor smoothly
- Route transitions: fade or slide (keep subtle, not distracting)
- Skeleton pulse animation: standard pulse/shimmer effect
- Toast notifications: slide in from top-right, auto-dismiss after 4s

---

## Tech Stack

| Category | Choice | Rationale |
|----------|--------|-----------|
| Framework | React 18 + TypeScript | Industry standard, strict typing |
| Build Tool | Vite | Fast HMR, optimized builds |
| Package Manager | pnpm | Disk efficient, fast installs |
| Routing | React Router v6 | Standard for SPAs |
| Data Fetching | TanStack Query v5 | Polling, caching, query invalidation |
| Styling | Tailwind CSS v4 | Utility-first, dark mode built-in, fast iteration |
| Charts | Recharts | React-native, composable, supports line/area charts |
| Forms | React Hook Form + Zod | For Add Holding modal, Alert creation |
| Notifications | react-hot-toast or sonner | Lightweight toast library |
| Icons | lucide-react | Consistent, tree-shakeable icon set |
| Linting | ESLint + Prettier | Per coding standards |

---

## API Integration — Dual API Architecture

This project uses two complementary free APIs:

- **CoinMarketCap (CMC)** — Primary API for real-time market data, coin metadata, global metrics, search, and trending. Requires API key (free Basic tier: 10,000 credits/month).
- **CoinCap** — Supplementary API for historical price data (charts) and optional WebSocket streaming. No API key required for basic use.

### CoinMarketCap Endpoints (Free Basic Tier)

| Endpoint | Purpose | Refresh Strategy |
|----------|---------|-----------------|
| `GET /v1/cryptocurrency/listings/latest` | Dashboard price table (top coins by market cap with price, volume, % changes) | Poll every 90s via `refetchInterval` |
| `GET /v1/cryptocurrency/quotes/latest` | Batch price lookup by IDs/symbols for portfolio value calculation | Poll every 90s |
| `GET /v1/cryptocurrency/map` | Full coin list for search (ID, name, symbol, rank). Cache locally. | Stale time 24h (fetch once per session) |
| `GET /v1/cryptocurrency/info` | Coin metadata: logo, description, URLs, tags | Stale time 1h |
| `GET /v1/cryptocurrency/trending/latest` | Trending coins for dashboard | Stale time 10 min |
| `GET /v1/global-metrics/quotes/latest` | Global market stats (total market cap, volume, BTC dominance) | Stale time 5 min |
| `GET /v1/tools/price-conversion` | Currency conversion (USD/EUR/BTC) | On-demand |
| `GET /v1/fiat/map` | Supported fiat currencies list | Stale time 24h (fetch once) |
| `GET /v1/cryptocurrency/categories` | Coin categories for filtering | Stale time 1h |

**Authentication**: API key passed via `X-CMC_PRO_API_KEY` header on every request.

**Base URL**: `https://pro-api.coinmarketcap.com`

### CoinCap Endpoints (Free, No Key Required)

| Endpoint | Purpose | Refresh Strategy |
|----------|---------|-----------------|
| `GET /v2/assets/{id}/history` | Historical price data for charts (interval: m5, m15, h1, h6, d1) | Stale time varies: 24h chart = 2 min, 7d+ = 10 min |
| `GET /v2/assets/{id}` | Single asset data (supplementary detail) | Stale time 5 min |
| `GET /v2/assets` | Asset list (fallback/supplementary) | Stale time 5 min |
| `WSS wss://ws.coincap.io/prices?assets=...` | WebSocket streaming for real-time price ticks (Nice-to-Have) | Continuous |

**Base URL**: `https://api.coincap.io`

### Rate Limit Strategy

**CoinMarketCap**: 10,000 credits/month (~333/day). Most endpoints cost 1 credit per 100 data points returned.

- **Primary defense**: Aggressive `staleTime` on all queries. Poll at 90s intervals (not 60s) to conserve credits.
- **Query deduplication**: TanStack Query automatically deduplicates identical in-flight requests.
- **Batch where possible**: `/cryptocurrency/quotes/latest` accepts multiple IDs in one call — use this for portfolio value updates instead of individual requests.
- **Cache coin map locally**: The `/cryptocurrency/map` response (full coin list) changes rarely. Fetch once per session, cache in memory/LocalStorage.
- **Stagger requests**: Dashboard loads in priority order: listings first, then global stats, then trending. Not all at once.
- **Retry with backoff**: Configure TanStack Query's `retry` (3 attempts) with exponential backoff. On 429 response, increase backoff.

**CoinCap**: More generous limits, but still use caching. No credit system — rate limit is per-IP (~200 req/min).

### Coin ID Mapping Between APIs

CMC uses numeric IDs (e.g., Bitcoin = 1), while CoinCap uses slug strings (e.g., "bitcoin"). We need a mapping utility:

- Store CMC's `slug` field from `/cryptocurrency/map` alongside CMC IDs
- CoinCap's asset IDs match CMC slugs in most cases (e.g., both use "bitcoin", "ethereum")
- Create a `getCoinCapId(cmcSlug: string)` helper for cross-API lookups

### Query Key Architecture

```typescript
export const QUERY_KEYS = {
  COINS: {
    LISTINGS: (currency: string, page: number, perPage: number) =>
      ['coins', 'listings', currency, page, perPage] as const,
    QUOTES: (coinIds: string) =>
      ['coins', 'quotes', coinIds] as const,
    MAP: ['coins', 'map'] as const,
    INFO: (coinId: string) =>
      ['coins', 'info', coinId] as const,
    TRENDING: ['coins', 'trending'] as const,
    CATEGORIES: ['coins', 'categories'] as const,
  },
  CHARTS: {
    HISTORY: (assetId: string, interval: string) =>
      ['charts', 'history', assetId, interval] as const,
  },
  PORTFOLIO: {
    QUOTES: (coinIds: string, currency: string) =>
      ['portfolio', 'quotes', coinIds, currency] as const,
  },
  GLOBAL: ['global'] as const,
  FIAT_MAP: ['fiatMap'] as const,
} as const;
```

---

## Data Model — TypeScript Interfaces

All types live in `src/types/` per coding standards.

### `src/types/coin.types.ts`

```typescript
export interface CoinListingData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmcRank: number;
  circulatingSupply: number;
  totalSupply: number | null;
  maxSupply: number | null;
  dateAdded: string;
  tags: string[];
  quote: Record<string, CoinQuote>;
}

export interface CoinQuote {
  price: number;
  volume24h: number;
  volumeChange24h: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  percentChange30d: number;
  marketCap: number;
  marketCapDominance: number;
  fullyDilutedMarketCap: number;
  lastUpdated: string;
}

export interface CoinMapItem {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  rank: number;
  isActive: number;
  firstHistoricalData: string;
  lastHistoricalData: string;
  platform: CoinPlatform | null;
}

export interface CoinPlatform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  tokenAddress: string;
}

export interface CoinInfo {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  category: string;
  description: string;
  dateAdded: string;
  dateLaunched: string | null;
  tags: string[];
  logo: string;
  urls: CoinUrls;
}

export interface CoinUrls {
  website: string[];
  technicalDoc: string[];
  twitter: string[];
  reddit: string[];
  messageBoard: string[];
  chat: string[];
  explorer: string[];
  sourceCode: string[];
}

export interface TrendingCoin {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmcRank: number;
  quote: Record<string, CoinQuote>;
}

export interface CoinCapHistoryPoint {
  priceUsd: string;
  time: number;
  date: string;
}

export interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string | null;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export interface GlobalMarketData {
  activeCryptocurrencies: number;
  totalCryptocurrencies: number;
  activeMarketPairs: number;
  activeExchanges: number;
  btcDominance: number;
  ethDominance: number;
  totalMarketCap: number;
  totalVolume24h: number;
  totalMarketCapYesterdayPercentageChange: number;
  totalVolume24hYesterdayPercentageChange: number;
  lastUpdated: string;
}
```

### `src/types/portfolio.types.ts`

```typescript
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
```

### `src/types/alert.types.ts`

```typescript
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
```

### `src/types/preferences.types.ts`

```typescript
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
```

### `src/types/api.types.ts`

```typescript
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
```

### `src/types/index.ts`

Barrel export re-exporting all types from the above files.

---

## Constants & Enums

### `src/helpers/constants/enums.ts`

```typescript
export enum CoinCapInterval {
  FIVE_MIN = 'm5',
  FIFTEEN_MIN = 'm15',
  ONE_HOUR = 'h1',
  SIX_HOUR = 'h6',
  ONE_DAY = 'd1',
}

export enum TimeRange {
  DAY = '1',
  WEEK = '7',
  MONTH = '30',
  THREE_MONTHS = '90',
  YEAR = '365',
}

export enum SortColumn {
  RANK = 'cmcRank',
  NAME = 'name',
  PRICE = 'price',
  CHANGE_1H = 'percentChange1h',
  CHANGE_24H = 'percentChange24h',
  CHANGE_7D = 'percentChange7d',
  MARKET_CAP = 'marketCap',
  VOLUME = 'volume24h',
}

export enum RoutePath {
  DASHBOARD = '/',
  COIN_DETAIL = '/coin/:coinId',
  PORTFOLIO = '/portfolio',
  ALERTS = '/alerts',
}
```

### `src/helpers/constants/apiConfig.ts`

```typescript
export const API_CONFIG = {
  CMC: {
    BASE_URL: import.meta.env.VITE_CMC_BASE_URL,
    DEFAULT_PER_PAGE: 100,
    SEARCH_DEBOUNCE_MS: 300,
    POLLING_INTERVAL_MS: 90_000,
    STALE_TIMES: {
      LISTINGS: 90_000,
      QUOTES: 90_000,
      MAP: 24 * 60 * 60_000,
      INFO: 60 * 60_000,
      GLOBAL: 5 * 60_000,
      TRENDING: 10 * 60_000,
      FIAT_MAP: 24 * 60 * 60_000,
      CATEGORIES: 60 * 60_000,
    },
    RETRY_COUNT: 3,
  },
  COINCAP: {
    BASE_URL: 'https://api.coincap.io/v2',
    STALE_TIMES: {
      HISTORY_SHORT: 2 * 60_000,
      HISTORY_LONG: 10 * 60_000,
      ASSET: 5 * 60_000,
    },
    WS_URL: 'wss://ws.coincap.io/prices',
  },
} as const;
```

### `src/helpers/constants/textContent.ts`

All user-facing strings centralized here: button labels, headings, placeholder text, error messages, empty state messages, toast messages, table column headers, etc.

---

## Folder Structure (Detailed)

```
src/
├── api/
│   ├── cmcClient.ts                 # CMC fetch wrapper (adds API key header, base URL)
│   ├── coinCapClient.ts             # CoinCap fetch wrapper (base URL, no auth)
│   ├── endpoints/
│   │   ├── cmcCoin.endpoints.ts     # CMC cryptocurrency endpoints
│   │   ├── cmcGlobal.endpoints.ts   # CMC global metrics endpoint
│   │   ├── coinCapAsset.endpoints.ts # CoinCap asset/history endpoints
│   │   └── index.ts
│   └── hooks/
│       ├── useCoinListings.ts       # Paginated listings with polling
│       ├── useCoinQuotes.ts         # Batch quotes for portfolio
│       ├── useCoinMap.ts            # Full coin map for search (cached)
│       ├── useCoinInfo.ts           # Coin metadata/detail
│       ├── useTrendingCoins.ts      # Trending coins
│       ├── useGlobalData.ts         # Global market stats
│       ├── usePriceHistory.ts       # CoinCap historical data for charts
│       └── index.ts
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── DataTable/
│   │   ├── Skeleton/
│   │   ├── Sparkline/
│   │   ├── ThemeToggle/
│   │   ├── CurrencySelector/
│   │   ├── SearchInput/
│   │   ├── Modal/
│   │   ├── Badge/
│   │   ├── ErrorFallback/
│   │   ├── EmptyState/
│   │   ├── Pagination/
│   │   └── index.ts
│   └── layout/
│       ├── AppLayout/
│       ├── Header/
│       ├── Sidebar/
│       ├── MobileNav/
│       └── index.ts
├── features/
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── GlobalStatsBar.tsx
│   │   │   ├── CoinTable.tsx
│   │   │   ├── CoinTableRow.tsx
│   │   │   └── TrendingCoins.tsx
│   │   ├── hooks/
│   │   │   └── useDashboardData.ts
│   │   ├── types/
│   │   └── index.ts
│   ├── coin-detail/
│   │   ├── components/
│   │   │   ├── PriceChart.tsx
│   │   │   ├── TimeRangeSelector.tsx
│   │   │   ├── CoinStats.tsx
│   │   │   └── CoinHero.tsx
│   │   ├── hooks/
│   │   └── index.ts
│   ├── portfolio/
│   │   ├── components/
│   │   │   ├── PortfolioSummaryCards.tsx
│   │   │   ├── HoldingsTable.tsx
│   │   │   ├── HoldingRow.tsx
│   │   │   ├── AddHoldingModal.tsx
│   │   │   └── EditHoldingModal.tsx
│   │   ├── hooks/
│   │   │   ├── usePortfolio.ts
│   │   │   └── usePortfolioMetrics.ts
│   │   ├── types/
│   │   └── index.ts
│   └── alerts/
│       ├── components/
│       │   ├── AlertsList.tsx
│       │   ├── AlertRow.tsx
│       │   ├── CreateAlertModal.tsx
│       │   └── AlertNotification.tsx
│       ├── hooks/
│       │   └── useAlerts.ts
│       └── index.ts
├── helpers/
│   ├── constants/
│   │   ├── apiConfig.ts
│   │   ├── enums.ts
│   │   ├── queryKeys.ts
│   │   ├── routes.ts
│   │   ├── textContent.ts
│   │   ├── theme.ts
│   │   └── index.ts
│   └── utils/
│       ├── formatCurrency.ts
│       ├── formatNumber.ts
│       ├── formatDate.ts
│       ├── formatPercentage.ts
│       ├── localStorage.ts
│       ├── mapApiResponse.ts
│       ├── coinIdMapping.ts
│       └── index.ts
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useTheme.ts
│   ├── useCurrency.ts
│   └── index.ts
├── types/
│   ├── coin.types.ts
│   ├── portfolio.types.ts
│   ├── alert.types.ts
│   ├── preferences.types.ts
│   ├── api.types.ts
│   └── index.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx
```

---

## API Response Mapping

CMC returns `snake_case` JSON. CoinCap also returns `camelCase` but with string numbers (e.g., `"priceUsd": "96432.12"`). All responses must be mapped at the API boundary:

- **CMC mapper**: Convert `snake_case` keys to `camelCase` TypeScript interfaces (e.g., `cmc_rank` → `cmcRank`, `percent_change_24h` → `percentChange24h`)
- **CoinCap mapper**: Parse string numbers to actual numbers (e.g., `"priceUsd": "96432.12"` → `priceUsd: 96432.12`)
- **Coin ID mapper**: Cross-reference CMC slugs with CoinCap asset IDs for chart data

```typescript
export const mapCmcListingItem = (raw: RawCmcListingItem): CoinListingData => ({
  id: raw.id,
  name: raw.name,
  symbol: raw.symbol,
  slug: raw.slug,
  cmcRank: raw.cmc_rank,
  circulatingSupply: raw.circulating_supply,
  // ... etc
});
```

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Dual API (CMC + CoinCap)** | CMC free tier has no historical/chart data. CoinCap fills this gap perfectly with free history endpoints and WebSocket. Together they cover all needs. |
| **Tailwind CSS** over MUI | Data-dense project needs custom styling. Tailwind gives full control. Dark mode is trivial with `dark:` prefix. |
| **Recharts** for charts | React-native, composable, supports line/area charts. CoinCap provides the price history data. |
| **LocalStorage** for persistence | No auth needed for Project 1. Portfolio, alerts, and preferences all fit in LocalStorage. Clean `useLocalStorage` hook abstracts this. |
| **No global state library** | TanStack Query handles all server state. LocalStorage hooks handle persistence. React state + context for theme/currency. No Zustand or Redux needed. |
| **camelCase mapping at API boundary** | Keeps all component code consistent with TypeScript conventions. One mapping layer, no snake_case leaking into UI code. |
| **90s polling interval** | More conservative than 60s to respect CMC's 10k credits/month budget. Still feels responsive. |
| **Coin map cached locally** | The full coin list (~10k entries) changes rarely. Fetching once per session and filtering client-side is far more credit-efficient than hitting search endpoints. |
