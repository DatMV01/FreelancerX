import { GigDto } from "@/dto/gig.dto";
import { SellerRankStatus } from "@/features/seller/seller.rank.enum";
import UserAvatar from "@/features/user/components/UserAvatar";
import UserRank from "@/features/user/components/UserRank";
import { Rating } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const GigSellerRank = ({ gig }: { gig: GigDto }) => {
  const [avatarUrl, setAvatarUrl] = useState();
  const [rankLevel, setRankLevel] = useState(SellerRankStatus.new);

  const [userName, setUserName] = useState("mock-up-user-name");
  const [fullName, setFullName] = useState("Mockup Name");

  const [reviewRating, setReviewRating] = useState();
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const { seller } = gig;

    setRankLevel(seller?.sellerLevel);
    setFullName(seller?.fullName);
    setReviewRating(seller?.rating);
    setUserName(seller?.email);
  }, []);

  // "createdAt": "Fri, 21 Mar 2025 23:17:08 GMT",
  // "updatedAt": "Sun, 23 Mar 2025 13:17:23 GMT",
  // "id": "67970bfa-44ea-48fd-b41d-46c6b0132067",
  // "sellerLevel": "new",
  // "about": "csdcds a a c xcszcsacascsacxs aasddas",
  // "skills": [
  //     "WordPress"
  // ],
  // "languages": [
  //     "Urdu",
  //     " English",
  //     " French",
  //     " German"
  // ],
  // "rating": "0.00",
  // "completedOrders": 0,
  // "responseTime": 0,
  // "availability": "available",
  // "email": "datmv1111@gmail.com",
  // "username": null,
  // "fullName": "mai dat",
  // "avatar": null,
  // "phoneNumber": null,
  // "status": {
  //     "id": 2,
  //     "name": "PENDING_VERIFICATION"
  // }

  const handleScroll = () => {
    document
      .getElementById("gig-reviews")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="my-2 flex items-center space-x-2">
      <Link
        href={`/seller/profile/${userName}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <UserAvatar avatarUrl={avatarUrl} fullName={fullName} />
      </Link>

      <div>
        <div className="flex items-center justify-between space-x-2">
          <Link
            href={`/seller/profile/${userName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-bold hover:underline"
          >
            {fullName}
          </Link>

          <UserRank rankLevel={rankLevel} />
        </div>

        <div className="flex items-center text-yellow-500">
          {reviewRating && (
            <>
              <Rating defaultValue={reviewRating} precision={0.5} readOnly />

              <span className="ml-2 text-sm font-semibold text-black">
                {reviewRating}
              </span>
            </>
          )}

          <button
            onClick={handleScroll}
            className="ml-1 text-sm text-gray-500 underline"
          >
            ({reviewCount} reviews)
          </button>
        </div>
      </div>
    </div>
  );
};

export default GigSellerRank;
