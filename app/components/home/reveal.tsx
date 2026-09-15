"use client";

import {
  useEffect,
  useRef,
} from "react";

export function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            element.classList.add(
              "is-visible"
            );

            observer.unobserve(element);
          }
        },
        {
          threshold: 0.12,
        }
      );

    observer.observe(element);

    return () =>
      observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}