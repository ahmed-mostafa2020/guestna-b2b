"use client";

import { useTranslations } from "next-intl";
import { Container } from "@mui/material";
import AITrainingCampForm from "@components/forms/events/aiTrainingCamp/AITrainingCampForm";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setColorPreferences,
  setCustomLogo,
  setTheme,
} from "@store/theme/themeSlice";

const RamadanAITrainingCampPage = () => {
  const tApp = useTranslations();
  const t = useTranslations("aiTrainingCamp");

  const dispatch = useDispatch();

  useEffect(() => {
    document.title = `${tApp("pagesHead.appName")} | ${t("pageTitle")}`;
  }, []);

  const tripData = {
    company: {
      logo: "https://storage.googleapis.com/guestnabucket/images/1763377354285-50536543.webp",
      colorPreferences: {
        color_main: "#11327e",
        color_secondary: "#3295e2",
        color_title: "#11327e",
        color_text_dark: "#2b7397",
        color_text_light: "#5f9fbf",
        color_bg_home: "#fcfcfc",
        color_bg_package_details: "#ffffff",
        color_buttons_hover: "#3295e220",
        color_badge: "#2c656d",
        color_error: "#bf0000",
        color_success: "#5cb85c",
        color_border: "#2c656d",
        color_footer_link: "#11327e",
        color_links_hover: "#3295e2",
      },
    },
  };

  useEffect(() => {
    if (tripData?.company?.colorPreferences) {
      dispatch(setColorPreferences(tripData.company.colorPreferences));
      dispatch(setTheme("customized"));
    } else {
      dispatch(setColorPreferences(null));
      dispatch(setTheme("original"));
    }

    if (tripData?.company?.logo) {
      // Set custom logo if available
      dispatch(setCustomLogo(tripData.company.logo));
    } else {
      dispatch(setCustomLogo(null));
    }

    // Cleanup function to reset theme and logo when leaving the page
    return () => {
      dispatch(setColorPreferences(null));
      dispatch(setTheme("original"));
      dispatch(setCustomLogo(null));
    };
  }, [dispatch, tripData]);

  return (
    <main className="min-h-screen bg-packageDetailsBg py-8 lg:py-12">
      <Container maxWidth="md">
        <AITrainingCampForm />
      </Container>
    </main>
  );
};

export default RamadanAITrainingCampPage;
