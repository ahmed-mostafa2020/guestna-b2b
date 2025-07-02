"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { Container } from "@mui/material";

const ParentTrip = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Container maxWidth="lg">
      <div className="flex flex-col justify-center gap-2 p-4 mb-5 bg-white border rounded-lg w-fit border-mainColor">
        <h3 className="text-xl font-medium text-center">Parent testing trip</h3>

        <Link
          href={`/${locale}/parents/king-fahd-public-library-in-jeddah-riyadh-modern-school-2025-10-05t091610305z`}
          className="px-8 text-center py-3 capitalize rounded-[10px] text-white bg-mainColor border-2 border-mainColor font-medium text-base transition-all ease-in-out duration-200 hover:bg-linksHover hover:border-linksHover mx-auto lg:mt-6 mt-3"
        >
          {t("links.viewTripDetails")}
        </Link>
      </div>
    </Container>
  );
};

export default ParentTrip;
