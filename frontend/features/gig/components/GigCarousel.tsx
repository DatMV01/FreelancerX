"use client";

import { GigDto } from "@/dto/dto.type.";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavigationOptions } from "swiper/types";

const GigCarousel = ({
  gig,
  className = "",
  pauseVideoOnLeave = false,
}: {
  gig?: GigDto;
  pauseVideoOnLeave?: boolean;
  className?: string;
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const documentRef = useRef<HTMLIFrameElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFullScreen, setFullscreen] = useState<boolean>(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [videoTimes, setVideoTimes] = useState<{ [key: number]: number }>({});

  const dataArr = useMemo(() => {
    if (!gig?.medias) return [];
    const { thumbnail, video, ...anothers } = gig.medias;
    const values = Object.entries(anothers).map(([_, value]) => value);
    return [thumbnail, video, ...values].filter(Boolean);
  }, [gig]);

  const handleMouseEnter = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setIsHovered(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setIsHovered(false);
  };

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isFullScreen);

    return () => document.body.classList.remove("overflow-hidden");
  }, [isFullScreen]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);

    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);

    videoRefs.current.forEach((video, index) => {
      if (video && index !== swiper.realIndex) {
        setVideoTimes((prev) => ({
          ...prev,
          [index]: video.currentTime,
        }));
        video.pause();
      }
    });

    const activeVideo = videoRefs.current[swiper.activeIndex];
    if (activeVideo && videoTimes[swiper.activeIndex] !== undefined) {
      activeVideo.currentTime = videoTimes[swiper.activeIndex];
      //  activeVideo.play();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFullscreen(false);

        videoRefs.current.forEach((video, index) => {
          if (video) {
            video.pause();
          }
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  return (
    <>
      <div
        onMouseEnter={() => {
          if (!isFullScreen) {
            handleMouseEnter();
          }
        }}
        onTouchStart={() => {
          if (!isFullScreen) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!isFullScreen) {
            setIsHovered(false);

            pauseVideoOnLeave &&
              videoRefs.current.forEach((video, index) => {
                if (video) {
                  setVideoTimes((prev) => ({
                    ...prev,
                    [index]: video.currentTime,
                  }));
                  video.pause();
                }
              });
          }
        }}
        onTouchEnd={() => {
          if (!isFullScreen) {
            setIsHovered(false);

            pauseVideoOnLeave &&
              videoRefs.current.forEach((video, index) => {
                if (video) {
                  setVideoTimes((prev) => ({
                    ...prev,
                    [index]: video.currentTime,
                  }));
                  video.pause();
                }
              });
          }
        }}
        className={clsx(
          isFullScreen
            ? "fixed inset-0 z-50 flex h-full items-center justify-between bg-black/70 p-10 pt-16"
            : "relative flex items-center justify-center " + className,
        )}
      >
        {isFullScreen && (
          <button
            aria-label="Close fullscreen"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 rounded-full bg-red-500 p-2 text-white"
          >
            <X size={20} />
          </button>
        )}

        <button
          ref={prevRef}
          className={clsx(
            "absolute top-1/2 left-0 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-1 text-white",
            {
              hidden: !isHovered || isFirstSlide,
            },
            {
              "left-4": isFullScreen,
            },
          )}
        >
          <ChevronLeft size={25} />
        </button>

        <button
          ref={nextRef}
          className={clsx(
            "absolute top-1/2 right-0 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-1 text-white",
            {
              hidden: !isHovered || isLastSlide,
            },
            {
              "right-4": isFullScreen,
            },
          )}
        >
          <ChevronRight size={25} />
        </button>

        <button
          onClick={() => setFullscreen((prev) => !prev)}
          className={clsx(
            "-none absolute right-0 bottom-0 z-10 rounded-full bg-gray-300 p-2",
            {
              "right-5 bottom-5": isFullScreen,
            },
            // {
            //   hidden: !isHovered,
            // },
          )}
        >
          <Expand size={isFullScreen ? 20 : 16} />
        </button>

        <Swiper
          speed={500}
          touchRatio={1.5}
          modules={[Navigation, Pagination]}
          onSlideChange={handleSlideChange}
          spaceBetween={10}
          slidesPerView={1}
          centeredSlides={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onInit={(swiper) => {
            (swiper.params.navigation as NavigationOptions).prevEl =
              prevRef.current;
            (swiper.params.navigation as NavigationOptions).nextEl =
              nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
          }}
          loop={false}
          className={`h-full w-full ${isFullScreen && "!pb-[10px]"}`}
        >
          {dataArr.map((item: any, index) => {
            if (!item) return null;

            const renderMedia = () => {
              if (item.mimeType.startsWith("image")) {
                return (
                  <img
                    src={item.url}
                    alt={"alt" in item ? (item.alt as string) : "Image"}
                    className="h-full object-contain"
                    loading="lazy"
                  />
                );
              }

              if (item.mimeType.startsWith("video")) {
                return (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    controls
                    className="h-full "
                  >
                    <source src={item.url} type="video/mp4" />
                  </video>
                );
              }

              if (
                item.mimeType.startsWith("application/pdf") &&
                activeIndex === index
              ) {
                return (
                  <iframe
                    ref={documentRef}
                    src={item.url}
                    className="h-full w-full"
                  />
                );
              }

              return null;
            };

            return (
              <SwiperSlide
                key={item.id}
                className={clsx({
                  "p-2": isFullScreen,
                })}
              >
                <div className="flex h-full w-full items-center justify-center px-10">
                  {renderMedia()}
                </div>
              </SwiperSlide>
            );
          })}

          <div
            className={`custom-pagination ${!isFullScreen && "my-2"} flex items-center justify-center space-x-2`}
          ></div>
        </Swiper>
      </div>
    </>
  );
};

export default GigCarousel;
