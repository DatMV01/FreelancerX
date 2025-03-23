"use client";

import { CircularProgress, Tooltip } from "@mui/material";
import React, { useEffect } from "react";

import { Divider, Tab, Tabs } from "@mui/material";
import { CheckCircle, Clock, Heart, RefreshCw } from "lucide-react";
import { useState } from "react";

import { GigDto } from "@/dto/gig.dto";
import GigCarousel from "@/features/gig/components/GigCarousel";
import GigComments from "@/features/gig/components/GigComment";
import GigComparePackage from "@/features/gig/components/GigComparePackage";
import GigDescription from "@/features/gig/components/GigDescription";
import GigFAQ from "@/features/gig/components/GigFAQ";
import GigMessagePopover from "@/features/gig/components/GigMessagePopover";
import GigMetaData from "@/features/gig/components/GigMetaData";
import GigRatings from "@/features/gig/components/GigReviews";
import GigSellerOverview from "@/features/gig/components/GigSellerOverview";
import GigSellerPortfolio from "@/features/gig/components/GigSellerPortfolio";
import GigSellerRank from "@/features/gig/components/GigSellerRank";
import axiosInstance from "@/lib/apiClient";
import { useRouter } from "next/router";
import BreadcrumbCategory from "@/components/BreadcrumbCategory";
import GigPrototype from "@/features/gig/components/GigPrototype";

const BreadcumSection = ({ gig }: { gig: GigDto | null }) => {
  if (!gig) return;

  return (
    <div className="flex justify-between">
      <BreadcrumbCategory
        categoryInfo={{
          category: gig?.category || "",
          subcategory: gig?.subCategory || "",
          subsubcategory: gig?.nestedSubcategory || "",
        }}
      />
    </div>
  );
};

const PackageSideBar = ({
  packageName,
  packagePrice,
  packageDescription,
  packageDelivery,
  packageRevisions,
  packageIncluded,
}: {
  packageName: string;
  packagePrice: string;
  packageDescription: string;
  packageDelivery: string | number;
  packageRevisions: string | number;
  packageIncluded: string[];
}) => {
  const handleScroll = () => {
    document
      .getElementById("compare-packages")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="my-4 flex w-full flex-col space-y-2 px-2">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold">{packageName}</p>
        <p className="text-2xl font-bold">${packagePrice}</p>
      </div>

      <div className="flex items-center text-base text-gray-600">
        {packageDescription}
      </div>

      <div className="flex items-center space-x-4 text-gray-500">
        <p className="flex items-center gap-1">
          <Clock size={16} />
          <span> {packageDelivery}-day delivery</span>
        </p>
        <p className="flex items-center gap-1">
          <RefreshCw size={16} />
          <span> {packageRevisions} Revisions</span>
        </p>
      </div>

      <div className=" ">
        <p className="font-semibold">What's Included:</p>
        <ul className="max-h-[300px] overflow-auto">
          {packageIncluded.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} /> {item}
            </li>
          ))}
        </ul>
      </div>

      <button className="h-8 rounded-sm border-2 border-green-500 bg-green-500 text-white hover:bg-green-600">
        Continue
      </button>
      <button className="h-8 rounded-sm border" onClick={handleScroll}>
        Compare packages
      </button>
    </div>
  );
};

