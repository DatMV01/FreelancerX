"use client";

import BreadcrumbCpn from "@/components/breadcrumb";
import ScrollableDiv2 from "@/components/scrollable-div-2";
import { findCategoryBySlug } from "@/data/data";
import { recommendsWebDevelopmentData } from "@/data/recommend";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Page = () => {
  const router = useRouter();

  const { category, subcategory, subsubcategory } = router.query;

  const _subcategory = findCategoryBySlug(subcategory as String);

  return (
    <div>
      <BreadcrumbCpn />

      {_subcategory && (
        <div>
          <h1 className="text-3xl font-bold">{_subcategory.title}</h1>
          <p className="font-medium text-[#74767E]">
            {_subcategory.description}
          </p>
        </div>
      )}

      <ScrollableDiv2   >
        {recommendsWebDevelopmentData.map((m: any) => (
          <Link href={m.url}>
            <div className="mr-4 flex justify-center items-center rounded-full   bg-slate-50 py-4 px-8 font-bold shadow hover:fill-green-600 hover:text-green-600">
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
    </div>
  );
};

export default Page;
