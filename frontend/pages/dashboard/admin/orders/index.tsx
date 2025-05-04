"use client";

import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import OrdersManageTable from "@/features/order/components/OrdersManageTable";
import {
  ActorType
} from "@/features/order/dto";
import {
  defaulFetchOrdersByAdminQuery,
  useGetOrdersByAdmin,
} from "@/features/order/hooks/useGetOrdersByAdmin";
import { OrderEntity } from "@/features/order/order.entity";
import { useQuerySync } from "@/hooks/useQuerySync";
import { ReactElement } from "react";

function AdminOrdersPage() {
  const { query, queryString, setQuery, removeFilter, resetQuery } =
    useQuerySync<OrderEntity>(defaulFetchOrdersByAdminQuery);

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useGetOrdersByAdmin(queryString);

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
