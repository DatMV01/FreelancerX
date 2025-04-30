import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const API_URL = "/wallet";

export const getWalletInfo = async (): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/infomation`);
  return response.data;
};

export const requestWithdraw = async (data: any): Promise<any> => {
  const response = await axiosInstanceV1.post(
    `${API_URL}/withdraw/request`,
    data,
  );
  return response;
};

export const getWalletTransactions = async (): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/transactions`);
  return response;
};
