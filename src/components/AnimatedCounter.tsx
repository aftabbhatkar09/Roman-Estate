"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a stat value (e.g. "1,200+", "99%", "30yrs") when it scrolls
 * into view. Values with a decimal point (e.g. "2.5k+") render statically —
 * counting up a decimal digit-by-digit tends to look more like a glitch than
 * an effect, so it's not worth the complexity.
 */
export default function AnimatedCounter({
  value,
  duration = 1500,
}: {
  value: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [started, setStarted] = useState(false);

  const match = !value.includes(".") ? value.match(/^([\d,]+)(.*)$/) : null;
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset to 0 right as the count-up kicks off, not on mount — the
          // final value stays visible (e.g. for no-JS/SSR) until then.
          setDisplay(`0${suffix}`);
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started || target === null) return;
    const startTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(current.toLocaleString("en-IN") + suffix);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, suffix, duration]);

  return <span ref={ref}>{display}</span>;
}
