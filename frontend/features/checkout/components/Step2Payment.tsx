import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function Step2Payment({ onNext, onBack }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // Giả lập xử lý thanh toán (VD: redirect tới VNPAY, gọi webhook, v.v...)
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 3000); // có thể điều chỉnh thời gian phù hợp
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">💳 Payment</h2>
      <p className="text-gray-600">Pay with VNPAY or your preferred method.</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={onBack}
          className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
        >
          Back
        </button>

        <button
          onClick={handlePay}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <CheckoutButton packageId="1" amount={100} />
      </div>
    </div>
  );
}
