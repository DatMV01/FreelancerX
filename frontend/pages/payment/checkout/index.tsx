import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const CheckoutSteps = () => {
  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState("");

  const order = {
    gigTitle: "Design a modern landing page",
    package: "Standard",
    deliveryTime: "3 days",
    revisions: 2,
    price: 155,
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-6 rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {step === 1 ? "Review Your Order" : "Submit Requirements"}
        </h2>
        <div className="text-sm text-gray-500">Step {step} of 3</div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">{order.gigTitle}</h3>
            <p className="text-gray-500">Package: {order.package}</p>
            <p className="text-gray-500">Delivery: {order.deliveryTime}</p>
            <p className="text-gray-500">Revisions: {order.revisions}</p>
            <p className="mt-2 text-lg font-bold">${order.price}</p>
          </div>
          <Button className="w-full" onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Tell the seller what they need to get started
          </label>
          <textarea
            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows={6}
            placeholder="Describe your project, share files, references, brand guidelines, etc."
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => setStep(3)}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 text-center">
          <p className="text-lg font-semibold">Ready to pay?</p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Pay with Stripe
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutSteps;
