import { GigDto } from "@/dto/dto.type.";
import { getFreelancerProfileByEmail } from "@/features/freelancer/freelancer.api";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import GigSellerRank from "./GigSellerRank";

const GigSellerOverview = ({ gig }: { gig: GigDto }) => {
  // const freelancer = gig.freelancer
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

  const date = new Date(freelancer?.createdAt);
  const memberSince = `${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`;
  const languages = freelancer?.freelancersLanguages;
  const skill = freelancer?.freelancersSkills;

  return (
    <div>
      <div className="my-4 w-full space-y-6 rounded-sm border p-4">
        <GigSellerRank gig={gig} />

        <div className="grid grid-cols-4 gap-4 text-sm text-gray-800">
          <div>
            <p className="font-semibold">From</p>
            <p>{freelancer?.country}</p>
          </div>

          <div>
            <p className="font-semibold">Member since</p>
            <p>{memberSince}</p>
          </div>

          <div>
            <p className="font-semibold">Languages</p>
            <div className="flex flex-wrap gap-x-2">
              {languages?.map((_: any) => <p>{_.name}</p>)}
            </div>
          </div>

          <div>
            <p className="font-semibold">Skills</p>
            <div className="flex flex-wrap gap-x-2">
              {skill?.map((_: any) => <p>{_.name}</p>)}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-700">
          <p className="text-wrap">{freelancer?.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default GigSellerOverview;
