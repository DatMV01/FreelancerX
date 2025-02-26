"use client";

import BreadcrumbCpn from "@/components/breadcrumb";
import { FilterSection } from "@/components/filter_section";
import ScrollableDiv2 from "@/components/scrollable-div-2";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { findCategoryBySlug } from "@/data/data";
import { recommendsWebDevelopmentData } from "@/data/recommend";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const DescriptionSection = (category: any) => {
  return (
    <>
      {category && (
        <div>
          <h1 className="text-3xl font-bold">{category.title}</h1>
          <p className="font-medium text-[#74767E]">{category.description}</p>
        </div>
      )}
    </>
  );
};

const RecommendSection = () => {
  return (
    <ScrollableDiv2>
      {recommendsWebDevelopmentData.map((m: any) => (
        <Link href={m.url}>
          <div className="mr-4 flex items-center justify-center rounded-full bg-slate-50 px-8 py-4 font-bold shadow hover:fill-green-600 hover:text-green-600">
            <span className="relative h-[40px] w-[40px]">
              <Image
                alt="logo"
                src={m.icon}
                fill
                objectFit="cover"
                className=""
              />
            </span>

            <span className="ml-4">{m.title}</span>
          </div>
        </Link>
      ))}
    </ScrollableDiv2>
  );
};

const ResultAndSortSection = () => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      sort: "Best selling",
    },
  });

  const sortWatch = watch("sort");
  useEffect(() => {
    console.log("Name changed:", sortWatch);
  }, [sortWatch]);

  return (
    <div className="flex items-center justify-between">
      <p className="text-[#74767E]">1,500+ resutls</p>
      <div className="flex items-center">
        <p className="mr-2">Sort by:</p>
        <Popover>
          <PopoverTrigger className="flex items-center justify-center rounded-md border-2 p-2 font-bold">
            <span className="mr-2">Recommended</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 11 7"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentFill"
            >
              <path d="M5.464 6.389.839 1.769a.38.38 0 0 1 0-.535l.619-.623a.373.373 0 0 1 .531 0l3.74 3.73L9.47.61a.373.373 0 0 1 .531 0l.619.623a.38.38 0 0 1 0 .535l-4.624 4.62a.373.373 0 0 1-.531 0Z"></path>
            </svg>
          </PopoverTrigger>
          <PopoverContent align="end">
            <div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    {...register("sort")}
                    value="Recommended"
                  />
                  <span>Recommended</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    {...register("sort")}
                    value="Best selling"
                  />
                  <span>Best selling</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    {...register("sort")}
                    value="Newest arrivals"
                  />
                  <span>Newest arrivals</span>
                </label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

const Page = () => {
  const router = useRouter();

  const { category, subcategory, subsubcategory } = router.query;

  const _subcategory = findCategoryBySlug(subcategory as String);

  return (
    <div>
      <BreadcrumbCpn />
      <DescriptionSection category={_subcategory} />
      <RecommendSection />
      <FilterSection  />
      <ResultAndSortSection />
    </div>
  );
};

export default Page;
