"use client";

/**
 * Custom hook for toggling visibility of masked financial data.
 * Allows users to temporarily reveal sensitive information.
 */

import { useState, useCallback } from "react";

interface UseMaskReturn {
  isMasked: boolean;
  toggleMask: () => void;
  setMasked: (masked: boolean) => void;
}

export function useMask(initialMasked: boolean = true): UseMaskReturn {
  const [isMasked, setIsMasked] = useState<boolean>(initialMasked);

  const toggleMask = useCallback((): void => {
    setIsMasked((prev) => !prev);
  }, []);

  const setMasked = useCallback((masked: boolean): void => {
    setIsMasked(masked);
  }, []);

  return { isMasked, toggleMask, setMasked };
}
