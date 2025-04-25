"use client";

import { Heart, Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import GigCarousel from "@/features/gig/components/GigCarousel";
import UserAvatar from "@/features/user/components/UserAvatar";
import UserRank from "@/features/user/components/UserRank";
import { faker } from "@faker-js/faker";
import { Tooltip } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { FreelancerRankEnum, GigDto } from "@/dto/dto.type.";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstTwoLetters } from "@/lib/utils";
import useSWR from "swr";
import { getFreelancerProfileByEmail } from "@/features/freelancer/freelancer.api";

const GigCardListingReview = ({ gig }: { gig: GigDto }) => {
  const email = gig?.freelancer.email;

  const [isFavorite, setFavorite] = useState(false);

  const {
    data: freelancer,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    `/profile/email/${email}`,
    () => getFreelancerProfileByEmail(email),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 300000, // 5 minutes
    },
  );

  if (isLoading || isValidating) {
    return (
      <div className="h-full w-full">
        <Loader2 className="m-auto animate-spin" size={18} />
      </div>
    );
  }

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
          gig={gig}
          pauseVideoOnLeave
          className={clsx(
            "h-full",
            // "md:h-[250px]",
            // "lg:h-[230px]",
            // "xl:h-[250px]",
          )}
        />
        <div className="p-2">
          <div className="mb-2 flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <Avatar>
                <AvatarImage src={freelancer?.avatar} />
                <AvatarFallback className="text-[14px]">
                  {getFirstTwoLetters(freelancer?.displayName)}
                </AvatarFallback>
              </Avatar>

              <Link
                href={`/freelancer/profile/${freelancer?.email}`}
                className="text-sm font-bold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {freelancer?.displayName}
              </Link>
            </div>

            <UserRank rankLevel={freelancer?.level} />
          </div>

          <Link
            href={`/gig/${gig?.slug}`}
            target="_blank"
            className="text-[17px] hover:underline"
          >
            {gig?.title}
          </Link>
          <div className="mt-2 flex items-center text-yellow-500">
            <Star
              size={16}
              className="mr-1 fill-yellow-500 stroke-yellow-500"
            />
            <span className="font-semibold">{gig?.ratingAverage}</span>
            <span className="ml-1 text-sm text-gray-500">
              ({gig?.ratingCount})
            </span>
          </div>
          <p className="mt-2 text-[17px] font-semibold text-gray-700">
            From ${gig?.basicPrice}
          </p>
        </div>
      </div>

      <div className="absolute top-0 right-0 z-10">
        {!isFavorite && (
          <Tooltip title="Save to list" placement="top">
            <button
              className={clsx(
                "rounded-full p-2",
                "bg-gray-100 hover:bg-gray-200",
              )}
              onClick={addFavoriteGig}
            >
              <Heart size={20} className="stroke-gray-500" />
            </button>
          </Tooltip>
        )}
        {isFavorite && (
          <Tooltip title="Remove" placement="top">
            <button
              className={clsx(
                "flex rounded-full p-2",
                "bg-red-200 hover:bg-red-100",
              )}
              onClick={removeFavoriteGig}
            >
              <Heart size={20} className="stroke-red-500" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default GigCardListingReview;
