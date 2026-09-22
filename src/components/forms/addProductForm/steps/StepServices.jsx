"use client";

import { useState } from "react";
import { useFormikContext, FieldArray } from "formik";
import { useTranslations, useLocale } from "next-intl";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const SERVICES_TYPES = [
  "MEALS",
  "FOOD",
  "MEDIA_COVERAGE",
  "BADGES",
  "SUPERVISION",
  "PHOTOGRAPHERS",
  "TRANSLATORS",
  "TRANSPORTATION",
  "ACCOMMODATION",
  "OTHER",
];

const isHexObjectId = (str) =>
  typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

const getItemName = (item, locale) => {
  if (!item) return "";
  if (typeof item === "string") return isHexObjectId(item) ? "" : item;
  if (typeof item.name === "object" && item.name !== null) {
    return item.name[locale] || item.name.ar || item.name.en || "";
  }
  return item.name || item.title || item.label || "";
};

const StepServices = ({ servicesOptions = [], customServicesOptions = [] }) => {
  const t = useTranslations("providerProfile.products.modal");
  const tTypes = useTranslations("providerProfile.products.modal.servicesTypes");
  const locale = useLocale();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  // Track selected service type per service index (local UI state only)
  const [serviceTypeFilters, setServiceTypeFilters] = useState({});

  const getServiceTypeForIndex = (index) => serviceTypeFilters[index] || "";

  const setServiceTypeForIndex = (index, type) => {
    setServiceTypeFilters((prev) => ({ ...prev, [index]: type }));
  };

  // Find the servicesType of a selected service by its ID
  const getServiceTypeById = (serviceId) => {
    const found = servicesOptions.find((opt) => {
      const id = opt?._id || opt?.id;
      return id === serviceId;
    });
    return found?.servicesType || "";
  };

  // Build service type options for the dropdown
  const serviceTypeOptions = SERVICES_TYPES.map((type) => ({
    value: type,
    label: tTypes(type),
  }));

  // Filter services by selected type
  const getFilteredServices = (selectedType) => {
    if (!selectedType) return servicesOptions;
    return servicesOptions.filter((opt) => opt.servicesType === selectedType);
  };

  return (
    <div className="space-y-6">
      {/* Services List */}
      <FieldArray name="services">
        {({ push, remove }) => (
          <div className="space-y-6">
            {(values.services || []).map((item, index) => {
              // Determine active type: from local state or inferred from selected service
              const selectedType =
                getServiceTypeForIndex(index) ||
                (item.service ? getServiceTypeById(item.service) : "");
              const filteredOptions = getFilteredServices(selectedType);

              return (
                <div
                  key={index}
                  className="bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-border space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-titleColor flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-mainColor inline-block" />
                      {t("fields.service")} #{index + 1}{" "}
                      <span className="text-error">*</span>
                    </span>

                    {values.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          remove(index);
                          // Clean up local type filter
                          setServiceTypeFilters((prev) => {
                            const next = { ...prev };
                            delete next[index];
                            return next;
                          });
                        }}
                        className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                      >
                        <DeleteOutlineIcon className="w-4 h-4" />
                        {t("fields.removeItem")}
                      </button>
                    )}
                  </div>

                  {/* Service Type Dropdown */}
                  <div>
                    <label className="block mb-1.5 text-xs font-bold text-titleColor uppercase tracking-wider">
                      {t("fields.serviceType")}
                    </label>
                    <SelectionGroup
                      name={`_serviceType_${index}`}
                      value={selectedType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setServiceTypeForIndex(index, newType);
                        // Reset service selection when type changes
                        setFieldValue(`services[${index}].service`, "");
                      }}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.selectServiceType")}
                      list={serviceTypeOptions}
                    />
                  </div>

                  {/* Service Dropdown (filtered by type) */}
                  <div>
                    <SelectionGroup
                      name={`services[${index}].service`}
                      value={(() => {
                        const sVal = item.service;
                        const found = servicesOptions.find((opt) => {
                          const id = opt?._id || opt?.id;
                          if (id && id === sVal) return true;
                          if (opt?.name === sVal) return true;
                          if (
                            typeof opt?.name === "object" &&
                            opt.name !== null
                          ) {
                            return (
                              opt.name.ar === sVal || opt.name.en === sVal
                            );
                          }
                          return false;
                        });
                        if (found) return getItemName(found, locale);
                        return isHexObjectId(sVal) ? "" : sVal || "";
                      })()}
                      onChange={(e) => {
                        const selectedName = e.target.value;
                        const selectedObj = filteredOptions.find((opt) => {
                          const name = getItemName(opt, locale);
                          return (
                            name === selectedName ||
                            opt.name === selectedName ||
                            (typeof opt.name === "object" &&
                              (opt.name?.ar === selectedName ||
                                opt.name?.en === selectedName))
                          );
                        });
                        setFieldValue(
                          `services[${index}].service`,
                          selectedObj?._id || selectedObj?.id || selectedName
                        );
                      }}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.selectService")}
                      list={filteredOptions
                        .map((opt) => getItemName(opt, locale))
                        .filter(Boolean)}
                    />
                  </div>

                  {/* Service Notes */}
                  <div>
                    <label className="block mb-2 text-xs font-bold text-titleColor uppercase tracking-wider">
                      {t("subtitles.serviceNotes")}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* EN Note */}
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

                      {/* AR Note */}
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
              );
            })}

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
              .map((id) => {
                const found = customServicesOptions.find((cs) => {
                  const sId = cs?._id || cs?.id;
                  if (sId && sId === id) return true;
                  if (cs?.name === id) return true;
                  if (typeof cs?.name === "object" && cs.name !== null) {
                    return cs.name.ar === id || cs.name.en === id;
                  }
                  return false;
                });
                if (found) return getItemName(found, locale);
                return isHexObjectId(id) ? "" : id;
              })
              .filter(Boolean)}
            onChange={(e) => {
              const selectedNames = Array.isArray(e.target.value)
                ? e.target.value
                : [e.target.value];
              const selectedIds = selectedNames
                .map((name) => {
                  const found = customServicesOptions.find((cs) => {
                    const csName = getItemName(cs, locale);
                    return (
                      csName === name ||
                      cs.name === name ||
                      (typeof cs.name === "object" &&
                        (cs.name?.ar === name || cs.name?.en === name))
                    );
                  });
                  return found?._id || found?.id || name;
                })
                .filter(Boolean);
              setFieldValue("customServices", selectedIds);
            }}
            onBlur={handleBlur}
            placeholder={t("placeholders.selectCustomServices")}
            list={customServicesOptions
              .map((cs) => getItemName(cs, locale))
              .filter(Boolean)}
          />
        </div>
      )}
    </div>
  );
};

export default StepServices;
