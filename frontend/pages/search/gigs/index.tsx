"use client";

import GigLitstingSection from "@/features/categories/GigLitstingSection";
import PaginationSection from "@/features/categories/PaginationSection";
import { fetchGigsV2 } from "@/features/gig/gig.api";
import { GigEntity } from "@/features/gig/gig.entity";
import { useFetchByQuery } from "@/hooks/useFetch";
import { useQuerySync } from "@/hooks/useQuerySync";
import { QueryInput } from "@/lib/fitlers/query-utils";
import { useRouter } from "next/router";

export const defaulFetchGigsQuery: QueryInput<GigEntity> = {
  page: 1,
  pageSize: 10,
  sorts: { createdAt: "DESC", updatedAt: "DESC" },
} as any;

export default function SearchGigsPage() {
  const { query, queryString, queryStringDecode, url, setQuery, resetQuery } =
    useQuerySync<GigEntity>({} as any);

  const router = useRouter();
  console.log(query.filters?.tags.keyword);
  const tagKeyword = query?.filters?.tags.keyword;
  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useFetchByQuery({
    queryString: tagKeyword != "" ? queryString : null,
    fetcherFn: fetchGigsV2,
    key: url,
  });

  console.log(response?.data);

  if (!tagKeyword || tagKeyword === "") return <div>No result </div>;

  if (response && response?.data?.length == 0) return <div>No result </div>;

  return (
    <div className="flex flex-col space-y-6">
      {/* <FilterBar />
      <ResultAndSortSection /> */}

      {response?.data && <GigLitstingSection data={response?.data} />}

      <PaginationSection pageMetaData={response?.data?.meta} />
    </div>
  );
}
