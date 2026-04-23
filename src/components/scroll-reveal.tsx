"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  as?: "div" | "section" | "article";
  className?: string;
  delay?: number;
  id?: string;
};

export function ScrollReveal({ children, as = "div", className = "", delay = 0, id }: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              window.setTimeout(() => node.classList.add("is-visible"), delay);
            } else {
              node.classList.add("is-visible");
            }
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  const Tag = as;
  const combined = `reveal ${className}`.trim();

  return (
    <Tag ref={ref as never} className={combined} id={id}>
      {children}
    </Tag>
  );
}
