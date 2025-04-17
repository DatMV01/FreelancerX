import { useEffect, useState, useRef } from "react";

export function useCountdownRedirect({
  seconds = 5,
  autoStart = false,
}: {
  seconds?: number;
  autoStart?: boolean;
}) {
  const [countdown, setCountdown] = useState(seconds);
  const [isCounting, setIsCounting] = useState(autoStart);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isCounting) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && urlRef.current) {
      window.open(urlRef.current, "_blank");
    }
  }, [countdown, isCounting]);

  const start = (url: string) => {
    urlRef.current = url;
    setCountdown(seconds);
    setIsCounting(true);
  };

  const reset = () => {
    setCountdown(seconds);
    setIsCounting(false);
    urlRef.current = null;
  };

  return { countdown, isCounting, start, reset };
}
