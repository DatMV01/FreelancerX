"use client";

import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import OrdersManageTable from "@/features/order/components/OrdersManageTable";
import { ActorType } from "@/features/order/dto";
import {
  defaulFetchOrdersByAdminQuery,
  useGetOrdersByAdmin,
} from "@/features/order/hooks/useGetOrdersByAdmin";
import { fetchOrdersByAdmin } from "@/features/order/order.api";
import { OrderEntity } from "@/features/order/order.entity";
import { useFetchByQuery } from "@/hooks/useFetch";
import { defaulFetchQuery, useQuerySync } from "@/hooks/useQuerySync";
import { ReactElement } from "react";

function AdminOrdersPage() {
  const { query, queryString, url, setQuery, removeQuery, resetQuery } =
    useQuerySync<OrderEntity>(defaulFetchQuery);

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useFetchByQuery({
    queryString,
    fetcherFn: fetchOrdersByAdmin,
    key: url,
  });

  return (
    <OrdersManageTable
      response={response}
      isLoading={isLoading || isValidating}
      error={error}
      mutate={mutate}
      actorType={ActorType.ADMIN}
    />
  );
}

AdminOrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default AdminOrdersPage;
