import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    is2Xl: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isSm: window.innerWidth < 640,
        isMd: window.innerWidth >= 640 && window.innerWidth < 768,
        isLg: window.innerWidth >= 768 && window.innerWidth < 1024,
        isXl: window.innerWidth >= 1024 && window.innerWidth < 1280,
        is2Xl: window.innerWidth >= 1280,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
