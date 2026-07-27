"use client";

import { useFormikContext, FieldArray } from "formik";
import { useTranslations } from "next-intl";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const StepServices = ({ servicesOptions = [], customServicesOptions = [] }) => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  return (
    <div className="space-y-6">
      {/* Services List matching Image 1 */}
      <FieldArray name="services">
        {({ push, remove }) => (
          <div className="space-y-6">
            {(values.services || []).map((item, index) => (
              <div
                key={index}
                className="bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-border space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-titleColor flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-mainColor inline-block" />
                    {t("fields.service")} #{index + 1} <span className="text-error">*</span>
                  </span>

                  {values.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <DeleteOutlineIcon className="w-4 h-4" />
                      {t("fields.removeItem")}
                    </button>
                  )}
                </div>

                {/* Service Dropdown */}
                <div>
                  <SelectionGroup
                    name={`services[${index}].service`}
                    value={
                      servicesOptions.find((opt) => opt._id === item.service)
                        ?.name || item.service || ""
                    }
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      const selectedObj = servicesOptions.find(
                        (opt) => opt.name === selectedName
                      );
                      setFieldValue(
                        `services[${index}].service`,
                        selectedObj?._id || selectedName
                      );
                    }}
                    onBlur={handleBlur}
                    placeholder={t("placeholders.selectService")}
                    list={servicesOptions.map((opt) => opt.name || opt)}
                  />
                </div>

                {/* Service Notes matching Image 1 layout */}
                <div>
                  <label className="block mb-2 text-xs font-bold text-titleColor uppercase tracking-wider">
                    {t("subtitles.serviceNotes")}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* EN Note with badge */}
                    <div className="relative flex items-center">
                      <div className="absolute start-3 top-1/2 -translate-y-1/2 z-10 px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] font-bold text-gray-500">
                        EN
                      </div>
                      <div className="w-full ps-11">
                        <TextInputGroup
                          type="text"
                          name={`services[${index}].note.en`}
                          value={item.note?.en || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t("placeholders.serviceNoteEn")}
                        />
                      </div>
                    </div>

                    {/* AR Note with badge */}
                    <div className="relative flex items-center">
                      <div className="absolute start-3 top-1/2 -translate-y-1/2 z-10 px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] font-bold text-gray-500">
                        AR
                      </div>
                      <div className="w-full ps-11">
                        <TextInputGroup
                          type="text"
                          name={`services[${index}].note.ar`}
                          value={item.note?.ar || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t("placeholders.serviceNoteAr")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => push({ service: "", note: { en: "", ar: "" } })}
              className="w-full py-3 rounded-xl border border-dashed border-mainColor/40 text-mainColor hover:bg-mainColor/5 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <AddIcon className="w-4 h-4" />
              {t("fields.addService")}
            </button>
          </div>
        )}
      </FieldArray>

      {/* Custom Services */}
      {customServicesOptions.length > 0 && (
        <div className="border-t border-border pt-5">
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.customServices")}
          </label>
          <SelectionGroup
            name="customServices"
            multiple={true}
            value={(values.customServices || [])
              .map((id) => customServicesOptions.find((cs) => cs._id === id)?.name)
              .filter(Boolean)}
            onChange={(e) => {
              const selectedNames = e.target.value;
              const selectedIds = selectedNames
                .map(
                  (name) =>
                    customServicesOptions.find((cs) => cs.name === name)?._id ||
                    name
                )
                .filter(Boolean);
              setFieldValue("customServices", selectedIds);
            }}
            onBlur={handleBlur}
            placeholder={t("placeholders.selectCustomServices")}
            list={customServicesOptions.map((cs) => cs.name || cs)}
          />
        </div>
      )}
    </div>
  );
};

export default StepServices;
