import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const API_URL = "/gig";

export const getGigs = async (): Promise<GigDto[]> => {
  try {
    const response = await axiosInstanceV1.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching gigs:", error);
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
