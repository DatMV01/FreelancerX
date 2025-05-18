"use client";

import DashboardLayout2 from "@/components/layouts/DashboardLayout2";
import GigsManageTable from "@/features/gig/components/GigsManageTable";
import { fetchGigsV2, findUserGigs } from "@/features/gig/gig.api";
import { GigEntity } from "@/features/gig/gig.entity";
import { defaulFetchGigsQuery } from "@/features/gig/hooks/useGetActiveGigs";
import { ActorType } from "@/features/order/dto";
import { useFetchByQuery } from "@/hooks/useFetch";
import { useQuerySync } from "@/hooks/useQuerySync";

import { ReactElement } from "react";

function FreelancerManageGigsPage() {
  const { query, queryString, url, setQuery, removeQuery, resetQuery } =
    useQuerySync<GigEntity>(defaulFetchGigsQuery);

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useFetchByQuery({
    queryString,
    fetcherFn: findUserGigs,
    key: url,
  });

  return (
    <GigsManageTable
      response={response}
      isLoading={isLoading || isValidating}
      error={error}
      mutate={mutate}
      actorType={ActorType.FREELANCER}
    />
  );
}

FreelancerManageGigsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout2>{page}</DashboardLayout2>;
};

export default FreelancerManageGigsPage;
