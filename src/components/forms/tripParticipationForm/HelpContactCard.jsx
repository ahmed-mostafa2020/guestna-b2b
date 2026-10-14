"use client";

import { useTranslations } from "next-intl";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { smallWhatsappIcon } from "@assets/svg";

const HelpContactCard = () => {
  const t = useTranslations("profile.createTripLink.participation.help");

  return (
    <aside className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 rounded-xl border border-[#e5e7eb] bg-white">
      <div className="flex flex-col gap-0.5">
        <h4 className="text-sm font-bold font-somar text-[#1f2937]">
          {t("title")}
        </h4>
        <p className="text-xs font-somar text-[#6b7280]">{t("body")}</p>
        <span
          dir="ltr"
          className="mt-1 w-fit px-2 py-0.5 rounded border border-[#e5e7eb] bg-[#f3f4f6] text-xs font-medium font-somar text-[#374151]"
        >
          {CONSTANT_VALUES.GUESTNA_PHONE}
        </span>
      </div>

      <a
        href={CONSTANT_VALUES.WHATSAPP_CONTACT}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#059669] bg-[#ecfdf5] text-xs font-medium font-ibm text-[#047857] hover:shadow-md transition-shadow duration-150"
      >
        {smallWhatsappIcon}
        {t("cta")}
      </a>
    </aside>
  );
};

export default HelpContactCard;
