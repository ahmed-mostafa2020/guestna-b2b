"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCustomLogo } from "@store/theme/themeSlice";
import GraduationForm from "@components/forms/events/graduation/GraduationForm";

const GraduationPage = () => {
  const tApp = useTranslations();
  const t = useTranslations("graduation");
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = `${tApp("pagesHead.appName")} | ${t("pageTitle")}`;
    dispatch(setCustomLogo("/images/graduation/bls-logo.png"));

    return () => {
      dispatch(setCustomLogo(null));
    };
  }, [dispatch, t, tApp]);

  return (
    <main className="min-h-screen bg-[#f5f0e8] py-0">
      <GraduationForm />
    </main>
  );
};

export default GraduationPage;
