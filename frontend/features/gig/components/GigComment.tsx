import { GigDto } from "@/dto/dto.type.";
import { faker } from "@faker-js/faker";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Avatar, Divider, Rating } from "@mui/material";

import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { LoremIpsum } from "lorem-ipsum";
import { Star } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { getGigRatingCount, getGigReviews } from "../gig.api";
import { getUserById } from "@/features/user/user.api";
import {
  getFreelancerById,
  getFreelancerProfileById,
} from "@/features/freelancer/freelancer.api";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GigSellerResponse = ({ comment }: { comment: any }) => {
  const { reviewerId, freelancerId, content, replies } = comment;

  const {
    data: reviewer,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(`/user/${reviewerId}`, () => getUserById(reviewerId), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
    dedupingInterval: 1000000,
  });

  const {
    data: freelancer,
    error: error2,
    isLoading: isLoading2,
    isValidating: isValidating2,
  } = useSWR(
    `/freelancer/${freelancerId}`,
    () => getFreelancerProfileById(freelancerId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 1000000,
    },
  );

  return (
    <div className="w-full rounded-lg border p-4">
      <div className="mb-2 flex items-center gap-3">
        <Avatar alt="User" src={reviewer?.avatar} />

        <div>
          <div className="flex flex-col space-x-2">
            <a
              href={`/buyer/profile/${reviewer?.email}`}
              target="_blank"
              className="font-semibold"
            >
              {reviewer?.fullName}
            </a>

            <p className="text-sm text-gray-500"> {reviewer?.country}</p>
          </div>
          {/* <p className="text-sm text-gray-500">{country}</p> */}
        </div>
      </div>
      <Divider />
      <div className="mt-2 flex items-center gap-1">
        <Rating
          name="half-rating-read"
          defaultValue={comment.rating}
          precision={1}
          readOnly
        />

        <span className="text-sm text-gray-500">
          {format(new Date(comment.createdAt), "dd/MM/yyyy")}
        </span>
      </div>

      <div className="mt-2 p-0 text-gray-700">
        <p>{comment.comment}</p>
      </div>

      <Divider />

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-x-2">
              <Avatar alt="freelancer" src={freelancer?.avatar} />
              <strong>{freelancer?.displayName}'s response</strong>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <span className="ml-[48px]"> {comment.reply}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const GigComments = ({ gig }: { gig: GigDto }) => {
  if (!gig || !gig.id) return null;

  const gigId = gig?.id;

  const [page, setPage] = useState(1);
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/reviews/gig/${gigId}?page=${page}&limit=10`,
    () => getGigReviews(gigId, page),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  if (error) return <div>Error loading reviews</div>;
  if (!data && isValidating) return <div>Loading...</div>;

  const loadMoreAuto = () => {
    if (data.page < data.lastPage && !isValidating) {
      setPage(data.page + 1);
    }
  };

  const loadMoreClick = () => {
    if (data.page < data.lastPage && !isValidating) {
      setPage(data.page + 1);
    }
  };

  const reviews = data.reviews;

  return (
    <div className="my-4 space-y-4">
      <div className="space-y-4">
        {reviews?.map((_: any) => <GigSellerResponse key={_.id} comment={_} />)}
      </div>

      {isValidating && <div>Loading more...</div>}

      <button
        className="rounded-md border-[1px] border-black bg-white p-2 font-bold text-black"
        onClick={loadMoreClick}
      >
        Show More Reviews
      </button>
    </div>
  );
};

export default GigComments;
