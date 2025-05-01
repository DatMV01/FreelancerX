"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";
import StripeButton from "./StripeButton";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { CircularProgress } from "@mui/material";
import { getOrderById } from "@/features/order/order.api";
import StripePayment from "./StripePayment";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function Step2Payment({ onNext, onBack }: Props) {
  const searchParams = useSearchParams();
  const gigId = searchParams.get("gigId");
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
  const transactionStripeId = searchParams.get("transactionStripeId");
  const clientSecret = searchParams.get("clientSecret");
  const paymentIntentId = searchParams.get("paymentIntentId");

  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

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

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {order && order.status !== "UNPAID" && <div>Order has been paided.</div>}

      {order && order.status === "UNPAID" && (
        <div>
          <div className="flex space-x-6">
            <div className="w-2/3">
              {/* <StripeButton
                paymentSuccesCb={(value: any) => {
                  setPaymentSuccess(value);
                }}
              /> */}

              <StripePayment
                paymentSuccesCb={(value: any) => {
                  setPaymentSuccess(value);
                }}
              />
            </div>
            <div className="w-1/3">
              <h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>No:</span>
                  <span className="text-right font-medium">
                    {order.id.split("-")[4]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-medium capitalize">
                    {order.snapshot.package.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-medium">
                    {order.snapshot.package.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Time:</span>
                  <span>{order.deliveryTime} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Revisions:</span>
                  <span>{order.snapshot.package.revisions} times</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{order.quantity}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2 border-t pt-4 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{order.totalAmount.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>0 USD</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total:</span>
                  <span>{order.price.toLocaleString()} USD</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button
              className="disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onNext}
              disabled={!paymentSuccess}
            >
              Continue
            </Button>
            {/* <Button
          className="disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onNext}
        >
          Continue
        </Button> */}
          </div>
        </div>
      )}
    </div>
  );
}
