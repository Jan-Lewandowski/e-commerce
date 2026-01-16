'use client'

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReady(true);
    }
  }, [key]);

  const setItem = (value: T) => {
    setStoredValue(value);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error: key "${key}":`, error);
    }
  };


  const getItem = (): T => {
    if (typeof window === "undefined") return storedValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : storedValue;
    } catch (error) {
      console.error(`Error: key "${key}":`, error);
      return storedValue;
    }
  };

  const clearItem = () => {
    setStoredValue(initialValue);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error: key "${key}":`, error);
    }
  };

  return { storedValue, setItem, clearItem, getItem, ready };
}
