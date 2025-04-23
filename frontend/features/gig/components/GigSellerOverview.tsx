import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import useSWR from "swr";
import GigSellerRank from "./GigSellerRank";

const GigSellerOverview = ({ gig }: { gig: GigDto }) => {
  const { freelancer } = gig;

  const { data, error, isLoading, isValidating } = useSWR(
    `/freelancer/profile/${freelancer.email}`,
    (url: string) => axiosInstanceV1.get(url).then((res) => res.data),
  );

  if (isLoading || isValidating) {
    return <div>Loading</div>;
  }

  const date = new Date(data?.createdAt);
  const memberSince = `${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`;
  const languages = data?.freelancersLanguages;

  return (
    <div>
      <div className="my-4 w-full space-y-6 rounded-sm border p-4">
        <GigSellerRank gig={gig} />

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <p className="font-semibold">From</p>
            <p>{data?.country}</p>
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
          <p className="text-wrap">{data?.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default GigSellerOverview;
