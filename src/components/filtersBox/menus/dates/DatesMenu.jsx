"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import AnimatedCircularMonthCounter from "./AnimatedCircularMonthCounter";
import Calender from "./Calender";

const DatesMenu = ({ type }) => {
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
  };

  const t = useTranslations();

  return (
    <div className="flex-col gap-1 lg:gap-4 centered w-full lg:w-[500px]">
      <div className="w-full pb-4 border-b md:pb-8 centered border-border">
        <div className="centered gap-2 bg-[#f5f5f5] rounded-[45px] px-8 py-2">
          <button
            onClick={() => handleButtonClick(1)}
            className={`outline-none font-ibm font-medium px-8 py-4 rounded-[32px] transition-all duration-200 ease-in-out ${
              activeButton === 1
                ? "bg-white text-mainColor"
                : "text-black bg-transparent"
            } `}
          >
            {t("common.dates")}
          </button>

          <button
            onClick={() => handleButtonClick(2)}
            className={`outline-none font-ibm font-medium px-8 py-4 rounded-[32px] transition-all duration-200 ease-in-out ${
              activeButton === 2
                ? "bg-white text-mainColor"
                : "text-black bg-transparent"
            } `}
          >
            {t("common.months")}
          </button>
        </div>
      </div>

      {/* {activeButton === 1 && <Calender />} */}
      {activeButton === 1 && <Calender type={type} />}
      {activeButton === 2 && <AnimatedCircularMonthCounter month={1} />}
    </div>
  );
};

export default DatesMenu;
