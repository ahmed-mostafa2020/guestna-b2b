"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { useFormikContext, FieldArray } from "formik";
import { useTranslations, useLocale } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { cn } from "@utils/helpers/cn";

const isHexObjectId = (str) =>
  typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

const getItemName = (item, locale) => {
  if (!item) return "";
  if (typeof item === "string") {
    return isHexObjectId(item) ? "" : item;
  }
  if (typeof item.name === "object" && item.name !== null) {
    return item.name[locale] || item.name.ar || item.name.en || "";
  }
  return item.name || item.title || item.label || "";
};

const DEFAULT_DEMO_SERVICES = [
  { id: "s1", name: { ar: "وجبة غداء خفيفة", en: "Light Lunch" } },
  { id: "s2", name: { ar: "مرشد سياحي معتمد", en: "Certified Tour Guide" } },
  { id: "s3", name: { ar: "مواصلات ذهاب وعودة", en: "Round-trip Transportation" } },
  { id: "s4", name: { ar: "تذاكر الدخول للفعاليات", en: "Event Entry Tickets" } },
  { id: "s5", name: { ar: "تصوير فوتوغرافي تذكاري", en: "Commemorative Photography" } },
  { id: "s6", name: { ar: "مشروبات وضيافة", en: "Beverages & Hospitality" } },
];

const DEFAULT_DEMO_BRANCHES = [
  {
    id: "branch-1",
    name: { ar: "فرع النخيل - الرياض", en: "Al-Nakheel Branch - Riyadh" },
    subtitle: { ar: "فرع النخيل - الرياض", en: "Al-Nakheel Branch - Riyadh" },
  },
  {
    id: "branch-2",
    name: { ar: "فرع العليا - الرياض", en: "Al-Olaya Branch - Riyadh" },
    subtitle: { ar: "فرع العليا - الرياض", en: "Al-Olaya Branch - Riyadh" },
  },
  {
    id: "branch-3",
    name: { ar: "فرع الروضة - جدة", en: "Al-Rawdah Branch - Jeddah" },
    subtitle: { ar: "فرع الروضة - جدة", en: "Al-Rawdah Branch - Jeddah" },
  },
];

