"use client";

import BreadcrumbCpn from "@/components/breadcrumb";
import { FilterSection } from "@/components/filter_section";
import { GigCard } from "@/components/gig_card";
import ScrollableDiv2 from "@/components/scrollable-div-2";
import SearchBar from "@/components/searchbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { findCategoryBySlug } from "@/data/data";
import { recommendsWebDevelopmentData } from "@/data/recommend";
import { Pagination } from "@mui/material";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const DescriptionSection = ({ category }: any) => {
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
      {recommendsWebDevelopmentData.map((m: any, index) => (
        <Link href={m.url} key={index}>
          <div className="mr-4 flex items-center justify-center rounded-full bg-slate-50 px-8 py-4 font-bold shadow hover:fill-green-600 hover:text-green-600">
            <span className="relative h-[40px] w-[40px]">
              <Image
                alt="logo"
                src={m.icon}
                fill
                style={{ objectFit: "cover" }}
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

const GigLitstingSection = () => {
  return (
    <div
      // className="grid grid-cols-3"
      className={clsx(
        "mt-4 grid grid-cols-1 gap-4",
        "md:grid-cols-2",
        "lg:grid-cols-3",
      )}
    >
      {Array.from({ length: 30 }, (_, i) => (
        <GigCard key={i} />
      ))}
    </div>
  );
};

const PaginationSection = () => {
  const [page, setPage] = useState(1);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    console.log("Page changed to:", value);
  };

  return (
    <Pagination
      className="my-8 flex justify-center"
      boundaryCount={3}
      count={100}
      page={page}
      onChange={handleChange}
    />
  );
};

const ExploreMore = ({ title = "", ...props }: { title: any }) => {
  const categories = [
    {
      title: "Website Design",
      link: "/categories/graphics-design/website-design",
    },
    {
      title: "SEO",
      link: "/categories/online-marketing/seo-services",
    },
    {
      title: "Website Maintenance",
      link: "/categories/programming-tech/website-maintenance",
    },
    {
      title: "Website Migration",
      link: "/categories/programming-tech/website-maintenance/backup-migration",
    },
    {
      title: "Magento",
      link: "/categories/programming-tech/website-development/magento-development",
    },
    {
      title: "SiteBuilder",
      link: "/categories/programming-tech/website-development/sitebuilder-development",
    },
    {
      title: "Drupal",
      link: "/categories/programming-tech/website-development/drupal-development",
    },
    {
      title: "Front-End Development",
      link: "/categories/programming-tech/front-end-development",
    },
    {
      title: "Back-End Development",
      link: "/categories/programming-tech/back-end-development",
    },
    {
      title: "Full-Stack Development",
      link: "/categories/programming-tech/full-stack-development",
    },
    {
      title: "Mobile Apps",
      link: "/categories/programming-tech/mobile-apps",
    },
    {
      title: "CMS Development",
      link: "/categories/programming-tech/cms-development",
    },
    {
      title: "E-Commerce Development",
      link: "/categories/programming-tech/ecommerce-development",
    },
    {
      title: "AI & Chatbots",
      link: "/categories/programming-tech/ai-chatbots",
    },
    {
      title: "Blockchain & Cryptocurrency",
      link: "/categories/programming-tech/blockchain-cryptocurrency",
    },
    {
      title: "Game Development",
      link: "/categories/programming-tech/game-development",
    },
    {
      title: "Desktop Applications",
      link: "/categories/programming-tech/desktop-applications",
    },
    {
      title: "Software Testing",
      link: "/categories/programming-tech/software-testing",
    },
    {
      title: "Cybersecurity",
      link: "/categories/programming-tech/cybersecurity",
    },
    {
      title: "User Testing",
      link: "/categories/programming-tech/user-testing",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="w-full p-8 text-center text-2xl font-bold">
        Explore More {title} Service
      </h2>

      <div className="flex flex-wrap items-center justify-center">
        {categories.map((_, index) => (
          <Link
            key={index}
            href={_.link}
            className="m-1 w-fit rounded-3xl bg-[#EFEFF0] px-4 py-1 font-medium hover:bg-gray-300"
          >
            {_.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

const Guides = ({ title = "", ...props }: { title: any }) => {
  return (
    <div className="py-4">
      <h2 className="text-base font-bold">Guides related to {title}</h2>
      <p>Not implement</p>
    </div>
  );
};

const Page = () => {
  const router = useRouter();

  const { category, subcategory, subsubcategory } = router.query;

  const _subcategory = subcategory && findCategoryBySlug(subcategory as String);

  return (
    <div>
      <BreadcrumbCpn />
      <DescriptionSection category={_subcategory} />
      <RecommendSection />
      <FilterSection />
      <ResultAndSortSection />
      <GigLitstingSection />
      <PaginationSection />
      <ExploreMore title={"Website Development"} />
      <Guides title={"Website Development"} />
    </div>
  );
};

export default Page;
