import { GigDto } from "@/dto/dto.type.";
import clsx from "clsx";
import GigCardListingReview from "../gig/components/GigCardListingReview";

const GigLitstingSection = ({ data }: { data: GigDto[] }) => {
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
