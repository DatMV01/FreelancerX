"use client";

import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import OrdersManageTable from "@/features/order/components/OrdersManageTable";
import { ActorType } from "@/features/order/dto";
import {
  defaulFetchOrdersByFreelancerQuery,
  useGetOrdersFreelancer,
} from "@/features/order/hooks/useGetOrdersFreelancer";
import { OrderEntity } from "@/features/order/order.entity";
import { useQuerySync } from "@/hooks/useQuerySync";
import { selectFreelancer } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { ReactElement } from "react";

function FreelancerOrdersPage() {
  const freelancer = useAppSelector(selectFreelancer);

  const { query, queryString, setQuery, resetQuery } =
    useQuerySync<OrderEntity>(defaulFetchOrdersByFreelancerQuery);

  const enabled = !!freelancer?.id && !!queryString;

  console.log(queryString);

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useGetOrdersFreelancer(enabled ? queryString : null);

  if (!freelancer) return null;

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
