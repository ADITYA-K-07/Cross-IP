"use client";

import { useCallback, useEffect, useState } from "react";
import { getUsage, UsageResult } from "./api";

export const MAX_FREE_CHECKS = 5;
const CHANGE_EVENT = "CrossIP-usage-change";

function broadcastUsage(usage: UsageResult) {
  window.dispatchEvent(new CustomEvent<UsageResult>(CHANGE_EVENT, { detail: usage }));
}

export function useFreeChecks() {
  const [usage, setUsage] = useState<UsageResult>({ limit: MAX_FREE_CHECKS, remaining: MAX_FREE_CHECKS });
  const [usageError, setUsageError] = useState("");
  const [isUsageLoading, setIsUsageLoading] = useState(true);

  const refreshChecks = useCallback(async () => {
    try {
      const nextUsage = await getUsage();
      setUsage(nextUsage);
      setUsageError("");
      broadcastUsage(nextUsage);
      return nextUsage;
    } catch (error) {
      setUsageError(error instanceof Error ? error.message : "Could not load free-check usage.");
      throw error;
    } finally {
      setIsUsageLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => {
      void refreshChecks().catch(() => undefined);
    }, 0);
    const handleChange = (event: Event) => {
      const nextUsage = (event as CustomEvent<UsageResult>).detail;
      if (nextUsage) setUsage(nextUsage);
    };
    window.addEventListener(CHANGE_EVENT, handleChange);
    return () => {
      window.clearTimeout(initialRefresh);
      window.removeEventListener(CHANGE_EVENT, handleChange);
    };
  }, [refreshChecks]);

  return {
    maxChecks: usage.limit,
    remainingChecks: usage.remaining,
    usageError,
    isUsageLoading,
    refreshChecks,
    consumeCheck: refreshChecks,
  };
}
