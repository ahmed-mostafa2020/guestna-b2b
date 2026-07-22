"use client";

import { useFormikContext, FieldArray } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const StepItinerary = () => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, handleChange, handleBlur } = useFormikContext();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-titleColor">{t("fields.itinerary")}</h4>
          <p className="text-xs text-subtitleColor">
            {t("subtitles.itinerary")}
          </p>
        </div>
      </div>

      <FieldArray name="itinerary">
        {({ push, remove }) => (
          <div className="space-y-4">
            {(values.itinerary || []).map((item, index) => (
              <div
                key={index}
                className="bg-gray-50/60 p-4 rounded-2xl border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-mainColor">
                    {t("fields.day")} #{item.day || index + 1}
                  </span>

                  {(values.itinerary || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1 text-error hover:bg-error/10 rounded transition-colors text-xs flex items-center gap-1 font-semibold"
                    >
                      <DeleteOutlineIcon className="w-4 h-4" />
                      {t("fields.removeItem")}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1 text-xs font-semibold text-gray-600">
                      {t("fields.day")}
                    </label>
                    <TextInputGroup
                      type="number"
                      min={1}
                      name={`itinerary[${index}].day`}
                      value={item.day ?? index + 1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-semibold text-gray-600">
                      {t("fields.toDoEn")}
                    </label>
                    <TextInputGroup
                      textarea={true}
                      rows={2}
                      name={`itinerary[${index}].toDo.en`}
                      value={item.toDo?.en || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.itineraryEn")}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-xs font-semibold text-gray-600">
                      {t("fields.toDoAr")}
                    </label>
                    <TextInputGroup
                      textarea={true}
                      rows={2}
                      name={`itinerary[${index}].toDo.ar`}
                      value={item.toDo?.ar || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.itineraryAr")}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                push({ day: (values.itinerary?.length || 0) + 1, toDo: { en: "", ar: "" } })
              }
              className="w-full py-2.5 rounded-xl border border-dashed border-mainColor/40 text-mainColor hover:bg-mainColor/5 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <AddIcon className="w-4 h-4" />
              {t("fields.addItem")}
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default StepItinerary;
