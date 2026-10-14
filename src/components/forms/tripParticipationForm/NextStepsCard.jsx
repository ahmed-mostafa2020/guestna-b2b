"use client";

import { useTranslations } from "next-intl";
import { NotificationsNoneOutlined } from "@mui/icons-material";

import { NEXT_STEPS } from "./constants";

const NextStepsCard = () => {
  const t = useTranslations("profile.createTripLink.participation.nextSteps");

  return (
    <section
      aria-labelledby="participation-next-steps-title"
      className="flex flex-col gap-4 p-5 md:p-6 rounded-2xl border border-[#cce5e6] bg-[#f0f7f7]"
    >
      <h3
        id="participation-next-steps-title"
        className="ps-2.5 text-lg md:text-xl font-bold font-somar text-[#111827]"
      >
        {t("title")}
      </h3>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NEXT_STEPS.map((step, index) => (
          <li
            key={step}
            className="flex flex-col gap-1 px-4 py-4 rounded-xl border border-[#d6eaeb] bg-white/90"
          >
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="size-6 shrink-0 centered rounded-full bg-mainColor text-white text-xs font-bold font-ibm"
              >
                {index + 1}
              </span>
              <h4 className="text-base font-medium font-somar text-[#111827]">
                {t(`steps.${step}.title`)}
              </h4>
            </div>
            <p className="ps-8 text-sm md:text-base font-somar text-[#4b5563]">
              {t(`steps.${step}.description`)}
            </p>
          </li>
        ))}
      </ol>

      <p className="flex items-center gap-1 pe-1 text-sm font-medium font-somar text-[#4b5563]">
        <NotificationsNoneOutlined sx={{ fontSize: 16 }} aria-hidden="true" />
        {t("notice")}
      </p>
    </section>
  );
};

export default NextStepsCard;
