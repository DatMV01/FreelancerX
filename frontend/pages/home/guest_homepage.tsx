import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { categories, subCategoriesByCategory } from "@/data/data";
import useGenerateRandomColor from "@/hooks/useGenerateRandomColor";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SearchSection = () => {
  return (
    <div className="flex h-[300px] w-full flex-col items-center justify-between rounded-lg bg-gradient-to-b from-green-900 to-green-500 px-6 py-12">
      <h1 className="text-center text-3xl text-white">
        Scale your professional workforce with <br />
        <span>freelancers</span>
      </h1>

      <form className="relative flex h-[52px] w-full flex-row">
        <input
          placeholder="Search for any service..."
          type="text"
          autoComplete="off"
          style={{ WebkitAppearance: "none" }}
          className="h-[52px] w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-transparent focus:ring-0"
        ></input>

        <button className="absolute right-2 top-1/2 flex h-[40px] w-[40px] -translate-y-1/2 items-center justify-center rounded-lg bg-green-900">
          <div className="fill-white">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentFill"
            >
              <path d="m15.89 14.653-3.793-3.794a.37.37 0 0 0-.266-.109h-.412A6.499 6.499 0 0 0 6.5 0C2.91 0 0 2.91 0 6.5a6.499 6.499 0 0 0 10.75 4.919v.412c0 .1.04.194.11.266l3.793 3.794a.375.375 0 0 0 .531 0l.707-.707a.375.375 0 0 0 0-.53ZM6.5 11.5c-2.763 0-5-2.238-5-5 0-2.763 2.237-5 5-5 2.762 0 5 2.237 5 5 0 2.762-2.238 5-5 5Z"></path>
            </svg>
          </div>
        </button>
      </form>
    </div>
  );
};

const CategoriesSection = () => {
  return (
    <div className="col mt-6 grid grid-cols-3 grid-rows-[repeat(3,_170px)]">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="flex flex-col items-center gap-y-3"
        >
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-2xl border-2">
            <Image
              width="0"
              height="0"
              src={category.icon2}
              alt=" "
              className="h-[40px] w-[40px]"
            ></Image>
          </div>
          <p className="text-center"> {category.title}</p>
        </Link>
      ))}
    </div>
  );
};

const PopularServiceSection = () => {
  return (
    <div className=" ">
      <h2 className="text-2xl text-[#404145]">Popular Service</h2>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-full space-x-4 py-4">
          {subCategoriesByCategory.map((category: any) => {
            return (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <div
                  className={`flex h-[170px] w-[120px] flex-col justify-between rounded-lg bg-gradient-to-b from-green-900 via-green-500 to-green-300 p-1`}
                >
                  <p className="text-wrap text-center text-white">
                    {category.title}
                  </p>

                  <Image
                    className="rounded-lg"
                    alt="Website Development"
                    height={130}
                    width={120}
                    src="/images/website-development.webp"
                    priority
                  />
                </div>
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

const GuestHomePage = () => {
  return (
    <div className="my-4">
      <SearchSection />
      <CategoriesSection />
      <PopularServiceSection />
    </div>
  );
};

export default GuestHomePage;
