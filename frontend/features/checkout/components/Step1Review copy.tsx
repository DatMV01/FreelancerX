"use client";

import { Button } from "@/components/ui/button";
import { GigDto, GigPackage } from "@/dto/dto.type.";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { CircularProgress } from "@mui/material";
import { CheckCircle, Clock, DollarSign, RefreshCw, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useEffect, useState } from "react";
import GigCarousel from "@/features/gig/components/GigCarousel";

export default function Step1Review({ onNext }: { onNext: () => void }) {
  const searchParams = useSearchParams();

  const gigId = searchParams.get("gigId");
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
  const transactionStripeId = searchParams.get("transactionStripeId");
  const clientSecret = searchParams.get("clientSecret");
  const paymentIntentId = searchParams.get("paymentIntentId");

  const [message, setMessage] = useState<{
    type: "success" | "errror";
    message: string;
  }>();

  const [order, setOrder] = useState<any>();
  const [gig, setGig] = useState<GigDto | undefined>();
  const [packageInfo, setPackageInfo] = useState<GigPackage | undefined>();
  const [allFeatures, setAllFeatures] = useState<string[]>([]);

  const { data, error, isLoading } = useSWR(
    orderId ? `/orders/checkout/${orderId}` : null,
    (url: string) => axiosInstanceV1.get(url).then((res) => res.data),
  );

  const {
    data: data2,
    error: error2,
    isLoading: isLoading2,
  } = useSWR<GigDto>(orderId ? `/gig/${gigId}` : null, (url: string) =>
    axiosInstanceV1.get(url).then((res) => res.data),
  );

  useEffect(() => {
    data && setOrder(data);
  }, [orderId, data]);

  useEffect(() => {
    data2 && setGig(data2);
  }, [, gigId, data2]);

  useEffect(() => {
    if (error) {
      setMessage({
        type: "errror",
        message: "Order not found",
      });
    } else if (error2) {
      setMessage({
        type: "errror",
        message: "Gig not found",
      });
    }
  }, [error, error2]);

  // useEffect(() => {
  //   const getPackageInfo = async () => {
  //     const packageInfo = gig?.packages.find(
  //       (_: GigPackage) => _.id === packageId,
  //     );

  //     if (packageInfo) {
  //       const allFeatures = Array.from(
  //         new Set(packageInfo.features.map((f) => f.package)),
  //       );

  //       console.log(packageInfo);

  //       setPackageInfo(packageInfo);
  //       setAllFeatures(allFeatures);
  //     } else {
  //       setMessage({
  //         type: "errror",
  //         message: "Package not found",
  //       });
  //     }
  //   };

  //   gig && packageId && getPackageInfo();
  // }, [gig, packageId]);

  useEffect(() => {
    const getPackageInfo = async () => {
      const packageInfo = order.snapshot.package;
      if (packageInfo) {
        const allFeatures = Array.from(
          new Set(packageInfo.features.map((f: any) => f.package)),
        ) as any;

        setPackageInfo(packageInfo);
        setAllFeatures(allFeatures);
      } else {
        setMessage({
          type: "errror",
          message: "Package not found",
        });
      }
    };

    order && getPackageInfo();
  }, [order]);

  const getValue = (pkg: GigPackage, feature: string) => {
    const found = pkg.features.find((f) => f.package === feature);
    if (found?.value) {
      if (found.value === "Yes") {
        return <CheckCircle className="text-green-500" size={18} />;
      }
      return found.value;
    }
    return <X color="red" size={18} />;
  };

  return (
    <div className="w-full">
      {isLoading ||
        (isLoading2 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <CircularProgress />
          </div>
        ))}

      {order && packageInfo && gig && (
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-xl">
              <span className="mr-2 font-semibold">OrderNo:</span>
              #{order.id.split("-")[4]}
            </p>
          </div>

          <div className="flex space-x-2">
            <GigCarousel gig={gig} className="h-[300px] w-[400px]" />

            <div className="flex flex-col">
              <p className="text-xl">
                <span className="mr-2 font-semibold">Gig:</span>
                {gig.title}
              </p>
              <p className="text-xl">
                <span className="mr-2 font-semibold">Package:</span>
                {packageInfo.title}
              </p>
              <p className="text-xl">
                <span className="mr-2 font-semibold">Description:</span>
                {packageInfo.description}
              </p>
              <p className="text-xl">
                <span className="mr-2 font-semibold">Price:</span>$
                {packageInfo.price}
              </p>
            </div>
          </div>

          <div className="overflow-auto rounded-xl border border-gray-200 shadow-md">
            <table className="min-w-full table-fixed border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="w-1/2 px-4 py-2">Features</th>

                  <th
                    key={packageInfo.type}
                    className="w-1/2 border px-4 py-2 text-center capitalize"
                  >
                    {packageInfo.title}
                  </th>
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature) => (
                  <tr key={feature} className="border-t">
                    <td className="px-4 py-2 font-medium">{feature}</td>
                    <td key={packageInfo.type} className="border px-4 py-2">
                      <span className="flex items-center justify-center">
                        {getValue(packageInfo, feature)}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="border-t bg-gray-50 font-semibold">
                  <td className="px-4 py-2">
                    <span className="flex items-center space-x-1">
                      <RefreshCw size={18} className="text-green-500" />
                      <span>Revision</span>
                    </span>
                  </td>
                  <td key={packageInfo.type} className="px-4 py-2 text-center">
                    {packageInfo.revisions}
                  </td>
                </tr>
                <tr className="border-t bg-gray-50 font-semibold">
                  <td className="px-4 py-2">
                    <span className="flex items-center space-x-1">
                      <Clock size={18} className="text-orange-500" />
                      <span>Delivery (Days)</span>
                    </span>
                  </td>
                  <td key={packageInfo.type} className="px-4 py-2 text-center">
                    {packageInfo.deliveryTime}
                  </td>
                </tr>
                <tr className="border-t bg-gray-50 font-semibold">
                  <td className="px-4 py-2">
                    <span className="flex items-center space-x-1">
                      <DollarSign size={18} className="text-blue-500" />
                      <span>Price (USD)</span>
                    </span>
                  </td>
                  <td key={packageInfo.type} className="px-4 py-2 text-center">
                    ${packageInfo.price}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end">
            <Button onClick={onNext}>Continue to Payment</Button>
          </div>
        </div>
      )}

      {/* ✅ Success & Error Messages */}
      {message && (
        <p
          className={`mt-2 text-center text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}
        >
          {message.message}
        </p>
      )}
    </div>
  );
}
