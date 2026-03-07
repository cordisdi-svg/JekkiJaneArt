"use client";

import React, { useState, useEffect, useMemo, ReactNode } from "react";

interface TypewriterTextProps {
    children: ReactNode;
    delay?: number; // base delay per character in ms
    cursorChar?: string;
    scrollRef?: React.RefObject<HTMLDivElement>;
}

export function TypewriterText({ children, delay = 20, cursorChar = "_", scrollRef }: TypewriterTextProps) {
    const [charIndex, setCharIndex] = useState(0);

    // Auto-scroll when typing
    useEffect(() => {
        if (scrollRef?.current && charIndex > 0) {
            const el = scrollRef.current;
            // Scroll to bottom smoothly to keep cursor in view
            el.scrollTop = el.scrollHeight;
        }
    }, [charIndex, scrollRef]);

    // Extract all text nodes in order and build a map of where each character belongs
    const { textNodes, totalChars } = useMemo(() => {
        const nodes: { text: string }[] = [];
        let count = 0;

        const traverse = (node: ReactNode) => {
            if (typeof node === "string" || typeof node === "number") {
                const text = String(node);
                nodes.push({ text });
                count += text.length;
            } else if (React.isValidElement(node)) {
                if (node.props && node.props.children) {
                    React.Children.forEach(node.props.children, traverse);
                }
            } else if (Array.isArray(node)) {
                node.forEach(traverse);
            }
        };

        traverse(children);
        return { textNodes: nodes, totalChars: count };
    }, [children]);

    useEffect(() => {
        if (charIndex >= totalChars) return;

        // Add some random variation to the typing speed for realism
        const randomDelay = delay * 0.5 + Math.random() * delay;

        const timer = setTimeout(() => {
            setCharIndex((prev) => prev + 1);
        }, randomDelay);

        return () => clearTimeout(timer);
    }, [charIndex, totalChars, delay]);

    const isFinished = charIndex >= totalChars;

    // Render tree with clipped text
    const renderTree = () => {
        let currentGlobalIndex = 0;

        const cloneAndClip = (node: ReactNode): ReactNode => {
            if (typeof node === "string" || typeof node === "number") {
                const text = String(node);
                const nodeStart = currentGlobalIndex;
                const nodeEnd = currentGlobalIndex + text.length;

                currentGlobalIndex = nodeEnd;

                // If this entire node is not yet reached by the typewriter, return null
                if (charIndex <= nodeStart) return null;

                // If this entire node is within the typed segment, return as is
                if (charIndex >= nodeEnd) {
                    if (charIndex >= totalChars && nodeEnd === totalChars) {
                        return (
                            <React.Fragment key="done">
                                {text}
                                <span className="typewriter-cursor">{cursorChar}</span>
                            </React.Fragment>
                        );
                    }
                    return text;
                }

                // Partially typed node
                return (
                    <React.Fragment key="typing">
                        {text.slice(0, charIndex - nodeStart)}
                        <span className="typewriter-cursor">{cursorChar}</span>
                    </React.Fragment>
                );
            }

            if (React.isValidElement(node)) {
                const children = React.Children.map(node.props.children, cloneAndClip);
                // If no children produced any text (all null), we can still render the element to keep structure, but it might be empty
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
            <style>{`
        @keyframes vertical-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .typewriter-cursor {
          display: inline-block;
          font-weight: 700;
          animation: vertical-blink 1s step-end infinite;
          margin-left: 2px;
        }
      `}</style>
            {renderTree()}
        </div>
    );
}
