"use client";

import BreadcrumbCategory from "@/components/BreadcrumbCategory";
import { Button } from "@/components/ui/button";
import { GigDto, GigPackage } from "@/dto/dto.type.";
import GigCarousel from "@/features/gig/components/GigCarousel";
import GigComments from "@/features/gig/components/GigComment";
import GigComparePackage from "@/features/gig/components/GigComparePackage";
import GigComparePackage2 from "@/features/gig/components/GigComparePackage2";
import GigDescription from "@/features/gig/components/GigDescription";
import GigFAQ from "@/features/gig/components/GigFAQ";
import GigFavorite from "@/features/gig/components/GigFavorite";
import GigMessagePopover from "@/features/gig/components/GigMessagePopover";
import GigMetaData from "@/features/gig/components/GigMetaData";
import GigPrototype from "@/features/gig/components/GigPrototype";
import GigReviewStats from "@/features/gig/components/GigReviewStats";

import GigSellerOverview from "@/features/gig/components/GigSellerOverview";
import GigSellerPortfolio from "@/features/gig/components/GigSellerPortfolio";
import GigSellerRank from "@/features/gig/components/GigSellerRank";
import { getGigBySlug } from "@/features/gig/gig.api";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import {
  addFavoriteGig,
  removeFavoriteGig,
  selectFavoriteGigs,
  selectFavoriteGigsStatus,
} from "@/lib/redux/features/gigs/gigsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { CircularProgress, Tab, Tabs, Tooltip } from "@mui/material";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  Loader2,
  Pencil,
  RefreshCw,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const BreadcumSection = ({ gig }: { gig: GigDto | null }) => {
  if (!gig) return;

  return (
    <div className="flex justify-between">
      <BreadcrumbCategory
        categoryInfo={{
          category: gig?.category,
          subCategory: gig?.subCategory,
          nestedSubcategory: gig?.nestedSubcategory,
        }}
      />
    </div>
  );
};

