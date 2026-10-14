"use client";

import { useTranslations } from "next-intl";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { smallWhatsappIcon } from "@assets/svg";

const HelpContactCard = () => {
  const t = useTranslations("profile.createTripLink.participation.help");

  return (
    <aside className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 rounded-xl border border-border bg-white">
      <div className="flex flex-col gap-0.5">
        <h4 className="text-sm font-bold font-somar text-textDark">
          {t("title")}
        </h4>
        <p className="text-xs font-somar text-textLight">{t("body")}</p>
        <span
          dir="ltr"
          className="mt-1 w-fit px-2 py-0.5 rounded border border-border bg-packageDetailsBg text-xs font-medium font-somar text-textDark"
        >
          {CONSTANT_VALUES.GUESTNA_PHONE}
        </span>
      </div>

      <a
        href={CONSTANT_VALUES.WHATSAPP_CONTACT}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-status-success-border bg-status-success-bg text-xs font-medium font-ibm text-status-success-fg hover:shadow-md transition-shadow duration-150"
      >
        {smallWhatsappIcon}
        {t("cta")}
      </a>
    </aside>
  );
};

export default HelpContactCard;
