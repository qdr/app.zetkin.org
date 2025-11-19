import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  // Always start with defaultValue on both server and first client render
  const [value, setValue] = useState<T>(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Only access localStorage on the client after hydration
  useEffect(() => {
    const storedValue = getLocalStorageValue(key, defaultValue);
    setValue(storedValue);
    setIsInitialized(true);
  }, [key, defaultValue]);

  const setStoredValue = (newValue: T) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
    setValue(newValue);
  };

  return [value, setStoredValue];
}

function getLocalStorageValue<T>(key: string, defaultValue: T): T {
  const isBrowser = typeof window !== 'undefined';
  const stringValue = isBrowser ? localStorage.getItem(key) : null;

  if (stringValue === null || stringValue.length == 0) {
    if (isBrowser) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
    return defaultValue;
  }

  try {
    return JSON.parse(stringValue);
  } catch (err) {
    return defaultValue;
  }
}
