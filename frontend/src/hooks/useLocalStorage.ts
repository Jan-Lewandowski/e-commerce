'use client'

import { useCallback, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  })
  const setItem = useCallback((value: T) => {
    setStoredValue(value);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error: key "${key}":`, error);
    }
  }, [key]);


  const getItem = useCallback((): T => {
    if (typeof window === "undefined") return storedValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : storedValue;
    } catch (error) {
      console.error(`Error: key "${key}":`, error);
      return storedValue;
    }
  }, [key, storedValue]);

  const clearItem = useCallback(() => {
    setStoredValue(initialValue);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error: key "${key}":`, error);
    }
  }, [initialValue, key]);

  return { storedValue, setItem, clearItem, getItem, ready: true };
}
