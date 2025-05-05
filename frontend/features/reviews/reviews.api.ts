import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const API_URL = "/reviews";

export const replyOrderComment = async (
  reviewId: string,
  replyText: string,
  freelancerId: string,
): Promise<any> => {
  const response = await axiosInstanceV1.patch(`${API_URL}/${reviewId}`, {
    reply: replyText,
    freelancerId: freelancerId,
  });
  return response;
};
