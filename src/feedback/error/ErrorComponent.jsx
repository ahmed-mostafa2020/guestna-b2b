"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import ResetButton from "@components/features/discover/gridSection/filterGrid/resetButton";

import { Container } from "@mui/material";

const ErrorComponent = ({
  statusCode = 404,
  errorMessage,
  notFoundPage = true,
  isResetButton = false,
  padding = true,
}) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <>
      <div
        className={`w-full flex flex-col items-center justify-center gap-6  bg-activityDetailsBg ${
          padding ? "py-10 lg:py-20" : "py-5"
        }`}
      >
        {statusCode && (
          <h2 className="text-5xl lg:text-[200px] lg:pb-4 font-bold text-[#384250]">
            {statusCode}
          </h2>
        )}
        <Container className="flex-col gap-6 centered">
          {errorMessage && (
            <p className="text-lg lg:text-2xl font-semibold text-[#161616] text-center">
              {errorMessage}
            </p>
          )}

          {notFoundPage && (
            <p className="text-lg font-medium text-[#161616] text-center">
              {t("common.error")}
            </p>
          )}

          <div className="w-full gap-2 m-auto lg:w-[60%] centered">
            {isResetButton && <ResetButton />}

            <Link
              href={`/${locale}`}
              replace={true}
              className="flex-1 py-3 font-bold text-center text-white transition-all duration-200 ease-in-out rounded-lg w-fit bg-mainColor hover:bg-linksHover"
            >
              {t("links.backHome")}
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ErrorComponent;
