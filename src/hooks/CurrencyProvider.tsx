import { CurrencyContext, useCurrencyProvider } from './useCurrency';

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export const CurrencyProvider = ({
  children,
}: CurrencyProviderProps): React.JSX.Element => {
  const value = useCurrencyProvider();

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
