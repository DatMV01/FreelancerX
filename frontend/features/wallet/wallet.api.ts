import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

const API_URL = "/wallets";

export const walletUrl = {
  info: `${API_URL}/infomation`,
  requestWithdraw: `${API_URL}/withdraw/request`,
  transactions: (queryStr: string) => `${API_URL}/transactions?${queryStr}`,
  transaction: (id: string) => `${API_URL}/transactions/${id}`,
  earningsByYear: (year: string) => `${API_URL}/earnings/${year}`,
  approveWithdraw: (id: string) => `${API_URL}/withdraw/approve/${id}`,
  rejectWithdraw: (id: string) => `${API_URL}/withdraw/reject/${id}`,
  approveEarning: (id: string) => `${API_URL}/earning/approve/${id}`,
};

export const getWalletInfo = async () => axiosInstanceV1.get(walletUrl.info);

export const requestWithdraw = async (data: any) =>
  axiosInstanceV1.post(walletUrl.requestWithdraw, data);

export const fetchWalletTransactions = async (query: string) =>
  axiosInstanceV1.get(walletUrl.transactions(query));

export const fetchWalletTransaction = async (id: string) =>
  axiosInstanceV1.get(walletUrl.transaction(id));

export const getEarningsDataByYear = async (year: string) =>
  axiosInstanceV1.get(walletUrl.earningsByYear(year));

export const approveWithdraw = async (id: string) =>
  axiosInstanceV1.patch(walletUrl.approveWithdraw(id));

export const rejectWithdraw = async (id: string, reason: string) =>
  axiosInstanceV1.patch(walletUrl.rejectWithdraw(id), { reason });

export const approvePendingEarning = async (id: string) =>
  axiosInstanceV1.patch(walletUrl.approveEarning(id));
