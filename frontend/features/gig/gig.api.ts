import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1, axiosInstanceV2 } from "@/lib/axios/axiosInstance";
import { GigEntity } from "./gig.entity";
import { buildQueryFromObject } from "@/lib/fitlers/query-utils";
import { GigStatus } from "./gig.types";
type FetchOrderParams = {
  page?: number;
  limit?: number;
  filters?: string;
  fields?: string;
};
const BASE = "/gigs";

export const gigUrl = {
  root: BASE,
  byId: (id: string) => `${BASE}/${id}`,
  bySlug: (slug: string) => `${BASE}/slug/${slug}`,
  favorites: `${BASE}/favorites`,
  favoriteById: (id: string) => `${BASE}/favorites/${id}`,
  reviews: (gigId: string, page: number) =>
    `/reviews/gig/${gigId}?page=${page}&limit=10`,
  ratingCount: (gigId: string) => `/reviews/gig/${gigId}/rating-count`,
  activeGig: (email: string) => {
    const queryStr = buildQueryFromObject({
      page: 1,
      sorts: { createdAt: "DESC", updatedAt: "DESC" },
      pageSize: 50,
      filters: {
        status: [GigStatus.ACTIVE],
        freelancer: {
          email,
        },
      },
    } as any);
    return `${BASE}?${queryStr}`;
  },
};

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
    const response = await axiosInstanceV1.get(BASE, {
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
const fetch = async (url: string, params: FetchOrderParams) => {
  try {
    const response = await axiosInstanceV1.get(url, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        filters: params.filters || "",
        fields: params.fields,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const searchGig = async (queryStr: string) => {
  debugger;
  return axiosInstanceV1.get(`${BASE}/search?${queryStr}`);
};

export const searchGigByTag = async (queryStr: string) => {
  debugger;
  return axiosInstanceV1.get(`${BASE}/search/tag?${queryStr}`);
};

export const fetchGigsV2 = async (queryStr: string) => {
  debugger;
  return axiosInstanceV2.get(`${BASE}?${queryStr}`);
};

export const findUserGigs = async (queryStr: string) => {
  debugger;
  return axiosInstanceV1.get(`${BASE}/me?${queryStr}`);
};


export const fetchFavoritesGigs = async () => {
  const { data } = await axiosInstanceV1.get(gigUrl.favorites);
  return data;
};

export const addFavoriteGig = async (id: string) => {
  const { data } = await axiosInstanceV1.post(gigUrl.favorites, { gigId: id });
  return data;
};

export const removeFavoriteGig = async (id: string) => {
  const { data } = await axiosInstanceV1.delete(gigUrl.favoriteById(id));
  return data;
};

export const getGigById = async (id: string) => {
  const { data } = await axiosInstanceV1.get(gigUrl.byId(id));
  return data;
};

export const getGigBySlug = async (slug: string) =>
  axiosInstanceV1.get(gigUrl.bySlug(slug));

export const createGig = async (
  gig: Omit<GigDto, "id" | "createdAt" | "updatedAt">,
) => {
  const { data } = await axiosInstanceV1.post(gigUrl.root, gig);
  return data;
};

export const updateGig = async (
  id: string,
  gig: Omit<Partial<GigEntity>, "id" | "createdAt" | "updatedAt">,
) => {
  const response = await axiosInstanceV1.patch(gigUrl.byId(id), gig);
  return response;
};

export const deleteGig = async (id: string) =>
  axiosInstanceV1.delete(gigUrl.byId(id));

export const getGigRatingCount = async (id: string) => {
  const { data } = await axiosInstanceV1.get(gigUrl.ratingCount(id));
  return data;
};

export const getGigReviews = async (id: string, page: number) => {
  const { data } = await axiosInstanceV1.get(gigUrl.reviews(id, page));
  return data;
};
