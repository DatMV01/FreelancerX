"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollableDiv from "@/components/ScrollableDiv";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findCategoryBySlug } from "@/data/data";
import { recommendsWebDevelopmentData } from "@/data/recommend";
import { useFilterParams } from "@/hooks/useFilterParams";
import { Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { exploreMoreWebsiteDevelopmentServiceData } from "./data/mockData.";
import ExploreMoreServiceSection from "./ExploreMoreServiceSection";
import { FilterBar } from "./FilterBar";
import GigLitstingSection from "./GigLitstingSection";
import { PageMetaDto } from "@/dto/base/pagination";
import useSWR from "swr";
import { fetchGigs } from "../gig/gig.api";
import CircularProgressCenter from "@/components/CircularProgressCenter";

const DescriptionSection = ({ category }: any) => {
  if (!category) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold">{category.title}</h1>
      <p className="font-medium text-[#74767E]">{category.description}</p>
    </div>
  );
};

const RecommendSection = ({
  recommendsCategoryData,
}: {
  recommendsCategoryData: any;
}) => {
  if (!recommendsCategoryData) return;

  return (
    <ScrollableDiv
      dragAndScroll
      showScrollBar
      showLeftRightButton
      buttonOverlay={false}
    >
      {recommendsCategoryData.map((m: any, index: number) => (
        <Link href={m.url} key={index}>
          <div className="bg-muted/50 mr-4 flex items-center justify-center gap-x-2 rounded-full px-8 py-4 font-bold shadow hover:fill-green-600 hover:text-green-600">
            <img alt="logo" className="h-[30px] w-[30px]" src={m.icon} />

            <span>{m.title}</span>
          </div>
        </Link>
      ))}
    </ScrollableDiv>
  );
};

const ResultAndSortSection = () => {
  const { params, setParam, resetParams, countActiveParams } =
    useFilterParams();

  return (
    <div className="flex justify-end">
      <div className="flex items-center">
        <p className="mr-2">Sort by:</p>
        <Select
          value={params.sortBy || "latest"}
          onValueChange={(val) => setParam("sortBy", val)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            {/* <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const PaginationSection = ({
  pageMetaData,
}: {
  pageMetaData?: Partial<PageMetaDto>;
}) => {
  const { params, setParam } = useFilterParams();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setParam("limit", 50);
    setParam("page", value);
  };

  const page = Number(pageMetaData?.page ?? params.page ?? 1);
  const count = Number(pageMetaData?.pageCount ?? 100);

  return (
    <Pagination
      className="my-8 flex justify-center"
      boundaryCount={3}
      count={count}
      page={page}
      onChange={handleChange}
    />
  );
};

const useFetchGigsByCategory = ({
  page = 1,
  limit = 10,
  filters = "",
  config = {},
}: {
  page: number;
  limit: number;
  filters?: string;
  config?: any;
}) => {
  const key = filters ? [`/gig`, page, limit, filters] : [`/gig`, page, limit];

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    () => fetchGigs({ page, limit, filters }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
      refreshInterval: 0,
      ...config,
    },
  );

  return {
    data,
    isLoading,
    isValidating,
    mutate,
    error,
    key,
  };
};

const SubCategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  if (!Array.isArray(slug) || Array.from(slug).length !== 2) return;

  const [category, subCategory] = slug;

  const _subcategory = subCategory && findCategoryBySlug(subCategory as String);

  const recommendSectionData =
    subCategory === "website-development" ? recommendsWebDevelopmentData : null;

  const exploreMoreServiceData =
    subCategory === "website-development"
      ? exploreMoreWebsiteDevelopmentServiceData
      : null;

  const { params, setParam } = useFilterParams();

  const page = Number(params.page ?? 1);
  const limit = Number(params.pageSize ?? 50);
  const { data, isLoading, isValidating, error, mutate, key } =
    useFetchGigsByCategory({
      page,
      limit,
      filters: `status:ACTIVE`,
    });

  if (isLoading || isValidating) {
    return (
      <div className="flex min-h-screen">
        <CircularProgressCenter fullScreen />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Breadcrumbs />
      <DescriptionSection category={_subcategory} />

      {recommendSectionData && (
        <RecommendSection recommendsCategoryData={recommendSectionData} />
      )}

      <FilterBar />
      <ResultAndSortSection />
      <GigLitstingSection data={data.data} />
      <PaginationSection pageMetaData={data.meta} />

      {exploreMoreServiceData && (
        <ExploreMoreServiceSection
          title={subCategory.replace("-", " ")}
          data={exploreMoreServiceData}
        />
      )}
    </div>
  );
};

export default SubCategoryPage;
