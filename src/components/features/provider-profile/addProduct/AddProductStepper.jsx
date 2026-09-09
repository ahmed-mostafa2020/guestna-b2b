"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@utils/helpers/cn";

export const PRODUCT_STEPS = [
  { id: 1, key: "basicInfo" },
  { id: 2, key: "locations" },
  { id: 3, key: "media" },
  { id: 4, key: "salesChannels" },
  { id: 5, key: "pricing" },
];

const AddProductStepper = ({
  currentStep = 1,
  onStepClick,
  isStep1Completed = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.steps");

  return (
    <div className="w-full overflow-x-auto py-2 px-1">
      <nav
        aria-label="Progress Stepper"
        className="flex items-center justify-between min-w-[620px] sm:min-w-full max-w-4xl mx-auto"
      >
        {PRODUCT_STEPS.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted =
            currentStep > step.id || (step.id === 1 && isStep1Completed);
          const isClickable = Boolean(
            onStepClick &&
              (isCompleted ||
                isActive ||
                step.id === 1 ||
                (step.id === 4 && isStep1Completed))
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
                {/* Step Circle: 32x32, IBM Plex Sans Arabic, 16px, 500, leading-[14px] */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-ibm text-base font-medium leading-[14px] transition-all duration-200 flex-shrink-0",
                    isActive
                      ? "bg-[#008f8f] text-white shadow-sm"
                      : isCompleted
                      ? "bg-[#008f8f] text-white"
                      : "border-[1.5px] border-[#0a0a0a] text-[#0a0a0a] bg-white"
                  )}
                >
                  {step.id}
                </div>

                {/* Step Label: Somar Sans, 16px, 500, leading-6 (24px), #1f2626 */}
                <span className="font-somar text-base font-medium leading-6 text-[#1f2626] whitespace-nowrap">
                  {t(step.key)}
                </span>
              </div>

              {/* Connecting Line between steps: 1.5px, #292D32 or completed #008f8f */}
              {index < PRODUCT_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-[1.5px] mx-2.5 sm:mx-4 transition-colors duration-200",
                    isCompleted ? "bg-[#008f8f]" : "bg-[#292D32]"
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
