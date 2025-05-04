"use client";

import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import OrdersManageTable from "@/features/order/components/OrdersManageTable";
import { ActorType } from "@/features/order/dto";
import {
     defaulFetchOrdersByBuyerQuery,
     useGetOrdersByBuyer,
} from "@/features/order/hooks/useGetOrdersByBuyer";
import { OrderEntity } from "@/features/order/order.entity";
import { useQuerySync } from "@/hooks/useQuerySync";
import { ReactElement } from "react";

function BuyerOrdersPage() {
  const { query, queryString, setQuery, removeFilter, resetQuery } =
    useQuerySync<OrderEntity>(defaulFetchOrdersByBuyerQuery);

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useGetOrdersByBuyer(queryString);

  return (
    <OrdersManageTable
      response={response}
      isLoading={isLoading || isValidating}
      error={error}
      mutate={mutate}
      actorType={ActorType.BUYER}
    />
  );
}

BuyerOrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default BuyerOrdersPage;
