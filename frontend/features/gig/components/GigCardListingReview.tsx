"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GigDto } from "@/dto/dto.type.";
import {
  freelancerUrl
} from "@/features/freelancer/freelancer.api";
import GigCarousel from "@/features/gig/components/GigCarousel";
import UserRank from "@/features/user/components/UserRank";
import { useFetchV1 } from "@/hooks/useFetch";
import { getFirstTwoLetters } from "@/lib/utils";
import clsx from "clsx";
import { Loader2, Star } from "lucide-react";
import Link from "next/link";
import GigFavorite from "./GigFavorite";

const GigCardListingReview = ({ gig }: { gig: GigDto }) => {
  const freelancerId = gig.freelancerId;

  const {
    data: freelancer,
    error,
    isLoading,
    isValidating,
  } = useFetchV1({
    url: freelancerUrl.profileById(freelancerId),
    swrOptions: {
      dedupingInterval: 300000, // 5 minutes
    },
    requireLogin: false,
  });

  if (isLoading || isValidating) {
    return (
      <div className="h-full w-full">
        <Loader2 className="m-auto animate-spin" size={18} />
      </div>
    );
  }

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

          <div className="line-clamp-2 max-h-15 w-full overflow-y-hidden">
            <Link
              href={`/gig/${gig?.slug}`}
              target="_blank"
              className="text-[17px] hover:underline"
            >
              {gig?.title}
            </Link>
          </div>

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
        <GigFavorite gig={gig} />
      </div>
    </div>
  );
};

export default GigCardListingReview;
