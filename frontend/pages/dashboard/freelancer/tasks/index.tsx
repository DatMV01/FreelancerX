"use client";

import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import OrdersManageTable from "@/features/order/components/OrdersManageTable";
import { ActorType } from "@/features/order/dto";
import {
  defaulFetchOrdersByFreelancerQuery
} from "@/features/order/hooks/useGetOrdersFreelancer";
import { fetchOrdersByFreelancer } from "@/features/order/order.api";
import { OrderEntity } from "@/features/order/order.entity";
import { useFetchByQuery } from "@/hooks/useFetch";
import { useQuerySync } from "@/hooks/useQuerySync";
import { ReactElement } from "react";

function FreelancerOrdersPage() {
  const { query, queryString, url, setQuery, resetQuery } =
    useQuerySync<OrderEntity>(defaulFetchOrdersByFreelancerQuery);

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useFetchByQuery({
    queryString,
    fetcherFn: fetchOrdersByFreelancer,
    key: url,
  });

  return (
    <OrdersManageTable
      response={response}
      isLoading={isLoading || isValidating}
      error={error}
      mutate={mutate}
      actorType={ActorType.FREELANCER}
    />
  );
}

FreelancerOrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default FreelancerOrdersPage;
