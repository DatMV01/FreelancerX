import CircularProgressCenter from "@/components/CircularProgressCenter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserRank from "@/features/user/components/UserRank";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

enum FreelancerRankEnum {
  NEW = "NEW",
  LEVEL1 = "LEVEL1",
  LEVEL2 = "LEVEL2",
  LEVEL3 = "LEVEL3",
}

enum FreelancerSkillProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

enum FreelancerLanguageProficiency {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
  FLUENT = "Fluent",
}

interface FreelancerLanguage {
  id: number;
  alpha3: string;
  name: string;
  proficiency: FreelancerLanguageProficiency;
}

interface FreelancerSkill {
  id: number;
  name: string;
  proficiency: FreelancerSkillProficiency;
}

interface FreelancerProfile {
  fullName: string;
  createdAt: string;
  id: string;
  email: string;
  country: string;
  userId: string;
  level: FreelancerRankEnum;
  bio: string;
  avatar: string;
  phone: string;
  freelancersLanguages: FreelancerLanguage[];
  freelancersSkills: FreelancerSkill[];
  reviewCount: number;
  completedOrderCount: number;
  earnings: string;
  withdrawnAmount: string;
  completedRate: string;
  reviews?: {
    id: number;
    username: string;
    rating: number;
    comment: string;
  }[];
  gigs?: {
    id: number;
    title: string;
    description: string;
    price: number;
    deliveryTime: string;
    revisions: number;
    rating: number;
    reviews: number;
    createdAt: string;
    updatedAt: string;
    userId: string;
    freelancerId: string;
    status: string;
  }[];
}

const FreelancerProfile = () => {
  const searchParams = useSearchParams();
  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState<{
    type: "success" | "errror";
    message: string;
  }>();

  const user = useAppSelector(selectUser);

  const dev = false || searchParams.get("dev");
  const { email } = router.query;

  useEffect(() => {
    const fetchFreelancer = async () => {
      if (!email) return;
      try {
        const response = await axiosInstanceV1.get(
          `/freelancer/profile/${email}`,
        );

        debugger;
        console.log(response);

        setFreelancer(response.data);
      } catch (err: any) {
        setMessage({
          type: "errror",
          message: "Freelancer not found",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFreelancer();
    setIsUser(user?.email === email);
  }, [email]);

  return (
    <div className="relative">
      {freelancer && (
        <div>
          {isUser && (
            <div className="my-2 flex justify-end">
              <Button asChild>
                <Link href={`/freelancer/profile/edit/${freelancer.email}`}>
                  Edit profile
                </Link>
              </Button>
            </div>
          )}
          <Card className="rounded-lg p-6 shadow-sm">
            <CardContent className="flex flex-col items-center md:flex-row md:items-start">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-gray-200">
                  <Image
                    src={freelancer.avatar}
                    alt={freelancer.email}
                    layout="fill"
                    objectFit="cover"
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
                  {dev && (
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/8/83/Telegram_2019_Logo.svg"
                        alt="Telegram"
                        width={40}
                        height={40}
                        className="cursor-pointer"
                      />
                    </a>
                  )}
                </div>
              </div>
              <div className="w-full text-center md:ml-6 md:text-left">
                <h2 className="text-2xl font-semibold">
                  {freelancer.fullName}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{freelancer.bio}</p>
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
              Reviews ({freelancer.reviewCount})
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

      {loading && (
        <div className="z-50 flex h-full w-full items-center justify-center">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default FreelancerProfile;
