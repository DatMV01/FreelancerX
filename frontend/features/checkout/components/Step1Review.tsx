import { Button } from "@/components/ui/button";
import { GigDto } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { CircularProgress } from "@mui/material";
import { CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useEffect, useState } from "react";

const fetcher = (url: string) =>
  axiosInstanceV1.get(url).then((res) => res.data);

export default function Step1Review({ onNext }: { onNext: () => void }) {
  const searchParams = useSearchParams();
  const gigId = searchParams.get("gigId");
  const packageTitle = searchParams.get("packageTitle");

  const {
    data: gig,
    error,
    isLoading,
  } = useSWR<GigDto>(gigId && packageTitle ? `/gig/${gigId}` : null, fetcher);

  const [packageInfo, setPackageInfo] = useState<{
    gigId: string;
    gigTitle: string;
    packageTitle: string;
    packageName: string;
    packagePrice: string;
    packageDescription: string;
    packageDelivery: string | number;
    packageRevisions: string | number;
    packageIncluded: string[];
  } | null>(null);

  const getPackageInfo = (title: "basic" | "standard" | "premium") => {
    const [
      packageName,
      packageDescription,
      packageDelivery,
      packageRevisions,
      pricePackage,
      ...additionalPackages
    ] = gig?.pricingPackage || [];

    const included = additionalPackages
      .filter((item: any) => item[title] !== "")
      .map((item: any) =>
        item[title] === "x" ? item.package : `${item.package}: ${item[title]}`,
      );

    return {
      gigId: gig!.id,
      gigTitle: gig!.title,
      packageTitle: title,
      packageName: packageName?.[title],
      packagePrice: pricePackage?.[title],
      packageDescription: packageDescription?.[title],
      packageDelivery: packageDelivery?.[title],
      packageRevisions: packageRevisions?.[title],
      packageIncluded: included,
    };
  };

  useEffect(() => {
    if (!gig || !packageTitle) return;
    const validTitles = ["basic", "standard", "premium"];
    if (validTitles.includes(packageTitle)) {
      const info = getPackageInfo(
        packageTitle as "basic" | "standard" | "premium",
      );
      setPackageInfo(info);
    }
  }, [gig, packageTitle]);

  if (!gigId || !packageTitle) {
    return (
      <div className="p-8 text-center text-red-500">
        Missing gigId or packageTitle in URL.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error fetching gig data: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : !packageInfo ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <p className="text-red-500">Package not found.</p>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-2xl font-bold">Review Your Order</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <img
                  src={
                    gig?.images.image1?.url ||
                    gig?.images.image2?.url ||
                    gig?.images.image3?.url
                  }
                  className="h-[200px] w-[200px]"
                />
                <div className="flex max-w-[80%] flex-col">
                  <p className="text-xl">
                    <span className="font-semibold">Gig Title:</span>
                    {packageInfo.gigTitle}
                  </p>
                  <p className="text-xl">
                    <span className="font-semibold">Package Name:</span>
                    {packageInfo.packageName}
                  </p>
                  <p className="text-xl">
                    <span className="font-semibold">Description:</span>
                    {packageInfo.packageDescription}
                  </p>

                  <div className="flex items-center space-x-4 text-gray-500">
                    <p className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{packageInfo.packageDelivery}-day delivery</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <RefreshCw size={16} />
                      <span>{packageInfo.packageRevisions} Revisions</span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-2xl font-bold">${packageInfo.packagePrice}</p>
            </div>

            <div>
              <p className="font-semibold">What's Included:</p>
              <ul className="max-h-[300px] space-y-1 overflow-auto">
                {packageInfo.packageIncluded.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end">
              <Button onClick={onNext}>Continue to Payment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
