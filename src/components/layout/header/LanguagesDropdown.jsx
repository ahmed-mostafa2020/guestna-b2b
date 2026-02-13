"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";

import { doneIcon } from "@assets/svg";

const LanguagesDropdown = () => {
  const locale = useLocale();
  const t = useTranslations();

  const [selectedLanguage, setSelectedLanguage] = useState(
    locale == "ar" ? "العربية" : "English"
  );
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  const switchLocale = (locale) => {
    // Remove the current locale from the pathname
    const newPathname = pathname.replace(/^\/(en|ar)/, "");
    return `/${locale}${newPathname}`;
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  const languagesList = [
    { name: "العربية", url: "ar" },
    { name: "English", url: "en" },
  ];

  const renderedLanguagesList = languagesList.map((language, index) => (
    <Link
      href={switchLocale(language.url)}
      key={index}
      className="flex items-center justify-between px-4 py-4 text-sm transition-all duration-200 ease-in-out border-b cursor-pointer border-border hover:bg-buttonsHover"
      onClick={() => selectLanguage(language.name)}
    >
      <span>{language.name}</span>
      {selectedLanguage === language.name && <span>{doneIcon}</span>}
    </Link>
  ));

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between w-full p-3 text-base font-medium border-2 rounded-md border-border"
        onClick={toggleDropdown}
      >
        <div>
          <h4 className="text-xs font-light text-start">
            {t("header.language")}
          </h4>

          <h3 className="text-lg leading-5">{selectedLanguage}</h3>
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
          {renderedLanguagesList}
        </div>
      )}
    </div>
  );
};

export default LanguagesDropdown;
