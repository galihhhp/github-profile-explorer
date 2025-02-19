import { useState, useEffect } from 'react';

export function useSearchParams<T extends string>(
  key: string,
  onParamChange?: (value: T | null) => void
) {
  const [paramValue, setParamValue] = useState<T | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get(key) as T;

    if (value) {
      setParamValue(value);
      onParamChange?.(value);
    }
  }, []);

  const updateSearchParams = (value: T | null) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }

    window.history.pushState(
      {},
      '',
      `?${searchParams.toString()}`
    );

    setParamValue(value);
    onParamChange?.(value);
  };

  return {
    paramValue,
    updateSearchParams
  };
}