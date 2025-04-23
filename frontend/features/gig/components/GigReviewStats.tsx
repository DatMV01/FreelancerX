import { GigDto } from "@/dto/dto.type.";
import { getOrderById } from "@/features/order/order.api";
import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { getGigRatingCount } from "../gig.api";

const ratings = [
  { rating: 5, count: 307 },
  { rating: 4, count: 100 },
  { rating: 3, count: 50 },
  { rating: 2, count: 35 },
  { rating: 1, count: 10 },
];

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
        <div className="mx-2 h-2 overflow-hidden rounded-lg bg-gray-200">
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

const fillReviewData = (reviewData: any) => {
  // Tạo danh sách với tất cả các rating từ 1 đến 5
  const allRatings = [1, 2, 3, 4, 5];

  // Tạo đối tượng với rating là key và count là value, mặc định count là 0
  const reviewMap = allRatings.reduce(
    (acc, rating) => {
      acc[rating] = 0; // Đặt count = 0 cho tất cả các rating
      return acc;
    },
    {} as Record<number, number>,
  );

  // Cập nhật reviewMap với dữ liệu trả về
  reviewData.forEach((review: any) => {
    reviewMap[review.rating] = review.count;
  });

  // Chuyển reviewMap về dạng mảng để dễ dàng sử dụng
  const result = Object.keys(reviewMap).map((key) => ({
    rating: Number(key),
    count: reviewMap[Number(key)],
  }));

  return result;
};

const GigReviewStats = ({ gig }: { gig: any }) => {
  if (!gig || !gig?.id) return;

  const gigId = gig?.id;

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/reviews/gig/${gigId}/rating-count`,
    () => getGigRatingCount(gigId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  if (isLoading || isValidating) {
    return <div>Loading</div>;
  }

  const totalCount = data?.reduce(
    (sum: any, item: any) => sum + Number(item.count),
    0,
  );

  const totalRating = data?.reduce(
    (sum: any, item: any) => sum + Number(item.count) * Number(item.rating),
    0,
  );

  const ratingAverage = totalRating / totalCount;

  const fillReview = data && fillReviewData(data);

  return (
    <div id="gig-reviews">
      <div className="text-2xl font-bold">Reviews </div>

      <div className="rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">
            {totalCount || gig.ratingCount} reviews for this Gig
          </p>

          <div className="mt-1 flex items-center text-black">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < ratingAverage || gig.ratingAverage
                    ? "fill-yellow-500 text-yellow-500"
                    : "fill-none text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-lg font-semibold">
              {gig.ratingAverage}
            </span>
          </div>
        </div>

        <table className="mt-4 space-y-2">
          <tbody>
            {fillReview?.map(
              ({ rating, count }: { rating: number; count: number }) => (
                <RatingBar
                  key={rating}
                  stars={rating}
                  count={count}
                  total={totalCount || gig.ratingCount}
                />
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GigReviewStats;
