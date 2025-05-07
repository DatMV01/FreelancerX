import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const BASE = "/user";

export const userUrl = {
  detail: (id: string) => `${BASE}/${id}`,
  update: (id: string) => `${BASE}/update/${id}`,
  delete: (id: string) => `${BASE}/delete/${id}`,
};

export const getUserById = async (id: string): Promise<any> => {
  const response = await axiosInstanceV1.get(userUrl.detail(id));
  return response;
};

// export const fetchGigs = async ({
//   page = 1,
//   limit = 10,
//   filters = "",
// }: {
//   page: number;
//   limit: number;
//   filters: string;
// }): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.get(API_URL, {
//       params: {
//         page,
//         limit,
//         filters,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching gigs:", error);
//     throw error;
//   }
// };

// export const createGig = async (
//   gig: Omit<GigDto, "id" | "createdAt" | "updatedAt">,
// ): Promise<GigDto> => {
//   try {
//     const response = await axiosInstanceV1.post(API_URL, gig);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating gig:", error);
//     throw error;
//   }
// };

// export const updateGig = async (
//   id: string,
//   gig: Omit<GigDto, "id" | "createdAt" | "updatedAt">,
// ): Promise<GigDto> => {
//   try {
//     const response = await axiosInstanceV1.put(`${API_URL}/${id}`, gig);
//     return response.data;
//   } catch (error) {
//     console.error("Error updating gig:", error);
//     throw error;
//   }
// };

// export const deleteGig = async (id: string): Promise<void> => {
//   try {
//     await axiosInstanceV1.delete(`${API_URL}/${id}`);
//   } catch (error) {
//     console.error("Error deleting gig:", error);
//     throw error;
//   }
// };

// export const getGigRatingCount = async (id: string): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.get(
//       `/reviews/gig/${id}/rating-count`,
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching getGigRatingCount by id:", error);
//     throw error;
//   }
// };

// export const getGigReviews = async (id: string, page: number): Promise<any> => {
//   try {
//     const response = await axiosInstanceV1.get(
//       `/reviews/gig/${id}?page=${page}&limit=10`,
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching getGigReviews by id:", error);
//     throw error;
//   }
// };
