import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { selectFavoriteGigs } from "@/lib/redux/features/gigs/gigsSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { Badge, Divider, Tooltip } from "@mui/material";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const NavbarLeftPopoverFavoriteGig = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const favoriteGigs = useAppSelector(selectFavoriteGigs);

  return (
    <Popover>
      <Tooltip title="View Orders">
        <PopoverTrigger>
          <Badge
            badgeContent={favoriteGigs.length}
            color="success"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "11px",
                height: "21px",
                minWidth: "21px",
                zIndex: "10",
              },
            }}
          >
            <Heart />
          </Badge>
        </PopoverTrigger>
      </Tooltip>

      <PopoverContent align="end" className="w-80 p-0">
        <div>
          <div className="flex border-b bg-gray-100 p-3 font-semibold text-gray-700">
            <Heart /> &nbsp;
            <span>Favorite Gigs</span> &nbsp;
            <Link
              className="cursor-pointer text-gray-500 hover:underline"
              href="/dashboard/buyer/favorites"
          
            >
              (Details)
            </Link>
          </div>
          <Divider />
          <ScrollArea className="h-[600px] w-full">
            {favoriteGigs.length == 0 && (
              <div className="p-3 text-gray-500">No Favorite Gigs... yet</div>
            )}

            {favoriteGigs.length > 0 &&
              favoriteGigs.map((gig) => (
                <div
                  key={gig.id}
                  className="flex h-25 items-center gap-2 border-b p-2 last:border-none hover:bg-gray-100"
                >
                  <div className="relative flex aspect-square w-20 flex-shrink-0 items-center">
                    <img
                      src={gig.thumbnail.url}
                      alt="Gig Thumbnail"
                      className="w-full rounded-sm"
                    />
                  </div>

                  <div className=" ">
                    <p className="line-clamp-2 max-h-15 overflow-y-hidden">
                      <Link
                        href={`/gig/${gig?.slug}`}
                        target="_blank"
                        className="text-sm hover:underline"
                      >
                        {gig?.title}
                      </Link>
                    </p>

                    <div className="flex items-center gap-x-2">
                      <a
                        href={`/freelancer/profile/${gig.freelancer.email}`}
                        target="_blank"
                        className="cursor-pointer text-xs text-gray-500 hover:underline"
                      >
                        {gig.freelancer.displayName}
                      </a>
                      <p className="flex items-center justify-center space-x-1">
                        <Star
                          size={12}
                          className="fill-yellow-500 stroke-yellow-500"
                        />

                        <span className="text-xs font-semibold text-yellow-500">
                          {gig?.ratingAverage}
                        </span>

                        <span className="text-xs text-gray-500">
                          ({gig?.ratingCount})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NavbarLeftPopoverFavoriteGig;
