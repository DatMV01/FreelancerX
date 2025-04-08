import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || "");

export const CheckoutButton = ({
  packageId,
  amount,
}: {
  packageId: string;
  amount: number;
}) => {
  const handleCheckout = async () => {
    const res = await axiosInstanceV1.post("/stripe/create-checkout-session", {
      packageId,
      amount,
    });
    debugger
    const { url } = res.data;
    window.location.href = url;
  };

  return (
    <button
      onClick={handleCheckout}
      className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
    >
      Thanh toán
    </button>
  );
};
