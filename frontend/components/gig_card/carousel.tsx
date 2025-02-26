"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 10 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

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
      url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/118505834/original/eb828312a9e5e7f58c23a12981ccae2f8b475fd0.jpg",
      type: "image",
      alt: "image",
    },
    {
      url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/187221060/original/498dee5818e4f41cec45d8abf27a15e081bdfaa7.jpg",
      type: "image",
      alt: "image",
    },
  ];

  return (
    <div className="relative w-full">
      <div
        ref={sliderRef}
        className="keen-slider keen-slider__slide w-full overflow-hidden rounded-lg"
      >
        {data.map((d) => {
          if (d.type === "image") {
            return (
              <div className="keen-slider__slide aspect-video">
                <img src={d.url} alt={d.alt} className="w-full object-fill" />
              </div>
            );
          }

          if (d.type === "video") {
            return (
              <div className="keen-slider__slide aspect-video">
                <video controls muted>
                  <source src={d.url} type="video/mp4" />
                </video>
              </div>
            );
          }
        })}
      </div>

      <button
        className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white hover:bg-gray-100"
        onClick={() => instanceRef.current?.prev()}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white hover:bg-gray-100"
        onClick={() => instanceRef.current?.next()}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 space-x-2">
        {data.map((_, idx) => (
          <button
            key={idx}
            className={`h-2 w-2 rounded-full transition-all ${
              currentSlide === idx ? "h-2 w-2 bg-white" : "bg-gray-100"
            }`}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
          />
        ))}
      </div>
    </div>
  );
}
