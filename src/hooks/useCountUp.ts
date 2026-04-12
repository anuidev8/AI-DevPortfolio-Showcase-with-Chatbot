import { useState, useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

interface UseCountUpProps {
  target: number;
  duration?: number;
  start?: number;
}

const easeOutExpo = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function useCountUp({ target, duration = 1000, start = 0 }: UseCountUpProps) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;

    if (isReduced) {
      setCount(target);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = Math.pow(progress, 3); // simple cubic ease out => 1 - Math.pow(1 - progress, 3) actually. Wait, easeOutExpo is better.
      const currentVal = start + (target - start) * easeOutExpo(progress);

      setCount(Math.round(currentVal));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [inView, target, duration, start, isReduced]);

  return { count, ref };
}
