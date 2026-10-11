"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Check } from "@mui/icons-material";

import { cn } from "@utils/helpers/cn";

const BookingStepper = ({
  steps,
  currentStep,
  isCurrentStepValid = false,
  onStepClick,
  namespace = "schoolTripBooking.steps",
}) => {
  const t = useTranslations(namespace);

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="w-full overflow-x-auto sm:overflow-x-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className="flex items-center justify-center gap-2 sm:gap-3 min-w-max mx-auto px-1">
        {steps.map((stepKey, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isNext = index === currentStep + 1;
          const isClickable = isCompleted || (isNext && isCurrentStepValid);
          const isLast = index === steps.length - 1;

          return (
            <li key={stepKey} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${t(stepKey)} (${index + 1}/${steps.length})`}
                className={cn(
                  "flex items-center gap-1.5 font-somar text-sm transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secColor focus-visible:ring-offset-2",
                  isClickable
                    ? "cursor-pointer hover:text-secColor"
                    : "cursor-default",
                  isActive || isCompleted
                    ? "text-titleColor font-medium"
                    : isClickable
                      ? "text-titleColor hover:text-secColor"
                      : "text-textDark"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-5 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300",
                    isActive || isCompleted
                      ? "bg-secColor text-white"
                      : isClickable
                        ? "border-2 border-secColor text-secColor"
                        : "border border-textDark text-textDark"
                  )}
                >
                  {isCompleted ? <Check sx={{ fontSize: 14 }} /> : index + 1}
                </span>
                <span className="whitespace-nowrap">{t(stepKey)}</span>
              </button>

              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-10 sm:w-20 md:w-28 transition-colors duration-300",
                    isCompleted ? "bg-secColor" : "bg-titleColor/60"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default memo(BookingStepper);
