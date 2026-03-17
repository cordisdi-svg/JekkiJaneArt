"use client";

import React, { useState, useEffect, useMemo, useRef, ReactNode } from "react";

interface TypewriterTextProps {
    children: ReactNode;
    delay?: number; // base delay per character in ms
    cursorChar?: string;
    scrollRef?: React.RefObject<HTMLDivElement>;
}

export function TypewriterText({ children, delay = 35, cursorChar, scrollRef }: TypewriterTextProps) {
    const [charIndex, setCharIndex] = useState(0);
    const cursorRef = useRef<HTMLElement>(null);
    const isAutoScrollingRef = useRef(false);
    const freezeAutoScrollUntilRef = useRef(0);

    // Extract all text content to calculate delays per character
    const { totalChars, textContent } = useMemo(() => {
        let text = "";
        const traverse = (node: ReactNode) => {
            if (typeof node === "string" || typeof node === "number") {
                text += String(node);
            } else if (React.isValidElement(node)) {
                if (node.type === "br") {
                    text += "\n";
                } else if (node.props && node.props.children) {
                    React.Children.forEach(node.props.children, traverse);
                }
            } else if (Array.isArray(node)) {
                node.forEach(traverse);
            }
        };
        traverse(children);
        return { totalChars: text.length, textContent: text };
    }, [children]);

    // Typing logic with context-aware delays (messenger style)
    useEffect(() => {
        if (charIndex >= totalChars) return;

        const ch = textContent[charIndex];
        let currentDelay = delay;

        if (ch === "\n") currentDelay = 110;
        else if (".!?…".includes(ch)) currentDelay = 150;
        else if (",;:—-".includes(ch)) currentDelay = 65;
        else if (ch === " ") currentDelay = 20;
        else currentDelay = delay + (Math.random() * 10 - 5);

        const timer = setTimeout(() => {
            setCharIndex((prev) => prev + 1);
        }, currentDelay);

        return () => clearTimeout(timer);
    }, [charIndex, totalChars, delay, textContent]);

    // Container interaction listeners
    useEffect(() => {
        const container = scrollRef?.current;
        if (!container) return;

        const handleManualInteraction = () => {
            freezeAutoScrollUntilRef.current = Date.now() + 1000;
        };

        const handleScroll = () => {
            // If scroll event happens and we didn't trigger it, it's manual
            if (!isAutoScrollingRef.current) {
                handleManualInteraction();
            }
        };

        container.addEventListener("pointerdown", handleManualInteraction, { passive: true });
        container.addEventListener("wheel", handleManualInteraction, { passive: true });
        container.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            container.removeEventListener("pointerdown", handleManualInteraction);
            container.removeEventListener("wheel", handleManualInteraction);
            container.removeEventListener("scroll", handleScroll);
        };
    }, [scrollRef]);

    // Smart auto-scroll when typing
    useEffect(() => {
        // Bail out if we are in the freeze window
        if (Date.now() < freezeAutoScrollUntilRef.current) return;

        if (scrollRef?.current && cursorRef.current && charIndex > 0) {
            const container = scrollRef.current;
            const cursor = cursorRef.current;
            
            const containerRect = container.getBoundingClientRect();
            const cursorRect = cursor.getBoundingClientRect();
            
            // 150px margin to handle paragraph jumps/newlines
            const isVisible = (
                cursorRect.top >= containerRect.top &&
                cursorRect.bottom <= containerRect.bottom + 150
            );
            
            if (isVisible) {
                isAutoScrollingRef.current = true;
                cursor.scrollIntoView({ block: "nearest", behavior: "auto" });
                
                // Clear the flag after the scroll is processed
                // requestAnimationFrame ensures it's cleared after the browser has a chance to handle the scroll
                requestAnimationFrame(() => {
                    isAutoScrollingRef.current = false;
                });
            }
        }
    }, [charIndex, scrollRef]);

    // Render tree with clipped text
    const renderTree = () => {
        let currentGlobalIndex = 0;

        const cloneAndClip = (node: ReactNode): ReactNode => {
            if (typeof node === "string" || typeof node === "number") {
                const text = String(node);
                const nodeStart = currentGlobalIndex;
                const nodeEnd = currentGlobalIndex + text.length;

                currentGlobalIndex = nodeEnd;

                if (charIndex <= nodeStart) return null;

                if (charIndex >= nodeEnd) {
                    if (charIndex >= totalChars && nodeEnd === totalChars) {
                        return (
                            <React.Fragment key="done">
                                {text}
                                <Cursor ref={cursorRef} char={cursorChar} />
                            </React.Fragment>
                        );
                    }
                    return text;
                }

                return (
                    <React.Fragment key="typing">
                        {text.slice(0, charIndex - nodeStart)}
                        <Cursor ref={cursorRef} char={cursorChar} />
                    </React.Fragment>
                );
            }

            if (React.isValidElement(node)) {
                if (node.type === "br") {
                    const nodeIndex = currentGlobalIndex;
                    currentGlobalIndex += 1;
                    
                    if (charIndex > nodeIndex) return node;
                    if (charIndex === nodeIndex) {
                        return (
                            <React.Fragment key="br-typing">
                                {node}
                                <Cursor ref={cursorRef} char={cursorChar} />
                            </React.Fragment>
                        );
                    }
                    return null;
                }

                const children = React.Children.map(node.props.children, cloneAndClip);
                const validChildren = React.Children.toArray(children).filter(child => child !== null);

                if (validChildren.length === 0 && node.props.children) return null;

                return React.cloneElement(node, { ...node.props, children });
            }

            if (Array.isArray(node)) {
                return node.map((n, i) => <React.Fragment key={i}>{cloneAndClip(n)}</React.Fragment>);
            }

            return node;
        };

        return cloneAndClip(children);
    };

    return (
        <div className="relative w-full h-full">
            {renderTree()}
        </div>
    );
}

const Cursor = React.forwardRef<HTMLSpanElement, { char?: string }>(({ char }, ref) => {
    if (char) {
        return (
            <span ref={ref} className="typewriter-cursor">
                <style>{`
          @keyframes vertical-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          .typewriter-cursor {
            display: inline-block;
            font-weight: 700;
            animation: vertical-blink 1s step-end infinite;
            margin-left: 2px;
          }
        `}</style>
                {char}
            </span>
        );
    }

    return (
        <span
            ref={ref}
            style={{
                display: "inline-block",
                width: "2px",
                height: "1em",
                background: "rgba(255,255,255,0.8)",
                verticalAlign: "text-bottom",
                marginLeft: "1px",
                animation: "blink-messenger 1s step-end infinite",
            }}
        >
            <style>{`
        @keyframes blink-messenger { 50% { opacity: 0; } }
      `}</style>
        </span>
    );
});

Cursor.displayName = "Cursor";
