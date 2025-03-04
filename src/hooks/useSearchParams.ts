import { useState, useEffect, useCallback } from "react";

export function useSearchParams<T>(
  paramName: string,
  callback?: (value: T | null) => void
) {
  const getInitialValue = (): T | null => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(paramName);
    return value as unknown as T;
  };

  const [paramValue, setParamValue] = useState<T | null>(getInitialValue());

  const updateSearchParams = useCallback(
    (newValue: T | null) => {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      if (newValue === null) {
        params.delete(paramName);
      } else {
        params.set(paramName, String(newValue));
      }

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", newUrl);

      setParamValue(newValue);
    },
    [paramName]
  );

  useEffect(() => {
    const handlePopState = () => {
      const newValue = getInitialValue();
      setParamValue(newValue);
      if (callback) callback(newValue);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [callback]);

  useEffect(() => {
    if (callback) callback(paramValue);
  }, []);

  return { paramValue, updateSearchParams };
}
