"use client";

/**
 * Custom hook for secure clipboard operations.
 * Implements copy-to-clipboard with temporary toast notifications and auto-clear for sensitive data.
 */

import { useState, useCallback } from "react";
import { sanitizeForClipboard } from "@/lib/security";

interface UseClipboardReturn {
  copied: boolean;
  copyToClipboard: (text: string, sensitive?: boolean) => Promise<void>;
  error: string | null;
}

export function useClipboard(): UseClipboardReturn {
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, sensitive: boolean = false): Promise<void> => {
    try {
      const sanitizedText = sanitizeForClipboard(text);
      
      if (!navigator.clipboard) {
        throw new Error("Clipboard API not available");
      }

      await navigator.clipboard.writeText(sanitizedText);
      setCopied(true);
      setError(null);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

      if (sensitive) {
        setTimeout(async () => {
          try {
            const currentClipboard = await navigator.clipboard.readText();
            if (currentClipboard === sanitizedText) {
              await navigator.clipboard.writeText("");
            }
          } catch (err) {
            console.warn("Could not clear clipboard:", err);
          }
        }, 60000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to copy");
      setCopied(false);
    }
  }, []);

  return { copied, copyToClipboard, error };
}
