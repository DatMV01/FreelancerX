import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const StripeCheckoutForm = ({
  paymentSuccesCb,
}: {
  paymentSuccesCb: any;
}) => {
  const searchParams = useSearchParams();

  const stripe = useStripe();
  const elements = useElements();
  const [isFetchingSecret, setIsFetchingSecret] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [message, setMessage] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const gigId = searchParams.get("gigId");
  const orderId = searchParams.get("orderId");
  const transactionId = searchParams.get("transactionId");
  const transactionStripeId = searchParams.get("transactionStripeId");
  const clientSecret = searchParams.get("clientSecret");
  const paymentIntentId = searchParams.get("paymentIntentId");

  const [order, setOrder] = useState<any>();
  const {
    data,
    error,
    isLoading: isFetchingOrder,
  } = useSWR(orderId ? `/order/checkout/${orderId}` : null, (url: string) =>
    axiosInstanceV1.get(url).then((res) => res.data),
  );

  useEffect(() => {
    data && setOrder(data);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!clientSecret || !stripe || !elements) {
      setMessage("❌ Stripe is not ready.");
      return;
    }

    try {
      setIsProcessingPayment(true);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
        },
      });

      if (result?.paymentIntent?.status === "succeeded") {
        setMessage("🎉 Payment successful!");
        setPaymentSuccess(true);
        paymentSuccesCb && paymentSuccesCb(true);
      } else {
        setMessage(result?.error?.message || "❌ Payment failed.");
      }
    } catch (err) {
      setMessage("❌ An error occurred.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isLoading = isFetchingOrder || isFetchingSecret || isProcessingPayment;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6 shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800">💳 Pay with Card</h2>

      {isFetchingSecret && (
        <div className="text-sm font-medium text-blue-600">
          🔄 Initializing payment session...
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">Card Number</label>
        <div className="rounded-md border p-3 ring-blue-400 transition focus-within:ring-2">
          <CardNumberElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1a202c",
                  "::placeholder": { color: "#a0aec0" },
                },
                invalid: {
                  color: "#e53e3e",
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium text-gray-600">Expiry</label>
          <div className="rounded-md border p-3 ring-blue-400 transition focus-within:ring-2">
            <CardExpiryElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1a202c",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium text-gray-600">CVC</label>
          <div className="rounded-md border p-3 ring-blue-400 transition focus-within:ring-2">
            <CardCvcElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1a202c",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading || paymentSuccess}
        className={`relative flex w-full items-center justify-center rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="mr-2 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            {isFetchingSecret
              ? "Preparing…"
              : isProcessingPayment
                ? "Processing…"
                : "Paying…"}
          </>
        ) : (
          `Pay $${order?.totalAmount}`
        )}
      </button>

      {message && (
        <p className="mt-3 text-center text-sm font-medium text-gray-700">
          {message}
        </p>
      )}
    </form>
  );
};
