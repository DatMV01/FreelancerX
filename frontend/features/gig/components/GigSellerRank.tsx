import { GigDto } from "@/dto/dto.type.";
import { getFreelancerProfileByEmail } from "@/features/freelancer/freelancer.api";
import UserAvatar from "@/features/user/components/UserAvatar";
import UserRank from "@/features/user/components/UserRank";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const GigSellerRank = ({ gig }: { gig: GigDto }) => {
  const email = gig.freelancer.email;

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
    return <Loader2 className="animate-spin" size={18} />;
  }

  const handleScroll = () => {
    document
      .getElementById("gig-reviews")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const { ratingCount, ratingAverage } = gig;
  return (
    <div className="my-2 flex items-center space-x-2">
      <Link
        href={`/freelancer/profile/${email}`}
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
            href={`/freelancer/profile/${email}`}
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
