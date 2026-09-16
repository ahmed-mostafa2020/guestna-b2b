"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { useFormikContext, FieldArray, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import BranchCustomizationSidebar from "./BranchCustomizationSidebar";
import {
  buildBranchGroups,
  getItemName,
} from "../branchConstants";

const isHexObjectId = (str) =>
  typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

const DEFAULT_DEMO_SERVICES = [
  { id: "s1", name: { ar: "وجبة غداء خفيفة", en: "Light Lunch" } },
  { id: "s2", name: { ar: "مرشد سياحي معتمد", en: "Certified Tour Guide" } },
  { id: "s3", name: { ar: "مواصلات ذهاب وعودة", en: "Round-trip Transportation" } },
  { id: "s4", name: { ar: "تذاكر الدخول للفعاليات", en: "Event Entry Tickets" } },
  { id: "s5", name: { ar: "تصوير فوتوغرافي تذكاري", en: "Commemorative Photography" } },
  { id: "s6", name: { ar: "مشروبات وضيافة", en: "Beverages & Hospitality" } },
];

const Step5Services = ({
  formSelectionData = null,
  isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.step5");
  const locale = useLocale();
  const isAr = locale === "ar";

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormikContext();

  // Sidebar open/closed state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Manage open branches accordion state
  const [openBranches, setOpenBranches] = useState({});

  // Prepare branch groups (by city)
  const branchGroups = useMemo(() => {
    return buildBranchGroups(formSelectionData?.providerBranchs, locale, isAr);
  }, [formSelectionData?.providerBranchs, locale, isAr]);

  // Flattened branch map for quick lookup by ID
  const allBranchesMap = useMemo(() => {
    const map = new Map();
    branchGroups.forEach((group) => {
      group.branches?.forEach((b) => {
        map.set(b.id, b);
      });
    });
    return map;
  }, [branchGroups]);

  // Selected branch IDs for customization
  const [selectedBranchIds, setSelectedBranchIds] = useState(() => {
    if (Array.isArray(values.customizedBranchIds) && values.customizedBranchIds.length > 0) {
      return values.customizedBranchIds;
    }
    if (values.branchServices && typeof values.branchServices === "object") {
      const keys = Object.keys(values.branchServices).filter((k) => {
        const item = values.branchServices[k];
        return Array.isArray(item) && item.length > 0;
      });
      if (keys.length > 0) return keys;
    }
    return [];
  });

  const isCustomizedActive = selectedBranchIds.length > 0;

  // Active customized branch objects to render in form
  const activeCustomizedBranches = useMemo(() => {
    return selectedBranchIds
      .map((id) => allBranchesMap.get(id))
      .filter(Boolean);
  }, [selectedBranchIds, allBranchesMap]);

  // Handle saving branch selections from sidebar
  const handleSaveSelectedBranches = useCallback(
    (newSelectedIds) => {
      setSelectedBranchIds(newSelectedIds);
      setFieldValue("customizedBranchIds", newSelectedIds);

      const currentBranchServices = { ...(values.branchServices || {}) };
      newSelectedIds.forEach((bId) => {
        if (!currentBranchServices[bId] || currentBranchServices[bId].length === 0) {
          currentBranchServices[bId] = [
            { service: "", note: { ar: "", en: "" } },
          ];
        }
      });
      // Remove unselected branches from formik state
      Object.keys(currentBranchServices).forEach((bId) => {
        if (!newSelectedIds.includes(bId)) {
          delete currentBranchServices[bId];
        }
      });
      setFieldValue("branchServices", currentBranchServices);

      // Automatically open the first branch accordion if none open
      if (newSelectedIds.length > 0) {
        setOpenBranches((prev) => ({
          ...prev,
          [newSelectedIds[0]]: true,
        }));
      }
    },
    [values.branchServices, setFieldValue]
  );

  // Handle clearing customization
  const handleCancelCustomization = useCallback(() => {
    setSelectedBranchIds([]);
    setFieldValue("customizedBranchIds", []);
    setFieldValue("branchServices", {});
  }, [setFieldValue]);

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

  // Branch-specific services initialized in form values or local state fallback
  const branchServicesData = values.branchServices || {};

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
        id="services"
        aria-labelledby="services-default-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none scroll-mt-6"
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
          {typeof errors.services === "string" && touched.services && (
            <p className="text-xs text-error mt-2 font-medium">
              {errors.services}
            </p>
          )}
        </div>

        {/* Services List with FieldArray */}
        <FieldArray name="services">
          {({ push, remove }) => {
            const servicesList = values.services || [];
            return (
              <div className="space-y-4 sm:space-y-6">
                {servicesList.map((item, index) => {
                  const serviceErr =
                    getIn(errors, `services[${index}].service`) ||
                    (index === 0 && typeof errors.services === "string"
                      ? errors.services
                      : null);
                  const serviceTouched =
                    getIn(touched, `services[${index}].service`) ||
                    Boolean(touched.services);

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

                      {/* 4 Inputs Grid: Service, Price, AR Notes, EN Notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                            touched={serviceTouched}
                            errors={serviceErr}
                          />
                        </div>

                        {/* Service Price */}
                        <div>
                          <TextInputGroup
                            type="number"
                            min="0"
                            name={`services[${index}].price`}
                            value={item.price ?? ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={t("servicePrice")}
                            labelClassName={labelCls}
                            placeholder={t("servicePricePlaceholder")}
                            borderClassName={inputBorderCls}
                            autoComplete="off"
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
                    push({ service: "", price: 0, note: { en: "", ar: "" } })
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

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isCustomizedActive ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="px-4 py-2 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>{t("editBranchesBtn")}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelCustomization}
                  className="px-3 py-2 rounded-lg text-error hover:bg-error/5 font-somar text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  {t("cancelCustomizeBtn")}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="px-4 py-2 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                {t("branchCustomizeBtn")}
              </button>
            )}
          </div>
        </div>

        {/* When NOT customized: Empty State Box Matching Figma */}
        {!isCustomizedActive ? (
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
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-mainColor hover:bg-titleColor text-white font-somar font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm"
            >
              {t("branchCustomizeBtn")}
            </button>
          </div>
        ) : (
          /* When CUSTOMIZED: Branches Accordion List for Selected Branches ONLY */
          <div className="space-y-4">
            {activeCustomizedBranches.map((branch) => {
              const isOpen = Boolean(openBranches[branch.id]);
              const branchName = branch.name?.[locale] || branch.name?.ar || branch.name?.en || "";
              const branchSubtitle = branch.fullName?.[locale] || branch.fullName?.ar || branch.fullName?.en || "";
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

                              {/* Service Price */}
                              <div>
                                <TextInputGroup
                                  type="number"
                                  min="0"
                                  name={`branchServices.${branch.id}[${bIdx}].price`}
                                  value={bItem.price ?? ""}
                                  onChange={(e) => {
                                    const updated = [...branchServices];
                                    updated[bIdx] = {
                                      ...updated[bIdx],
                                      price: e.target.value,
                                    };
                                    setFieldValue(
                                      `branchServices.${branch.id}`,
                                      updated
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  label={t("servicePrice")}
                                  labelClassName={labelCls}
                                  placeholder={t("servicePricePlaceholder")}
                                  borderClassName={inputBorderCls}
                                  autoComplete="off"
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

      {/* Branch Customization Sidebar Drawer */}
      <BranchCustomizationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedBranchIds={selectedBranchIds}
        onSave={handleSaveSelectedBranches}
        branchGroups={branchGroups}
      />
    </div>
  );
};

export default memo(Step5Services);
