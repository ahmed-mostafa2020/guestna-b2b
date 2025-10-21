"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@store/theme/themeSlice";
import { doneIcon } from "@assets/svg";

const ThemeDropdown = () => {
  const t = useTranslations("header");
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const themeName = currentTheme === "original" ? t("originalTheme") : t("customizedTheme");
    setSelectedTheme(themeName);
    applyTheme(currentTheme);
  }, [currentTheme, t]);

  const applyTheme = (themeValue) => {
    const root = document.documentElement;

    if (themeValue === "customized") {
      // Apply customized theme colors
      root.style.setProperty("--color-main", "#0B7F8F");
      root.style.setProperty("--color-secondary", "#80AB3C");
      root.style.setProperty("--color-title", "#259EB0");
      root.style.setProperty("--color-text-dark", "#1D1D1B");
      root.style.setProperty("--color-text-light", "#585652");
      root.style.setProperty("--color-bg-home", "#FFFFFF");
      root.style.setProperty("--color-bg-package-details", "#E1F6F8");
      root.style.setProperty("--color-buttons-hover", "#139DBD");
      root.style.setProperty("--color-badge", "#1858A5");
      root.style.setProperty("--color-error", "#bf0000");
      root.style.setProperty("--color-success", "#5cb85c");
      root.style.setProperty("--color-border", "#18D4D9");
      root.style.setProperty("--color-footer-link", "#CFFBFF");
    } else {
      // Apply original theme colors
      root.style.setProperty("--color-main", "#007473");
      root.style.setProperty("--color-secondary", "#F09814");
      root.style.setProperty("--color-title", "#008F8F");
      root.style.setProperty("--color-text-dark", "#1F2626");
      root.style.setProperty("--color-text-light", "#737373");
      root.style.setProperty("--color-bg-home", "#eeeeee");
      root.style.setProperty("--color-bg-package-details", "#F3F3F3");
      root.style.setProperty("--color-buttons-hover", "#E1F5F5");
      root.style.setProperty("--color-badge", "#1858A5");
      root.style.setProperty("--color-error", "#bf0000");
      root.style.setProperty("--color-success", "#5cb85c");
      root.style.setProperty("--color-border", "#ECECEC");
      root.style.setProperty("--color-footer-link", "#00000099");
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectTheme = (themeName, themeValue) => {
    setSelectedTheme(themeName);
    setIsOpen(false);
    dispatch(setTheme(themeValue));
    applyTheme(themeValue);
  };

  const themesList = [
    { name: t("originalTheme"), value: "original" },
    { name: t("customizedTheme"), value: "customized" },
  ];

  const renderedThemesList = themesList.map((theme, index) => (
    <div
      key={index}
      className="flex items-center justify-between px-4 py-4 text-sm transition-all duration-200 ease-in-out border-b cursor-pointer border-border hover:bg-buttonsHover"
      onClick={() => selectTheme(theme.name, theme.value)}
    >
      <span>{theme.name}</span>
      {selectedTheme === theme.name && <span>{doneIcon}</span>}
    </div>
  ));

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full p-3 text-base font-medium border-2 rounded-md border-border"
        onClick={toggleDropdown}
      >
        <div>
          <h4 className="text-xs font-light text-start">
            {t("chooseTheme")}
          </h4>

          <h3 className="text-lg leading-5">{selectedTheme}</h3>
        </div>

        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="var(--color-text-dark)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="z-10 w-full py-2 mt-2 bg-white">
          {renderedThemesList}
        </div>
      )}
    </div>
  );
};

export default ThemeDropdown;