const PackageSideBar = ({
  gigId,
  gigPackage,
  packageTitle,
  packageName,
  packagePrice,
  packageDescription,
  packageDelivery,
  packageRevisions,
  packageIncluded,
  continueCb,
}: {
  gigId: string;
  gigPackage: GigPackage;
  packageTitle: string;
  packageName: string;
  packagePrice: string;
  packageDescription: string;
  packageDelivery: string | number;
  packageRevisions: string | number;
  packageIncluded: string[];
  continueCb?: any;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { mode } = router.query;

  const handleScroll = () => {
    document
      .getElementById("compare-packages")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePlaceAnOrder = async () => {
    if (mode) {
      toast.info("Preview mode");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    try {
      setLoading(true);

      const res = await axiosInstanceV1.post("/orders", {
        packageId: gigPackage.id,
        gigId: gigId,
        quantity: 1,
      });

      const { orderId, transactionId, clientSecret, paymentIntentId } =
        res.data;

      console.log(res.data);

      params.set("gigId", gigId);
      params.set("orderId", orderId);
      params.set("transactionId", transactionId);
      params.set("clientSecret", clientSecret);
      params.set("paymentIntentId", paymentIntentId);
    } catch (error) {
    } finally {
      setLoading(false);
    }

    router.push(`/payment/checkout?${params.toString()}`);
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
          <Clock size={18} className="text-orange-500" />
          <span> {packageDelivery}-day delivery</span>
        </p>
        <p className="flex items-center gap-1">
          <RefreshCw size={18} className="text-green-500" />

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

      <button
        className="h-8 cursor-pointer rounded-sm border"
        onClick={handleScroll}
      >
        Compare packages
      </button>

      <button
        onClick={(e) => {
          e.preventDefault();
          handlePlaceAnOrder();
        }}
        className="flex h-8 items-center justify-center space-x-2 rounded-sm border-2 border-green-500 bg-green-500 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={loading}
      >
        {loading && <Loader2 className="animate-spin" size={18} />}
        <span> {loading ? "Processing..." : "Place an order"}</span>
      </button>
    </div>
  );
};

const SideBarContent = ({ gig }: { gig: GigDto | null }) => {
  if (!gig) return;

  const router = useRouter();

  const [value, setValue] = useState(0);
  const user = useAppSelector(selectUser);

  const [
    packageName,
    packageDescription,
    packageDelivery,
    packageRevisions,
    pricePackage,
    ...addtitionalPackages
  ] = gig.pricingPackage || [];

  const a = addtitionalPackages
    .filter((item) => item.basic !== "")
    .map((item) => {
      return item.basic === "x" || item.basic === "Yes"
        ? item.package
        : `${item.package}: ${item.basic}`;
    });

  const b = addtitionalPackages
    .filter((item) => item.standard !== "")
    .map((item) => {
      return item.standard === "x" || item.standard === "Yes"
        ? item.package
        : `${item.package}: ${item.standard}`;
    });

  const c = addtitionalPackages
    .filter((item) => item.premium !== "")
    .map((item) => {
      return item.premium === "x" || item.premium === "Yes"
        ? item.package
        : `${item.package}: ${item.premium}`;
    });

  const basicPackage = gig.packages.find((_) => _.type === "basic");
  const standardPackage = gig.packages.find((_) => _.type === "standard");
  const premiumPackage = gig.packages.find((_) => _.type === "premium");

  const isGigOwner = gig?.freelancer?.email === user?.email;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="sticky top-4 hidden h-fit w-[300px] md:block">
      {isGigOwner && (
        <div className="my-2 flex justify-end">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();

              router.push(`/dashboard/freelancer/gigs/edit/?id=${gig.id}`);
            }}
          >
            <Pencil className="h-4 text-green-500" /> Edit
          </Button>
        </div>
      )}

      <div className="flex h-8 justify-end">
        <GigFavorite gig={gig} />
      </div>

      <div className="rounded-sm border border-gray-200">
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
            gigId={gig?.id}
            gigPackage={basicPackage as any}
            packageTitle="basic"
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
            gigId={gig?.id}
            gigPackage={standardPackage as any}
            packageTitle="standard"
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
            gigId={gig?.id}
            gigPackage={premiumPackage as any}
            packageTitle="premium"
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
  const { title, freelancer } = gig;

  console.log(gig);
  return (
    <div className="min-w-0">
      <p className="min-h-8 text-xl font-semibold">{title}</p>

      <GigSellerRank gig={gig} />

      <GigCarousel gig={gig} className="h-[300px] lg:h-[400px] xl:h-[600px]" />

      <GigDescription gig={gig} />

      {/* <GigMetaData /> */}

      <GigSellerOverview gig={gig} />

      {/* <GigSellerPortfolio /> */}

      {/* <GigComparePackage gig={gig} /> */}

      <GigComparePackage2 gig={gig} />

      <GigFAQ gig={gig} />

      <GigReviewStats gig={gig} />

      <GigComments gig={gig} />

      <div className="sticky bottom-10 z-10">
        <GigMessagePopover freelancer={freelancer} />
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
  const user = useAppSelector(selectUser);

  

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await getGigBySlug(slug as any);

        const { data } = response;

        setGig(data);
      } catch (error) {
        //  alert("Error fetching data:" + error);
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

      {!isLoading && !gig && (
        <div className="flex items-center justify-center">
          Gig does not exitsted
        </div>
      )}

      {!isLoading && gig && (
        <>
          <BreadcumSection gig={gig} />

          <div className="relative flex w-full space-x-4">
            <GigMainContent gig={gig} />
            <SideBarContent gig={gig} />
          </div>

          {/* <ServiceAlsoViewed /> */}
          {/* <BrowsingHistory /> */}
        </>
      )}
    </div>
  );
};

export default GigDetail;
