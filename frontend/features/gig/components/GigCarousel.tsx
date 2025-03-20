import { faker } from "@faker-js/faker";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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

const GigCarousel = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isFullScreen, setFullscreen] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [videoTimes, setVideoTimes] = useState<{ [key: number]: number }>({});
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const goToSlide = (index: number) => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(index);
      }
    };

    if (isFullScreen && slideIndex) {
      setTimeout(() => {
        goToSlide(slideIndex);
      }, 100);
    }
  }, [slideIndex]);

  useEffect(() => {
    if (isFullScreen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isFullScreen]);

  const handleSlideChange = (swiper: any) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index !== swiper.realIndex) {
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
  }, []);

  return (
    <>
      <div
        className={clsx({
          "relative flex h-[500px] items-center justify-center": !isFullScreen,
          "fixed inset-0 z-50 flex h-full items-center justify-between bg-black bg-opacity-80 p-10 pt-16":
            isFullScreen,
        })}
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
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-2 text-white"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          ref={nextRef}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-gray-300 p-2 text-white"
        >
          <ChevronRight size={20} />
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
          style={{ height: "95%", width: "95%", padding: "10px 0" }}
        >
          {data.map((_, index) => {
            if (_.type === "image") {
              return (
                <SwiperSlide key={faker.number.bigInt()} className="p-2">
                  <div className="flex h-full w-full items-center justify-center bg-none">
                    <img
                      src={_.url}
                      alt={_.alt}
                      data-index={index}
                      onClick={(e) => {
                        const dataIndex = Number(e.currentTarget.dataset.index);

                        setFullscreen(true);
                        setSlideIndex(dataIndex);
                      }}
                      className="h-full w-full cursor-pointer object-contain"
                    />
                  </div>
                </SwiperSlide>
              );
            }

            if (_.type === "video") {
              return (
                <SwiperSlide key={faker.number.bigInt()} className="p-2">
                  <div className="flex h-full w-full items-center justify-center bg-none">
                    <video
                      data-index={index}
                      controls
                      className="h-full w-full object-cover"
                      autoPlay={false}
                      ref={(el) => {
                        if (el) videoRefs.current[index] = el;
                      }}
                    >
                      <source src={_.url} type="video/mp4" />
                    </video>
                  </div>
                </SwiperSlide>
              );
            }
          })}

          <div className="custom-pagination flex items-center justify-center space-x-2"></div>
        </Swiper>
      </div>
    </>
  );
};

export default GigCarousel;
