import { stringAvatar } from "@/lib/utils";
import { Avatar } from "@mui/material";
import { Diamond, Heart, Star } from "lucide-react";

import React, { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Tooltip } from "@mui/material";
import Link from "next/link";
import CarouselV2 from "./carousel_v2";

export const GigCard = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const saveToListHandle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    console.log("====================================");
    console.log("saveToListHandle");
    console.log("====================================");
  };
  return (
    <div className="relative w-full rounded-sm border bg-white">
      <div className="z-10 flex flex-col">
        {/* <Carousel /> */}
        <CarouselV2 />

        <div className=" ">
          <div className="my-2 flex flex-row items-center justify-between space-x-2">
            <div className="flex flex-row items-center space-x-2">
              <Avatar
                className="h-6 w-6 text-[12px]"
                {...stringAvatar("Mai Dat")}
              />
              <Avatar
                className="h-6 w-6"
                alt="Remy Sharp"
                src="/avatar/1.jpg"
              />
              <Link href={"/"} className="text-sm font-bold hover:underline">
                Mai Dat
              </Link>
            </div>
            <div>
              <div className="flex items-center">
                <span className="mr-2 text-[12px]">Level 2</span>
                {Array.from({ length: 2 }, (_, i) => i + 1).map((a) => (
                  <Diamond size={10} color="#000000" fill="#00000" />
                ))}

                <Diamond size={10} color="#E4E5E7" fill="#E4E5E7" />
              </div>

              <div className="flex items-center rounded-sm bg-[#ffe0b3] px-1">
                <span className="mr-2 text-[12px]">Top Rated</span>

                {Array.from({ length: 3 }, (_, i) => i + 1).map((a) => (
                  <Diamond size={10} color="#000000" fill="#00000" />
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/user/user_123/create-a-high-converting-shopify-dropshipping-website"
            target="_blank"
            className="text-base hover:underline"
          >
            I will design a professional WordPress website or web design
          </Link>
          <div className="mt-2 flex items-center text-yellow-500">
            <Star size={16} fill="currentColor" className="mr-1" />
            <span className="font-semibold">4.9</span>
            <span className="ml-1 text-gray-500">(803)</span>
          </div>
          <p className="mt-2 font-semibold text-gray-700">From $125</p>
        </div>
      </div>

      <div className="abcxyz absolute right-2 top-2 z-50">
        <Tooltip title="Save to list" placement="top">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 fill-gray-500 hover:bg-gray-200"
            onClick={(e) => saveToListHandle(e)}
          >
            <Heart size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
