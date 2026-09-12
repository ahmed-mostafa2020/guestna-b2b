"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import iconStepDone from "@assets/providerRegister/icon-step-done.svg";

const RegisterStepper = ({
  steps,
  currentStep,
  maxVisitedStep,
  onStepClick,
}) => {
  const t = useTranslations("providerRegister.steps");

  return (
    <div className="bg-packageDetailsBg border border-border rounded-xl px-2 py-3.5">
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
              onClick={() => {
                if (isClickable) onStepClick(index);
              }}
              className={`flex-1 flex items-start gap-2 bg-white rounded-xl px-4 py-4 md:py-6 text-start transition-all duration-200 ${
                isActive
                  ? "border border-mainColor bg-buttonsHover"
                  : isCompleted
                    ? "border border-mainColor/30 bg-mainColor/5"
                    : "border border-border"
              } ${isClickable ? "cursor-pointer" : "cursor-default opacity-80"}`}
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
                  className={`size-8 shrink-0 rounded-full flex items-center justify-center text-sm font-medium font-somar ${
                    isActive
                      ? "bg-titleColor text-white"
                      : "border border-textDark text-textDark"
                  }`}
                >
                  {index + 1}
                </span>
              )}

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p
                  className={`font-somar font-semibold text-lg md:text-xl text-textDark tracking-wide ${
                    isEmphasized ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {t(`${stepKey}.title`)}
                </p>
                <p
                  className={`font-somar font-medium text-sm md:text-base text-textLight ${
                    isEmphasized ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {t(`${stepKey}.subtitle`)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RegisterStepper;
