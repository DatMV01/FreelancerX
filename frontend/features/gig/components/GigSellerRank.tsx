import { FreelancerRankEnum, GigDto } from "@/dto/dto.type.";
import UserAvatar from "@/features/user/components/UserAvatar";
import UserRank from "@/features/user/components/UserRank";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { Rating } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

// "freelancer": {
//         "createdAt": "Fri, 04 Apr 2025 12:58:29 GMT",
//         "id": "062244bb-4507-47ce-8f6b-476af36641eb",
//         "email": "admin@example.com",
//         "country": "Benin",
//         "userId": "84cb62f9-f2cf-489c-97d0-62a49f213c0e",
//         "level": "NEW",
//         "bio": "refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2Y2NjYWRjNS1hNWNkLTQ4ODUtYTFjMC1lMzIxMDc0MmFmYTkiLCJoYXNoIjoiZDE2N2NiOGZhYTExNDQ2Nzc1YTA5OGZmYTA5OWU0NzEzMWZjMmE5NDE0OWRiMDE4YzBiOTJlY2Y1MzlhMDYxNiIsImlhdCI6MTc0Mzc2MjA0MCwiZXhwIjoxNzQ2MzU0MDQwfQ.gfVaDITJdf6jA-2dU1FoSAfy6yC8Yxi96ShW2q8QriE',\n  accessExpires: 1743848440527,",
//         "avatar": "http://localhost:3000/public/images/avartar___Screenshot 2025-01-18 222228-1743771487197-e48890fbb17b6243b463e.png",
//         "phone": "111111111111111",
//         "fullName": "Mai Dat 123",
//         "freelancersLanguages": [
//             {
//                 "id": 18,
//                 "alpha3": "bel",
//                 "name": "Belarusian",
//                 "proficiency": "Intermediate"
//             },
//             {
//                 "id": 19,
//                 "alpha3": "ben",
//                 "name": "Bengali",
//                 "proficiency": "Beginner"
//             }
//         ],
//         "freelancersSkills": [
//             {
//                 "id": 2,
//                 "name": "Full Stack Development",
//                 "proficiency": "Beginner"
//             },
//             {
//                 "id": 11,
//                 "name": "API Development",
//                 "proficiency": "Intermediate"
//             }
//         ],
//         "reviewCount": 0,
//         "completedOrderCount": 0,
//         "completedRate": "0.00"
//     },
//     "slug": "as-your-gig-storefront,-yourtitle-is-the-most-important-place-to-include-keywords-that-buyers-would-likely-use.-1743847762581"
// }

const GigSellerRank = ({ gig }: { gig: GigDto }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [level, setLevel] = useState(FreelancerRankEnum.NEW);

  const [email, setEmail] = useState("email@example.ocm");
  const [displayName, setDisplayName] = useState("Mockup Name");

  const [completedRate, setCompletedRate] = useState(5);
  const [freelancerReviewCount, setFreelancerReviewCount] = useState(0);
  const [gigReviewCount, setGigReviewCount] = useState(0);

  const { freelancer } = gig;
  const { data, error, isLoading } = useSWR(
    `/freelancer/profile/${freelancer.email}`,
    (url: string) => axiosInstanceV1.get(url).then((res) => res.data),
  );

  useEffect(() => {
    if (data) {
      console.log("data", data);

      setAvatarUrl(data?.avatar);
      setLevel(data?.level);
      setDisplayName(data?.displayName);

      setEmail(data?.email);
      setCompletedRate(data?.completedRate);
      setFreelancerReviewCount(data?.reviewCount);
    }
  }, [data]);

  useEffect(() => {
    const { freelancer, reviewCount: gigReviewCount } = gig;

    //   setAvatarUrl(freelancer?.avatar);
    // setLevel(freelancer?.level);
    // setDisplayName(freelancer?.displayName);

    // setEmail(freelancer?.email);
    // setCompletedRate(freelancer?.completedRate);
    // setFreelancerReviewCount(freelancer?.reviewCount);

    setGigReviewCount(gigReviewCount || 0);
  }, []);

  const handleScroll = () => {
    document
      .getElementById("gig-reviews")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="my-2 flex items-center space-x-2">
      <Link
        href={`/freelancer/profile/${email}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <UserAvatar avatarUrl={avatarUrl} fullName={displayName} />
      </Link>

      <div>
        <div className="flex items-center justify-between flex-col">
          <Link
            href={`/freelancer/profile/${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-bold hover:underline"
          >
            {displayName}
          </Link>

          <UserRank rankLevel={level} />
        </div>

        {/* <div className="flex items-center text-yellow-500">
          {completedRate && (
            <>
              <Rating defaultValue={completedRate} precision={1} readOnly />

              <span className="ml-2 text-sm font-semibold text-black">
                {completedRate}
              </span>
            </>
          )}

          <button
            onClick={handleScroll}
            className="ml-1 text-sm text-gray-500 underline"
          >
            ({gigReviewCount} reviews)
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default GigSellerRank;
