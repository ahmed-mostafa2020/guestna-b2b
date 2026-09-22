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

export const SERVICES_TYPES = [
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

const DEFAULT_DEMO_SERVICES = [
  { id: "s1", servicesType: "FOOD", name: { ar: "وجبة غداء خفيفة", en: "Light Lunch" } },
  { id: "s2", servicesType: "SUPERVISION", name: { ar: "مرشد سياحي معتمد", en: "Certified Tour Guide" } },
  { id: "s3", servicesType: "TRANSPORTATION", name: { ar: "مواصلات ذهاب وعودة", en: "Round-trip Transportation" } },
  { id: "s4", servicesType: "OTHER", name: { ar: "تذاكر الدخول للفعاليات", en: "Event Entry Tickets" } },
  { id: "s5", servicesType: "PHOTOGRAPHERS", name: { ar: "تصوير فوتوغرافي تذكاري", en: "Commemorative Photography" } },
  { id: "s6", servicesType: "MEALS", name: { ar: "مشروبات وضيافة", en: "Beverages & Hospitality" } },
];

/**
 * Reusable Service Row Item supporting Service Type filtering
 */
const ServiceRowItem = memo(
  ({
    item,
    index,
    servicesOptions = [],
    servicesTypeOptions = [],
    onChangeServiceType,
    onChangeService,
    onChangePrice,
    onChangeNoteAr,
    onChangeNoteEn,
    onRemove,
    canRemove = false,
    isSelectionsLoading = false,
    serviceTouched,
    serviceErr,
    arNoteState,
    enNoteState,
    t,
    locale,
    labelCls,
    inputBorderCls,
    inputFieldCls,
  }) => {
    // Resolve current serviceType: directly from item or from selected service in options
    const currentServiceType = useMemo(() => {
      if (item.serviceType) return item.serviceType;
      if (item.service) {
        const found = servicesOptions.find(
          (opt) => (opt?._id || opt?.id) === item.service
        );
        return found?.servicesType || found?.serviceType || "";
      }
      return "";
    }, [item.serviceType, item.service, servicesOptions]);

    // Current service type label for dropdown display
    const selectedTypeLabel = useMemo(() => {
      const match = servicesTypeOptions.find(
        (opt) => opt.value === currentServiceType
      );
      return match ? match.label : currentServiceType || "";
    }, [servicesTypeOptions, currentServiceType]);

    // Filter services according to the selected service type
    const filteredServices = useMemo(() => {
      if (!currentServiceType) return [];
      return servicesOptions.filter((s) => {
        const type = s?.servicesType || s?.serviceType;
        return type === currentServiceType;
      });
    }, [servicesOptions, currentServiceType]);

    const filteredServiceNameList = useMemo(() => {
      return filteredServices
        .map((s) => getItemName(s, locale))
        .filter(Boolean);
    }, [filteredServices, locale]);

    // Current service name for dropdown display
    const selectedServiceName = useMemo(() => {
      const sVal = item.service;
      if (!sVal) return "";
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
    }, [item.service, servicesOptions, locale]);

    return (
      <div className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4 transition-all">
        {/* Item Top Bar */}
        <div className="flex items-center justify-between">
          <span className="font-somar text-base font-medium text-textDark flex items-center gap-2">
            {t("serviceItem", { num: index + 1 })}
          </span>

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={t("removeService")}
              className="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
            >
              <DeleteOutlineIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 2-Row Inputs Grid */}
        <div className="space-y-4 sm:space-y-5">
          {/* Row 1: Service Type & Service Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
            {/* 1. Service Type Dropdown */}
            <div>
              <SelectionGroup
                name={`services[${index}].serviceType`}
                value={selectedTypeLabel}
                onChange={(e) => {
                  const labelOrVal = e.target.value;
                  const match = servicesTypeOptions.find(
                    (opt) =>
                      opt.label === labelOrVal || opt.value === labelOrVal
                  );
                  const newTypeVal = match ? match.value : labelOrVal;
                  onChangeServiceType(newTypeVal);
                }}
                label={t("serviceTypeLabel")}
                labelClassName={labelCls}
                placeholder={t("serviceTypePlaceholder")}
                border="1px solid var(--color-border)"
                list={servicesTypeOptions.map((opt) => opt.label)}
                disabled={isSelectionsLoading}
              />
            </div>

            {/* 2. Filtered Service Dropdown */}
            <div>
              <SelectionGroup
                name={`services[${index}].service`}
                required={true}
                value={selectedServiceName}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const selectedObj = filteredServices.find((opt) => {
                    const name = getItemName(opt, locale);
                    return (
                      name === selectedName ||
                      opt.name === selectedName ||
                      (typeof opt.name === "object" &&
                        (opt.name?.ar === selectedName ||
                          opt.name?.en === selectedName))
                    );
                  });
                  onChangeService(selectedObj, selectedName);
                }}
                label={t("serviceLabel")}
                labelClassName={labelCls}
                placeholder={
                  currentServiceType
                    ? t("servicePlaceholder")
                    : t("selectServiceTypeFirst")
                }
                border="1px solid var(--color-border)"
                list={filteredServiceNameList}
                disabled={isSelectionsLoading || !currentServiceType}
                touched={serviceTouched}
                errors={serviceErr}
              />
            </div>
          </div>

          {/* Row 2: Price, Arabic Notes, English Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-start">
            {/* 3. Service Price */}
            <div>
              <TextInputGroup
                type="number"
                min="0"
                name={`services[${index}].price`}
                value={item.price ?? ""}
                onChange={(e) => onChangePrice(e.target.value)}
                label={t("servicePrice")}
                labelClassName={labelCls}
                placeholder={t("servicePricePlaceholder")}
                borderClassName={inputBorderCls}
                inputClassName={inputFieldCls}
                autoComplete="off"
              />
            </div>

            {/* 4. Arabic Notes */}
            <div>
              <TextInputGroup
                type="text"
                name={`services[${index}].note.ar`}
                value={item.note?.ar || ""}
                onChange={(e) => onChangeNoteAr(e.target.value)}
                touched={arNoteState?.showError}
                errors={arNoteState?.error}
                label={t("notesArLabel")}
                labelClassName={labelCls}
                placeholder={t("notesArPlaceholder")}
                borderClassName={inputBorderCls}
                inputClassName={inputFieldCls}
                autoComplete="off"
              />
            </div>

            {/* 5. English Notes */}
            <div dir="ltr" className="text-start">
              <TextInputGroup
                type="text"
                name={`services[${index}].note.en`}
                value={item.note?.en || ""}
                onChange={(e) => onChangeNoteEn(e.target.value)}
                touched={enNoteState?.showError}
                errors={enNoteState?.error}
                label={t("notesEnLabel")}
                labelClassName={labelCls}
                placeholder={t("notesEnPlaceholder")}
                borderClassName={inputBorderCls}
                inputClassName={inputFieldCls}
                textAlign="left"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ServiceRowItem.displayName = "ServiceRowItem";

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
    setFieldValue,
  } = useFormikContext();

  // Helper for field error state matching Step 1
  const getFieldErrorState = useCallback(
    (path) => {
      const error = getIn(errors, path);
      const isTouched = getIn(touched, path);
      const val = getIn(values, path);
      return {
        error: typeof error === "string" ? error : undefined,
        showError: Boolean(
          error &&
            (isTouched ||
              (typeof val === "string" && val.trim().length > 0))
        ),
      };
    },
    [errors, touched, values]
  );

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
            { service: "", serviceType: "", price: "", note: { ar: "", en: "" } },
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

  // Service Type options list for dropdown
  const servicesTypeOptions = useMemo(() => {
    return SERVICES_TYPES.map((typeKey) => ({
      value: typeKey,
      label: t(`servicesTypes.${typeKey}`) || typeKey,
    }));
  }, [t]);

  // Branch-specific services initialized in form values or local state fallback
  const branchServicesData = values.branchServices || {};

  const labelCls =
    "font-somar text-sm sm:text-base font-medium text-textDark text-start block";
  const inputBorderCls =
    "border border-border hover:border-mainColor focus:border-mainColor";
  const inputFieldCls = "!h-[52px] !py-0 px-4";

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

                  return (
                    <ServiceRowItem
                      key={index}
                      item={item}
                      index={index}
                      servicesOptions={servicesOptions}
                      servicesTypeOptions={servicesTypeOptions}
                      onChangeServiceType={(newType) => {
                        setFieldValue(`services[${index}].serviceType`, newType);
                        // Reset service if current service doesn't belong to the new type
                        const currentServiceObj = servicesOptions.find(
                          (opt) => (opt?._id || opt?.id) === item.service
                        );
                        const matchType =
                          currentServiceObj?.servicesType ||
                          currentServiceObj?.serviceType;
                        if (matchType !== newType) {
                          setFieldValue(`services[${index}].service`, "");
                          setFieldValue(`services[${index}].name`, { ar: "", en: "" });
                        }
                      }}
                      onChangeService={(selectedObj, selectedName) => {
                        const sId = selectedObj?._id || selectedObj?.id || selectedName;
                        setFieldValue(`services[${index}].service`, sId);
                        if (selectedObj) {
                          const nameEn =
                            selectedObj.name?.en ||
                            (typeof selectedObj.name === "string"
                              ? selectedObj.name
                              : selectedName);
                          const nameAr =
                            selectedObj.name?.ar ||
                            (typeof selectedObj.name === "string"
                              ? selectedObj.name
                              : selectedName);
                          setFieldValue(`services[${index}].name`, {
                            en: nameEn,
                            ar: nameAr,
                          });
                        }
                      }}
                      onChangePrice={(priceVal) => {
                        setFieldValue(`services[${index}].price`, priceVal);
                        const numVal = Number(priceVal) || 0;
                        setFieldValue(`services[${index}].isPaid`, numVal > 0);
                      }}
                      onChangeNoteAr={(noteArVal) => {
                        setFieldValue(`services[${index}].note.ar`, noteArVal);
                      }}
                      onChangeNoteEn={(noteEnVal) => {
                        setFieldValue(`services[${index}].note.en`, noteEnVal);
                      }}
                      onRemove={() => remove(index)}
                      canRemove={servicesList.length > 1}
                      isSelectionsLoading={isSelectionsLoading}
                      serviceTouched={serviceTouched}
                      serviceErr={serviceErr}
                      arNoteState={getFieldErrorState(`services[${index}].note.ar`)}
                      enNoteState={getFieldErrorState(`services[${index}].note.en`)}
                      t={t}
                      locale={locale}
                      labelCls={labelCls}
                      inputBorderCls={inputBorderCls}
                      inputFieldCls={inputFieldCls}
                    />
                  );
                })}

                {/* Add Service Button */}
                <button
                  type="button"
                  onClick={() =>
                    push({
                      service: "",
                      serviceType: "",
                      price: "",
                      isPaid: false,
                      note: { ar: "", en: "" },
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-semibold text-sm transition-all duration-200 cursor-pointer"
                >
                  <AddIcon className="w-5 h-5" />
                  <span>{t("addServiceBtn")}</span>
                </button>
              </div>
            );
          }}
        </FieldArray>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Branch Customization Card
      ───────────────────────────────────────────────────────────── */}
      <section
        id="branch-services-section"
        aria-labelledby="branch-services-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-6 sm:mb-8 text-start">
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="branch-services-title"
                className="font-somar text-xl font-medium text-textDark leading-6"
              >
                {t("customizeDatesTitle")}
              </h2>
              {isCustomizedActive && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-mainColor/10 text-mainColor">
                  <AutoAwesomeOutlinedIcon className="w-3.5 h-3.5" />
                  {t("selectedBranchesCount", {
                    count: selectedBranchIds.length,
                  })}
                </span>
              )}
            </div>
            <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
              {t("customizeDatesSubtitle")}
            </p>
          </div>

          {/* Top Actions: Customize or Edit / Cancel */}
          <div className="flex items-center gap-3">
            {isCustomizedActive ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(true)}
                  className="px-4 py-2 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  <EditOutlinedIcon className="w-4 h-4" />
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
                className="px-4 py-2 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{t("branchCustomizeBtn")}</span>
              </button>
            )}
          </div>
        </div>

        {/* When NOT customized: Empty placeholder state */}
        {!isCustomizedActive ? (
          <div className="py-12 px-4 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-3 bg-gray-50/50">
            <h3 className="font-somar font-bold text-base text-textDark">
              {t("emptyBranchesTitle")}
            </h3>
            <p className="font-somar text-xs sm:text-sm text-textLight max-w-md">
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
              const branchName =
                branch.name?.[locale] ||
                branch.name?.ar ||
                branch.name?.en ||
                "";
              const branchSubtitle =
                branch.fullName?.[locale] ||
                branch.fullName?.ar ||
                branch.fullName?.en ||
                "";
              const branchServices = branchServicesData[branch.id] || [
                { service: "", serviceType: "", price: "", note: { ar: "", en: "" } },
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
                        <p className="font-somar text-xs sm:text-sm text-textLight mt-0.5">
                          {branchSubtitle}
                        </p>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-textDark hover:bg-buttonsHover/30 transition-colors">
                      {isOpen ? (
                        <KeyboardArrowUpIcon className="w-5 h-5 text-textLight" />
                      ) : (
                        <KeyboardArrowDownIcon className="w-5 h-5 text-textLight" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="p-4 sm:p-6 bg-white border-t border-border space-y-4 sm:space-y-6">
                      {branchServices.map((bItem, bIdx) => {
                        return (
                          <ServiceRowItem
                            key={bIdx}
                            item={bItem}
                            index={bIdx}
                            servicesOptions={servicesOptions}
                            servicesTypeOptions={servicesTypeOptions}
                            onChangeServiceType={(newType) => {
                              const updated = [...branchServices];
                              const currentServiceObj = servicesOptions.find(
                                (opt) => (opt?._id || opt?.id) === bItem.service
                              );
                              const matchType =
                                currentServiceObj?.servicesType ||
                                currentServiceObj?.serviceType;

                              updated[bIdx] = {
                                ...updated[bIdx],
                                serviceType: newType,
                                service: matchType === newType ? updated[bIdx].service : "",
                              };
                              setFieldValue(
                                `branchServices.${branch.id}`,
                                updated
                              );
                            }}
                            onChangeService={(selectedObj, selectedName) => {
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
                            onChangePrice={(priceVal) => {
                              const updated = [...branchServices];
                              updated[bIdx] = {
                                ...updated[bIdx],
                                price: priceVal,
                                isPaid: (Number(priceVal) || 0) > 0,
                              };
                              setFieldValue(
                                `branchServices.${branch.id}`,
                                updated
                              );
                            }}
                            onChangeNoteAr={(noteArVal) => {
                              const updated = [...branchServices];
                              updated[bIdx] = {
                                ...updated[bIdx],
                                note: {
                                  ...(updated[bIdx].note || {}),
                                  ar: noteArVal,
                                },
                              };
                              setFieldValue(
                                `branchServices.${branch.id}`,
                                updated
                              );
                            }}
                            onChangeNoteEn={(noteEnVal) => {
                              const updated = [...branchServices];
                              updated[bIdx] = {
                                ...updated[bIdx],
                                note: {
                                  ...(updated[bIdx].note || {}),
                                  en: noteEnVal,
                                },
                              };
                              setFieldValue(
                                `branchServices.${branch.id}`,
                                updated
                              );
                            }}
                            onRemove={() => {
                              const updated = branchServices.filter(
                                (_, i) => i !== bIdx
                              );
                              setFieldValue(
                                `branchServices.${branch.id}`,
                                updated
                              );
                            }}
                            canRemove={branchServices.length > 1}
                            isSelectionsLoading={isSelectionsLoading}
                            serviceTouched={false}
                            serviceErr={null}
                            arNoteState={{ showError: false, error: null }}
                            enNoteState={{ showError: false, error: null }}
                            t={t}
                            locale={locale}
                            labelCls={labelCls}
                            inputBorderCls={inputBorderCls}
                            inputFieldCls={inputFieldCls}
                          />
                        );
                      })}

                      {/* Add Branch Service Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue(`branchServices.${branch.id}`, [
                            ...branchServices,
                            {
                              service: "",
                              serviceType: "",
                              price: "",
                              isPaid: false,
                              note: { ar: "", en: "" },
                            },
                          ]);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
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
        allowedBranchIds={values.providerBranchs}
        title={t("sidebarTitle")}
        subtitle={t("sidebarSubtitle")}
        saveBtnText={t("saveBtn")}
      />
    </div>
  );
};

export default memo(Step5Services);
