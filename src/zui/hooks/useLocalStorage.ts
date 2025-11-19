import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage only on client after mount
  useEffect(() => {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) {
      return;
    }

    const stringValue = localStorage.getItem(key);

    if (stringValue === null || stringValue.length === 0) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      setValue(defaultValue);
    } else {
      try {
        setValue(JSON.parse(stringValue));
      } catch (err) {
        setValue(defaultValue);
      }
    }

    setIsInitialized(true);
  }, [key, defaultValue]);

  const setValueAndStore = (newValue: T) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(newValue));
    }
    setValue(newValue);
  };

  return [value, setValueAndStore];
}
