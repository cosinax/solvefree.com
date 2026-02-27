"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Syncs state to the URL hash for sharing/bookmarking.
 * Usage: const [values, setValues] = useHashState({ key1: "default1", key2: "default2" });
 * URL becomes: #key1=value1&key2=value2
 */
export function useHashState<T extends Record<string, string>>(
  defaults: T
): [T, (updates: Partial<T>) => void] {
  const [values, setValuesInternal] = useState<T>(defaults);
  const [initialized, setInitialized] = useState(false);

  // Read from hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setInitialized(true);
      return;
    }
    const params = new URLSearchParams(hash);
    const parsed = { ...defaults } as T;
    for (const key of Object.keys(defaults)) {
      const val = params.get(key);
      if (val !== null) {
        (parsed as Record<string, string>)[key] = val;
      }
    }
    setValuesInternal(parsed);
    setInitialized(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Write to hash when values change (after initialization)
  useEffect(() => {
    if (!initialized || typeof window === "undefined") return;
    const params = new URLSearchParams();
    let hasNonDefault = false;
    for (const [key, val] of Object.entries(values)) {
      if (val !== "" && val !== defaults[key]) {
        params.set(key, val);
        hasNonDefault = true;
      }
    }
    const newHash = hasNonDefault ? `#${params.toString()}` : "";
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash || window.location.pathname);
    }
  }, [values, initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValues = useCallback((updates: Partial<T>) => {
    setValuesInternal((prev) => ({ ...prev, ...updates }));
  }, []);

  return [values, setValues];
}
