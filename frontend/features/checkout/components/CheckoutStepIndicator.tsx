import { motion } from "framer-motion";
import { CheckCircle, CreditCard, FileText } from "lucide-react";

type StepIndicatorProps = {
  currentStep: number;
  onStepClick?: (step: number) => void;
};

const steps = [
  { label: "Review Order", icon: FileText },
  { label: "Cornfirm & Payment", icon: CreditCard },
  { label: "Submit Requirement", icon: CheckCircle },
];

export default function CheckoutStepIndicator({
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mb-10 px-2 sm:px-0">
      {/* Progress bar */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 rounded-full" />
      <motion.div
        className="absolute top-5 left-0 h-1 bg-blue-600 rounded-full z-10"
        initial={{ width: 0 }}
        animate={{ width: `${progressPercent}%` }}
        transition={{ duration: 0.4 }}
      />

      {/* Steps */}
      <div className="flex justify-between relative z-20 gap-2 sm:gap-0">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isClickable = isCompleted && onStepClick;
          const Icon = step.icon;

          return (
            <div
              key={index}
              className={`flex flex-col items-center text-center flex-1 ${
                isClickable ? "cursor-pointer group" : ""
              }`}
              onClick={() => {
                if (isClickable && onStepClick) {
                  onStepClick(stepNumber);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-md
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-500 text-white group-hover:bg-green-600"
                      : "bg-gray-300 text-gray-700"
                  }`}
              >
                <Icon size={24} />
              </motion.div>

              <p
                className={`text-xs sm:text-sm leading-tight ${
                  isActive
                    ? "font-semibold text-blue-600"
                    : isCompleted
                    ? "text-green-600 group-hover:text-green-700"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
