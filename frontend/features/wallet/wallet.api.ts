import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const API_URL = "/wallet";

export const getWalletInfo = async (): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/infomation`);
  return response;
};

export const requestWithdraw = async (data: any): Promise<any> => {
  const response = await axiosInstanceV1.post(
    `${API_URL}/withdraw/request`,
    data,
  );
  return response;
};

export const fetchWalletTransactions = async (
  queryStr: string,
): Promise<any> => {
  const response = await axiosInstanceV1.get(
    `${API_URL}/transactions?${queryStr}`,
  );
  return response;
};

export const getEarningsDataByYear = async (year: number): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/earnings/${year}`);
  return response;
};
