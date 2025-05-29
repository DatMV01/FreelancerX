"use client";

import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import clsx from "clsx";
import { GigDto } from "@/dto/dto.type";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PrevArrow = ({ className, onClick }: any) => (
  <button
    onClick={onClick}
    className={clsx(
      "absolute z-10 left-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/70 p-2 text-white hover:bg-gray-700",
      className
    )}
  >
    <ChevronLeft size={24} />
  </button>
);

const NextArrow = ({ className, onClick }: any) => (
  <button
    onClick={onClick}
    className={clsx(
      "absolute z-10 right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/70 p-2 text-white hover:bg-gray-700",
      className
    )}
  >
    <ChevronRight size={24} />
  </button>
);

const GigCarousel = ({
  gig,
  className = "",
}: {
  gig?: GigDto;
  className?: string;
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const sliderRef = useRef<Slider | null>(null);

  const { thumbnail, ...anothers } = gig?.medias || {};
  const dataArr = [thumbnail, ...Object.values(anothers)].filter(Boolean);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isFullScreen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isFullScreen]);

  const renderMedia = (item: any, index: number) => {
    if (item.mimeType.startsWith("image")) {
      return (
        <img
          src={item.url}
          alt={item.alt || `Image ${index}`}
          className="max-h-[500px] w-full object-contain mx-auto"
        />
      );
    }

    if (item.mimeType.startsWith("video")) {
      return (
        <video controls className="max-h-[500px] w-full mx-auto">
          <source src={item.url} type="video/mp4" />
        </video>
      );
    }

    if (item.mimeType.startsWith("application/pdf")) {
      return (
        <iframe
          src={item.url}
          className="w-full"
          style={{ height: "500px", display: "block", margin: "0 auto" }}
        />
      );
    }

    return <div className="text-red-500">File không hỗ trợ</div>;
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div
      className={clsx(
        "relative",
        isFullScreen &&
          "fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4",
        className
      )}
    >
      {isFullScreen && (
        <button
          onClick={() => setIsFullScreen(false)}
          className="absolute top-4 right-4 z-50 rounded-full bg-red-500 p-2 text-white"
        >
          <X size={20} />
        </button>
      )}

      <button
        onClick={() => setIsFullScreen(!isFullScreen)}
        className="absolute bottom-4 right-4 z-50 rounded-full bg-gray-700 p-2 text-white"
      >
        <Expand size={18} />
      </button>

      <Slider ref={sliderRef} {...settings} className="w-full">
        {dataArr.map((item, index) => (
          <div key={item.id || index} className="px-4">
            <div className="w-full">{renderMedia(item, index)}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default GigCarousel;
