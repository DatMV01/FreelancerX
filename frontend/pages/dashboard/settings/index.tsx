"use client";

import useSWR from "swr";
import { fakeFetcher } from "@/lib/fakeFetcher";
import { Loader2 } from "lucide-react"; // Import spinner icon từ Lucide
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ReactElement } from "react";

export default function SettingsPage() {
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "orders",
    fakeFetcher,
    {
      revalidateOnFocus: true,
    },
  );

  if (isLoading || isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <span className="ml-4 text-lg text-gray-700">Loading ...</span>
      </div>
    );
  }

  if (error) return <p>Error</p>;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Danh sách đơn hàng</h1>
      <ul className="space-y-2">
        {data &&
          (data as any).map((order: any) => (
            <li
              key={order.id}
              className="flex justify-between rounded border bg-white p-4 shadow-sm"
            >
              <span>{order.name}</span>
              <span className="text-muted-foreground text-sm">
                {order.status}
              </span>
            </li>
          ))}
      </ul>

      <button
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => {
          mutate();
        }}
      >
        Refetch
      </button>
    </div>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
