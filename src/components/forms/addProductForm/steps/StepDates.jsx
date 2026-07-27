"use client";

import { useFormikContext, FieldArray } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const StepDates = () => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Start Date fromDay */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.fromDay")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="date"
            name="fromDay"
            value={values.fromDay || ""}
            errors={errors.fromDay}
            touched={touched.fromDay}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* End Date toDay */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.toDay")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="date"
            name="toDay"
            value={values.toDay || ""}
            errors={errors.toDay}
            touched={touched.toDay}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* Start Hour */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.fromHour")}
          </label>
          <TextInputGroup
            type="time"
            name="fromHour"
            value={values.fromHour || ""}
            errors={errors.fromHour}
            touched={touched.fromHour}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        {/* End Hour */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.toHour")}
          </label>
          <TextInputGroup
            type="time"
            name="toHour"
            value={values.toHour || ""}
            errors={errors.toHour}
            touched={touched.toHour}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {/* Available Times List */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-titleColor">
            {t("fields.availableTimes")}
          </h4>
        </div>

        <FieldArray name="availableTimes">
          {({ push, remove }) => (
            <div className="space-y-3">
              {(values.availableTimes || []).map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50/70 p-3 rounded-xl border border-border"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <TextInputGroup
                      type="time"
                      name={`availableTimes[${index}].from`}
                      value={slot.from || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <TextInputGroup
                      type="time"
                      name={`availableTimes[${index}].to`}
                      value={slot.to || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  {values.availableTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      title={t("fields.removeItem")}
                    >
                      <DeleteOutlineIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => push({ from: "", to: "" })}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-mainColor hover:underline cursor-pointer"
              >
                <AddIcon className="w-4 h-4" />
                {t("fields.addTime")}
              </button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default StepDates;
