"use client";

import React from "react";

type LooseProps = Record<string, unknown> & { children?: React.ReactNode };

const factory = (tag: keyof JSX.IntrinsicElements) => {
  return React.forwardRef<HTMLElement, LooseProps>(function MotionTag({ children, ...props }, ref) {
    return React.createElement(tag, { ...props, ref }, children as React.ReactNode);
  });
};

export const motion = {
  div: factory("div"),
  button: factory("button")
};

export function AnimatePresence({ children }: { children: React.ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}
