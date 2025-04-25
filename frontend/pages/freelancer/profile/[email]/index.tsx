import CircularProgressCenter from "@/components/CircularProgressCenter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFreelancerProfileByEmail } from "@/features/freelancer/freelancer.api";
import UserRank from "@/features/user/components/UserRank";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

const FreelancerProfile = () => {
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "errror";
    message: string;
  }>();

  const { email } = router.query ?? "";
  const {
    data: freelancer,
    error,
    isLoading,
    isValidating,
  } = useSWR<FreelancerProfile>(
    email ? `/profile/email/${email}` : null,
    () => getFreelancerProfileByEmail(typeof email === "string" ? email : ""),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 300000, // 5 minutes
    },
  );

  if (isLoading || isValidating) {
    return <CircularProgressCenter fullScreen />;
  }

  return (
    <div className="relative">
      {freelancer && (
        <div>
          <Card className="rounded-lg p-6 shadow-sm">
            <CardContent className="flex flex-col items-center md:flex-row md:items-start">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-gray-200">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.email}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="flex space-x-2">
                  <a
                    href={`https://zalo.me/${freelancer.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                      alt="Zalo"
                      width={40}
                      height={40}
                      className="cursor-pointer"
                    />
                  </a>
                  {
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg"
                        alt="Telegram"
                        width={40}
                        height={40}
                        className="cursor-pointer"
                      />
                    </a>
                  }
                </div>
              </div>
              <div className="w-full text-center md:ml-6 md:text-left">
                <h2 className="text-2xl font-semibold">
                  {freelancer.displayName || "Freelancer"}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{freelancer.bio}</p>

                <p className="mt-1 text-sm">
                  <span className="font-bold">From: </span>
                  {freelancer.country}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <UserRank rankLevel={freelancer.level} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Languages</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {freelancer.freelancersLanguages?.map((lang) => (
                <Badge key={lang.id} className="bg-gray-200 text-gray-800">
                  {`${lang.name} - ${lang.proficiency}`}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {freelancer.freelancersSkills?.map((skill) => (
                <Badge key={skill.id} className="bg-gray-300 text-gray-900">
                  {`${skill.name} - ${skill.proficiency}`}
                </Badge>
              ))}
            </div>
          </div>

          {/* My gig */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">
              My gig ({freelancer.gigs?.length || 0})
            </h3>
            <div className="mt-4 space-y-4"></div>
          </div>

          {/* Reviews section */}
          <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">
              Reviews ({freelancer.reviewCount || 0})
            </h3>
            <div className="mt-4 space-y-4">
              {freelancer.reviews?.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border p-4 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{review.username}</h3>
                    <span className="text-yellow-500">
                      {"⭐".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {message && (
        <p
          className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
        >
          {message.message}
        </p>
      )}
    </div>
  );
};

export default FreelancerProfile;
