import { GigDto } from "@/dto/gig.dto";
import { stringAvatar } from "@/lib/utils";
import { Avatar } from "@mui/material";
import { Diamond, Star } from "lucide-react";
import Link from "next/link";

const GigSellerRank = ({ gig }: { gig: GigDto }) => {
  const { title, seller } = gig;
  const { firstName, lastName, email, username, avatar } = seller;

  const handleScroll = () => {
    document
      .getElementById("gig-reviews")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className="my-2 flex items-center space-x-2">
        <Link
          href={`/seller/$${seller.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {avatar ? (
            <Avatar
              alt="Remy Sharp"
              src={avatar}
              className="aspect-square"
              sx={{ height: 50, width: 50 }}
            >
              username
            </Avatar>
          ) : (
            <Avatar
              className="h-6 w-6 text-[12px]"
              {...stringAvatar("Mai Dat")}
            />
          )}
        </Link>

        <div className=" ">
          <p className="flex items-center justify-between space-x-2">
            <Link
              href={`/seller/$${seller.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold hover:underline"
            >
              {username || "username"}
            </Link>
            <span className="flex h-[20px] w-fit flex-row items-center rounded-sm bg-yellow-300 px-2 text-xs font-bold">
              <span>Top Rated &nbsp;</span>
              {[...Array(3)].map((_, i) => (
                <Diamond key={i} size={10} fill="black" stroke="none" />
              ))}
            </span>

            <span className="flex h-[20px] w-fit flex-row items-center rounded-sm bg-yellow-300 px-2 text-xs font-bold">
              <span>Level &nbsp;2</span>
              {[...Array(2)].map((_, i) => (
                <Diamond key={i} size={10} fill="black" stroke="none" />
              ))}
              <Diamond
                size={10}
                fill="oklch(0.707 0.022 261.325)"
                stroke="none"
              />
            </span>

            <span className="flex h-[20px] w-fit flex-row items-center rounded-sm bg-yellow-300 px-2 text-xs font-bold">
              <span>Level &nbsp;1</span>
              <Diamond size={10} fill="black" stroke="none" />
              {[...Array(2)].map((_, i) => (
                <Diamond
                  key={i}
                  size={10}
                  fill="oklch(0.707 0.022 261.325)"
                  stroke="none"
                />
              ))}
            </span>
          </p>

          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill="oklch(0.795 0.184 86.047)"
                stroke="none"
              />
            ))}
            <span className="ml-2 text-sm font-semibold text-black">5.0</span>
            <button
              onClick={handleScroll}
              className="ml-1 text-sm text-gray-500 underline"
            >
              (221 reviews)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigSellerRank;
