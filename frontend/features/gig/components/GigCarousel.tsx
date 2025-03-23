"use client";

import { faker } from "@faker-js/faker";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavigationOptions } from "swiper/types";

const data = [
  {
    id: faker.string.uuid(),
    url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/187221060/original/498dee5818e4f41cec45d8abf27a15e081bdfaa7.jpg",
    url2: "https://fiverr-res.cloudinary.com/image/upload/w_1260,q_auto,f_auto,pg_1/20240322/Haseeb_xnsjhx",
    type: "image",
    alt: "image",
  },
  {
    id: faker.string.uuid(),
    url: "http://localhost:3000/public/documents/document_demo.drawio.pdf",
    type: "document",
  },
  {
    id: faker.string.uuid(),
    url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/pqadd5xxrezx4zithzpg",
    type: "video",
  },
  {
    id: faker.string.uuid(),
    url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/gags7a77f6zybuusmf7g",
    type: "video",
  },

  {
    id: faker.string.uuid(),
    url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/118505834/original/eb828312a9e5e7f58c23a12981ccae2f8b475fd0.jpg",
    url2: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/151755071/original/2da69a6c1ae0a528377d6a93d43c0cbd2a706fb8/design-shopify-dropshipping-store.jpg",
    type: "image",
    alt: "image",
  },
  {
    id: faker.string.uuid(),
    url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/187221060/original/498dee5818e4f41cec45d8abf27a15e081bdfaa7.jpg",
    url2: "https://fiverr-res.cloudinary.com/image/upload/w_1260,q_auto,f_auto,pg_1/20240322/Haseeb_xnsjhx",
    type: "image",
    alt: "image",
  },
];

const GigCarousel = ({
  className = "",
}: {
  showFullScreen?: boolean;
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

  const [videoTimes, setVideoTimes] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isFullScreen);

    return () => document.body.classList.remove("overflow-hidden");
  }, [isFullScreen]);

  const handleSlideChange = (swiper: any) => {
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
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!isFullScreen) {
            setIsHovered(false);

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
            ? "fixed inset-0 z-50 flex h-full items-center justify-between bg-black bg-opacity-80 p-10 pt-16"
            : "relative flex items-center justify-center",
          className,
        )}
      >
        {isFullScreen && (
          <button
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white"
          >
            <X size={20} />
          </button>
        )}

        <button
          ref={prevRef}
          className={clsx(
            "absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-2 text-white",
            {
              "pointer-events-none hidden": !isHovered || isFirstSlide,
              "opacity-100": isHovered && !isFirstSlide,
            },
          )}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          ref={nextRef}
          className={clsx(
            "absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-2 text-white",
            {
              "pointer-events-none hidden": !isHovered || isLastSlide,
              "opacity-100": isHovered && !isLastSlide,
            },
          )}
        >
          <ChevronRight size={20} />
        </button>

        <button
          onClick={() => setFullscreen((prev) => !prev)}
          style={{
            bottom: isFullScreen ? 20 : 0,
            right: isFullScreen ? 20 : 0,
          }}
          className={clsx(
            "absolute z-10 rounded-full border-none bg-gray-300 p-2",
            {
              "pointer-events-none hidden": !isHovered,
              "opacity-100": isHovered,
            },
          )}
        >
          <Expand size={16} />
        </button>

        <Swiper
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
          style={{ height: "100%", width: "100%", paddingBottom: "10px" }}
        >
          {data.map(({ id, url, type, alt }, index) => (
            <SwiperSlide
              key={id}
              className={clsx({
                "p-2": isFullScreen,
                "p-1": !isFullScreen,
              })}
            >
              <div className="flex h-full w-full items-center justify-center">
                {type === "image" && (
                  <img
                    src={url}
                    alt={alt}
                    className="h-full w-full object-contain"
                  />
                )}
                {type === "video" && (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[index] = el;
                    }}
                    controls
                    className="h-fit"
                  >
                    <source src={url} type="video/mp4" />
                  </video>
                )}
                {type === "document" && (
                  <iframe
                    ref={documentRef}
                    src={url}
                    width="100%"
                    height="100%"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}

          <div className="custom-pagination flex items-center justify-center space-x-2"></div>
        </Swiper>
      </div>
    </>
  );
};

export default GigCarousel;
