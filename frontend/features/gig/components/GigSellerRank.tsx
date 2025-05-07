import { GigDto } from "@/dto/dto.type.";
import UserAvatar from "@/features/user/components/UserAvatar";
import UserRank from "@/features/user/components/UserRank";
import Link from "next/link";

const GigSellerRank = ({
  gig,
  freelancer,
}: {
  gig?: GigDto;
  freelancer: any;
}) => {
  if (!freelancer) {
    return null;
  }

  const handleScroll = () => {
    document
      .getElementById("gig-reviews")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="my-2 flex items-center space-x-2">
      <Link
        href={`/freelancer/profile/${freelancer.email}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <UserAvatar
          avatarUrl={freelancer?.avatar}
          fullName={freelancer?.displayName}
        />
      </Link>

      <div>
        <div className="flex items-center justify-between gap-x-2">
          <Link
            href={`/freelancer/profile/${freelancer?.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-bold hover:underline"
          >
            {freelancer?.displayName}
          </Link>

          <UserRank rankLevel={freelancer?.level} />
        </div>

        <div className="flex items-center text-yellow-500">
          <button
            onClick={handleScroll}
            className="ml-1 text-sm text-gray-500 underline"
          >
            ({gig?.ratingCount} reviews)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GigSellerRank;
