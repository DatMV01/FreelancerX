import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const API_URL = "/wallets";

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

export const fetchWalletTransaction = async (
  transactionId: string,
): Promise<any> => {
  const response = await axiosInstanceV1.get(
    `${API_URL}/transactions/${transactionId}`,
  );
  return response;
};

export const getEarningsDataByYear = async (year: number): Promise<any> => {
  const response = await axiosInstanceV1.get(`${API_URL}/earnings/${year}`);
  return response;
};



export const approveWithdraw = async (transactionId: string): Promise<any> => {
  const response = await axiosInstanceV1.patch(
    `${API_URL}/withdraw/approve/${transactionId}`,
  );
  return response;
};

export const rejectWithdraw = async (
  transactionId: string,
  reason: string,
): Promise<any> => {
  const response = await axiosInstanceV1.patch(
    `${API_URL}/withdraw/reject/${transactionId}`,
    { reason },
  );
  return response;
};

export const approvePendingEarning = async (
  transactionId: string,
): Promise<any> => {
  const response = await axiosInstanceV1.patch(
    `${API_URL}/earning/approve/${transactionId}`,
  );
  return response;
};