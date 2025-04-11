import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CheckoutFlow from "@/features/checkout/components/CheckoutFlow";

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
    <div className="relative min-h-[100vh] w-full">
      <CheckoutFlow />
    </div>
  );
};

export default CheckoutSteps;
