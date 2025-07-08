import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setValue(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing localStorage value:', error);
      }
    }
  }, [key]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, mounted]);

  return [value, setValue] as const;
}