"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { hidePaymentMethods } from "@store/checkout/finalTripDetailsSlice";

import { CONSTANT_VALUES } from "@constants/constantValues";

import { chevronLeftIcon, chevronRightIcon } from "@assets/svg";

import { Container } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

const StepperSection = ({ tripSlug, tripType }) => {
  const isPaymentMethods = useSelector(
    (state) => state.finalTripDetailsData?.isPaymentMethodsShown
  );
  const dispatch = useDispatch();

  const locale = useLocale();
  const t = useTranslations();

  const steps = [
    {
      id: 1,
      title:
        tripType === CONSTANT_VALUES.PACKAGE
          ? t("finalDetails.stepper.selectYourPackage")
          : t("finalDetails.stepper.selectYourActivity"),
      isCompleted: true,
      isCurrent: false,
    },
    {
      id: 2,
      title: t("finalDetails.stepper.contactInfo"),
      isCompleted: isPaymentMethods,
      isCurrent: true,
    },
    {
      id: 3,
      title: t("finalDetails.stepper.paymentDetails"),
      isCompleted: false,
      isCurrent: isPaymentMethods,
    },
  ];

  const renderedSteps = steps.map((step, index) => (
    <div
      className={`flex items-center ${
        index !== steps.length - 1 && "flex-1"
      } gap-3`}
      key={step.id}
    >
      <div className="flex items-center flex-shrink-0 gap-2">
        <div
          className={`w-8 h-8 rounded-full centered transition-all duration-200 ease-in-out ${
            !step.isCompleted && !step.isCurrent && "border border-textDark"
          } ${
            (step.isCompleted || step.isCurrent) && "text-white bg-mainColor"
          } `}
        >
          {step.isCompleted ? <DoneIcon fontSize="small" /> : step.id}
        </div>
        <h3 className="font-medium">{step.title}</h3>
      </div>

      {index !== steps.length - 1 && (
        <div className="hidden md:block h-[1px] bg-textDark w-[-webkit-fill-available]"></div>
      )}
    </div>
  ));

  return (
    <section>
      <Container maxWidth="lg">
        <div className="flex flex-col gap-3 lg:gap-6">
          <div className="flex flex-col w-full gap-2 md:flex-row">
            {renderedSteps}
          </div>

          {isPaymentMethods ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/discover/${tripSlug}`}
                className="flex items-center gap-2 text-lg lg:text-xl w-fit"
              >
                {tripType === CONSTANT_VALUES.PACKAGE
                  ? t("links.returnToPackage")
                  : t("links.returnToActivity")}
              </Link>
              {locale === "ar" ? chevronLeftIcon : chevronRightIcon}

              <button
                onClick={() => {
                  dispatch(hidePaymentMethods());
                }}
                className="text-lg border-none outline-none lg:text-xl"
              >
                {t("finalDetails.stepper.contactInfo")}
              </button>
            </div>
          ) : (
            <Link
              href={`/${locale}/discover/${tripSlug}`}
              className="flex items-center gap-2 text-lg lg:text-xl w-fit"
            >
              {locale === "ar" ? chevronRightIcon : chevronLeftIcon}

              <span>
                {tripType === CONSTANT_VALUES.PACKAGE
                  ? t("links.returnToPackage")
                  : t("links.returnToActivity")}
              </span>
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
};

export default StepperSection;
