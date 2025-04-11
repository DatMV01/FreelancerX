import React, { useState } from "react";
import {
  CardCvcElement,
  CardElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";

export const StripeCheckout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await axiosInstanceV1.post("/stripe/create-payment-intent", {
      // packageId,
      amount: 5000,
    });

    const { clientSecret } = await res.data;

    const result = await stripe?.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements?.getElement(CardElement)!,
        billing_details: {
          name: "Test User",
        },
      },
    });

    if (result?.paymentIntent?.status === "succeeded") {
      setSuccess(true);
    } else {
      alert(result?.error?.message || "Payment failed");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full rounded border p-4">
      <h2 className="mb-4 text-xl">Pay $50 with Card</h2>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm">Card Number</span>
          <CardNumberElement
            options={{ style: { base: { fontSize: "16px" } } }}
            className="w-full rounded border p-2"
          />
        </label>

        <div className="flex space-x-4">
          <label className="flex-1">
            <span className="text-sm">Expiry</span>
            <CardExpiryElement
              options={{ style: { base: { fontSize: "16px" } } }}
              className="w-full rounded border p-2"
            />
          </label>

          <label className="flex-1">
            <span className="text-sm">CVC</span>
            <CardCvcElement
              options={{ style: { base: { fontSize: "16px" } } }}
              className="w-full rounded border p-2"
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
      {success && <p className="mt-4 text-green-600">Payment successful!</p>}
    </form>
  );
};
