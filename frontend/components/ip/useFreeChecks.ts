"use client";

import { useCallback, useEffect, useState } from "react";

export const MAX_FREE_CHECKS = 5;

const STORAGE_KEY = "ipsentinel-free-checks";
const CHANGE_EVENT = "ipsentinel-free-checks-change";

function readStoredChecks() {
  if (typeof window === "undefined") return MAX_FREE_CHECKS;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? Number(raw) : MAX_FREE_CHECKS;

  if (!Number.isFinite(parsed)) return MAX_FREE_CHECKS;
  return Math.max(0, Math.min(MAX_FREE_CHECKS, parsed));
}

function writeStoredChecks(value: number) {
  if (typeof window === "undefined") return;

  const nextValue = Math.max(0, Math.min(MAX_FREE_CHECKS, value));
  window.localStorage.setItem(STORAGE_KEY, String(nextValue));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: nextValue }));
}

export function useFreeChecks() {
  const [remainingChecks, setRemainingChecks] = useState(readStoredChecks);

  useEffect(() => {
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<number>).detail;
      setRemainingChecks(typeof detail === "number" ? detail : readStoredChecks());
    };

    const handleStorage = () => setRemainingChecks(readStoredChecks());

    window.addEventListener(CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const consumeCheck = useCallback(() => {
    const current = readStoredChecks();
    if (current <= 0) return false;

    writeStoredChecks(current - 1);
    return true;
  }, []);

  const resetChecks = useCallback(() => {
    writeStoredChecks(MAX_FREE_CHECKS);
  }, []);

  return {
    maxChecks: MAX_FREE_CHECKS,
    remainingChecks,
    consumeCheck,
    resetChecks,
  };
}
