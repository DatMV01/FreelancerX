import { useState } from "react";
import Step1Review from "./Step1Review";
import Step2Payment from "./Step2Payment";
import Step3Success from "./Step3Success";
import CheckoutStepIndicator from "./CheckoutStepIndicator";

export default function CheckoutFlow() {
  const [step, setStep] = useState(1);

  const handleStepClick = (clickedStep: number) => {
    if (clickedStep < step) {
      setStep(clickedStep);
    }
  };

  return (
    <div className="w-full">
      <CheckoutStepIndicator currentStep={step} onStepClick={handleStepClick} />
      {step === 1 && <Step1Review onNext={() => setStep(2)} />}
      {step === 2 && (
        <Step2Payment onBack={() => setStep(1)} onNext={() => setStep(3)} />
      )}
      {step === 3 && <Step3Success />}
    </div>
  );
}
