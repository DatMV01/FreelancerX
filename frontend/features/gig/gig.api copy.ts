import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1, axiosInstanceV2 } from "@/lib/axios/axiosInstance";

const API_URL = "/gigs";

export const fetchGigs = async ({
  page = 1,
  limit = 10,
  filters = "",
}: {
  page: number;
  limit: number;
  filters: string;
}): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(API_URL, {
      params: {
        page,
        limit,
        filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching gigs:", error);
    throw error;
  }
};

 
export const fetchGigsV2 = async (queryStr: string): Promise<any> => {
  const response = await axiosInstanceV2.get(`${API_URL}?${queryStr}`);
  return response;
};

export const fetchFavoritesGigs = async (): Promise<GigDto[]> => {
  try {
    const response = await axiosInstanceV1.get(`${API_URL}/favorites`);
    return response.data;
  } catch (error) {
    console.error("fetchFavoritesGigs", JSON.stringify(error));
    throw error;
  }
};

export const addFavoriteGig = async (id: string): Promise<GigDto> => {
  try {
    const response = await axiosInstanceV1.post(`${API_URL}/favorites`, {
      gigId: id,
    });
    return response.data;
  } catch (error) {
    console.error("addFavoriteGig", JSON.stringify(error));
    throw error;
  }
};

export const removeFavoriteGig = async (id: string): Promise<GigDto> => {
  try {
    const response = await axiosInstanceV1.delete(`${API_URL}/favorites/${id}`);
    return response.data;
  } catch (error) {
    console.error("fetchFavoritesGigs", JSON.stringify(error));
    throw error;
  }
};

export const getGigById = async (id: string): Promise<GigDto> => {
  try {
    const response = await axiosInstanceV1.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gig by id:", error);
    throw error;
  }
};

export const getGigBySlug = async (slug: string): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/slug/${slug}`);
  return response;
};

export const createGig = async (
  gig: Omit<GigDto, "id" | "createdAt" | "updatedAt">,
): Promise<GigDto> => {
  try {
    const response = await axiosInstanceV1.post(API_URL, gig);
    return response.data;
  } catch (error) {
    console.error("Error creating gig:", error);
    throw error;
  }
};

export const updateGig = async (
  id: string,
  gig: Omit<GigDto, "id" | "createdAt" | "updatedAt">,
): Promise<GigDto> => {
  try {
    const response = await axiosInstanceV1.put(`${API_URL}/${id}`, gig);
    return response.data;
  } catch (error) {
    console.error("Error updating gig:", error);
    throw error;
  }
};

export const deleteGig = async (id: string): Promise<void> => {
  try {
    await axiosInstanceV1.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting gig:", error);
    throw error;
  }
};

export const getGigRatingCount = async (id: string): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(
      `/reviews/gig/${id}/rating-count`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching getGigRatingCount by id:", error);
    throw error;
  }
};

export const getGigReviews = async (id: string, page: number): Promise<any> => {
  try {
    const response = await axiosInstanceV1.get(
      `/reviews/gig/${id}?page=${page}&limit=10`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching getGigReviews by id:", error);
    throw error;
  }
};
