import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useEffect, useRef, useState } from "react";

const ServicesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef();

  const locale = useLocale();
  const t = useTranslations();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownList = [
    {
      name: t("header.b2c"),
      url: `https://www.guestna.app/${locale}`,
      target: "_blank",
    },
  ];

  const renderedDropdownList = dropdownList.map((item, index) => (
    <Link
      target={item.target || "_self"}
      href={item.url}
      key={index}
      className={`flex items-center justify-between px-4 py-4 text-sm transition-all duration-200 ease-in-out cursor-pointer  hover:bg-buttonsHover font-ibm ${
        index === dropdownList.length - 1
          ? "border-b-0 "
          : "border-border border-b"
      }`}
    >
      <span>{item.name}</span>
    </Link>
  ));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full p-3 text-base font-medium rounded-md bg-[#FCFCFC]"
        onClick={toggleDropdown}
      >
        <div>
          <h3 className="text-lg leading-5 font-ibm pe-8">
            {t("header.services")}
          </h3>
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
            stroke="#1F2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute -bottom-[80px] z-10 w-full py-2 bg-[#FCFCFC]">
          {renderedDropdownList}
        </div>
      )}
    </div>
  );
};

export default ServicesDropdown;
