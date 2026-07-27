"use client";

import BilingualListStep from "./BilingualListStep";

const StepBenefits = () => (
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
);

export default StepBenefits;
