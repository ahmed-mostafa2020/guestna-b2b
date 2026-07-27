"use client";

import { useFormikContext, FieldArray } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const StepExemptions = () => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, handleChange, handleBlur } = useFormikContext();

  const enList = values.exemptedFromTrip?.en || [""];
  const arList = values.exemptedFromTrip?.ar || [""];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-bold text-titleColor">{t("fields.exemptedFromTrip")}</h4>
        <p className="text-xs text-subtitleColor">
          {t("subtitles.exemptions")}
        </p>
      </div>

      <FieldArray name="exemptedFromTrip.en">
        {({ push: pushEn, remove: removeEn }) => (
          <FieldArray name="exemptedFromTrip.ar">
            {({ push: pushAr, remove: removeAr }) => (
              <div className="space-y-4">
                {enList.map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-50/60 p-4 rounded-2xl border border-border space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-titleColor">
                        {t("fields.exemptionItemNum", { num: index + 1 })}
                      </span>

                      {enList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            removeEn(index);
                            removeAr(index);
                          }}
                          className="p-1 text-error hover:bg-error/10 rounded transition-colors text-xs flex items-center gap-1 font-semibold"
                        >
                          <DeleteOutlineIcon className="w-4 h-4" />
                          {t("fields.removeItem")}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1 text-xs font-semibold text-gray-600">
                          {t("fields.exemptionEn")}
                        </label>
                        <TextInputGroup
                          type="text"
                          name={`exemptedFromTrip.en[${index}]`}
                          value={enList[index] || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t("placeholders.exemptionEn")}
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-xs font-semibold text-gray-600">
                          {t("fields.exemptionAr")}
                        </label>
                        <TextInputGroup
                          type="text"
                          name={`exemptedFromTrip.ar[${index}]`}
                          value={arList[index] || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t("placeholders.exemptionAr")}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    pushEn("");
                    pushAr("");
                  }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-mainColor/40 text-mainColor hover:bg-mainColor/5 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AddIcon className="w-4 h-4" />
                  {t("fields.addExemptionItem")}
                </button>
              </div>
            )}
          </FieldArray>
        )}
      </FieldArray>
    </div>
  );
};

export default StepExemptions;
