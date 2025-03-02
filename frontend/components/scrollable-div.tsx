import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
          <ChevronLeft size={20} color="#000000" strokeWidth={2} />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={clsx(
          `${layout && layout}`,
          { "flex overflow-x-auto whitespace-nowrap p-1": !layout },
          {
            "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar]:h-2":
              showScrollBar,
          },
          { "[&::-webkit-scrollbar]:hidden": !showScrollBar },

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
          <ChevronRight size={20} color="#000000" strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default ScrollableDiv;
