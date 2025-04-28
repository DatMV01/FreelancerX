import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const API_URL = "/transaction";

export const getWalletByFreelancerId = async (id: string): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/wallet`);
  return response.data;
};

export const getEarningByYear = async (year: number): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/earnings/${year}`);
  return response.data;
};

export const fetchFreelancerTransactions = async ({
  page = 1,
  limit = 20,
  filters = "",
}: {
  page: number;
  limit?: number;
  filters?: string;
}): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/freelancer`, {
    params: {
      page,
      limit,
      filters,
    },
  });
  return response.data;
};
