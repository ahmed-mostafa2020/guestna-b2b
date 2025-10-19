"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { useState } from "react";

import flag from "@assets/Saudi Arabia (SA).svg";
import { doneIcon } from "@assets/svg";

const CountriesDropdown = () => {
  const [selectedCountry, setSelectedCountry] = useState("السعودية");
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
  };

  const countriesList = [
    // { name: "مصر", flag: flag },
    { name: "السعودية", flag: flag },
  ];

  const renderedCountriesList = countriesList.map((country, index) => (
    <div
      key={index}
      className="flex items-center justify-between px-4 py-4 text-sm transition-all duration-200 ease-in-out border-b cursor-pointer border-border hover:bg-buttonsHover"
      onClick={() => selectCountry(country.name)}
    >
      <div className="flex items-center gap-2">
        <Image
          src={country.flag}
          alt={country.name}
          width={21}
          height={15}
          priority="true"
        />
        <span>{country.name}</span>
      </div>

      {selectedCountry === country.name && <span>{doneIcon}</span>}
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
            {t("header.country")}
          </h4>

          <h3 className="text-lg leading-5">{selectedCountry}</h3>
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
          {renderedCountriesList}
        </div>
      )}
    </div>
  );
};

export default CountriesDropdown;
