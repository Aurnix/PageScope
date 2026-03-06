import { useState, useEffect, useRef } from "react";

interface Props {
  target: number;
  duration?: number;
}

export default function AnimatedNumber({ target, duration = 1200 }: Props) {
  const [current, setCurrent] = useState(0);
  const rafId = useRef(0);

  useEffect(() => {
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCurrent(Math.floor(progress * target));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        setCurrent(target);
      }
    }

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [target, duration]);

  return <span>{current.toLocaleString()}</span>;
}