const Step5Services = ({
  formSelectionData = null,
  isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.step5");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, handleChange, handleBlur, setFieldValue } = useFormikContext();

  // Manage open branches accordion state
  const [openBranches, setOpenBranches] = useState({ "branch-1": true });
  // Toggle for branch customisation mode
  const [isBranchCustomizeActive, setIsBranchCustomizeActive] = useState(false);

  const toggleBranch = useCallback((branchId) => {
    setOpenBranches((prev) => ({
      ...prev,
      [branchId]: !prev[branchId],
    }));
  }, []);

  // Prepare services list options
  const servicesOptions = useMemo(() => {
    const rawServices = formSelectionData?.services;
    if (Array.isArray(rawServices) && rawServices.length > 0) {
      return rawServices;
    }
    return DEFAULT_DEMO_SERVICES;
  }, [formSelectionData?.services]);

  const serviceNameList = useMemo(() => {
    return servicesOptions
      .map((s) => getItemName(s, locale))
      .filter(Boolean);
  }, [servicesOptions, locale]);

  // Prepare branches list
  const branchesList = useMemo(() => {
    const rawBranches = formSelectionData?.providerBranchs;
    if (Array.isArray(rawBranches) && rawBranches.length > 0) {
      return rawBranches.map((b, idx) => ({
        id: b._id || b.id || `branch-${idx}`,
        name: {
          ar: getItemName(b, "ar") || `فرع ${idx + 1}`,
          en: getItemName(b, "en") || `Branch ${idx + 1}`,
        },
        subtitle: {
          ar: getItemName(b, "ar") || `فرع ${idx + 1}`,
          en: getItemName(b, "en") || `Branch ${idx + 1}`,
        },
      }));
    }
    return DEFAULT_DEMO_BRANCHES;
  }, [formSelectionData?.providerBranchs]);

  // Branch-specific services initialized in form values or local state fallback
  const branchServicesData = values.branchServices || {
    "branch-1": [
      { service: "", note: { ar: "", en: "" } },
      { service: "", note: { ar: "", en: "" } },
    ],
  };

  const labelCls =
    "font-somar text-sm sm:text-base font-medium text-textDark text-start block mb-1";
  const inputBorderCls =
    "border border-border hover:border-mainColor focus:border-mainColor";

  return (
    <div className="flex flex-col gap-6 sm:gap-8" dir={isAr ? "rtl" : "ltr"}>
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: Default Services Card
      ───────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="services-default-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-start">
          <h2
            id="services-default-title"
            className="font-somar text-xl font-medium text-textDark leading-6"
          >
            {t("cardTitle")}
          </h2>
          <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
            {t("cardSubtitle")}
          </p>
        </div>

        {/* Services List with FieldArray */}
        <FieldArray name="services">
          {({ push, remove }) => {
            const servicesList = values.services || [];
            return (
              <div className="space-y-4 sm:space-y-6">
                {servicesList.map((item, index) => {
                  const selectedServiceName = (() => {
                    const sVal = item.service;
                    const found = servicesOptions.find((opt) => {
                      const id = opt?._id || opt?.id;
                      if (id && id === sVal) return true;
                      if (opt?.name === sVal) return true;
                      if (typeof opt?.name === "object" && opt.name !== null) {
                        return opt.name.ar === sVal || opt.name.en === sVal;
                      }
                      return false;
                    });
                    if (found) return getItemName(found, locale);
                    return isHexObjectId(sVal) ? "" : sVal || "";
                  })();

                  return (
                    <div
                      key={index}
                      className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4 transition-all"
                    >
                      {/* Item Top Bar */}
                      <div className="flex items-center justify-between">
                        <span className="font-somar text-base font-medium text-textDark flex items-center gap-2">
                          {t("serviceItem", { num: index + 1 })}
                        </span>

                        {servicesList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            aria-label={t("removeService")}
                            className="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <DeleteOutlineIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* 3 Inputs Grid: Service, AR Notes, EN Notes */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {/* Service Selection */}
                        <div>
                          <SelectionGroup
                            name={`services[${index}].service`}
                            required={true}
                            value={selectedServiceName}
                            onChange={(e) => {
                              const selectedName = e.target.value;
                              const selectedObj = servicesOptions.find((opt) => {
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
                            label={t("serviceLabel")}
                            labelClassName={labelCls}
                            placeholder={t("servicePlaceholder")}
                            border="1px solid var(--color-border)"
                            list={serviceNameList}
                            disabled={isSelectionsLoading}
                          />
                        </div>

                        {/* Arabic Notes */}
                        <div>
                          <TextInputGroup
                            type="text"
                            name={`services[${index}].note.ar`}
                            value={item.note?.ar || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={t("notesArLabel")}
                            labelClassName={labelCls}
                            placeholder={t("notesArPlaceholder")}
                            borderClassName={inputBorderCls}
                            autoComplete="off"
                          />
                        </div>

                        {/* English Notes */}
                        <div dir="ltr" className="text-start">
                          <TextInputGroup
                            type="text"
                            name={`services[${index}].note.en`}
                            value={item.note?.en || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={t("notesEnLabel")}
                            labelClassName={labelCls}
                            placeholder={t("notesEnPlaceholder")}
                            borderClassName={inputBorderCls}
                            textAlign="left"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Service Button */}
                <button
                  type="button"
                  onClick={() =>
                    push({ service: "", note: { en: "", ar: "" } })
                  }
                  className="w-full py-3 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AddIcon className="w-4 h-4" />
                  <span>{t("addServiceBtn")}</span>
                </button>
              </div>
            );
          }}
        </FieldArray>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Branch Customization (Toggles between Empty State & Accordion)
      ───────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="branch-customization-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Header with action button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 text-start">
          <div>
            <h2
              id="branch-customization-title"
              className="font-somar text-xl font-medium text-textDark leading-6"
            >
              {t("cardTitle")}
            </h2>
            <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
              {t("cardSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBranchCustomizeActive((prev) => !prev)}
            className={cn(
              "self-start sm:self-auto px-4 py-2 rounded-lg border font-somar text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap",
              isBranchCustomizeActive
                ? "border-mainColor bg-mainColor text-white hover:bg-titleColor"
                : "border-mainColor text-mainColor hover:bg-mainColor/5"
            )}
          >
            {isBranchCustomizeActive
              ? t("cancelCustomizeBtn")
              : t("branchCustomizeBtn")}
          </button>
        </div>

        {/* When NOT customized: Empty State Box Matching Figma */}
        {!isBranchCustomizeActive ? (
          <div className="bg-[#F9FAFA] border border-gray-200 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400">
              <AutoAwesomeOutlinedIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-somar font-bold text-base sm:text-lg text-titleColor">
              {t("emptyBranchesTitle")}
            </h3>
            <p className="font-somar text-xs sm:text-sm text-gray-500 max-w-md">
              {t("emptyBranchesSubtitle")}
            </p>
          </div>
        ) : (
          /* When CUSTOMIZED: Branches Accordion List */
          <div className="space-y-4">
          {branchesList.map((branch) => {
            const isOpen = Boolean(openBranches[branch.id]);
            const branchName = branch.name?.[locale] || branch.name?.ar || branch.name?.en || "";
            const branchSubtitle = branch.subtitle?.[locale] || branch.subtitle?.ar || branch.subtitle?.en || "";
            const branchServices = branchServicesData[branch.id] || [
              { service: "", note: { ar: "", en: "" } },
            ];

            return (
              <div
                key={branch.id}
                className="rounded-2xl border border-border overflow-hidden transition-all duration-200"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleBranch(branch.id)}
                  className="w-full p-4 sm:p-5 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="text-start">
                    <h4 className="font-somar font-bold text-base text-titleColor">
                      {branchName}
                    </h4>
                    {branchSubtitle && (
                      <p className="font-somar text-xs sm:text-sm text-gray-500 mt-0.5">
                        {branchSubtitle}
                      </p>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-textDark hover:bg-gray-200/50 transition-colors">
                    {isOpen ? (
                      <KeyboardArrowUpIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <KeyboardArrowDownIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="p-4 sm:p-6 bg-white border-t border-border space-y-4 sm:space-y-6">
                    {branchServices.map((bItem, bIdx) => {
                      const selectedServiceName = (() => {
                        const sVal = bItem.service;
                        const found = servicesOptions.find((opt) => {
                          const id = opt?._id || opt?.id;
                          if (id && id === sVal) return true;
                          if (opt?.name === sVal) return true;
                          if (typeof opt?.name === "object" && opt.name !== null) {
                            return opt.name.ar === sVal || opt.name.en === sVal;
                          }
                          return false;
                        });
                        if (found) return getItemName(found, locale);
                        return isHexObjectId(sVal) ? "" : sVal || "";
                      })();

                      return (
                        <div
                          key={bIdx}
                          className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-somar text-base font-medium text-textDark">
                              {t("serviceItem", { num: bIdx + 1 })}
                            </span>

                            {branchServices.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = branchServices.filter(
                                    (_, i) => i !== bIdx
                                  );
                                  setFieldValue(
                                    `branchServices.${branch.id}`,
                                    updated
                                  );
                                }}
                                aria-label={t("removeService")}
                                className="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <DeleteOutlineIcon className="w-5 h-5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {/* Service dropdown */}
                            <div>
                              <SelectionGroup
                                name={`branchServices.${branch.id}[${bIdx}].service`}
                                required={true}
                                value={selectedServiceName}
                                onChange={(e) => {
                                  const selectedName = e.target.value;
                                  const selectedObj = servicesOptions.find((opt) => {
                                    const name = getItemName(opt, locale);
                                    return (
                                      name === selectedName ||
                                      opt.name === selectedName ||
                                      (typeof opt.name === "object" &&
                                        (opt.name?.ar === selectedName ||
                                          opt.name?.en === selectedName))
                                    );
                                  });
                                  const updated = [...branchServices];
                                  updated[bIdx] = {
                                    ...updated[bIdx],
                                    service:
                                      selectedObj?._id ||
                                      selectedObj?.id ||
                                      selectedName,
                                  };
                                  setFieldValue(
                                    `branchServices.${branch.id}`,
                                    updated
                                  );
                                }}
                                onBlur={handleBlur}
                                label={t("serviceLabel")}
                                labelClassName={labelCls}
                                placeholder={t("servicePlaceholder")}
                                border="1px solid var(--color-border)"
                                list={serviceNameList}
                                disabled={isSelectionsLoading}
                              />
                            </div>

                            {/* Arabic Notes */}
                            <div>
                              <TextInputGroup
                                type="text"
                                name={`branchServices.${branch.id}[${bIdx}].note.ar`}
                                value={bItem.note?.ar || ""}
                                onChange={(e) => {
                                  const updated = [...branchServices];
                                  updated[bIdx] = {
                                    ...updated[bIdx],
                                    note: {
                                      ...updated[bIdx]?.note,
                                      ar: e.target.value,
                                    },
                                  };
                                  setFieldValue(
                                    `branchServices.${branch.id}`,
                                    updated
                                  );
                                }}
                                onBlur={handleBlur}
                                label={t("notesArLabel")}
                                labelClassName={labelCls}
                                placeholder={t("notesArPlaceholder")}
                                borderClassName={inputBorderCls}
                                autoComplete="off"
                              />
                            </div>

                            {/* English Notes */}
                            <div dir="ltr" className="text-start">
                              <TextInputGroup
                                type="text"
                                name={`branchServices.${branch.id}[${bIdx}].note.en`}
                                value={bItem.note?.en || ""}
                                onChange={(e) => {
                                  const updated = [...branchServices];
                                  updated[bIdx] = {
                                    ...updated[bIdx],
                                    note: {
                                      ...updated[bIdx]?.note,
                                      en: e.target.value,
                                    },
                                  };
                                  setFieldValue(
                                    `branchServices.${branch.id}`,
                                    updated
                                  );
                                }}
                                onBlur={handleBlur}
                                label={t("notesEnLabel")}
                                labelClassName={labelCls}
                                placeholder={t("notesEnPlaceholder")}
                                borderClassName={inputBorderCls}
                                textAlign="left"
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [
                          ...branchServices,
                          { service: "", note: { ar: "", en: "" } },
                        ];
                        setFieldValue(`branchServices.${branch.id}`, updated);
                      }}
                      className="w-full py-3 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <AddIcon className="w-4 h-4" />
                      <span>{t("addServiceBtn")}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  </div>
  );
};

export default memo(Step5Services);
