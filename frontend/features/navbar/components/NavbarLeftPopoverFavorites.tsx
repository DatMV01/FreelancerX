import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { faker } from "@faker-js/faker";
import { Badge, Button, CircularProgress, Divider } from "@mui/material";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const favoriteListings = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Gig số ${i + 1}`,
  seller: `Seller ${i + 1}`,
  timeAdded: `${i + 1} phút trước`,
  thumbnail: faker.image.urlLoremFlickr(),
}));

const NavbarLeftPopoverFavorites = () => {
  const [visibleCount, setVisibleCount] = useState(10);
  const [favorites, setFavorites] = useState(
    favoriteListings.slice(0, visibleCount),
  );
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      const newCount = visibleCount + 10;
      setVisibleCount(newCount);
      setFavorites(favoriteListings.slice(0, newCount));
      setLoading(false);
    }, 2000);
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Badge
          color="success"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "11px",
              height: "21px",
              minWidth: "21px",
              padding: "0px",
            },
            "&": {
              borderRadius: "100%",
            },
            "&:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        >
          <Heart />
        </Badge>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div>
          <div className="flex border-b bg-gray-100 p-3 font-semibold text-gray-700">
            <Heart /> &nbsp; Favorite Listings
          </div>
          <Divider />
          <ScrollArea className="h-[600px] w-full">
            {favorites.length > 0 ? (
              favorites.map((listing) => (
                <div
                  key={listing.id}
                  className="flex cursor-pointer items-center gap-3 border-b p-4 last:border-none hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative h-14 w-14">
                      <Image
                        src={listing.thumbnail}
                        alt={listing.title}
                        fill
                        className="rounded-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{listing.title}</p>
                      <p className="text-xs text-gray-500">
                        by{" "}
                        <span className="font-semibold text-gray-700">
                          {listing.seller}
                        </span>{" "}
                        - <span>{listing.timeAdded}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500">No favorites yet...</div>
            )}
          </ScrollArea>
          {visibleCount < favoriteListings.length && (
            <div className="p-3 text-center">
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                <Button
                  onClick={loadMore}
                  variant="contained"
                  color="success"
                  sx={{ width: "100%" }}
                  size="small"
                >
                  Load more
                </Button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NavbarLeftPopoverFavorites;
