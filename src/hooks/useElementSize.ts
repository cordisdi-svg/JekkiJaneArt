"use client";

import { useEffect, useRef, useState } from "react";

type ElementSize = {
  ref: import("react").RefObject<HTMLDivElement>;
  width: number;
  height: number;
};

export function useElementSize(): ElementSize {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = Math.max(0, Math.round(entry.contentRect.width));
      const height = Math.max(0, Math.round(entry.contentRect.height));
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return { ref, width: size.width, height: size.height };
}
