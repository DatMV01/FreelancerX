import { GigDto } from "@/dto/gig.dto";
import { Star } from "lucide-react";
import React from "react";

const RatingBar = ({
  stars,
  count,
  total,
}: {
  stars: number;
  count: number;
  total: number;
}) => {
  return (
    <tr>
      <td className="w-14 whitespace-nowrap text-gray-700">{stars} Stars</td>
      <td className="w-full">
        <div className="h-2 overflow-hidden rounded-lg bg-gray-200">
          <div
            className="h-full bg-black"
            style={{ width: `${(count / total) * 100}%` }}
          ></div>
        </div>
      </td>
      <td className="ml-2 text-gray-700">({count})</td>
    </tr>
  );
};

const GigRatings = ({ gig }: { gig: GigDto }) => {
  const ratings = [
    { stars: 5, count: 307 },
    { stars: 4, count: 100 },
    { stars: 3, count: 50 },
    { stars: 2, count: 35 },
    { stars: 1, count: 10 },
  ];

  const totalReviews = ratings.reduce((sum, rating) => sum + rating.count, 0);

  return (
    <div id="gig-reviews">
      <div className="m-4 text-2xl font-bold">Reviews</div>

      <div className="rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            {totalReviews} reviews for this Gig
          </p>

          <div className="mt-1 flex items-center text-black">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-black" />
            ))}
            <span className="ml-2 text-lg font-semibold">5.0</span>
          </div>
        </div>

        <table className="mt-4 space-y-2">
          <tbody>
            {ratings.map(({ stars, count }) => (
              <RatingBar
                key={stars}
                stars={stars}
                count={count}
                total={totalReviews}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GigRatings;
