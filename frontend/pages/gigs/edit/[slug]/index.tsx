"use client";

import GigAddEdit from "@/components/gig_add_edit";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = async (url: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (await axiosInstanceV1.get(url)).data;
};

export default function EditGig() {
  const router = useRouter();
  const { slug } = router.query;

  const { data, error, isValidating, isLoading } = useSWR(
    slug ? `/gig/slug/${slug}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // Không refetch khi user quay lại tab
      revalidateOnReconnect: false, // Không refetch khi mạng reconnect
      refreshInterval: 0, // Không tự động refresh data
      dedupingInterval: Infinity, // Không fetch lại khi có request trùng
    },
  );

  console.log(data);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <GigAddEdit gigData={data} />;
}
