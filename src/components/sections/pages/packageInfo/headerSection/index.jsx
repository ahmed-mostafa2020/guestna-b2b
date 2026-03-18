"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

import { chevronLeftIcon, chevronRightIcon, smallHeartIcon } from "@assets/svg";

import { Container } from "@mui/material";
import IosShareIcon from "@mui/icons-material/IosShare";
import useShare from "@hooks/useShare";

const HeaderSection = ({ tripSlug }) => {
  const locale = useLocale();
  const t = useTranslations();
  const { handleShare } = useShare();

  return (
    <section className="py-5 bg-white">
      <Container className="flex items-center justify-between">
        <Link href={`/${locale}/discover/${tripSlug}`}>
          {locale === "ar" ? chevronRightIcon : chevronLeftIcon}
        </Link>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1">
            {smallHeartIcon}
            {t("links.addToFavorites")}
          </button>

          <button onClick={handleShare} className="flex items-center gap-1">
            <IosShareIcon fontSize="small" />
            {t("links.share")}
          </button>
        </div>
      </Container>
    </section>
  );
};

export default memo(HeaderSection);
