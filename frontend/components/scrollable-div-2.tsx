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

const ScrollableDiv2 = ({
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
    <div className={`flex h-full flex-col ${className}`}>
      <div className="flex justify-end">
        {showLeftRightButton && (
          <button
            onClick={scrollLeftOnClick}
            className={clsx(
              `mx-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-100`,
              `${!isTopScrollLeft && "pointer-events-none opacity-50"} `,
            )}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 8 15"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentFill"
            >
              <path d="m7.228.69.619.62a.375.375 0 0 1 0 .53L2.2 7.5l5.647 5.66a.375.375 0 0 1 0 .53l-.62.62a.375.375 0 0 1-.53 0L.154 7.764a.375.375 0 0 1 0-.53L6.698.69a.375.375 0 0 1 .53 0Z"></path>
            </svg>
          </button>
        )}

        {showLeftRightButton && (
          <button
            onClick={scrollRightOnClick}
            className={clsx(
              `flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-100`,
              `${!isLastScrollLeft && "pointer-events-none opacity-50"} `,
            )}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 8 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentFill"
            >
              <path d="m.772 1.19-.619.62a.375.375 0 0 0 0 .53L5.8 8 .153 13.66a.375.375 0 0 0 0 .53l.62.62a.375.375 0 0 0 .53 0l6.544-6.545a.375.375 0 0 0 0-.53L1.302 1.19a.375.375 0 0 0-.53 0Z"></path>
            </svg>
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={clsx(
          `${layout && layout}`,
          `${!layout && "flex overflow-x-auto whitespace-nowrap p-2"}`,
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
    </div>
  );
};

export default ScrollableDiv2;
