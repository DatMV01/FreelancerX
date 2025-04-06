"use client";

import { GigDto } from "@/dto/dto.type.";
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

const fakeData = [
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

  const { documents, video, images } = gig || {};
  const dataArr = (
    gig
      ? [
          images?.image1 && {
            type: "image",
            ...images?.image1,
          },
          images?.image2 && {
            type: "image",
            ...images?.image2,
          },
          images?.image3 && {
            type: "image",
            ...images?.image3,
          },
          documents?.document1 && {
            type: "document",
            ...documents?.document1,
          },
          documents?.document2 && {
            type: "document",
            ...documents?.document2,
          },
          video && {
            type: "video",
            ...video,
          },
        ]
      : fakeData
  ).filter(Boolean);

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
            "absolute right-0 bottom-0 z-10 rounded-full border-none bg-gray-300 p-2",
            {
              "right-5 bottom-5": isFullScreen,
            },
            {
              hidden: !isHovered,
            },
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
          style={{ height: "100%", width: "100%", paddingBottom: "10px" }}
        >
          {dataArr.map(
            (item, index) =>
              item && (
                <SwiperSlide
                  key={item.id}
                  className={clsx({
                    "p-2": isFullScreen,
                  })}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    {item.type === "image" && (
                      <img
                        src={item.url}
                        alt={"alt" in item ? (item.alt as string) : "Image"}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    )}
                    {item.type === "video" && (
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[index] = el;
                        }}
                        controls
                        className="h-fit"
                      >
                        <source src={item.url} type="video/mp4" />
                      </video>
                    )}
                    {item.type === "document" && (
                      <iframe
                        ref={documentRef}
                        src={item.url}
                        width="100%"
                        height="100%"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ),
          )}

          <div className="custom-pagination flex items-center justify-center space-x-2"></div>
        </Swiper>
      </div>
    </>
  );
};

export default GigCarousel;
