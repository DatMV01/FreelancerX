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
import { getOrderById } from "@/features/order/order.api";
import { getGigById } from "@/features/gig/gig.api";

const getValue = (pkg: GigPackage, feature: string) => {
  const found = pkg.features.find((f) => f.package === feature);
  return found?.value === "Yes" ? (
    <CheckCircle className="text-green-500" size={18} />
  ) : found?.value ? (
    found.value
  ) : (
    <X color="red" size={18} />
  );
};

const FeaturesTable = ({
  packageInfo,
  allFeatures,
  getValue,
}: {
  packageInfo: GigPackage;
  allFeatures: string[];
  getValue: (pkg: GigPackage, feature: string) => React.ReactNode;
}) => (
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
      </tbody>
    </table>
  </div>
);

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

  const [packageInfo, setPackageInfo] = useState<GigPackage | undefined>();
  const [allFeatures, setAllFeatures] = useState<string[]>([]);

  const {
    data: order,
    error,
    isLoading,
    isValidating,
    mutate: mutateThisOrder,
  } = useSWR(
    orderId ? `/orders/${orderId}` : null,
    () => (orderId ? getOrderById(orderId) : null),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  const {
    data: gig,
    error: error2,
    isLoading: isLoading2,
    isValidating: isValidating2,
  } = useSWR(
    order?.gigId ? `/gig/${order.gigId}` : null,
    () => (order?.gigId ? getGigById(order.gigId) : null),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: 0,
    },
  );

  useEffect(() => {
    const handleErrors = () => {
      if (error) {
        return {
          type: "errror",
          message: "Order not found",
        };
      }
      if (error2) {
        return {
          type: "errror",
          message: "Gig not found",
        };
      }
    };

    setMessage(handleErrors() as any);
  }, [error, error2]);

  useEffect(() => {
    if (order) {
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
    }
  }, [order]);

  if (isLoading || isLoading2) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full">
      {order && order.status !== "UNPAID" && <div>Order has been paided.</div>}

      {order && order.status === "UNPAID" && packageInfo && gig && (
        <div className="flex flex-col space-y-4">
          <div className="flex">
            <div className="flex-1">
              <p className="text-xl">
                <span className="mr-2 font-semibold">OrderNo:</span>#
                {order.id.split("-")[4]}
              </p>

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

            <GigCarousel gig={gig} className="h-[300px] w-[100px] flex-1" />
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
          {/* 
          <FeaturesTable
            packageInfo={packageInfo}
            allFeatures={allFeatures}
            getValue={getValue}
          /> */}

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
