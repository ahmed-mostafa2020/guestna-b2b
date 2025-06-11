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
      title: t("bookWithConfidence.items.lowestPrice.title"),
      subTitle: t("bookWithConfidence.items.lowestPrice.subTitle"),
    },
    {
      icon: lockIcon,
      title: t("bookWithConfidence.items.privacyProtection.title"),
      subTitle: t("bookWithConfidence.items.privacyProtection.subTitle"),
    },
    {
      icon: headPhoneIcon,
      title: t("bookWithConfidence.items.support.title"),
      subTitle: t("bookWithConfidence.items.support.subTitle"),
    },
    {
      icon: phoneIcon,
      title: t("bookWithConfidence.items.callUs.title"),
      subTitle: t("bookWithConfidence.items.callUs.subTitle"),
    },
  ];

  const renderedItemsList = itemsList.map((item, index) => (
    <div key={item.title} className="flex gap-2">
      <span className="inline-block">{item.icon}</span>

      <div>
        <h3>{item.title}</h3>
        <h3
          className={`text-textLight ${
            index == itemsList.length - 1 && "lg:w-[80%]"
          }`}
        >
          {item.subTitle}
        </h3>
      </div>
    </div>
  ));

  return (
    <FrameWithImagedHeader imageSrc={headerSection} fontFamily="font-ibm">
      <h3 className="text-xl font-semibold">{t("bookWithConfidence.title")}</h3>

      <div className="flex flex-col gap-3">{renderedItemsList}</div>
    </FrameWithImagedHeader>
  );
};

export default BookWithConfidenceSection;
