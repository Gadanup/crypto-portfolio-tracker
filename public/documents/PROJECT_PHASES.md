# Crypto Portfolio Tracker — Build Phases

## How to Use This Document

Each phase builds on the previous one. The app should be in a **working, runnable state** at the end of every phase. Subphases within a phase can be done in order — each one specifies which files to create or modify, and what "done" looks like.

Estimated total: **~2 weeks** (per the roadmap cadence).

---

- [ ] **Phase 0: Project Setup**

**Goal**: Scaffolded Vite + React + TypeScript project with all tooling configured, folder structure in place, and a "Hello World" rendering in the browser.

- [x] **0.1 — Repository & Scaffold**

**Actions**:

- Create a new GitHub repo: `crypto-portfolio-tracker`
- Scaffold with: `pnpm create vite@latest crypto-portfolio-tracker --template react-ts`
- `cd crypto-portfolio-tracker && pnpm install`

**Files created**: Default Vite template files.

**Acceptance criteria**: `pnpm dev` starts the dev server and renders the Vite default page.

- [x] **0.2 — ESLint & Prettier**

**Actions**:

- Install and configure ESLint with TypeScript support
- Install and configure Prettier
- Add `.eslintrc.cjs` and `.prettierrc` at project root
- Add lint and format scripts to `package.json`

**Files created/modified**:

- `.eslintrc.cjs`
- `.prettierrc`
- `package.json` (scripts)

**Acceptance criteria**: `pnpm lint` runs with zero errors on the default template. `pnpm format` formats all files.

- [x] **0.3 — Tailwind CSS**

**Actions**:

- Install Tailwind CSS, PostCSS, autoprefixer
- Generate `tailwind.config.ts` and `postcss.config.js`
- Configure Tailwind with custom color tokens from the design spec (dark/light palette)
- Enable `darkMode: 'class'` strategy
- Replace default styles in `src/styles/globals.css` with Tailwind directives and base styles

**Files created/modified**:

- `tailwind.config.ts` (custom colors, fonts)
- `postcss.config.js`
- `src/styles/globals.css`

**Acceptance criteria**: A Tailwind class like `bg-surface text-primary` renders correctly. Dark mode classes (`dark:bg-surface-dark`) work when `<html class="dark">` is set.

- [x] **0.4 — Path Aliases**

**Actions**:

- Configure `@/` path alias in `tsconfig.json` (paths) and `vite.config.ts` (resolve.alias)

**Files modified**:

- `tsconfig.json`
- `vite.config.ts`

**Acceptance criteria**: `import { something } from '@/helpers/utils'` resolves correctly.

- [x] **0.5 — Folder Structure**

**Actions**:

- Create the entire folder structure from the project spec
- Add `index.ts` barrel export files in every directory
- Delete default Vite boilerplate files (`App.css`, `logo.svg`, etc.)

**Files created**: All empty folders and `index.ts` files as defined in the spec's folder structure section.

**Files modified**: `App.tsx` (strip default content, render a placeholder), `main.tsx` (import globals.css).

**Acceptance criteria**: All folders exist. All barrel `index.ts` files exist. App renders a placeholder with the correct Tailwind styling.

- [x] **0.6 — Environment Variables**

**Actions**:

