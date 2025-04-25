import clsx from "clsx";
import GigCardListingReview from "../gig/components/GigCardListingReview";
import { useRouter } from "next/router";
import { GigDto } from "@/dto/dto.type.";
import { GigCard } from "@/components/gig_card";

const GigLitstingSection = ({ data }: { data: GigDto[] }) => {
  const router = useRouter();
  const { demo } = router.query;

  if (demo) {
    return (
      <div
        className={clsx(
          "mt-4 grid grid-cols-1 gap-4",
          "md:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4",
        )}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <GigCard key={i} />
        ))}
      </div>
    );
  }
  if (data) console.log(data);
  return (
    <div
      className={clsx(
        "mt-4 grid grid-cols-1 gap-4",
        "md:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4",
      )}
    >
      {...data.map((gig) => <GigCardListingReview key={gig.id} gig={gig} />)}
    </div>
  );
};

export default GigLitstingSection;
