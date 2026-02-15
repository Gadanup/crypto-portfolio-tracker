import { useState, useCallback } from 'react';

export const useLocalStorage = <TValue>(
  key: string,
  initialValue: TValue,
): [TValue, (value: TValue | ((previous: TValue) => TValue)) => void] => {
  const [storedValue, setStoredValue] = useState<TValue>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as TValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: TValue | ((previous: TValue) => TValue)) => {
      setStoredValue((current) => {
        const nextValue = value instanceof Function ? value(current) : value;

        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // Storage full or unavailable — state still updates in memory
        }

        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
};
