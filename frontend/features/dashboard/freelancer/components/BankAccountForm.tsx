"use client";

import { axiosInstanceV1 } from "@/lib/axios/axiosInstance";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const WithdrawForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setMessage("Không tìm thấy thẻ.");
      setLoading(false);
      return;
    }
    debugger;
    // Tạo token từ thông tin thẻ
    console.log("Bắt đầu tạo token...");
    const { token, error } = await stripe.createToken(cardElement);
    console.log("Token:", token);
    console.log("Error:", error);

    if (error) {
      setMessage(error.message || "Có lỗi xảy ra.");
      setLoading(false);
      return;
    }

    // Gửi token + số tiền về server
    try {
      const res = await axiosInstanceV1.post("/stripe/payout/transfer-money", {
        cardToken: token.id,
        amount: parseFloat(amount),
      });

      const data = res.data;

      if (data.success) {
        setMessage("Rút tiền thành công!");
        setAmount("");
      } else {
        setMessage(data.message || "Rút tiền thất bại.");
      }
    } catch (err) {
      setMessage("Có lỗi mạng.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4 rounded-md border p-4 shadow-md"
    >
      <h2 className="text-xl font-semibold">Rút tiền Freelancer</h2>

      <div>
        <label className="mb-1 block">Số tiền (USD)</label>
        <input
          type="number"
          className="w-full rounded border px-3 py-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min={1}
          step={0.01}
        />
      </div>

      <div>
        <label className="mb-1 block">Thông tin thẻ</label>
        <div className="rounded border px-3 py-2">
          <CardElement
            options={{
              hidePostalCode: true, // 🔥 Ẩn postal code
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": { color: "#a0aec0" },
                },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </div>
      </div>

      {message && <div className="text-red-500">{message}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Đang xử lý..." : "Rút tiền"}
      </button>
    </form>
  );
};

// Wrapper để load Stripe Elements
const WithdrawFormWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <WithdrawForm />
    </Elements>
  );
};

export default WithdrawFormWrapper;
