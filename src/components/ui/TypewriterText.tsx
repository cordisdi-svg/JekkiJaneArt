"use client";

import React, { useState, useEffect, useMemo, ReactNode } from "react";

interface TypewriterTextProps {
    children: ReactNode;
    delay?: number; // base delay per character in ms
    cursorChar?: string;
    scrollRef?: React.RefObject<HTMLDivElement>;
}

export function TypewriterText({ children, delay = 35, cursorChar, scrollRef }: TypewriterTextProps) {
    const [charIndex, setCharIndex] = useState(0);

    // Extract all text content to calculate delays per character
    const { totalChars, textContent } = useMemo(() => {
        let text = "";
        const traverse = (node: ReactNode) => {
            if (typeof node === "string" || typeof node === "number") {
                text += String(node);
            } else if (React.isValidElement(node)) {
                if (node.props && node.props.children) {
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

        // Sophisticated delays matching about/page.tsx
        if (ch === "\n") currentDelay = 150;
        else if (".!?…".includes(ch)) currentDelay = 200;
        else if (",;:—-".includes(ch)) currentDelay = 90;
        else if (ch === " ") currentDelay = 28;
        else currentDelay = delay + (Math.random() * 14 - 7);

        const timer = setTimeout(() => {
            setCharIndex((prev) => prev + 1);
        }, currentDelay);

        return () => clearTimeout(timer);
    }, [charIndex, totalChars, delay, textContent]);

    // Auto-scroll when typing
    useEffect(() => {
        if (scrollRef?.current && charIndex > 0) {
            const el = scrollRef.current;
            el.scrollTop = el.scrollHeight;
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
                                <Cursor char={cursorChar} />
                            </React.Fragment>
                        );
                    }
                    return text;
                }

                return (
                    <React.Fragment key="typing">
                        {text.slice(0, charIndex - nodeStart)}
                        <Cursor char={cursorChar} />
                    </React.Fragment>
                );
            }

            if (React.isValidElement(node)) {
                const children = React.Children.map(node.props.children, cloneAndClip);
                // Filter out null children to check if the element should render at all
                const validChildren = React.Children.toArray(children).filter(child => child !== null);

                if (validChildren.length === 0) return null;

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

function Cursor({ char }: { char?: string }) {
    if (char) {
        return (
            <span className="typewriter-cursor">
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
}
