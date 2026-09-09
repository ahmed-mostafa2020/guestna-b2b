"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@utils/helpers/cn";

export const PRODUCT_STEPS = [
  { id: 1, key: "basicInfo" },
  { id: 2, key: "gallery" },
  { id: 3, key: "locations" },
  { id: 4, key: "salesChannels" },
  { id: 5, key: "pricing" },
];

const AddProductStepper = ({
  currentStep = 1,
  onStepClick,
  completedSteps = [],
  isStep1Completed = false,
  isStep2Completed = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.steps");

  // Support both array of completedSteps and legacy boolean flags
  const isCompletedStep = (stepId) => {
    return (
      currentStep > stepId ||
      completedSteps.includes(stepId) ||
      (stepId === 1 && isStep1Completed) ||
      (stepId === 2 && isStep2Completed)
    );
  };

  return (
    <div className="w-full overflow-x-auto py-2 px-1">
      <nav
        aria-label="Progress Stepper"
        className="flex items-center justify-between min-w-[620px] sm:min-w-full max-w-4xl mx-auto"
      >
        {PRODUCT_STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = isCompletedStep(step.id);
          const isClickable = Boolean(
            onStepClick && (isCompleted || isActive || step.id === 1)
          );

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step Item */}
              <div
                role={isClickable ? "button" : "group"}
                tabIndex={isClickable ? 0 : -1}
                onClick={() => isClickable && onStepClick?.(step.id)}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onStepClick?.(step.id);
                  }
                }}
                className={cn(
                  "flex items-center gap-2.5 sm:gap-3 select-none transition-all duration-200",
                  isClickable ? "cursor-pointer" : "cursor-default"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-ibm text-base font-medium leading-[14px] transition-all duration-200 flex-shrink-0",
                    isActive || isCompleted
                      ? "bg-titleColor text-white shadow-xs"
                      : "border-[1.5px] border-textDark text-textDark bg-white"
                  )}
                >
                  {step.id}
                </div>

                {/* Step Label */}
                <span className="font-somar text-base font-medium leading-6 text-textDark whitespace-nowrap">
                  {t(step.key)}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {index < PRODUCT_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-[1.5px] mx-2.5 sm:mx-4 transition-colors duration-200",
                    isCompleted ? "bg-titleColor" : "bg-gray-300"
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default memo(AddProductStepper);
