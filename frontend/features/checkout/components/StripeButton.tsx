"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { StripeCheckoutForm } from "./StripeCheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);
function StripeButton({ paymentSuccesCb }: { paymentSuccesCb: any }) {
  return (
    <Elements stripe={stripePromise} >
      {/* <StripeCheckout /> */}

      <StripeCheckoutForm paymentSuccesCb={paymentSuccesCb} />
    </Elements>
  );
}

export default StripeButton;
