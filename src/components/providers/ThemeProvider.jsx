"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

/**
 * Convert HEX color to space-separated RGB string
 * Example: "#3B82F6" -> "59 130 246"
 */
const hexToRgbString = (hex, fallback) => {
  const cleanHex = hex?.replace("#", "") || fallback.replace("#", "");

  if (cleanHex.length !== 6) return hexToRgbString(fallback, fallback);

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  return `${r} ${g} ${b}`;
};

const ThemeProvider = () => {
  const currentTheme = useSelector((state) => state.theme?.currentTheme);
  const colorPreferences = useSelector(
    (state) => state.theme?.colorPreferences
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    const setColor = (name, value, fallback) => {
      root.style.setProperty(name, hexToRgbString(value, fallback));
    };

    if (currentTheme === "customized" && colorPreferences) {
      setColor("--color-main", colorPreferences.color_main, "#007473");
      setColor(
        "--color-secondary",
        colorPreferences.color_secondary,
        "#F09814"
      );
      setColor("--color-title", colorPreferences.color_title, "#008F8F");
      setColor(
        "--color-text-dark",
        colorPreferences.color_text_dark,
        "#1F2626"
      );
      setColor(
        "--color-text-light",
        colorPreferences.color_text_light,
        "#737373"
      );
      setColor("--color-bg-home", colorPreferences.color_bg_home, "#EEEEEE");
      setColor(
        "--color-bg-package-details",
        colorPreferences.color_bg_package_details,
        "#F3F3F3"
      );
      setColor(
        "--color-buttons-hover",
        colorPreferences.color_buttons_hover,
        "#E1F5F5"
      );
      setColor("--color-badge", colorPreferences.color_badge, "#1858A5");
      setColor("--color-error", colorPreferences.color_error, "#BF0000");
      setColor("--color-success", colorPreferences.color_success, "#5CB85C");
      setColor("--color-border", colorPreferences.color_border, "#ECECEC");
      setColor(
        "--color-footer-link",
        colorPreferences.color_footer_link,
        "#000000"
      );
    } else {
      // Default theme
      setColor("--color-main", "#007473", "#007473");
      setColor("--color-secondary", "#F09814", "#F09814");
      setColor("--color-title", "#008F8F", "#008F8F");
      setColor("--color-text-dark", "#1F2626", "#1F2626");
      setColor("--color-text-light", "#737373", "#737373");
      setColor("--color-bg-home", "#EEEEEE", "#EEEEEE");
      setColor("--color-bg-package-details", "#F3F3F3", "#F3F3F3");
      setColor("--color-buttons-hover", "#E1F5F5", "#E1F5F5");
      setColor("--color-badge", "#1858A5", "#1858A5");
      setColor("--color-error", "#BF0000", "#BF0000");
      setColor("--color-success", "#5CB85C", "#5CB85C");
      setColor("--color-border", "#ECECEC", "#ECECEC");
      setColor("--color-footer-link", "#000000", "#000000");
    }
  }, [currentTheme, colorPreferences]);

  return null;
};

export default ThemeProvider;
