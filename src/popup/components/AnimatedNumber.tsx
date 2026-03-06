import { useState, useEffect } from "react";

interface Props {
  target: number;
  duration?: number;
}

export default function AnimatedNumber({ target, duration = 1200 }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{current.toLocaleString()}</span>;
}
