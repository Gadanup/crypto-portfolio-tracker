export const TEXT_CONTENT = {
  APP: {
    NAME: 'Crypto Portfolio Tracker',
    DESCRIPTION: 'Track your cryptocurrency portfolio in real time',
  },
  NAV: {
    DASHBOARD: 'Dashboard',
    PORTFOLIO: 'Portfolio',
    ALERTS: 'Alerts',
  },
  DASHBOARD: {
    TITLE: 'Market Overview',
    GLOBAL_STATS: {
      MARKET_CAP: 'Total Market Cap',
      VOLUME_24H: '24h Volume',
      BTC_DOMINANCE: 'BTC Dominance',
      ACTIVE_COINS: 'Active Cryptocurrencies',
    },
    TRENDING_TITLE: 'Trending',
  },
  COIN_DETAIL: {
    BACK: 'Back to Dashboard',
    ADD_TO_PORTFOLIO: 'Add to Portfolio',
    STATS: {
      MARKET_CAP: 'Market Cap',
      VOLUME_24H: '24h Volume',
      CIRCULATING_SUPPLY: 'Circulating Supply',
      TOTAL_SUPPLY: 'Total Supply',
      MAX_SUPPLY: 'Max Supply',
      RANK: 'Rank',
    },
    TIME_RANGES: {
      DAY: '24H',
      WEEK: '7D',
      MONTH: '30D',
      THREE_MONTHS: '90D',
      YEAR: '1Y',
    },
  },
  PORTFOLIO: {
    TITLE: 'My Portfolio',
    SUMMARY: {
      TOTAL_VALUE: 'Total Value',
      TOTAL_PL: 'Total P&L',
      BEST_PERFORMER: 'Best Performer',
      WORST_PERFORMER: 'Worst Performer',
      HOLDINGS_COUNT: 'Holdings',
    },
    TABLE: {
      COIN: 'Coin',
      QUANTITY: 'Quantity',
      BUY_PRICE: 'Avg Buy Price',
      CURRENT_PRICE: 'Current Price',
      CURRENT_VALUE: 'Value',
      PROFIT_LOSS: 'P&L',
      ALLOCATION: 'Allocation',
      ACTIONS: 'Actions',
    },
    ADD_HOLDING: 'Add Holding',
    EDIT_HOLDING: 'Edit Holding',
    REMOVE_HOLDING: 'Remove',
    EMPTY_STATE: {
      TITLE: 'No holdings yet',
      DESCRIPTION:
        'Browse coins on the dashboard and add them to your portfolio.',
      CTA: 'Browse Coins',
    },
  },
  ALERTS: {
    TITLE: 'Price Alerts',
    CREATE: 'Create Alert',
    TABLE: {
      COIN: 'Coin',
      TARGET_PRICE: 'Target Price',
      DIRECTION: 'Direction',
      STATUS: 'Status',
      CREATED: 'Created',
      ACTIONS: 'Actions',
    },
    DIRECTION: {
      ABOVE: 'Above',
      BELOW: 'Below',
    },
    STATUS: {
      ACTIVE: 'Active',
      TRIGGERED: 'Triggered',
      DISMISSED: 'Dismissed',
    },
    EMPTY_STATE: {
      TITLE: 'No alerts set',
      DESCRIPTION:
        'Create price alerts to get notified when a coin hits your target.',
      CTA: 'Create Alert',
    },
  },
  TABLE: {
    RANK: '#',
    NAME: 'Name',
    PRICE: 'Price',
    CHANGE_1H: '1h %',
    CHANGE_24H: '24h %',
    CHANGE_7D: '7d %',
    MARKET_CAP: 'Market Cap',
    VOLUME_24H: 'Volume (24h)',
    SHOWING: 'Showing',
    OF: 'of',
    PER_PAGE: 'per page',
  },
  SEARCH: {
    PLACEHOLDER: 'Search coins...',
    NO_RESULTS: 'No coins found',
  },
  CURRENCY: {
    LABEL: 'Currency',
  },
  THEME: {
    TOGGLE: 'Toggle theme',
  },
  BUTTONS: {
    SUBMIT: 'Submit',
    CANCEL: 'Cancel',
    SAVE: 'Save Changes',
    DELETE: 'Delete',
    RETRY: 'Try Again',
    CLOSE: 'Close',
  },
  MESSAGES: {
    LOADING: 'Loading...',
    ERROR: {
      GENERIC: 'Something went wrong. Please try again.',
      NETWORK: 'Network error. Check your connection.',
      API_LIMIT: 'API rate limit reached. Please wait a moment.',
    },
    SUCCESS: {
      HOLDING_ADDED: 'Holding added to portfolio',
      HOLDING_UPDATED: 'Holding updated',
      HOLDING_REMOVED: 'Holding removed from portfolio',
      ALERT_CREATED: 'Price alert created',
      ALERT_DISMISSED: 'Alert dismissed',
    },
  },
  FORM: {
    COIN: 'Select Coin',
    QUANTITY: 'Quantity',
    BUY_PRICE: 'Buy Price per Unit',
    TARGET_PRICE: 'Target Price',
    DIRECTION: 'Alert Direction',
    VALIDATION: {
      REQUIRED: 'This field is required',
      POSITIVE_NUMBER: 'Must be a positive number',
      SELECT_COIN: 'Please select a coin',
    },
  },
} as const;