const SideBarContent = ({ gig }: { gig: GigDto | null }) => {
  if (!gig) return;

  const [value, setValue] = useState(0);

  const [
    packageName,
    packageDescription,
    packageDelivery,
    packageRevisions,
    pricePackage,
    ...addtitionalPackages
  ] = gig.pricing || [];

  const a = addtitionalPackages
    .filter((item) => item.basic !== "")
    .map((item) => {
      return item.basic === "x"
        ? item.package
        : `${item.package}: ${item.basic}`;
    });

  const b = addtitionalPackages
    .filter((item) => item.standard !== "")
    .map((item) => {
      return item.standard === "x"
        ? item.package
        : `${item.package}: ${item.standard}`;
    });

  const c = addtitionalPackages
    .filter((item) => item.premium !== "")
    .map((item) => {
      return item.premium === "x"
        ? item.package
        : `${item.package}: ${item.premium}`;
    });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const saveToListHandle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
  };

  return (
    <div className="sticky top-4 hidden h-fit w-[300px] md:block">
      <div className="flex h-8 justify-end">
        <Tooltip title="Save to list" placement="top">
          <button
            className="flex items-center justify-center rounded-full bg-transparent"
            onClick={(e) => saveToListHandle(e)}
          >
            <Heart className="fill-[#b5b6ba] stroke-none" />
          </button>
        </Tooltip>

        <Tooltip title="Save to list" placement="top">
          <button
            className="flex items-center justify-center rounded-full bg-transparent"
            onClick={(e) => saveToListHandle(e)}
          >
            <Heart className="fill-red-500 stroke-none" />
          </button>
        </Tooltip>
      </div>

      <div className="rounded-sm border border-gray-500">
        <Tabs
          allowScrollButtonsMobile
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
          sx={{
            borderBottom: "1px solid oklch(0.551 0.027 264.364)",
            padding: "2px",
            maxWidth: "100%",
            overflowX: "auto",
            "& .MuiTabs-flexContainer": {
              flexWrap: "nowrap",
            },
          }}
          TabIndicatorProps={{
            sx: { backgroundColor: "oklch(0.551 0.027 264.364)" },
          }}
          centered
        >
          <Tab label="Basic" />
          <Tab label="Standard" />
          <Tab label="Premium" />
        </Tabs>

        {value == 0 && (
          <PackageSideBar
            packageName={packageName?.basic}
            packagePrice={pricePackage?.basic}
            packageDescription={packageDescription?.basic}
            packageDelivery={packageDelivery.basic}
            packageRevisions={packageRevisions.basic}
            packageIncluded={a}
          />
        )}

        {value == 1 && (
          <PackageSideBar
            packageName={packageName?.standard}
            packagePrice={pricePackage?.standard}
            packageDescription={packageDescription?.standard}
            packageDelivery={packageDelivery.standard}
            packageRevisions={packageRevisions.standard}
            packageIncluded={b}
          />
        )}

        {value == 2 && (
          <PackageSideBar
            packageName={packageName?.premium}
            packagePrice={pricePackage?.premium}
            packageDescription={packageDescription?.premium}
            packageDelivery={packageDelivery.premium}
            packageRevisions={packageRevisions.premium}
            packageIncluded={c}
          />
        )}
      </div>
    </div>
  );
};

const ServiceAlsoViewed = () => {
  return (
    <div className="my-8">
      <p className="text-xl font-bold">
        People Who Viewed This Service Also Viewed
      </p>
    </div>
  );
};

const BrowsingHistory = () => {
  return (
    <div className="my-8">
      <p className="text-xl font-bold">Browsing History</p>
    </div>
  );
};

const GigMainContent = ({ gig }: { gig: GigDto | null }) => {
  if (!gig) return;

  const router = useRouter();
  const { user_id, gig_id } = router.query;
  const { title, seller } = gig;

  return (
    <div className="min-w-0">
      <p className="min-h-8 text-xl font-semibold">{title}</p>

      <GigSellerRank gig={gig} />

      <GigCarousel className="h-[600px]" />

      <GigDescription gig={gig} />

      {false && <GigMetaData />}

      <GigSellerOverview gig={gig} />

      {false && <GigSellerPortfolio />}

      <GigComparePackage gig={gig} />

      <GigFAQ gig={gig} />

      <GigRatings gig={gig} />

      <GigComments gig={gig} />

      <div className="sticky bottom-10 z-10">
        <GigMessagePopover sellerName="abc" />
      </div>
    </div>
  );
};

const GigDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  if (slug === "demo-1234566789") {
    return <GigPrototype />;
  }

  const [isLoading, setLoading] = useState(false);
  const [gig, setGig] = useState<GigDto | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        const response = await axiosInstance.get(`/gig/slug/${slug}`);
        const { data } = response;

        console.log(response.data);

        setGig(data);
      } catch (error) {
        alert("Error fetching data:" + error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  return (
    <div className="relative min-h-[100vh] w-full">
      {isLoading && !gig && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}

      {!isLoading && gig && (
        <>
          <BreadcumSection gig={gig} />

          <div className="relative flex w-full space-x-4">
            <GigMainContent gig={gig} />
            <SideBarContent gig={gig} />
          </div>

          {false && <ServiceAlsoViewed />}
          {false && <BrowsingHistory />}
        </>
      )}
    </div>
  );
};

export default GigDetail;
