"use client";

import { useTranslations } from "next-intl";

import FrameWithImagedHeader from "../frameWithImagedHeader/FrameWithImagedHeader";

import headerSection from "@assets/sectionBackground/bookWithConfidenceHeader.png";

import { walletIcon, lockIcon, headPhoneIcon, phoneIcon } from "@assets/svg";

const BookWithConfidenceSection = () => {
  const t = useTranslations();

  const itemsList = [
    {
      icon: walletIcon,
      title: t("bookWithConfidence.items.choosing.title"),
      subTitle: t("bookWithConfidence.items.choosing.subTitle"),
    },
    {
      icon: lockIcon,
      title: t("bookWithConfidence.items.entertainment.title"),
      subTitle: t("bookWithConfidence.items.entertainment.subTitle"),
    },
    {
      icon: headPhoneIcon,
      title: t("bookWithConfidence.items.support.title"),
      subTitle: t("bookWithConfidence.items.support.subTitle"),
    },
    {
      icon: headPhoneIcon,
      title: t("bookWithConfidence.items.activities.title"),
      subTitle: t("bookWithConfidence.items.activities.subTitle"),
    },
    {
      icon: phoneIcon,
      title: t("bookWithConfidence.items.callUs.title"),
      subTitle: t("bookWithConfidence.items.callUs.subTitle"),
      phone: t("bookWithConfidence.items.callUs.phone"),
    },
  ];

  const renderedItemsList = itemsList.map((item, index) => (
    <div key={item.title} className="flex gap-2">
      <span className="inline-block mt-[5px]">{item.icon}</span>

      <div className="flex flex-col gap-[6px]">
        <h3 className="text-lg font-medium lg:text-xl">{item.title}</h3>

        <h4
          className={`text-[#545454] font-light ${
            index == itemsList.length - 1 && "lg:w-[80%]"
          }`}
        >
          {item.subTitle} {item.phone && <span dir="ltr">{item.phone}</span>}
        </h4>
      </div>
    </div>
  ));

  return (
    <FrameWithImagedHeader imageSrc={headerSection}>
      <h3 className="text-xl font-semibold lg:text-2xl text-mainColor">
        {t("bookWithConfidence.why")}
      </h3>

      <div className="flex flex-col gap-3">{renderedItemsList}</div>
    </FrameWithImagedHeader>
  );
};

export default BookWithConfidenceSection;