- Create `.env.local` with:
  - `VITE_CMC_BASE_URL=https://pro-api.coinmarketcap.com`
  - `VITE_CMC_API_KEY=your-api-key-here` (get free key at https://coinmarketcap.com/api/)
  - `VITE_COINCAP_BASE_URL=https://api.coincap.io/v2`
- Create `.env.example` with placeholder values (no real keys)
- Add `.env.local` to `.gitignore`

**Files created**: `.env.local`, `.env.example`
**Files modified**: `.gitignore`

**Acceptance criteria**: `import.meta.env.VITE_CMC_BASE_URL` and `import.meta.env.VITE_CMC_API_KEY` are accessible in code.

- [x] **0.7 — Core Dependencies**

**Actions**:

- Install all project dependencies:
  - `@tanstack/react-query`, `react-router-dom`, `react-hook-form`, `@hookform/resolvers`, `zod`
  - `recharts`, `lucide-react`, `react-hot-toast` (or `sonner`)
  - Dev: `@tanstack/eslint-plugin-query`

**Files modified**: `package.json`, `pnpm-lock.yaml`

**Acceptance criteria**: All packages installed. No version conflicts.

- [x] **0.8 — Base Constants & Types**

**Actions**:

- Create `src/helpers/constants/apiConfig.ts` — CMC and CoinCap base URLs, stale times, polling intervals, retry config
- Create `src/helpers/constants/enums.ts` — CoinCapInterval, TimeRange, SortColumn, RoutePath enums
- Create `src/helpers/constants/textContent.ts` — Start with navigation labels, page titles, common button text
- Create `src/helpers/constants/queryKeys.ts` — Query key factory (COINS, CHARTS, PORTFOLIO, GLOBAL namespaces)
- Create `src/helpers/constants/routes.ts` — Route path constants
- Create `src/helpers/constants/index.ts` — Barrel export
- Create all type files in `src/types/` as defined in the spec (coin, portfolio, alert, preferences, api types)

**Acceptance criteria**: All constants and types importable via `@/helpers/constants` and `@/types`. TypeScript compiles with zero errors.

---

- [x] **Phase 1: API Layer**

**Goal**: Complete dual-API integration (CoinMarketCap + CoinCap) — fetch wrappers, all endpoint functions, all TanStack Query hooks. Testable independently via a simple debug page.

- [x] **1.1 — API Clients (Fetch Wrappers)**

**Actions**:

- Create `src/api/cmcClient.ts` — a typed fetch wrapper for CoinMarketCap that:
  - Prepends the CMC base URL from env vars
  - Adds the `X-CMC_PRO_API_KEY` header from env vars on every request
  - Accepts query params as a typed object
  - Parses JSON responses and extracts the `data` field from CMC's response envelope
  - Throws typed errors using `CMCStatus` on non-zero `error_code`
  - Handles network errors gracefully
- Create `src/api/coinCapClient.ts` — a typed fetch wrapper for CoinCap that:
  - Prepends the CoinCap base URL
  - No auth needed
  - Parses JSON responses and extracts the `data` field
  - Parses string numbers to actual numbers where needed
  - Handles errors gracefully

**Files created**: `src/api/cmcClient.ts`, `src/api/coinCapClient.ts`

**Acceptance criteria**: `cmcClient.get<T>(path, params)` adds the API key header automatically. `coinCapClient.get<T>(path, params)` works without auth. Both are generic and return typed data.

- [x] **1.2 — Response Mappers**

**Actions**:

- Create `src/helpers/utils/mapApiResponse.ts` — mapper functions:
  - `mapCmcListingItem` — for `/cryptocurrency/listings/latest` items (snake_case → camelCase)
  - `mapCmcCoinInfo` — for `/cryptocurrency/info` response items
  - `mapCmcGlobalData` — for `/global-metrics/quotes/latest`
  - `mapCmcMapItem` — for `/cryptocurrency/map` items
  - `mapCmcTrendingItem` — for `/cryptocurrency/trending/latest` items
  - `mapCoinCapHistoryPoint` — for CoinCap `/assets/{id}/history` (parse string numbers)
  - `mapCoinCapAsset` — for CoinCap `/assets/{id}` (parse string numbers)
- Create `src/helpers/utils/coinIdMapping.ts` — utility to map between CMC slugs and CoinCap asset IDs

**Files created**: `src/helpers/utils/mapApiResponse.ts`, `src/helpers/utils/coinIdMapping.ts`

**Acceptance criteria**: Each mapper takes a raw API response shape and returns the correctly typed camelCase interface with proper number types.

- [x] **1.3 — Endpoint Functions**

**Actions**:

- Create `src/api/endpoints/cmcCoin.endpoints.ts`:
  - `getCoinListings(currency, start, limit, sort)` → `CoinListingData[]`
  - `getCoinQuotes(ids, currency)` → `Record<string, CoinListingData>`
  - `getCoinMap()` → `CoinMapItem[]`
  - `getCoinInfo(ids)` → `Record<string, CoinInfo>`
  - `getTrendingCoins()` → `TrendingCoin[]`
  - `getCategories()` → category data
- Create `src/api/endpoints/cmcGlobal.endpoints.ts`:
  - `getGlobalMetrics(currency)` → `GlobalMarketData`
  - `getFiatMap()` → fiat currency list
  - `convertPrice(amount, id, convert)` → converted price
- Create `src/api/endpoints/coinCapAsset.endpoints.ts`:
  - `getAssetHistory(assetId, interval, start, end)` → `CoinCapHistoryPoint[]`
  - `getAsset(assetId)` → `CoinCapAsset`
  - `getAssets(limit)` → `CoinCapAsset[]`
- Create `src/api/endpoints/index.ts` — barrel export

**Files created**: All endpoint files.

**Acceptance criteria**: Each function calls the correct API URL with proper params, maps the response through the appropriate mapper, and returns typed data.

- [x] **1.4 — TanStack Query Provider Setup**

**Actions**:

- Create `src/api/queryClient.ts` — configure `QueryClient` with default options (retry, staleTime, refetchOnWindowFocus)
- Wrap `<App />` in `<QueryClientProvider>` in `main.tsx`

**Files created**: `src/api/queryClient.ts`
**Files modified**: `main.tsx`

**Acceptance criteria**: TanStack Query DevTools visible in dev mode. Provider wraps the entire app.

- [x] **1.5 — TanStack Query Hooks**

**Actions**:

- Create all hooks in `src/api/hooks/`:
  - `useCoinListings(currency, page, perPage)` — uses `refetchInterval` (90s) for polling, returns paginated data
  - `useCoinQuotes(coinIds, currency)` — batch quotes for portfolio, polling at 90s
  - `useCoinMap()` — fetches full coin map once per session (staleTime 24h), used for client-side search
  - `useCoinInfo(coinId)` — coin metadata, enabled only when coinId is defined
  - `useTrendingCoins()` — trending with long staleTime
  - `useGlobalData(currency)` — global market stats, stale time 5 min
  - `usePriceHistory(assetId, interval)` — CoinCap historical data, staleTime varies by interval
- Create `src/api/hooks/index.ts` — barrel export

**Files created**: All hook files.

**Acceptance criteria**: Each hook uses the correct query key from the factory, correct endpoint function, correct staleTime/refetchInterval. All hooks return `{ data, isLoading, isError, error }` with proper types.

- [x] **1.6 — API Layer Verification**

**Actions**:

- Create a temporary debug page or use React Query DevTools to verify:
  - CMC listings data loads (top 100 coins by market cap)
  - CMC coin map loads (full coin list for search)
  - CMC global metrics load
  - CoinCap history loads for "bitcoin" with different intervals
  - Polling works (data refreshes every 90s, observable in DevTools)
  - API key is correctly attached to CMC requests (check Network tab)

**Acceptance criteria**: All endpoints return correctly typed data. No runtime errors. Polling observable in DevTools. CMC credit usage is reasonable.

---

- [ ] **Phase 2: Core UI Shell**

**Goal**: App has routing, a responsive layout (header + sidebar + content area), theme toggling, and currency selection. All pages exist as placeholders.

- [x] **2.1 — React Router Setup**

**Actions**:

- Create `src/App.tsx` with `<BrowserRouter>` and route definitions:
  - `/` → Dashboard page
  - `/coin/:coinId` → Coin Detail page
  - `/portfolio` → Portfolio page
  - `/alerts` → Alerts page
  - `*` → 404 Not Found page
- Create placeholder page components in each feature's `index.ts` (just render the page name)

**Files modified**: `src/App.tsx`
**Files created**: Placeholder exports in each feature `index.ts`

**Acceptance criteria**: Navigating to each route renders the correct placeholder. Unknown routes show a 404 page.

- [x] **2.2 — Theme System**

**Actions**:

- Create `src/hooks/useTheme.ts` — custom hook that:
  - Reads theme from LocalStorage (or defaults to system preference)
  - Toggles `dark` class on `<html>` element
  - Provides `theme`, `toggleTheme`, `setTheme` functions
  - Persists choice to LocalStorage
- Create `src/helpers/constants/theme.ts` — theme-related constants

**Files created**: `src/hooks/useTheme.ts`, `src/helpers/constants/theme.ts`

**Acceptance criteria**: Theme persists across page reloads. System preference detected on first visit. `dark:` Tailwind classes activate correctly.

- [x] **2.3 — Currency Context**

**Actions**:

- Create `src/hooks/useCurrency.ts` — custom hook backed by LocalStorage:
  - Provides `currency`, `setCurrency`
  - Default: `'usd'`
  - Persisted to LocalStorage
- Optionally wrap in a small React Context if multiple deep components need it without prop drilling

**Files created**: `src/hooks/useCurrency.ts` (and optionally a context provider)

**Acceptance criteria**: Currency selection persists across reloads. Accessible from any component.

- [x] **2.4 — useLocalStorage & useDebounce Hooks**

**Actions**:

- Create `src/hooks/useLocalStorage.ts` — generic typed hook for reading/writing LocalStorage with JSON serialization
- Create `src/hooks/useDebounce.ts` — generic debounce hook (takes value + delay, returns debounced value)

**Files created**: Both hook files.

**Acceptance criteria**: Both hooks are generic, type-safe, and independently testable.

- [ ] **2.5 — Layout Components**

**Actions**:

- Create `src/components/layout/AppLayout/AppLayout.tsx` — wraps all pages. Contains Header + Sidebar + main content `<Outlet />`
- Create `src/components/layout/Header/Header.tsx` — logo, search input placeholder, currency selector, theme toggle
- Create `src/components/layout/Sidebar/Sidebar.tsx` — navigation links (Dashboard, Portfolio, Alerts) with active state via `useLocation`
- Create `src/components/layout/MobileNav/MobileNav.tsx` — bottom tab bar for mobile, shown only below `md` breakpoint
- Add barrel exports

**Files created**: All layout component files.

**Acceptance criteria**: Desktop shows header + sidebar + content. Mobile shows header + content + bottom nav. Active route is highlighted in nav. Theme toggle works. Currency selector works.

- [ ] **2.6 — Base UI Components (First Batch)**

**Actions**:

- Create `src/components/ui/Button/Button.tsx` — variants: primary, secondary, ghost, danger. Sizes: sm, md, lg. Accepts `isLoading` prop.
- Create `src/components/ui/Card/Card.tsx` — surface-colored container with optional title, padding
- Create `src/components/ui/Skeleton/Skeleton.tsx` — pulse animation, accepts className for sizing. Variants: text, circle, rectangle
- Create `src/components/ui/Badge/Badge.tsx` — for price change (green positive, red negative), small colored pill
- Create `src/components/ui/ErrorFallback/ErrorFallback.tsx` — error icon, message, "Try Again" button
- Create `src/components/ui/EmptyState/EmptyState.tsx` — icon, title, description, optional CTA button
- Add barrel exports

**Files created**: All UI component files.

**Acceptance criteria**: Each component renders correctly with all prop variants. Tailwind dark mode classes applied. Responsive sizing works.

---

- [ ] **Phase 3: Dashboard Page**

**Goal**: Fully functional dashboard with live price table, global stats, search, sparklines, sorting, filtering, and pagination. This is the "hero" page of the app.

- [ ] **3.1 — Global Stats Bar**

**Actions**:

- Create `src/features/dashboard/components/GlobalStatsBar.tsx`
  - Uses `useGlobalData()` hook
  - Displays: total market cap, 24h volume, BTC dominance, active cryptocurrencies
  - Number formatting via utility functions
  - Skeleton loader while loading
  - Horizontally scrollable on mobile

**Files created**: `GlobalStatsBar.tsx`

**Acceptance criteria**: Stats render with real data from CoinMarketCap. Skeleton shows during load. Numbers formatted with currency symbol and abbreviations (e.g., "$2.1T").

- [ ] **3.2 — Utility Functions for Formatting**

**Actions**:

- Create `src/helpers/utils/formatCurrency.ts` — uses `Intl.NumberFormat` for currency formatting with compact notation for large numbers
- Create `src/helpers/utils/formatNumber.ts` — generic number formatting (compact, percentage, supply numbers)
- Create `src/helpers/utils/formatPercentage.ts` — percentage with sign prefix (+/-) and color indicator
- Create `src/helpers/utils/formatDate.ts` — relative time and absolute date formatting
- Add barrel exports

**Files created**: All utility files.

**Acceptance criteria**: `formatCurrency(2100000000000, 'usd')` → `"$2.10T"`. `formatPercentage(5.23)` → `"+5.23%"`. All functions are pure and tested mentally with edge cases (0, negative, null).

- [ ] **3.3 — Coin Price Table**

**Actions**:

- Create `src/features/dashboard/components/CoinTable.tsx`
  - Uses `useCoinListings()` hook
  - Columns: #, Coin (icon + name + symbol), Price, 24h %, 7d %, Market Cap, Volume, 7d Sparkline
  - Clickable rows → navigate to `/coin/:coinId`
  - Skeleton rows while loading
  - Error state with retry
- Create `src/features/dashboard/components/CoinTableRow.tsx` — single row component
  - Price change cells colored green/red via `Badge` component
  - Sparkline in last column

**Files created**: `CoinTable.tsx`, `CoinTableRow.tsx`

**Acceptance criteria**: Table renders 50 coins with real data. Rows are clickable. Prices formatted correctly per selected currency. Loading shows skeleton rows. Error shows fallback.

- [ ] **3.4 — Sparkline Component**

**Actions**:

- Create `src/components/ui/Sparkline/Sparkline.tsx`
  - Accepts `data: number[]` and renders an inline SVG line chart
  - Line color: green if last > first, red if last < first
  - Fixed small dimensions (e.g., 120x40)
  - No axes, no labels — just the line

**Files created**: `Sparkline.tsx`

**Acceptance criteria**: Sparklines render in the table. Color reflects 7-day price direction. Performant with 50 rows on screen.

- [ ] **3.5 — Table Sorting**

**Actions**:

- Add sorting state to `CoinTable.tsx`
  - Clicking a column header sorts by that column
  - Visual indicator (arrow icon) on the active sort column
  - Toggle between ascending/descending on re-click
  - Default sort: by market cap rank, ascending

**Files modified**: `CoinTable.tsx`

**Acceptance criteria**: All sortable columns work. Active column has a visible arrow. Sort direction toggles on click.

- [ ] **3.6 — Table Pagination**

**Actions**:

- Create `src/components/ui/Pagination/Pagination.tsx`
  - Page number buttons, previous/next, "showing X of Y"
  - Per-page selector (25, 50, 100)
- Wire into `CoinTable.tsx` — `useCoinListings` accepts `page` and `perPage` params

**Files created**: `Pagination.tsx`
**Files modified**: `CoinTable.tsx`

**Acceptance criteria**: Pagination controls work. Changing page fetches new data (loading state visible briefly). Per-page selector updates results count.

- [ ] **3.7 — Coin Search**

**Actions**:

- Create `src/components/ui/SearchInput/SearchInput.tsx` — input with search icon, clear button, loading spinner
- Create `src/features/dashboard/components/SearchDropdown.tsx`:
  - Appears below the search input in the header
  - Uses `useCoinMap()` with `useDebounce` (300ms) — filters the cached coin map client-side
  - Shows results: coin icon, name, symbol, rank
  - Keyboard navigation: arrow keys to move, Enter to select, Escape to close
  - Click or Enter → navigate to `/coin/:coinId`
  - Shows "No results" empty state
  - Closes on click outside (use a `useClickOutside` hook or `useRef` + event listener)

**Files created**: `SearchInput.tsx`, `SearchDropdown.tsx`
**Files modified**: `Header.tsx` (integrate search)

**Acceptance criteria**: Typing triggers debounced search. Results appear in dropdown. Keyboard navigation works (up/down/enter/escape). Clicking a result navigates to coin detail. Dropdown closes on outside click.

- [ ] **3.8 — Dashboard Assembly**

**Actions**:

- Create `src/features/dashboard/index.tsx` — the Dashboard page component
  - Wraps everything in an ErrorBoundary
  - Renders: GlobalStatsBar, CoinTable (with pagination), optionally TrendingCoins
- Create `src/features/dashboard/components/TrendingCoins.tsx` (optional, simple horizontal scroll of trending coins from `useTrendingCoins`)

**Files created/modified**: `src/features/dashboard/index.tsx`, optionally `TrendingCoins.tsx`

**Acceptance criteria**: Dashboard loads with real data. Table is sortable, paginated. Search works from the header. All states handled (loading, error, empty). Responsive on mobile.

---

- [ ] **Phase 4: Coin Detail Page**

**Goal**: Detailed view of a single coin with interactive price chart, time range selection, key statistics, and "Add to Portfolio" action.

- [ ] **4.1 — Coin Hero Section**

**Actions**:

- Create `src/features/coin-detail/components/CoinHero.tsx`
  - Coin icon (large), name, symbol, rank badge
  - Current price (large), 24h change with badge
  - Back button to return to dashboard

**Files created**: `CoinHero.tsx`

**Acceptance criteria**: Renders with real data from `useCoinInfo(coinId)` and `useCoinQuotes`. Price formatted per selected currency.

- [ ] **4.2 — Time Range Selector**

**Actions**:

- Create `src/features/coin-detail/components/TimeRangeSelector.tsx`
  - Pill buttons: 24h, 7D, 30D, 90D, 1Y
  - Active pill highlighted
  - Clicking changes the selected time range (controlled component)

**Files created**: `TimeRangeSelector.tsx`

**Acceptance criteria**: Only one pill active at a time. Visually clear which is selected. Fires `onChange` callback.

- [ ] **4.3 — Price Line Chart**

**Actions**:

- Create `src/features/coin-detail/components/PriceChart.tsx`
  - Uses `usePriceHistory(coinCapAssetId, interval)` — `interval` driven by TimeRangeSelector (mapped from TimeRange enum to CoinCapInterval)
  - Renders a Recharts `AreaChart` or `LineChart`
  - Tooltip shows date + price on hover
  - Chart area fill with gradient (green or red based on price direction)
  - Responsive container
  - Skeleton placeholder while loading

**Files created**: `PriceChart.tsx`

**Acceptance criteria**: Chart renders with real CoinCap history data. Changing time range updates the chart. Tooltip shows formatted date and price. Skeleton during load.

- [ ] **4.4 — Coin Stats Grid**

**Actions**:

- Create `src/features/coin-detail/components/CoinStats.tsx`
  - Grid of stat cards: Market Cap, Volume, Circulating Supply, Total Supply, ATH (with date and % from ATH), ATL (with date and % from ATL), Price Change 7d, Price Change 30d
  - Uses Card UI component
  - Responsive grid: 2 columns on mobile, 3-4 on desktop

**Files created**: `CoinStats.tsx`

**Acceptance criteria**: All stats render with formatted numbers. Responsive grid layout. ATH/ATL dates formatted.

- [ ] **4.5 — Coin Detail Page Assembly**

**Actions**:

- Create `src/features/coin-detail/index.tsx`
  - Reads `coinId` from URL params via `useParams()`
  - Renders: CoinHero, TimeRangeSelector + PriceChart, CoinStats
  - "Add to Portfolio" button (wired in Phase 5)
  - ErrorBoundary wrapping
  - Loading state: skeleton for hero, chart, stats

**Files created**: `src/features/coin-detail/index.tsx`

**Acceptance criteria**: Navigating to `/coin/bitcoin` shows full detail page with real data. Time range switching works. All loading/error states handled. Responsive.

---

- [ ] **Phase 5: Portfolio Feature**

**Goal**: Users can add/edit/remove coin holdings, see total value and P&L, and the portfolio persists across sessions via LocalStorage.

- [ ] **5.1 — Portfolio LocalStorage Hook**

**Actions**:

- Create `src/features/portfolio/hooks/usePortfolio.ts`
  - Stores `PortfolioHolding[]` in LocalStorage via `useLocalStorage`
  - Provides: `holdings`, `addHolding`, `updateHolding`, `removeHolding`, `clearPortfolio`
  - `addHolding` generates a UUID for `id`, sets `addedAt` to current ISO timestamp
  - All mutations trigger re-render

**Files created**: `usePortfolio.ts`

**Acceptance criteria**: Holdings persist across page reloads. CRUD operations work correctly. Adding a duplicate coin creates a separate holding entry (users may have bought at different prices).

- [ ] **5.2 — Portfolio Metrics Hook**

**Actions**:

- Create `src/features/portfolio/hooks/usePortfolioMetrics.ts`
  - Takes `holdings` from `usePortfolio` and current prices from `useCoinQuotes`
  - Computes `PortfolioHoldingWithMetrics[]` — current value, P&L, allocation % for each holding
  - Computes `PortfolioSummary` — total value, total P&L, best/worst performers
  - Memoized computations with `useMemo`
  - Handles edge case: empty portfolio, missing price data

**Files created**: `usePortfolioMetrics.ts`

**Acceptance criteria**: Metrics update when prices refresh (polling). P&L calculations correct. Allocation percentages sum to 100%. Best/worst performer identified correctly.

- [ ] **5.3 — Add Holding Modal**

**Actions**:

- Create `src/components/ui/Modal/Modal.tsx` — reusable modal with backdrop, close on Escape, focus trap
- Create `src/features/portfolio/components/AddHoldingModal.tsx`
  - Form built with React Hook Form + Zod validation
  - Fields: Coin (search input with dropdown — reuse search logic), Quantity (number), Buy Price Per Unit (number)
  - Zod schema validates: coin selected, quantity > 0, buy price > 0
  - On submit: calls `addHolding()` from usePortfolio, shows success toast, closes modal

**Files created**: `Modal.tsx`, `AddHoldingModal.tsx`

**Acceptance criteria**: Modal opens/closes cleanly. Form validates all fields. Successful submission adds holding to LocalStorage, shows toast. Invalid form shows field-level errors.

- [ ] **5.4 — Portfolio Summary Cards**

**Actions**:

- Create `src/features/portfolio/components/PortfolioSummaryCards.tsx`
  - Row of cards: Total Value, Total P&L (amount + %), Best Performer, Worst Performer
  - P&L colored green/red
  - Skeleton loaders while prices load

**Files created**: `PortfolioSummaryCards.tsx`

**Acceptance criteria**: Cards show correct computed values. Colors reflect profit/loss.

- [ ] **5.5 — Holdings Table**

**Actions**:

- Create `src/features/portfolio/components/HoldingsTable.tsx` — table of all holdings with metrics
  - Columns: Coin, Quantity, Avg Buy Price, Current Price, P&L, Allocation %, 7d Sparkline, Actions (edit, remove)
  - Sortable by any column
  - Remove action: confirmation prompt, then remove + success toast
- Create `src/features/portfolio/components/HoldingRow.tsx` — single holding row

**Files created**: `HoldingsTable.tsx`, `HoldingRow.tsx`

**Acceptance criteria**: Table shows all holdings with correct metrics. Sorting works. Remove with confirmation works.

- [ ] **5.6 — Edit Holding Modal**

**Actions**:

- Create `src/features/portfolio/components/EditHoldingModal.tsx`
  - Pre-filled form with existing holding data
  - Same validation as AddHoldingModal
  - On submit: calls `updateHolding()`, shows toast

**Files created**: `EditHoldingModal.tsx`

**Acceptance criteria**: Opens with existing data pre-filled. Updates persist to LocalStorage.

- [ ] **5.7 — Portfolio Page Assembly**

**Actions**:

- Create `src/features/portfolio/index.tsx`
  - Renders: PortfolioSummaryCards, HoldingsTable, "Add Holding" button → opens modal
  - Empty state when no holdings: icon, message, CTA to browse coins
  - ErrorBoundary wrapping

**Files created**: `src/features/portfolio/index.tsx`

**Acceptance criteria**: Full portfolio page works end-to-end. Add → see in table with live P&L → edit → remove. Empty state shows when no holdings. All responsive.

- [ ] **5.8 — Wire "Add to Portfolio" from Coin Detail**

**Actions**:

- Add an "Add to Portfolio" button on the Coin Detail page
- Clicking opens the AddHoldingModal with the coin pre-selected

**Files modified**: `src/features/coin-detail/index.tsx`

**Acceptance criteria**: Button on coin detail page opens modal with coin already selected. Smooth UX flow from browsing → adding to portfolio.

---

- [ ] **Phase 6: Alerts System (Nice-to-Have)**

**Goal**: Users can set price alerts per coin and receive visual notifications when thresholds are crossed.

- [ ] **6.1 — Alerts LocalStorage Hook**

**Actions**:

- Create `src/features/alerts/hooks/useAlerts.ts`
  - Stores `PriceAlert[]` in LocalStorage
  - Provides: `alerts`, `createAlert`, `dismissAlert`, `removeAlert`, `clearAlerts`
  - `createAlert` generates UUID, sets status to `'active'`

**Files created**: `useAlerts.ts`

**Acceptance criteria**: Alerts CRUD works and persists.

- [ ] **6.2 — Alert Checker Hook**

**Actions**:

- Create `src/features/alerts/hooks/useAlertChecker.ts`
  - Runs on every price polling cycle
  - Compares active alert thresholds against current prices (from `useCoinQuotes`)
  - When threshold crossed: updates alert status to `'triggered'`, sets `triggeredAt`, fires a toast notification

**Files created**: `useAlertChecker.ts`

**Acceptance criteria**: Active alerts trigger when price crosses threshold. Toast notification appears. Alert status updates in LocalStorage.

- [ ] **6.3 — Create Alert Modal**

**Actions**:

- Create `src/features/alerts/components/CreateAlertModal.tsx`
  - Form: Coin search, Target Price, Direction (above/below) toggle
  - Zod validation
  - On submit: creates alert, toast confirmation

**Files created**: `CreateAlertModal.tsx`

**Acceptance criteria**: Form validates and creates alerts.

- [ ] **6.4 — Alerts List Page**

**Actions**:

- Create `src/features/alerts/components/AlertsList.tsx` — table/list of all alerts
  - Columns: Coin, Target Price, Direction, Status, Created, Triggered At, Actions
  - Status badge: active (blue), triggered (green), dismissed (gray)
  - Actions: dismiss, delete
- Create `src/features/alerts/components/AlertRow.tsx`
- Create `src/features/alerts/index.tsx` — page assembly

**Files created**: All alert component files.

**Acceptance criteria**: Alerts page shows all alerts. Status badges correct. Dismiss and delete work. Empty state when no alerts.

- [ ] **6.5 — Alert Notification Badge**

**Actions**:

- Add a notification badge to the Alerts nav item showing count of triggered (un-dismissed) alerts
- Badge disappears when all are dismissed

**Files modified**: `Sidebar.tsx`, `MobileNav.tsx`

**Acceptance criteria**: Badge shows correct count. Updates in real-time when alerts trigger.

---

- [ ] **Phase 7: Polish**

**Goal**: Every edge case handled. Loading, error, and empty states everywhere. Animations. Accessibility pass. The app feels finished.

- [ ] **7.1 — Loading States Audit**

**Actions**:

- Audit every page and component that uses async data
- Ensure skeleton loaders match content shape exactly
- Add skeleton to: GlobalStatsBar, CoinTable, CoinHero, PriceChart, CoinStats, PortfolioSummaryCards, HoldingsTable

**Acceptance criteria**: No page shows a blank white area during loading. Every async component has a matching skeleton.

- [ ] **7.2 — Error Boundaries**

**Actions**:

- Wrap every feature page in an `<ErrorBoundary>` with `ErrorFallback`
- Add retry button to ErrorFallback that resets the boundary
- Test by simulating API failures

**Files modified**: All feature `index.tsx` files.

**Acceptance criteria**: API errors show the fallback UI, not a white screen. Retry button re-fetches data.

- [ ] **7.3 — Empty States**

**Actions**:

- Audit every list/table: what shows when there's no data?
  - Dashboard coin table: shouldn't happen (API always returns data), but handle gracefully
  - Portfolio: "No holdings yet" with CTA
  - Alerts: "No alerts set" with CTA
  - Search: "No results found" with suggestion text

**Acceptance criteria**: Every empty state has an icon, message, and CTA where appropriate.

- [ ] **7.4 — Toast Notifications**

**Actions**:

- Ensure all user actions have toast feedback:
  - Holding added/edited/removed
  - Alert created/dismissed/deleted
  - Portfolio cleared
  - Error toasts on failed actions
- Configure toast position (top-right), auto-dismiss (4s), dark mode compatible

**Acceptance criteria**: Every mutation action gives toast feedback.

- [ ] **7.5 — Animations & Micro-Interactions**

**Actions**:

- Price change flash effect on table cells when prices update
- Theme transition: `transition-colors duration-200` on body/surfaces
- Table row hover effect
- Button active state (scale-down)
- Chart tooltip smooth follow
- Modal enter/exit animation (fade + scale)
- Page route transition (subtle fade)

**Acceptance criteria**: Interactions feel smooth and responsive. No janky transitions.

- [ ] **7.6 — Responsive Audit**

**Actions**:

- Test every page at: 375px (mobile), 768px (tablet), 1024px (small desktop), 1440px (large desktop)
- Verify: tables → cards on mobile, sidebar → bottom nav, charts resize properly, modals are full-screen on mobile, text doesn't overflow
- Fix any breakpoint issues

**Acceptance criteria**: App looks good and functions correctly at all breakpoints. Tested on a real phone if possible.

- [ ] **7.7 — Accessibility Pass**

**Actions**:

- All interactive elements focusable via Tab
- All buttons and inputs have `aria-label` where visual label is absent
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<header>`
- Color contrast: at least 4.5:1 for text (verify with browser DevTools)
- Search dropdown keyboard navigable (already done in Phase 3.7, verify)
- Modal focus trap (already done in Phase 5.3, verify)
- Skip to main content link (optional but good practice)
- Price change indicators: not relying on color alone (use +/- prefix and arrow icons)

**Acceptance criteria**: Tab through the entire app without getting stuck. Screen reader can identify all navigation and interactive elements. Color is never the only indicator of meaning.

---

- [ ] **Phase 8: Testing**

**Goal**: Key integration tests and hook tests that prove the critical paths work. Not 100% coverage — focus on what matters for interviews.

- [ ] **8.1 — Test Setup**

**Actions**:

- Install Vitest, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `msw` (Mock Service Worker)
- Configure `vitest.config.ts` (or add to `vite.config.ts`)
- Create test utilities: custom render function with QueryClientProvider + Router wrapper
- Set up MSW handlers for CMC and CoinCap endpoints with mock data

**Files created**: Test config, test utilities, MSW handlers.

**Acceptance criteria**: A basic test runs and passes with `pnpm test`.

- [ ] **8.2 — Utility Function Tests**

**Actions**:

- Test `formatCurrency`, `formatNumber`, `formatPercentage`, `formatDate`
- Test edge cases: 0, negative, null/undefined, very large numbers, very small numbers

**Files created**: Test files in `helpers/utils/`

**Acceptance criteria**: All formatters handle edge cases correctly.

- [ ] **8.3 — Hook Tests**

**Actions**:

- Test `useLocalStorage` — read, write, default value, JSON parsing
- Test `useDebounce` — value updates after delay
- Test `usePortfolio` — add, update, remove holdings

**Files created**: Test files in `hooks/` and `features/portfolio/hooks/`

**Acceptance criteria**: Hooks behave correctly in isolation.

- [ ] **8.4 — Integration Tests**

**Actions**:

- Test `CoinTable` — renders rows from mocked API data, sorting changes order, clicking row navigates
- Test `AddHoldingModal` — form validation, successful submission
- Test `SearchDropdown` — debounced search, keyboard navigation, selecting a result

**Files created**: Test files colocated with components.

**Acceptance criteria**: Critical user flows verified with Testing Library. Tests use MSW for API mocking.

- [ ] **8.5 — Test Verification**

**Actions**:

- Run `pnpm test` — all tests pass
- Run `pnpm test --coverage` — review coverage report
- Ensure zero test warnings/errors

**Acceptance criteria**: All tests green. No flaky tests.

---

- [ ] **Phase 9: Deployment & Final QA**

**Goal**: App is live on Vercel with a professional README. Final QA checklist complete.

- [ ] **9.1 — Build Verification**

**Actions**:

- Run `pnpm build` — zero errors, zero warnings
- Run `pnpm preview` — test the production build locally
- Check bundle size with `npx vite-bundle-visualizer` — no unexpectedly large chunks
- Verify lazy-loaded routes split correctly

**Acceptance criteria**: Production build works identically to dev. Bundle size reasonable.

- [ ] **9.2 — Vercel Deployment**

**Actions**:

- Connect GitHub repo to Vercel
- Configure environment variables in Vercel dashboard
- Deploy
- Configure custom domain (optional)
- Verify all routes work with Vercel's SPA rewrites

**Acceptance criteria**: App loads on the Vercel URL. All routes work (including direct navigation to `/coin/bitcoin`). API calls succeed.

- [ ] **9.3 — SEO & Metadata**

**Actions**:

- Set `<title>` and `<meta name="description">` in `index.html`
- Add Open Graph meta tags (`og:title`, `og:description`, `og:image`)
- Create a favicon and app icon
- Add 404 page handling

**Files modified**: `index.html`, potentially a `public/` folder for favicon

**Acceptance criteria**: Sharing the URL on LinkedIn/Twitter shows a nice preview card.

- [ ] **9.4 — README**

**Actions**:

- Write `README.md` with:
  - Project title and one-line description
  - Screenshot or GIF of the app
  - Live demo link
  - Tech stack list
  - Features list
  - Getting started instructions (clone, install, env vars, dev server)
  - Architecture overview (brief)
  - What I learned section

**Files created**: `README.md`

**Acceptance criteria**: Someone can clone the repo, follow the README, and run the app locally.

- [ ] **9.5 — Final QA Checklist**

- [ ] All MVP features working end-to-end
- [ ] No console errors or warnings in production build
- [ ] No `any` types (`pnpm lint` passes)
- [ ] No hardcoded strings (all in `textContent.ts`)
- [ ] Types in dedicated files
- [ ] Import order per coding standards
- [ ] Empty line at end of every file
- [ ] Responsive: tested at 375px, 768px, 1024px, 1440px
- [ ] Dark mode and light mode both look correct
- [ ] All loading states have skeletons
- [ ] All error states have retry actions
- [ ] All empty states have CTA
- [ ] Keyboard navigation works for all interactive elements
- [ ] Search dropdown keyboard navigable
- [ ] Price changes flash green/red
- [ ] Portfolio P&L calculations correct
- [ ] Currency switching updates all prices
- [ ] Data auto-refreshes (visible in TanStack Query DevTools)
- [ ] Lighthouse: Performance > 90, Accessibility > 90
- [ ] Tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] Deployed and accessible

- [ ] **9.6 — Portfolio & LinkedIn**

**Actions**:

- Add project to portfolio site with screenshot, tech stack, live link, and GitHub link
- Write LinkedIn post: what you built, key technical challenges, what you learned

**Acceptance criteria**: Project is visible on your portfolio. LinkedIn post published.

---

## Quick Reference: Phase Durations

| Phase                | Estimated Effort | Cumulative |
| -------------------- | ---------------- | ---------- |
| Phase 0: Setup       | 2-3 hours        | Day 1      |
| Phase 1: API Layer   | 4-5 hours        | Day 1-2    |
| Phase 2: UI Shell    | 4-5 hours        | Day 2-3    |
| Phase 3: Dashboard   | 6-8 hours        | Day 3-5    |
| Phase 4: Coin Detail | 4-5 hours        | Day 5-6    |
| Phase 5: Portfolio   | 6-8 hours        | Day 6-8    |
| Phase 6: Alerts      | 4-5 hours        | Day 8-9    |
| Phase 7: Polish      | 4-6 hours        | Day 9-10   |
| Phase 8: Testing     | 3-4 hours        | Day 10-11  |
| Phase 9: Deploy & QA | 2-3 hours        | Day 11-12  |

**Total**: ~40-50 hours across ~12 working days. Fits within the 2-week cadence with buffer days.
