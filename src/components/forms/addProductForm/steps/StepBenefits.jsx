"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BilingualListStep from "./BilingualListStep";

const StepBenefits = ({ setActiveStep }) => {
  const t = useTranslations("providerProfile.products.modal.subtitles");
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <div className="space-y-6">
      <BilingualListStep
        fieldName="benefits"
        titleKey="fields.benefits"
        subtitleKey="subtitles.benefits"
        itemLabelKey="fields.benefitItemNum"
        enLabelKey="fields.benefitEn"
        arLabelKey="fields.benefitAr"
        enPlaceholderKey="placeholders.benefitEn"
        arPlaceholderKey="placeholders.benefitAr"
        addButtonKey="fields.addBenefitItem"
      />

      {setActiveStep && (
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mainColor text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <VisibilityIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-titleColor">
                {t("readyToReview")}
              </h4>
              <p className="text-xs text-subtitleColor">
                {t("reviewBeforeSubmitNotice")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveStep(12)}
            className="px-5 py-2.5 rounded-xl bg-mainColor hover:bg-titleColor text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer flex-shrink-0 active:scale-[0.98] self-end sm:self-auto"
          >
            <VisibilityIcon className="w-4 h-4" />
            <span>{t("reviewProduct")}</span>
            {isRtl ? (
              <ArrowBackIcon className="w-4 h-4" />
            ) : (
              <ArrowForwardIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default StepBenefits;
