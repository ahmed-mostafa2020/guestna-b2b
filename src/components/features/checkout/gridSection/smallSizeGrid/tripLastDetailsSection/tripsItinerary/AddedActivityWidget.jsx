"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import { memo } from "react";

import addedSuccessfully from "@assets/success.svg";
import decoratedBubble from "@assets/green bubbles.svg";
import CloseIcon from "@mui/icons-material/Close";

const AddedActivityWidget = ({ onClose }) => {
  const t = useTranslations();

  return (
    <div className="relative w-[465px] h-[132px] bg-[#2D6A4F] rounded-[32px] flex items-center justify-center text-white shadow-lg lg:end-[500px]">
      {/* Close button */}
      <button onClick={onClose} className="absolute text-white end-6 top-6">
        <CloseIcon sx={{ color: "white", fontSize: "28px" }} />
      </button>

      {/* Success icon */}
      <div className="absolute start-6 top-[-50px] flex items-center justify-center">
        <Image
          src={addedSuccessfully}
          alt="added successfully"
          width={78}
          height={78}
        />
      </div>

      {/* Message */}
      <p className="text-base font-medium text-center">
        {t("finalDetails.extraActivityWidget")}
      </p>

      {/* Decorative elements */}
      <figure className="absolute bottom-0 start-6">
        <Image
          src={decoratedBubble}
          alt="decorated bubble"
          width={77}
          height={100}
        />
      </figure>
    </div>
  );
};

export default memo(AddedActivityWidget);
