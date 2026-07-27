"use client";

import BilingualListStep from "./BilingualListStep";

const StepMustHave = () => (
  <BilingualListStep
    fieldName="mustHaveItems"
    titleKey="fields.mustHaveItems"
    subtitleKey="subtitles.mustHave"
    itemLabelKey="fields.mustHaveItemNum"
    enLabelKey="fields.itemEn"
    arLabelKey="fields.itemAr"
    enPlaceholderKey="placeholders.mustHaveEn"
    arPlaceholderKey="placeholders.mustHaveAr"
    addButtonKey="fields.addMustHaveItem"
  />
);

export default StepMustHave;
