import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { NavigationOptions } from "swiper/types";

const CarouselV2 = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const data = [
    {
      url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/pqadd5xxrezx4zithzpg",
      type: "video",
    },
    {
      url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/gags7a77f6zybuusmf7g",
      type: "video",
    },

    {
      url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/187221060/original/498dee5818e4f41cec45d8abf27a15e081bdfaa7.jpg",
      type: "image",
      alt: "image",
    },
    {
      url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/364619355/original/9ed6cfb0d447d4ee25f1d4a525bdc7f56c031e3c.jpg",
      type: "image",
      alt: "image",
    },
    {
      url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/118505834/original/eb828312a9e5e7f58c23a12981ccae2f8b475fd0.jpg",
      type: "image",
      alt: "image",
    },
  ];

  return (
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

      {/* Swiper */}
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
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
        className="rounded-sm"
      >
        {data.map((d) => {
          if (d.type === "image") {
            return (
              <SwiperSlide className="aspect-video">
                <img src={d.url} alt={d.alt} className="w-full" />
              </SwiperSlide>
            );
          }

          if (d.type === "video") {
            return (
              <SwiperSlide className="aspect-video">
                <video controls muted autoPlay={false}>
                  <source src={d.url} type="video/mp4" />
                </video>
              </SwiperSlide>
            );
          }
        })}
      </Swiper>
    </div>
  );
};

export default CarouselV2;
