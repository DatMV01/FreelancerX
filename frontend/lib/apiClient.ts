import axios from "axios";
import { getSession } from "next-auth/react";

export const axiosInstanceV1 = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
 // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const axiosInstanceV2 = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/v2`,
 // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const axiosConfig = async (config: any) => {
  try {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
};

const axiosErrorHandler = (error: any) => {
  console.error("Axios Request Error:", error);
  return Promise.reject(error);
};

axiosInstanceV1.interceptors.request.use(axiosConfig, axiosErrorHandler);
axiosInstanceV2.interceptors.request.use(axiosConfig, axiosErrorHandler);
