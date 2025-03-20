import { faker } from "@faker-js/faker";
import { LoremIpsum } from "lorem-ipsum";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, Divider, Tooltip } from "@mui/material";
import { Star, Repeat } from "lucide-react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { GigDto } from "@/dto/gig.dto";

interface Review {
  user: {
    username: string;
    avatar: string;
    country: string;
    repeatClient: boolean;
  };
  content: string;
  replies: string;
}

const GigSellerResponse = ({ comment, ...props }: { comment: any }) => {
  const { user, content, replies } = comment;
  const { username, avatar, country, repeatClient } = user;
  return (
    <div className="w-full rounded-lg border p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-3">
        <Avatar src={avatar} alt="User" />

        <div>
          <div className="flex space-x-2">
            <p className="font-semibold">{username}</p>
            {repeatClient && (
              <div className="flex items-center justify-center space-x-1">
                <Repeat size={16} /> <strong>Repeat Client</strong>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">{country}</p>
        </div>
      </div>
      <Divider />
      <div className="mt-2 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-500 stroke-none" />
        ))}
        <span className="text-sm text-gray-500"> • 4 days ago</span>
      </div>

      <div className="mt-2 p-0 text-gray-700">
        <p>{content}</p>

        <div className="my-3 flex gap-4 text-sm text-gray-600">
          <span>
            <strong>$1,500-$2,000</strong> <br /> <span>Price</span>
          </span>
          <Divider orientation="vertical" flexItem />
          <span>
            <strong>2 weeks</strong>
            <br /> <span>Duration</span>
          </span>
        </div>
      </div>

      <Divider />

      <Accordion sx={{ boxShadow: "none", border: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ padding: 0, margin: 0 }}
        >
          <div className="flex items-center space-x-2">
            <Avatar
              src="/user-avatar.jpg"
              alt="User"
              sx={{ height: 30, width: 30 }}
            />
            <strong className="text-[15px]">Seller's Response</strong>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingLeft: "50px" }}>
          {replies}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const GigComments = ({ gig }: { gig: GigDto }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  useEffect(() => {
    const initialReviews = Array.from({ length: 10 }, () => comment());
    setReviews(initialReviews as any);
  }, []);

  const comment = () => {
    return {
      user: {
        username: faker.internet.username(),
        avatar: faker.image.avatar(),
        country: faker.location.country(),
        repeatClient: faker.datatype.boolean(0.5),
      },
      content: lorem.generateSentences(7),
      replies: lorem.generateSentences(3),
    };
  };

  const loadMoreReviews = () => {
    const newReviews = Array.from({ length: 5 }, () => comment());
    setReviews((prevReviews) => [...prevReviews, ...newReviews]);
  };

  return (
    <div className="my-4 space-y-4">
      <div className="space-y-4">
        {reviews &&
          reviews.map((_) => (
            <GigSellerResponse key={faker.number.bigInt()} comment={_} />
          ))}
      </div>
      <button
        className="rounded-md border-[1px] border-black bg-white p-2 font-bold text-black"
        onClick={loadMoreReviews}
      >
        Show More Reviews
      </button>
    </div>
  );
};

export default GigComments;
