"use client";

import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export const CheckoutButton = ({
  packageId,
  amount,
}: {
  packageId: string;
  amount: number;
}) => {
  const handleClick = async () => {
    const stripe = await stripePromise;
    if (!stripe) return;

    const res = await axiosInstanceV1.post("/stripe/create-checkout-session", {
      packageId,
      amount,
    });

    const { sessionId } = res.data;

    const result = await stripe.redirectToCheckout({
      sessionId,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
    >
      Pay with Stripe
    </button>
  );
};
