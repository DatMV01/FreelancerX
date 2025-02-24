import clsx from "clsx";
import {
  MouseEvent,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from "react";

type Props = {
  children?: ReactNode;
  className?: any;
  layout?: any;
  dragAndScroll?: boolean;
  showScrollBar?: boolean;
  showLeftRightButton?: boolean;
};
type Ref = HTMLDivElement;

const ScrollableDiv = ({
  children,
  className,
  layout,
  dragAndScroll = false,
  showScrollBar = true,
  showLeftRightButton = true,
  ...props
}: PropsWithChildren<Props>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTopScrollLeft, setIsTopScrollLeft] = useState(false);
  const [isLastScrollLeft, setIsLastScrollLeft] = useState(true);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    document.body.style.userSelect = "auto";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
    document.body.style.userSelect = "none";
  };
  const scrollLeftOnClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRightOnClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    setIsScrolling(true);

    clearTimeout((scrollRef.current as any)?._scrollTimeout);
    (scrollRef.current as any)._scrollTimeout = setTimeout(
      () => setIsScrolling(false),
      2000,
    );

    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setIsTopScrollLeft(scrollLeft != 0);
    setIsLastScrollLeft(scrollLeft + clientWidth <= scrollWidth - 1);
  };

  return (
    <div className={`relative flex h-full ${className}`}>
      {showLeftRightButton && isTopScrollLeft && (
        <button
          onClick={scrollLeftOnClick}
          className="absolute left-0 top-1/2 z-10 flex h-full w-8 -translate-y-1/2 items-center justify-center bg-[white] bg-opacity-50"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 8 15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.2279 0.690653L7.84662 1.30934C7.99306 1.45578 7.99306 1.69322 7.84662 1.83968L2.19978 7.5L7.84662 13.1603C7.99306 13.3067 7.99306 13.5442 7.84662 13.6907L7.2279 14.3094C7.08147 14.4558 6.84403 14.4558 6.69756 14.3094L0.153374 7.76518C0.00693607 7.61875 0.00693607 7.38131 0.153374 7.23484L6.69756 0.690653C6.84403 0.544184 7.08147 0.544184 7.2279 0.690653Z"></path>
          </svg>
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={clsx(
          `${layout && layout}`,
          `${!layout && "flex overflow-x-auto whitespace-nowrap p-1"}`,
          `${showScrollBar ? "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar]:h-2" : "[&::-webkit-scrollbar]:hidden"}`,
          `${isScrolling && "cursor-grab [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100"}`,
          `${
            !isScrolling &&
            "cursor-default [&::-webkit-scrollbar-thumb]:hidden [&::-webkit-scrollbar-track]:hidden"
          }`,
        )}
        onMouseDown={dragAndScroll ? handleMouseDown : undefined}
        onMouseLeave={dragAndScroll ? handleMouseLeave : undefined}
        onMouseUp={dragAndScroll ? handleMouseUp : undefined}
        onMouseMove={dragAndScroll ? handleMouseMove : undefined}
      >
        {children}
      </div>
      {showLeftRightButton && isLastScrollLeft && (
        <button
          onClick={scrollRightOnClick}
          className="absolute right-0 top-1/2 z-10 flex h-full w-8 -translate-y-1/2 items-center justify-center bg-[white] bg-opacity-50"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 8 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.772126 1.19065L0.153407 1.80934C0.00696973 1.95578 0.00696973 2.19322 0.153407 2.33969L5.80025 8L0.153407 13.6603C0.00696973 13.8067 0.00696973 14.0442 0.153407 14.1907L0.772126 14.8094C0.918563 14.9558 1.156 14.9558 1.30247 14.8094L7.84666 8.26519C7.99309 8.11875 7.99309 7.88131 7.84666 7.73484L1.30247 1.19065C1.156 1.04419 0.918563 1.04419 0.772126 1.19065Z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ScrollableDiv;
