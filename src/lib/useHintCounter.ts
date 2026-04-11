"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const THRESHOLD = 3;
const PREFIX = "__hint_";
const START_KEY = "__hint_session_start";
const DURATION = 5 * 60 * 1000; // 5 minutes in ms

// Module-level flag — reset check runs once per page load
let sessionInitialized = false;

function ensureSession(): void {
    if (sessionInitialized) return;
    sessionInitialized = true;
    try {
        const s = window.sessionStorage;
        const now = Date.now();
        const raw = s.getItem(START_KEY);
        const start = raw ? parseInt(raw, 10) : 0;
        if (!start || now - start > DURATION) {
            // Remove all previous hint counters
            const toRemove: string[] = [];
            for (let i = 0; i < s.length; i++) {
                const k = s.key(i);
                if (k?.startsWith(PREFIX)) toRemove.push(k);
            }
            toRemove.forEach((k) => s.removeItem(k));
            s.setItem(START_KEY, String(now));
        }
    } catch {
        // sessionStorage unavailable — hints stay always visible
    }
}

function readCount(key: string): number {
    try {
        const raw = window.sessionStorage.getItem(PREFIX + key);
        return raw ? parseInt(raw, 10) : 0;
    } catch {
        return 0;
    }
}

function writeCount(key: string, n: number): void {
    try {
        window.sessionStorage.setItem(PREFIX + key, String(n));
    } catch {
        // ignore write failures
    }
}

/**
 * Per-session hint counter.
 *
 * - Counters survive SPA (Next.js client-side) navigation within the same tab.
 * - Counters reset on: new tab/window, hard reload, or after 5 minutes in the same session.
 * - Once the action is performed `threshold` times, `visible` becomes false.
 * - The DOM hint element should remain in the tree (just hidden via visibility style)
 *   so that no layout interdependencies are broken.
 *
 * @param key       Unique string key for this hint (must be a stable literal)
 * @param threshold Number of actions before the hint hides (default: 3)
 */
export function useHintCounter(key: string, threshold: number = THRESHOLD) {
    const countRef = useRef(0);
    const [visible, setVisible] = useState(true);

    // Keep setVisible accessible from the stable increment callback
    const setVisibleRef = useRef<(v: boolean) => void>(setVisible);
    setVisibleRef.current = setVisible;

    useEffect(() => {
        ensureSession();
        const stored = readCount(key);
        countRef.current = stored;
        if (stored >= threshold) {
            setVisibleRef.current(false);
        }
        // key and threshold are stable string literals passed from each call-site —
        // no need to re-run this effect when they "change" (they never do).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Call once per qualifying user action.
     * Intentionally stable across renders (all mutable state accessed via refs).
     */
    const increment = useCallback(() => {
        if (countRef.current >= threshold) return;
        countRef.current += 1;
        writeCount(key, countRef.current);
        if (countRef.current >= threshold) {
            setVisibleRef.current(false);
        }
        // key and threshold are captured from outer scope once (stable literals).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally stable

    return { visible, increment } as const;
}
