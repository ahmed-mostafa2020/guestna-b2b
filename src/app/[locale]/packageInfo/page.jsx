"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

const MainPackageInfo = () => {
  const router = useRouter();

  const locale = useLocale();

  useEffect(() => {
    router.push(`/${locale}`);
  }, [locale, router]);

  return;
};

export default MainPackageInfo;
