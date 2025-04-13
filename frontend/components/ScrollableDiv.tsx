import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
  MouseEvent,
  useEffect,
} from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  layout?: string;
  dragAndScroll?: boolean;
  showScrollBar?: boolean;
  showLeftRightButton?: boolean;
  buttonOverlay?: boolean;
};

const ScrollableDiv = ({
  children,
  className,
  layout,
  dragAndScroll = false,
  showScrollBar = true,
  showLeftRightButton = true,
  buttonOverlay = false,
}: PropsWithChildren<Props>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStartLeft = useRef(0);

  const [scrolling, setScrolling] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [enableDragScroll, setEnableDragScroll] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setEnableDragScroll(dragAndScroll && window.innerWidth < 768);
    };
    handleResize(); // run once
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dragAndScroll]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!enableDragScroll || !scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStartLeft.current = scrollRef.current.scrollLeft;
    document.body.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.pageX - startX.current;
    scrollRef.current.scrollLeft = scrollStartLeft.current - dx;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);

    setScrolling(true);
    clearTimeout((scrollRef.current as any)._scrollTimeout);
    (scrollRef.current as any)._scrollTimeout = setTimeout(
      () => setScrolling(false),
      1500,
    );
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 500, behavior: "smooth" });
  };

  useEffect(() => {
    const up = () => handleMouseUp();
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseleave", up);
    handleScroll();
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", up);
    };
  }, []);

  const scrollArea = (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={clsx(
        layout || "flex overflow-x-auto p-2 whitespace-nowrap",
        showScrollBar
          ? "[&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full"
          : "[&::-webkit-scrollbar]:hidden",
        scrolling
          ? "[&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100"
          : "[&::-webkit-scrollbar-thumb]:hidden [&::-webkit-scrollbar-track]:hidden",
        enableDragScroll ? "cursor-grab" : "",
      )}
      onMouseDown={enableDragScroll ? handleMouseDown : undefined}
      onMouseMove={enableDragScroll ? handleMouseMove : undefined}
    >
      {children}
    </div>
  );

  if (buttonOverlay) {
    return (
      <div className={clsx("relative flex h-full", className)}>
        {showLeftRightButton && canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute top-1/2 left-0 z-10 flex h-full w-8 -translate-y-1/2 items-center justify-center bg-white/50"
          >
            <ChevronLeft size={20} className="stroke-black stroke-[2]" />
          </button>
        )}
        {scrollArea}
        {showLeftRightButton && canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute top-1/2 right-0 z-10 flex h-full w-8 -translate-y-1/2 items-center justify-center bg-white/50"
          >
            <ChevronRight size={20} className="stroke-black stroke-[2]" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("flex h-full flex-col", className)}>
      {showLeftRightButton && (
        <div className="flex justify-end gap-2 px-2 pb-1">
          <button
            onClick={scrollLeft}
            className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-100",
              !canScrollLeft && "pointer-events-none opacity-50",
            )}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={scrollRight}
            className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-100",
              !canScrollRight && "pointer-events-none opacity-50",
            )}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
      {scrollArea}
    </div>
  );
};

export default ScrollableDiv;
