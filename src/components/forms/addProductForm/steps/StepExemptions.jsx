"use client";

import BilingualListStep from "./BilingualListStep";

const StepExemptions = () => (
  <BilingualListStep
    fieldName="exemptedFromTrip"
    titleKey="fields.exemptedFromTrip"
    subtitleKey="subtitles.exemptions"
    itemLabelKey="fields.exemptionItemNum"
    enLabelKey="fields.exemptionEn"
    arLabelKey="fields.exemptionAr"
    enPlaceholderKey="placeholders.exemptionEn"
    arPlaceholderKey="placeholders.exemptionAr"
    addButtonKey="fields.addExemptionItem"
  />
);

export default StepExemptions;
