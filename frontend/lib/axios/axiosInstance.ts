"use client";

import axios from "axios";
import { selectAccessToken } from "../redux/features/auth/authSlice";
import { getClientStore } from "../redux/store";
import { getSession } from "next-auth/react";
import { useAppSelector } from "../redux/hooks";

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
    let accessToken: string | undefined | null;

    const session = await getSession();
    accessToken = session?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
 
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
};

const axiosErrorHandler = (error: any) => {
  console.error("Axios Request Error:", error);
  return Promise.reject(error);
};

// Add a request interceptor
axiosInstanceV1.interceptors.request.use(axiosConfig, axiosErrorHandler);
axiosInstanceV2.interceptors.request.use(axiosConfig, axiosErrorHandler);

// Add a response interceptor
axiosInstanceV1.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstanceV2.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);
