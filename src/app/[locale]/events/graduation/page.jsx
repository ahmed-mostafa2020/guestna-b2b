"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogoSubtext, setCustomLogo } from "@store/theme/themeSlice";
import GraduationForm from "@components/forms/events/graduation/GraduationForm";

const GraduationPage = () => {
  const tApp = useTranslations();
  const t = useTranslations("graduation");
  const locale = useLocale();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = `${tApp("pagesHead.appName")} | ${t("pageTitle")}`;
    dispatch(setCustomLogo("/images/graduation/bls-logo.png"));
    dispatch(setLogoSubtext(locale === "ar" ? "بدعم من GuestNa" : "Powered by GuestNa"));

    return () => {
      dispatch(setCustomLogo(null));
      dispatch(setLogoSubtext(null));
    };
  }, [dispatch, locale]);

  return (
    <main className="min-h-screen bg-[#f5f0e8] py-0">
      <GraduationForm />
    </main>
  );
};

export default GraduationPage;
