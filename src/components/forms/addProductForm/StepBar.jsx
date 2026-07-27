"use client";

import { memo, useRef, useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslations } from "next-intl";

export const STEP_KEYS = [
  "identity",
  "configuration",
  "dates",
  "activities",
  "pricing",
  "services",
  "media",
  "locations",
  "itinerary",
  "mustHave",
  "exemptions",
  "benefits",
  "review",
];

const StepBar = ({ activeStep, setActiveStep, maxVisitedStep, onStepClick }) => {
  const t = useTranslations("providerProfile.products.modal.steps");
  const scrollContainerRef = useRef(null);
  const stepRefs = useRef([]);

  // Auto-scroll active step pill into view
  useEffect(() => {
    if (stepRefs.current[activeStep] && scrollContainerRef.current) {
      stepRefs.current[activeStep].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeStep]);

  const progressPercentage = Math.round(
    ((activeStep + 1) / STEP_KEYS.length) * 100
  );

  return (
    <div className="w-full bg-white border-b border-border py-4 px-4 sm:px-6">
      {/* Scrollable Step Pills */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2.5 overflow-x-auto flex-nowrap py-1 scroll-smooth w-full select-none"
        style={{ scrollbarWidth: "thin" }}
      >
        {STEP_KEYS.map((key, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isClickable = index <= Math.max(activeStep, maxVisitedStep);

          return (
            <button
              key={key}
              ref={(el) => (stepRefs.current[index] = el)}
              type="button"
              disabled={!isClickable}
              onClick={() => {
                if (!isClickable) return;
                if (onStepClick) {
                  onStepClick(index);
                } else {
                  setActiveStep(index);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-mainColor text-white shadow-md scale-[1.02]"
                  : isCompleted
                  ? "bg-mainColor/10 text-mainColor border border-mainColor/30 hover:bg-mainColor/20"
                  : isClickable
                  ? "bg-gray-100 text-titleColor border border-gray-200 hover:bg-gray-200"
                  : "bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed opacity-60"
              }`}
            >
              {/* Badge Circle */}
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? "bg-white text-mainColor"
                    : isCompleted
                    ? "bg-mainColor text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? (
                  <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  index + 1
                )}
              </span>

              {/* Step Title */}
              <span>{t(key)}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Progress Line */}
      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
        <div
          className="bg-mainColor h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default memo(StepBar);
