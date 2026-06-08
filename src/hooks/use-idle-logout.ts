'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupabaseAuthBrowserClient } from '@/lib/supabase/auth-browser';

interface UseIdleLogoutOptions {
  enabled: boolean;
  idleMs?: number;
  warningMs?: number;
}

interface UseIdleLogoutReturn {
  showWarning: boolean;
  keepSession: () => void;
  signOutNow: () => Promise<void>;
  remainingSeconds: number;
}

const ACTIVITY_EVENTS = [
  'mousemove',
  'keydown',
  'click',
  'scroll',
  'touchstart',
] as const;

export function useIdleLogout({
  enabled,
  idleMs = 5 * 60 * 1000,
  warningMs = 4 * 60 * 1000,
}: UseIdleLogoutOptions): UseIdleLogoutReturn {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivity = useRef<number>(Date.now());

  const clearAllTimers = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    idleTimer.current = null;
    warningTimer.current = null;
    countdownTimer.current = null;
  }, []);

  const signOutNow = useCallback(async () => {
    clearAllTimers();
    try {
      const client = getSupabaseAuthBrowserClient();
      await client?.auth.signOut();
    } finally {
      window.location.href = '/auth/sign-in?reason=inactive';
    }
  }, [clearAllTimers]);

  const startCountdown = useCallback(() => {
    const warningDuration = idleMs - warningMs;
    setRemainingSeconds(Math.round(warningDuration / 1000));
    countdownTimer.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (countdownTimer.current) clearInterval(countdownTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [idleMs, warningMs]);

  const scheduleTimers = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, warningMs);
    idleTimer.current = setTimeout(() => {
      void signOutNow();
    }, idleMs);
  }, [clearAllTimers, idleMs, warningMs, signOutNow, startCountdown]);

  const keepSession = useCallback(() => {
    lastActivity.current = Date.now();
    setShowWarning(false);
    scheduleTimers();
  }, [scheduleTimers]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/auth')) return;
    scheduleTimers();
    const handleActivity = () => {
      if (showWarning) return;
      lastActivity.current = Date.now();
      scheduleTimers();
    };
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    return () => {
      clearAllTimers();
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled]);

  return { showWarning, keepSession, signOutNow, remainingSeconds };
}
