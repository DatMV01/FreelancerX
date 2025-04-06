import { GigDto } from "@/dto/dto.type.";
import { Badge, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import GigSellerRank from "./GigSellerRank";

// "freelancer": {
//   "createdAt": "Fri, 04 Apr 2025 12:58:29 GMT",
//   "id": "062244bb-4507-47ce-8f6b-476af36641eb",
//   "email": "admin@example.com",
//   "country": "Benin",
//   "userId": "84cb62f9-f2cf-489c-97d0-62a49f213c0e",
//   "level": "NEW",
//   "bio": "refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI2Y2NjYWRjNS1hNWNkLTQ4ODUtYTFjMC1lMzIxMDc0MmFmYTkiLCJoYXNoIjoiZDE2N2NiOGZhYTExNDQ2Nzc1YTA5OGZmYTA5OWU0NzEzMWZjMmE5NDE0OWRiMDE4YzBiOTJlY2Y1MzlhMDYxNiIsImlhdCI6MTc0Mzc2MjA0MCwiZXhwIjoxNzQ2MzU0MDQwfQ.gfVaDITJdf6jA-2dU1FoSAfy6yC8Yxi96ShW2q8QriE',\n  accessExpires: 1743848440527,",
//   "avatar": "http://localhost:3000/public/images/avartar___Screenshot 2025-01-18 222228-1743771487197-e48890fbb17b6243b463e.png",
//   "phone": "111111111111111",
//   "fullName": "Mai Dat 123",
//   "freelancersLanguages": [
//       {
//           "id": 18,
//           "alpha3": "bel",
//           "name": "Belarusian",
//           "proficiency": "Intermediate"
//       },
//       {
//           "id": 19,
//           "alpha3": "ben",
//           "name": "Bengali",
//           "proficiency": "Beginner"
//       }
//   ],
//   "freelancersSkills": [
//       {
//           "id": 2,
//           "name": "Full Stack Development",
//           "proficiency": "Beginner"
//       },
//       {
//           "id": 11,
//           "name": "API Development",
//           "proficiency": "Intermediate"
//       }
//   ],
//   "reviewCount": 120,
//   "completedOrderCount": 50,
//   "responseTime": 1,
//   "completedRate": "3.50"
// },

const GigSellerOverview = ({ gig }: { gig: GigDto }) => {
  const [country, setCountry] = useState("");

  const [memberSince, setMemberSince] = useState("");

  const [languages, setLanguages] = useState<
    { name: string; proficiency: string }[]
  >([]);

  const [bio, setBio] = useState("");

  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    const { freelancer } = gig;

    const date = new Date(freelancer.createdAt);
    setMemberSince(
      `${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`,
    );

    setLanguages(freelancer?.freelancersLanguages);

    setBio(freelancer?.bio);

    setCountry(freelancer?.country);

    setResponseTime(freelancer?.responseTime);
  }, []);

  return (
    <div>
      <div className="w-full space-y-6 rounded-lg border bg-white p-6 shadow-xs">
        <GigSellerRank gig={gig} />

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <p className="font-semibold">From</p>
            <p>{country}</p>
          </div>

          <div>
            <p className="font-semibold">Member since</p>
            <p>{memberSince}</p>
          </div>

          <div>
            <p className="font-semibold">Languages</p>

            {languages &&
              languages.map((_: any) => (
                <p>
                  {_.name} - {_.proficiency}
                </p>
              ))}
          </div>
        </div>

        <div className="text-sm text-gray-700">
          <p className="text-wrap">{bio}</p>
        </div>
      </div>

      {/* <div className="mt-4 hidden md:flex">
        <div className="text-gray-700">{about}</div>
      </div>  */}
    </div>
  );
};

export default GigSellerOverview;
