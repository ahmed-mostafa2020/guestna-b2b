"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

export const DEFAULT_THEME_COLORS = {
  "--color-main": "#007473",
  "--color-secondary": "#F09814",
  "--color-title": "#008F8F",
  "--color-text-dark": "#1F2626",
  "--color-text-light": "#737373",
  "--color-bg-home": "#eeeeee",
  "--color-bg-package-details": "#F3F3F3",
  "--color-buttons-hover": "#E1F5F5",
  "--color-badge": "#1858A5",
  "--color-error": "#bf0000",
  "--color-success": "#5cb85c",
  "--color-border": "#ECECEC",
  "--color-footer-link": "#00000099",
  "--color-links-hover": "#009883",
};

export const resetRootTheme = () => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  Object.entries(DEFAULT_THEME_COLORS).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

const ThemeProvider = () => {
  const currentTheme = useSelector((state) => state.theme?.currentTheme);
  const colorPreferences = useSelector(
    (state) => state.theme?.colorPreferences
  );

  useEffect(() => {
    // Only run on client-side (not during SSR)
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (currentTheme === "customized" && colorPreferences) {
      // Apply customized theme colors
      root.style.setProperty(
        "--color-main",
        colorPreferences.color_main || "#007473"
      );
      root.style.setProperty(
        "--color-secondary",
        colorPreferences.color_secondary || "#F09814"
      );
      root.style.setProperty(
        "--color-title",
        colorPreferences.color_title || "#008F8F"
      );
      root.style.setProperty(
        "--color-text-dark",
        colorPreferences.color_text_dark || "#1F2626"
      );
      root.style.setProperty(
        "--color-text-light",
        colorPreferences.color_text_light || "#737373"
      );
      root.style.setProperty(
        "--color-bg-home",
        colorPreferences.color_bg_home || "#eeeeee"
      );
      root.style.setProperty(
        "--color-bg-package-details",
        colorPreferences.color_bg_package_details || "#F3F3F3"
      );
      root.style.setProperty(
        "--color-buttons-hover",
        colorPreferences.color_buttons_hover || "#E1F5F5"
      );
      root.style.setProperty(
        "--color-badge",
        colorPreferences.color_badge || "#1858A5"
      );
      root.style.setProperty(
        "--color-error",
        colorPreferences.color_error || "#bf0000"
      );
      root.style.setProperty(
        "--color-success",
        colorPreferences.color_success || "#5cb85c"
      );
      root.style.setProperty(
        "--color-border",
        colorPreferences.color_border || "#ECECEC"
      );
      root.style.setProperty(
        "--color-footer-link",
        colorPreferences.color_footer_link || "#00000099"
      );
      root.style.setProperty(
        "--color-links-hover",
        colorPreferences.color_links_hover || "#009883"
      );
    } else {
      // Apply original theme colors
      resetRootTheme();
    }
  }, [currentTheme, colorPreferences]);

  return null;
};

export default ThemeProvider;
