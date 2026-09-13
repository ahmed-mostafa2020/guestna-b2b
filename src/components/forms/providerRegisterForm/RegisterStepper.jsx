"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { cn } from "@utils/helpers/cn";
import iconStepDone from "@assets/providerRegister/icon-step-done.svg";

const RegisterStepper = ({
  steps,
  currentStep,
  maxVisitedStep,
  onStepClick,
}) => {
  const t = useTranslations("providerRegister.steps");

  const handleKeyDown = (event, index) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const isRtl =
        typeof document !== "undefined" && document.dir === "rtl";
      const isNext =
        (event.key === "ArrowRight" && !isRtl) ||
        (event.key === "ArrowLeft" && isRtl);
      const targetIndex = isNext ? index + 1 : index - 1;

      if (
        targetIndex >= 0 &&
        targetIndex <= maxVisitedStep &&
        targetIndex < steps.length
      ) {
        event.preventDefault();
        onStepClick(targetIndex);
      }
    }
  };

  return (
    <nav
      aria-label={t("facility.title")}
      className="bg-packageDetailsBg border border-border rounded-xl px-2 py-3.5"
    >
      <div className="flex flex-col md:flex-row gap-3">
        {steps.map((stepKey, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= maxVisitedStep;
          const isEmphasized = isActive || isCompleted;

          return (
            <button
              key={stepKey}
              type="button"
              disabled={!isClickable}
              aria-current={isActive ? "step" : undefined}
              aria-label={`${t(`${stepKey}.title`)} (${index + 1}/${steps.length})`}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onClick={() => {
                if (isClickable) onStepClick(index);
              }}
              className={cn(
                "flex-1 flex items-start gap-2 bg-white rounded-xl px-4 py-4 md:py-6 text-start transition-all duration-200 border-2",
                isActive && "border-mainColor bg-buttonsHover",
                isCompleted && "border-mainColor/40 bg-mainColor/5",
                !isCompleted && !isActive && "border-border",
                !isClickable && "opacity-60 cursor-not-allowed",
                isClickable && !isActive && "cursor-pointer hover:bg-buttonsHover/50"
              )}
            >
              {isCompleted ? (
                <span className="relative size-8 shrink-0 overflow-clip">
                  <Image
                    src={iconStepDone}
                    alt=""
                    width={32}
                    height={32}
                    className="size-full"
                    unoptimized
                  />
                </span>
              ) : (
                <span
                  className={cn(
                    "size-8 shrink-0 rounded-full flex items-center justify-center text-sm font-medium font-somar",
                    isActive
                      ? "bg-titleColor text-white"
                      : "border border-textDark text-textDark"
                  )}
                >
                  {index + 1}
                </span>
              )}

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p
                  className={cn(
                    "font-somar font-semibold text-lg md:text-xl text-textDark tracking-wide",
                    isEmphasized ? "opacity-100" : "opacity-70"
                  )}
                >
                  {t(`${stepKey}.title`)}
                </p>
                <p
                  className={cn(
                    "font-somar font-medium text-xs text-textLight",
                    isEmphasized ? "opacity-100" : "opacity-70"
                  )}
                >
                  {t(`${stepKey}.subtitle`)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default RegisterStepper;
