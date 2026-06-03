"use client";

import { useTranslations } from "next-intl";
import { whiteWhatsAppIcon } from "@assets/svg";

const GUESTNA_WHATSAPP_URL = "https://wa.me/966500000000";

const HelpCard = () => {
  const t = useTranslations("recommendations.help");

  return (
    <div className="bg-[#fff4eb] rounded-[12px] px-6 py-6 w-full relative overflow-hidden">
      {/* Decorative rotated diamond — positioned at inline-start (right in RTL) */}
      <div className="absolute bottom-0 right-0 w-[136px] h-[170px] opacity-[0.08] pointer-events-none">
        <svg viewBox="0 0 133 168" fill="none" className="w-full h-full">
          <path d="M66.5 0L133 84L66.5 168L0 84L66.5 0Z" fill="#fc7900" />
        </svg>
      </div>

      <div className="flex flex-col gap-2 relative z-10">
        <h4 className="text-[20px] font-medium text-[#fc7900] font-somar leading-7 text-right">
          {t("title")}
        </h4>
        <p className="text-[14px] font-semibold text-[#cf6b0e] font-somar leading-5 text-right opacity-80">
          {t("body")}
        </p>

        {/* Button row — justify-start pushes button to RIGHT in RTL */}
        <div className="flex justify-start mt-2">
          <a
            href={GUESTNA_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fc7900] text-[#f6f7f8] text-[16px] font-somar rounded-[8px] px-4 py-2 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            {whiteWhatsAppIcon}
            {t("cta")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpCard;
