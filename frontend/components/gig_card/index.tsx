"use client";

import { Heart, Star } from "lucide-react";

import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import GigCarousel from "@/features/gig/components/GigCarousel";
import UserAvatar from "@/features/user/components/UserAvatar";
import UserRank from "@/features/user/components/UserRank";
import { faker } from "@faker-js/faker";
import { Tooltip } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { SellerRankStatus } from "@/features/seller/seller.rank.enum";

export const GigCard = () => {
  const [level, setLevel] = useState<number>(0);
  const [fullName, setFullName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [isFavorite, setFavorite] = useState(false);

  useEffect(() => {
    setLevel(faker.number.int({ min: 0, max: 3 }));
    setFullName(faker.person.fullName());
    setTitle(faker.lorem.lines(1));
    setRatingCount(faker.number.float({ multipleOf: 0.25, min: 0, max: 5 }));
    setReviewCount(faker.number.int({ min: 100, max: 1000 }));
    setPrice(faker.number.int({ min: 0, max: 1500 }));
    setFavorite(faker.datatype.boolean());
  }, []);

  const addFavoriteGig = () => {
    setFavorite(true);
  };

  const removeFavoriteGig = () => {
    setFavorite(false);
  };

  return (
    <div className="relative w-full rounded-sm">
      <div className="z-10 flex flex-col">
        <GigCarousel
          className={clsx(
            "h-[250px]",
            // "md:h-[250px]",
            // "lg:h-[230px]",
            // "xl:h-[250px]",
          )}
        />
        <div className="p-2">
          <div className="mb-2 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <UserAvatar
                fullName={fullName}
                height={30}
                width={30}
                fontSize={15}
              />

              <Link
                href={`/seller/profile/${fullName.toLowerCase().replaceAll(" ", "-")}`}
                className="text-sm font-bold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {fullName}
              </Link>
            </div>

            <UserRank rankLevel={SellerRankStatus.level3} />
          </div>

          <Link
            href="/gig/demo-1234566789"
            target="_blank"
            className="text-[17px] hover:underline"
          >
            {title}
          </Link>
          <div className="mt-2 flex items-center text-yellow-500">
            <Star
              size={16}
              className="mr-1 fill-yellow-500 stroke-yellow-500"
            />
            <span className="font-semibold">{ratingCount}</span>
            <span className="ml-1 text-sm text-gray-500">({reviewCount})</span>
          </div>
          <p className="mt-2 text-[17px] font-semibold text-gray-700">
            From ${price}
          </p>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-10">
        {!isFavorite && (
          <Tooltip title="Save to list" placement="top">
            <button
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full",
                "bg-gray-100 hover:bg-gray-200",
              )}
              onClick={addFavoriteGig}
            >
              <Heart size={16} className="stroke-gray-500" />
            </button>
          </Tooltip>
        )}
        {isFavorite && (
          <Tooltip title="Remove" placement="top">
            <button
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full",
                "bg-red-200 hover:bg-red-100",
              )}
              onClick={removeFavoriteGig}
            >
              <Heart size={16} className="stroke-red-500" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
