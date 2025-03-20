import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavigationOptions } from "swiper/types";

const data = [
  {
    url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/187221060/original/498dee5818e4f41cec45d8abf27a15e081bdfaa7.jpg",
    url2: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/151755071/original/2da69a6c1ae0a528377d6a93d43c0cbd2a706fb8/design-shopify-dropshipping-store.jpg",

    type: "image",
    alt: "image",
  },
  {
    url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/pqadd5xxrezx4zithzpg",
    type: "video",
  },
  {
    url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/gags7a77f6zybuusmf7g",
    type: "video",
  },

  {
    url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/118505834/original/eb828312a9e5e7f58c23a12981ccae2f8b475fd0.jpg",
    url2: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/151755071/original/2da69a6c1ae0a528377d6a93d43c0cbd2a706fb8/design-shopify-dropshipping-store.jpg",
    type: "image",
    alt: "image",
  },
  {
    url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/187221060/original/498dee5818e4f41cec45d8abf27a15e081bdfaa7.jpg",

    url2: "https://fiverr-res.cloudinary.com/image/upload/w_1260,q_auto,f_auto,pg_1/20240322/Haseeb_xnsjhx",
    type: "image",
    alt: "image",
  },
];

const CarouselV2Fullscreen = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [fullscreenImage, setFullscreen] = useState(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [videoTimes, setVideoTimes] = useState<{ [key: number]: number }>({});

  const handleSlideChange = (swiper: any) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index !== swiper.activeIndex) {
          setVideoTimes((prev) => ({
            ...prev,
            [index]: video.currentTime,
          }));
          video.pause();
        }
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
        setFullscreen(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {fullscreenImage ? (
        <div className="fixed inset-0 z-50 flex h-full w-full bg-black bg-opacity-90 p-16">
          <div className="flex h-full w-full justify-center">
            <Swiper
              loop
              //navigation={true}
              pagination={{
                clickable: true,
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                (swiper.params.navigation as NavigationOptions).prevEl =
                  prevRef.current;
                (swiper.params.navigation as NavigationOptions).nextEl =
                  nextRef.current;
              }}
              onSlideChange={handleSlideChange}
              modules={[Navigation]}
            >
              {data.map((_, index) => {
                if (_.type === "image") {
                  return (
                    <SwiperSlide className="h-full w-full">
                      <img
                        src={_.url2}
                        alt={_.alt}
                        className="w-full cursor-pointer"
                        onClick={(e) => setFullscreen(_ as any)}
                      />
                    </SwiperSlide>
                  );
                }

                if (_.type === "video") {
                  return (
                    <SwiperSlide className="h-full w-full">
                      <video
                        controls
                        autoPlay={false}
                        className="h-full w-full"
                        ref={(el) => {
                          if (el) videoRefs.current[index] = el;
                        }}
                      >
                        <source src={_.url} type="video/mp4" />
                      </video>
                    </SwiperSlide>
                  );
                }
              })}
            </Swiper>
          </div>

          <Button
            variant="ghost"
            ref={prevRef}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-2 text-white"
          >
            <ChevronLeft size={16} />
          </Button>

          <Button
            variant="ghost"
            ref={nextRef}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-2 text-white"
          >
            <ChevronRight size={16} />
          </Button>

          <button
            className="z-999 absolute right-5 top-5 text-3xl text-white"
            onClick={() => setFullscreen(null)}
          >
            ✖
          </button>
        </div>
      ) : (
        <div className="relative">
          <Button
            variant="ghost"
            ref={prevRef}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-2 text-white"
          >
            <ChevronLeft size={16} />
          </Button>

          <Button
            variant="ghost"
            ref={nextRef}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-2 text-white"
          >
            <ChevronRight size={16} />
          </Button>

          <Swiper
            modules={[Navigation, Pagination]}
            onSlideChange={handleSlideChange}
            slidesPerView={1}
            loop
            pagination={{
              el: ".custom-pagination",
              clickable: true,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              (swiper.params.navigation as NavigationOptions).prevEl =
                prevRef.current;
              (swiper.params.navigation as NavigationOptions).nextEl =
                nextRef.current;
            }}
            className="rounded-sm"
          >
            {data.map((d, index) => {
              if (d.type === "image") {
                return (
                  <SwiperSlide className="aspect-video">
                    <img
                      src={d.url}
                      alt={d.alt}
                      className="w-full cursor-pointer"
                      onClick={(e) => setFullscreen(d as any)}
                    />
                  </SwiperSlide>
                );
              }

              if (d.type === "video") {
                return (
                  <SwiperSlide className="aspect-video">
                    <video
                      controls
                      autoPlay={false}
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el;
                      }}
                    >
                      <source src={d.url} type="video/mp4" />
                    </video>
                  </SwiperSlide>
                );
              }
            })}
          </Swiper>
          <div className="custom-pagination my-2 flex items-center justify-center"></div>
        </div>
      )}
    </>
  );
};

export default CarouselV2Fullscreen;
