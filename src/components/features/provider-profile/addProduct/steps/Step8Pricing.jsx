"use client";

import { memo, useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useFormikContext, FieldArray, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import CheckboxGroup from "@components/forms/CheckboxGroup";
import formatCurrency from "@utils/formatters/FormatCurrency";
import { newSarSmall } from "@assets/svg";
import { cn } from "@utils/helpers/cn";
import BranchCustomizationSidebar from "./BranchCustomizationSidebar";
import {
  buildBranchGroups,
  getItemName,
  getItemDescription,
} from "../branchConstants";

const Step8Pricing = ({
  formSelectionData = null,
  isSelectionsLoading: _isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.stepPricing");
  const locale = useLocale();
  const isAr = locale === "ar";

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    submitCount,
  } = useFormikContext();

  const selectedSystemTypes = Array.isArray(values.systemTypes)
    ? values.systemTypes
    : [];
  const isB2BEnabled = selectedSystemTypes.includes("B2B");
  const isB2CEnabled =
    selectedSystemTypes.includes("B2C") ||
    (!isB2BEnabled && selectedSystemTypes.length === 0);
  const showBothTabs = isB2BEnabled && isB2CEnabled;

  // Active pricing tab: only "individual" (B2C) and "schools" (B2B)
  const [activeTab, setActiveTab] = useState(() => {
    if (!isB2CEnabled && isB2BEnabled) {
      return "schools";
    }
    return "individual";
  });

  // Keep activeTab in sync with step 3 channel selection
  useEffect(() => {
    if (!isB2CEnabled && isB2BEnabled && activeTab !== "schools") {
      setActiveTab("schools");
    } else if (!isB2BEnabled && isB2CEnabled && activeTab !== "individual") {
      setActiveTab("individual");
    }
  }, [isB2BEnabled, isB2CEnabled, activeTab]);

  // Auto-switch tabs when user attempts to proceed and errors belong to the inactive tab
  const lastSubmitCountRef = useRef(submitCount);
  useEffect(() => {
    if (submitCount > lastSubmitCountRef.current) {
      lastSubmitCountRef.current = submitCount;
      if (showBothTabs) {
        const hasB2CInvalid = Boolean(
          getIn(errors, "price") ||
            getIn(errors, "discountedPrice") ||
            getIn(errors, "targetAudiences") ||
            getIn(errors, "datePricing")
        );
        const hasB2BInvalid = Boolean(
          getIn(errors, "b2bPrice") ||
            getIn(errors, "b2bPricing") ||
            getIn(errors, "bulkPricing") ||
            getIn(errors, "studentsPerSupervisor")
        );

        if (activeTab === "individual" && !hasB2CInvalid && hasB2BInvalid) {
          setActiveTab("schools");
        } else if (activeTab === "schools" && !hasB2BInvalid && hasB2CInvalid) {
          setActiveTab("individual");
        }
      }
    }
  }, [submitCount, errors, showBothTabs, activeTab]);

  // Branch customization states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openBranches, setOpenBranches] = useState({});

  // Helper to calculate price based on base price, condition rule key (INCREASE/DECREASE) and percentage
  const calculateRulePrice = useCallback((basePrice, changeType, percentage) => {
    const numBase = Number(basePrice) || 0;
    const numPercent = Number(percentage) || 0;
    if (!numBase) return "";
    if (changeType === "DECREASE") {
      return Math.max(0, Math.round(numBase - (numBase * numPercent) / 100));
    }
    return Math.round(numBase + (numBase * numPercent) / 100);
  }, []);

  // Ensure values.datePricing, values.key, values.conditionRuleValue, b2bPrice, and branchPricing rules are initialized
  useEffect(() => {
    if (!Array.isArray(values.datePricing) || values.datePricing.length === 0) {
      setFieldValue("datePricing", [{ date: "", price: "" }], false);
    }
    if (!values.key) {
      setFieldValue("key", "INCREASE", false);
    }
    if (values.conditionRuleValue === undefined || values.conditionRuleValue === "") {
      setFieldValue("conditionRuleValue", "15", false);
    }

    if (
      !values.b2bPrice?.datePricing ||
      !Array.isArray(values.b2bPrice.datePricing) ||
      values.b2bPrice.datePricing.length === 0
    ) {
      setFieldValue("b2bPrice.datePricing", [{ date: "", price: "" }], false);
    }
    if (!values.b2bPrice?.key) {
      setFieldValue("b2bPrice.key", "DECREASE", false);
    }
    if (
      values.b2bPrice?.conditionRuleValue === undefined ||
      values.b2bPrice?.conditionRuleValue === ""
    ) {
      setFieldValue("b2bPrice.conditionRuleValue", "10", false);
    }

    if (values.branchPricing && typeof values.branchPricing === "object") {
      let hasUpdates = false;
      const updatedPricing = { ...values.branchPricing };
      Object.keys(updatedPricing).forEach((bId) => {
        const bData = updatedPricing[bId];
        if (bData && typeof bData === "object") {
          let bUpdated = false;
          let newDatePricing = bData.datePricing;
          let newB2bDatePricing = bData.b2bDatePricing;

          if (!Array.isArray(newDatePricing) || newDatePricing.length === 0) {
            const branchKey = bData.key || values.key || "INCREASE";
            const branchPercent =
              bData.conditionRuleValue ?? values.conditionRuleValue ?? 15;
            const defPrice = calculateRulePrice(
              bData.price || values.price,
              branchKey,
              branchPercent
            );
            newDatePricing = [
              {
                date: "",
                fromDate: "",
                toDate: "",
                key: branchKey,
                percentage: branchPercent,
                price: defPrice !== "" ? defPrice : "",
              },
            ];
            bUpdated = true;
          }

          if (!Array.isArray(newB2bDatePricing) || newB2bDatePricing.length === 0) {
            const b2bKey = bData.b2bKey || values.b2bPrice?.key || "DECREASE";
            const b2bPercent =
              bData.b2bConditionRuleValue ?? values.b2bPrice?.conditionRuleValue ?? 10;
            const defB2bPrice = calculateRulePrice(
              bData.schoolsPrice || values.b2bPrice?.price || values.price,
              b2bKey,
              b2bPercent
            );
            newB2bDatePricing = [
              {
                date: "",
                fromDate: "",
                toDate: "",
                key: b2bKey,
                percentage: b2bPercent,
                price: defB2bPrice !== "" ? defB2bPrice : "",
              },
            ];
            bUpdated = true;
          }

          if (bUpdated) {
            updatedPricing[bId] = {
              ...bData,
              datePricing: newDatePricing,
              b2bDatePricing: newB2bDatePricing,
            };
            hasUpdates = true;
          }
        }
      });
      if (hasUpdates) {
        setFieldValue("branchPricing", updatedPricing, false);
      }
    }
  }, [
    values.datePricing,
    values.key,
    values.conditionRuleValue,
    values.b2bPrice?.datePricing,
    values.b2bPrice?.key,
    values.b2bPrice?.conditionRuleValue,
    values.branchPricing,
    values.price,
    values.b2bPrice?.price,
    calculateRulePrice,
    setFieldValue,
  ]);

  // Current date formatted as YYYY-MM-DD for min date validation
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  // Branch groups mapping
  const branchGroups = useMemo(() => {
    return buildBranchGroups(formSelectionData?.providerBranchs, locale, isAr);
  }, [formSelectionData?.providerBranchs, locale, isAr]);

  const allBranchesMap = useMemo(() => {
    const map = new Map();
    branchGroups.forEach((group) => {
      group.branches?.forEach((b) => {
        map.set(b.id, b);
      });
    });
    return map;
  }, [branchGroups]);

  // Selected customized branch IDs
  const customizedBranchIds = useMemo(() => {
    if (Array.isArray(values.customizedPricingBranches)) {
      return values.customizedPricingBranches;
    }
    if (values.branchPricing && typeof values.branchPricing === "object") {
      return Object.keys(values.branchPricing);
    }
    return [];
  }, [values.customizedPricingBranches, values.branchPricing]);

  const isCustomizedActive = customizedBranchIds.length > 0;

  const activeCustomizedBranches = useMemo(() => {
    return customizedBranchIds
      .map((id) => allBranchesMap.get(id))
      .filter(Boolean);
  }, [customizedBranchIds, allBranchesMap]);

  // Target audience options from selection API or fallback
  const targetAudienceOptions = useMemo(() => {
    if (
      Array.isArray(formSelectionData?.targetAudiences) &&
      formSelectionData.targetAudiences.length > 0
    ) {
      return formSelectionData.targetAudiences;
    }
    return [
      {
        id: "adults",
        name: { ar: "كبار", en: "Adults" },
        description: {
          ar: "الأفراد البالغين من عمر 18 سنة فما فوق",
          en: "Adults aged 18 and above",
        },
      },
      {
        id: "children",
        name: { ar: "أطفال", en: "Children" },
        description: {
          ar: "الأطفال من سن 2 إلى 12 سنة",
          en: "Children aged 2 to 12 years",
        },
      },
      {
        id: "families",
        name: { ar: "عائلات", en: "Families" },
        description: {
          ar: "باقات مخصصة للعائلات والمجموعات",
          en: "Custom packages for families and groups",
        },
      },
      {
        id: "seniors",
        name: { ar: "كبار السن", en: "Seniors" },
        description: {
          ar: "فئة كبار السن من سن 60 سنة فما فوق",
          en: "Senior citizens aged 60 and above",
        },
      },
      {
        id: "vip",
        name: { ar: "شخصيات هامة (VIP)", en: "VIP" },
        description: {
          ar: "خدمة مميزة وتجربة كبار الشخصيات",
          en: "Premium VIP service and experience",
        },
      },
    ];
  }, [formSelectionData?.targetAudiences]);

  // Target audience options mapped for SelectionGroup list prop
  const targetAudienceList = useMemo(() => {
    return targetAudienceOptions.map((opt) => ({
      value: opt._id || opt.id,
      label: getItemName(opt, locale),
      description: getItemDescription(opt, locale),
    }));
  }, [targetAudienceOptions, locale]);

  // Season condition lists for SelectionGroup
  const changeTypeList = useMemo(
    () => [
      { value: "INCREASE", label: t("b2c.increase") },
      { value: "DECREASE", label: t("b2c.decrease") },
    ],
    [t]
  );

  const discountTypeList = useMemo(
    () => [
      {
        value: "PERCENTAGE",
        label:
          t("b2b.discountTypePercentage") ||
          t("b2c.discountTypePercentage") ||
          "%",
      },
      {
        value: "AMOUNT",
        label:
          t("b2b.discountTypeAmount") ||
          t("b2c.discountTypeAmount") ||
          "SAR",
      },
    ],
    [t]
  );

  // Toggle branch accordion
  const toggleBranch = useCallback((branchId) => {
    setOpenBranches((prev) => ({
      ...prev,
      [branchId]: !prev[branchId],
    }));
  }, []);

  // Save selected branches from sidebar
  const handleSaveSidebarBranches = useCallback(
    (newSelectedIds) => {
      setFieldValue("customizedPricingBranches", newSelectedIds);
      const updatedBranchPricing = { ...(values.branchPricing || {}) };

      newSelectedIds.forEach((id) => {
        if (!updatedBranchPricing[id]) {
          const defaultBranchPrice = values.price || "";
          const branchKey = values.key || "INCREASE";
          const branchPercent = values.conditionRuleValue || 15;
          const defaultRulePrice = calculateRulePrice(
            defaultBranchPrice,
            branchKey,
            branchPercent
          );

          const defaultB2bBranchPrice =
            values.b2bPrice?.price || values.price || "";
          const b2bBranchKey = values.b2bPrice?.key || "DECREASE";
          const b2bBranchPercent = values.b2bPrice?.conditionRuleValue || 10;
          const defaultB2bRulePrice = calculateRulePrice(
            defaultB2bBranchPrice,
            b2bBranchKey,
            b2bBranchPercent
          );

          updatedBranchPricing[id] = {
            price: "",
            discountedPrice: "",
            schoolsPrice: "",
            b2bDiscountedPrice: "",
            productCost: "",
            key: branchKey,
            conditionRuleValue: branchPercent,
            b2bKey: b2bBranchKey,
            b2bConditionRuleValue: b2bBranchPercent,
            studentsPerSupervisor: "",
            targetAudiences: [],
            datePricing: [
              {
                date: "",
                fromDate: "",
                toDate: "",
                key: branchKey,
                percentage: branchPercent,
                price: defaultRulePrice !== "" ? defaultRulePrice : "",
              },
            ],
            b2bQuantityDiscountTiers: [],
            b2bDatePricing: [
              {
                date: "",
                fromDate: "",
                toDate: "",
                key: b2bBranchKey,
                percentage: b2bBranchPercent,
                price: defaultB2bRulePrice !== "" ? defaultB2bRulePrice : "",
              },
            ],
          };
        }
      });

      Object.keys(updatedBranchPricing).forEach((id) => {
        if (!newSelectedIds.includes(id)) {
          delete updatedBranchPricing[id];
        }
      });

      setFieldValue("branchPricing", updatedBranchPricing);

      const newOpenMap = {};
      newSelectedIds.forEach((id) => {
        newOpenMap[id] = true;
      });
      setOpenBranches(newOpenMap);
      setIsSidebarOpen(false);
    },
    [
      setFieldValue,
      values.branchPricing,
      values.price,
      values.key,
      values.conditionRuleValue,
      values.b2bPrice?.price,
      values.b2bPrice?.key,
      values.b2bPrice?.conditionRuleValue,
      calculateRulePrice,
    ]
  );

  // Cancel branch customization
  const handleCancelCustomization = useCallback(() => {
    setFieldValue("customizedPricingBranches", []);
    setFieldValue("branchPricing", {});
    setOpenBranches({});
  }, [setFieldValue]);

  // Validation error helpers
  const priceErr = getIn(errors, "price");
  const priceTouched = getIn(touched, "price");

  const discountedPriceErr = getIn(errors, "discountedPrice");
  const discountedPriceTouched = getIn(touched, "discountedPrice");

  const productCostErr = getIn(errors, "productCost");
  const productCostTouched = getIn(touched, "productCost");

  const b2bPriceErr =
    getIn(errors, "b2bPrice.price") || getIn(errors, "b2bPricing.schoolsPrice");
  const b2bPriceTouched =
    getIn(touched, "b2bPrice.price") || getIn(touched, "b2bPricing.schoolsPrice");

  const b2bDiscountedPriceErr = getIn(errors, "b2bPrice.finalPrice");
  const b2bDiscountedPriceTouched = getIn(touched, "b2bPrice.finalPrice");

  const studentsPerSupervisorErr =
    getIn(errors, "studentsPerSupervisor") ||
    getIn(errors, "b2bPrice.studentsPerSupervisor") ||
    getIn(errors, "b2bPricing.studentsPerSupervisor");
  const studentsPerSupervisorTouched =
    getIn(touched, "studentsPerSupervisor") ||
    getIn(touched, "b2bPrice.studentsPerSupervisor") ||
    getIn(touched, "b2bPricing.studentsPerSupervisor");

  const hasB2CError = Boolean(
    (priceTouched && priceErr) ||
      (discountedPriceTouched && discountedPriceErr) ||
      (getIn(touched, "targetAudiences") && getIn(errors, "targetAudiences"))
  );

  const hasB2BError = Boolean(
    (b2bPriceTouched && b2bPriceErr) ||
      (b2bDiscountedPriceTouched && b2bDiscountedPriceErr) ||
      (studentsPerSupervisorTouched && studentsPerSupervisorErr) ||
      (getIn(touched, "bulkPricing") && getIn(errors, "bulkPricing"))
  );

  // Common CSS styles
  const labelCls =
    "font-somar text-sm sm:text-base font-medium text-textDark text-start block mb-1.5";
  const subLabelCls =
    "font-somar text-xs sm:text-sm font-medium text-textDark text-start block mb-1";
  const inputBorderCls =
    "border border-border hover:border-mainColor focus:border-mainColor rounded-xl";
  const inputFieldCls =
    "!h-[52px] !py-0 px-3.5 font-somar text-sm sm:text-base text-textDark";

  return (
    <div className="flex flex-col gap-6 sm:gap-8" dir={isAr ? "rtl" : "ltr"}>
      {/* ─────────────────────────────────────────────────────────────
          MAIN CARD: Pricing (التسعير)
      ───────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="pricing-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Header with Title and Branch Customization Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 text-start">
          <div>
            <h2
              id="pricing-title"
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
                className="px-4 py-2 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <span>{t("branchCustomizeBtn")}</span>
              </button>
            )}
          </div>
        </div>

        {/* ── TABS: سعر الفرد & للمدارس (Based on Step 3 Selection) ── */}
        <div
          className={cn(
            "grid gap-4 mb-6 sm:mb-8",
            showBothTabs
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1 sm:max-w-md"
          )}
        >
          {/* Tab 1: سعر الفرد (Individual / B2C) */}
          {isB2CEnabled && (
            <button
              type="button"
              onClick={() => setActiveTab("individual")}
              className={cn(
                "flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-200 text-start",
                showBothTabs ? "cursor-pointer" : "cursor-default",
                activeTab === "individual"
                  ? "border-mainColor bg-[#EAF5F4] shadow-xs"
                  : hasB2CError
                    ? "border-error/50 bg-error/5 hover:border-error"
                    : "border-border bg-white hover:border-mainColor/30"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  activeTab === "individual"
                    ? "bg-[#D7ECE7] text-mainColor"
                    : hasB2CError
                      ? "bg-error/15 text-error"
                      : "bg-homeBg text-textLight/60"
                )}
              >
                <GroupsOutlinedIcon className="w-6 h-6" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-somar font-medium text-sm sm:text-base text-textDark">
                    {t("tabs.individual")}
                  </span>
                  {hasB2CError && activeTab !== "individual" && (
                    <span className="w-2 h-2 rounded-full bg-error inline-block" />
                  )}
                </div>
                <div className="font-somar font-bold text-base sm:text-lg text-mainColor flex items-center gap-1 mt-0.5">
                  <span>
                    {values.price && Number(values.price) > 0
                      ? formatCurrency(values.price)
                      : "-"}
                  </span>
                  <span className="text-sm font-medium text-textLight">
                    / {t("tabs.perPerson")}
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* Tab 2: للمدارس (Schools / B2B) */}
          {isB2BEnabled && (
            <button
              type="button"
              onClick={() => setActiveTab("schools")}
              className={cn(
                "flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-200 text-start",
                showBothTabs ? "cursor-pointer" : "cursor-default",
                activeTab === "schools"
                  ? "border-mainColor bg-[#EAF5F4] shadow-xs"
                  : hasB2BError
                    ? "border-error/50 bg-error/5 hover:border-error"
                    : "border-border bg-white hover:border-mainColor/30"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  activeTab === "schools"
                    ? "bg-[#D7ECE7] text-mainColor"
                    : hasB2BError
                      ? "bg-error/15 text-error"
                      : "bg-homeBg text-textLight/60"
                )}
              >
                <SchoolOutlinedIcon className="w-6 h-6" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-somar font-medium text-sm sm:text-base text-textDark">
                    {t("tabs.schools")}
                  </span>
                  {hasB2BError && activeTab !== "schools" && (
                    <span className="w-2 h-2 rounded-full bg-error inline-block" />
                  )}
                </div>
                <div className="font-somar font-bold text-base sm:text-lg text-mainColor flex items-center gap-1 mt-0.5">
                  <span>
                    {(values.b2bPricing?.schoolsPrice ||
                      values.b2bPrice?.price) &&
                    Number(
                      values.b2bPricing?.schoolsPrice || values.b2bPrice?.price
                    ) > 0
                      ? formatCurrency(
                          values.b2bPricing?.schoolsPrice ||
                            values.b2bPrice?.price
                        )
                      : "-"}
                  </span>
                  <span className="text-sm font-medium text-textLight">
                    / {t("tabs.perPerson")}
                  </span>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* ═════════════════════════════════════════════════════════════
            TAB 1 CONTENT: B2C (سعر الفرد - Individual)
        ═════════════════════════════════════════════════════════════ */}
        {activeTab === "individual" && (
          <div className="space-y-6 sm:space-y-8">
            {/* 1. Base Price for Individuals */}
            <div className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3 text-start">
                <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
                  <LocalOfferOutlinedIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-somar font-bold text-base text-titleColor">
                    {t("b2c.basePriceTitle")}
                  </h3>
                  <p className="font-somar text-xs text-textLight">
                    {t("b2c.basePriceSubtitle")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Market Price (سعر السوق) */}
                <div>
                  <TextInputGroup
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    required={true}
                    label={t("b2c.marketPrice")}
                    labelClassName={labelCls}
                    value={values.b2cPrice?.price ?? values.price ?? ""}
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("b2cPrice.price", e.target.value);
                    }}
                    onBlur={handleBlur}
                    touched={priceTouched}
                    errors={priceErr}
                    placeholder={t("b2c.marketPricePlaceholder")}
                    borderClassName={inputBorderCls}
                    inputClassName={inputFieldCls}
                    endAdornment={newSarSmall}
                  />
                </div>

                {/* Discounted Price (السعر بعد التخفيض) */}
                <div>
                  <TextInputGroup
                    id="discountedPrice"
                    name="discountedPrice"
                    type="number"
                    min="0"
                    label={t("b2c.discountedPrice")}
                    labelClassName={labelCls}
                    value={
                      values.b2cPrice?.finalPrice ??
                      values.discountedPrice ??
                      ""
                    }
                    onChange={(e) => {
                      handleChange(e);
                      setFieldValue("b2cPrice.finalPrice", e.target.value);
                    }}
                    onBlur={handleBlur}
                    touched={discountedPriceTouched}
                    errors={discountedPriceErr}
                    placeholder={t("b2c.discountedPricePlaceholder")}
                    borderClassName={inputBorderCls}
                    inputClassName={inputFieldCls}
                    endAdornment={newSarSmall}
                  />
                </div>
              </div>
            </div>

            {/* 3. Target Audience Pricing Section (with SelectionGroup) */}
            <div className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4">
              <div className="border-b border-border pb-3 text-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
                    <GroupsOutlinedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-somar font-bold text-base text-titleColor">
                      {t("b2c.targetAudiencesTitle")}
                    </h3>
                    <p className="font-somar text-xs text-textLight">
                      {t("b2c.targetAudiencesSubtitle")}
                    </p>
                  </div>
                </div>
              </div>

              <FieldArray name="targetAudiences">
                {({ push, remove }) => {
                  const audiencesList =
                    Array.isArray(values.targetAudiences) &&
                    values.targetAudiences.length > 0
                      ? values.targetAudiences
                      : [{ targetAudience: "", price: "" }];

                  return (
                    <div className="space-y-3">
                      {audiencesList.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border border-border shadow-xs transition-all hover:border-mainColor/30"
                        >
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                            {/* Category Dropdown using SelectionGroup */}
                            <div>
                              <SelectionGroup
                                name={`targetAudiences[${index}].targetAudience`}
                                value={item.targetAudience || ""}
                                onChange={(e) => {
                                  setFieldValue(
                                    `targetAudiences[${index}].targetAudience`,
                                    e.target.value
                                  );
                                }}
                                onBlur={handleBlur}
                                label={t("b2c.category")}
                                labelClassName="block text-xs font-somar font-medium text-textLight text-start"
                                placeholder={t("b2c.selectCategory")}
                                list={targetAudienceList}
                                border="1px solid var(--color-border)"
                                touched={getIn(
                                  touched,
                                  `targetAudiences[${index}].targetAudience`
                                )}
                                errors={getIn(
                                  errors,
                                  `targetAudiences[${index}].targetAudience`
                                )}
                              />
                            </div>

                            {/* Price using TextInputGroup */}
                            <div>
                              <TextInputGroup
                                type="number"
                                min="0"
                                name={`targetAudiences[${index}].price`}
                                value={item.price ?? ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label={t("b2c.price")}
                                labelClassName="block text-xs font-somar font-medium text-textLight text-start"
                                placeholder={t("b2c.pricePlaceholder")}
                                borderClassName={inputBorderCls}
                                inputClassName={inputFieldCls}
                                endAdornment={newSarSmall}
                                touched={getIn(
                                  touched,
                                  `targetAudiences[${index}].price`
                                )}
                                errors={getIn(
                                  errors,
                                  `targetAudiences[${index}].price`
                                )}
                              />
                            </div>
                          </div>

                          {/* Delete Button (Shown on all rows when more than 1 row exists) */}
                          {audiencesList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer self-center"
                              title="Delete"
                            >
                              <DeleteOutlineIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          push({
                            targetAudience: "",
                            price: values.price || "",
                          })
                        }
                        className="w-full py-3 rounded-xl border border-mainColor text-mainColor font-somar font-bold text-sm sm:text-base hover:bg-mainColor/5 transition-colors cursor-pointer text-center mt-2"
                      >
                        {t("b2c.addAudiencePriceBtn")}
                      </button>
                    </div>
                  );
                }}
              </FieldArray>
            </div>

            {/* 4. Weekday & Season Pricing Rules (MATCHING FIGMA & SCREENSHOT 1) */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-border space-y-6 shadow-none">
              <FieldArray name="datePricing">
                {({ push, remove }) => {
                  const datePricingList =
                    Array.isArray(values.datePricing) && values.datePricing.length > 0
                      ? values.datePricing
                      : [{ date: "", price: "" }];

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                        <div className="text-start">
                          <h3 className="font-somar font-bold text-base sm:text-lg text-titleColor">
                            {t("b2c.weekdayPricingTitle")}
                          </h3>
                          <p className="font-somar text-xs sm:text-sm text-textLight mt-1">
                            {t("b2c.weekdayPricingSubtitle")}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const defaultPrice = calculateRulePrice(
                              values.price,
                              values.key || "INCREASE",
                              values.conditionRuleValue || 15
                            );
                            push({
                              date: "",
                              fromDate: "",
                              toDate: "",
                              key: values.key || "INCREASE",
                              percentage: values.conditionRuleValue || 15,
                              price: defaultPrice !== "" ? defaultPrice : "",
                            });
                          }}
                          className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <span>{t("b2c.addRuleBtn")}</span>
                        </button>
                      </div>

                      {/* Condition Builder Row: السعر بـ [زيادة/تخفيض] [%15] */}
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-somar text-textDark">
                        <span className="font-medium text-textDark flex-shrink-0">
                          {t("b2c.priceByLabel")}
                        </span>

                        {/* Dropdown: زيادة / تخفيض (key) */}
                        <div className="w-28 sm:w-32">
                          <SelectionGroup
                            name="key"
                            value={values.key || "INCREASE"}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFieldValue("key", val, true);
                              setFieldValue("conditionRuleChangeType", val, true);
                            }}
                            placeholder={t("b2c.increase")}
                            list={changeTypeList}
                            border="1px solid var(--color-border)"
                          />
                        </div>

                        {/* Input: %15 with matching 52px height */}
                        <div className="w-24 sm:w-28">
                          <TextInputGroup
                            type="number"
                            min="1"
                            max={values.key === "DECREASE" || values.conditionRuleChangeType === "DECREASE" ? "100" : undefined}
                            name="conditionRuleValue"
                            value={values.conditionRuleValue ?? "15"}
                            onChange={(e) => {
                              let val = e.target.value;
                              const isDiscount = values.key === "DECREASE" || values.conditionRuleChangeType === "DECREASE";
                              if (isDiscount && Number(val) > 100) {
                                val = "100";
                              }
                              setFieldValue("conditionRuleValue", val, true);
                            }}
                            onBlur={handleBlur}
                            touched={getIn(touched, "conditionRuleValue")}
                            errors={getIn(errors, "conditionRuleValue")}
                            placeholder="15"
                            borderClassName={inputBorderCls}
                            inputClassName="!h-[52px] !py-0 px-2 text-center font-somar text-xs sm:text-sm text-textDark"
                            endAdornment={
                              <span className="text-textLight font-somar text-sm">
                                %
                              </span>
                            }
                          />
                        </div>
                      </div>

                      {/* Date Pricing Rows */}
                      <div className="space-y-4 pt-2">
                        {datePricingList.map((item, index) => {
                          const fromDateVal = item.fromDate || item.date || "";
                          const toDateVal = item.toDate || fromDateVal || "";

                          const isFromPast = Boolean(
                            fromDateVal && fromDateVal < todayStr
                          );
                          const isToPast = Boolean(
                            toDateVal && toDateVal < todayStr
                          );
                          const isToBeforeFrom = Boolean(
                            toDateVal && fromDateVal && toDateVal < fromDateVal
                          );

                          const fromTouched = getIn(
                            touched,
                            `datePricing[${index}].fromDate`
                          );
                          const toTouched = getIn(
                            touched,
                            `datePricing[${index}].toDate`
                          );
                          const fromError = getIn(
                            errors,
                            `datePricing[${index}].fromDate`
                          );
                          const toError = getIn(
                            errors,
                            `datePricing[${index}].toDate`
                          );
                          const priceTouched = getIn(
                            touched,
                            `datePricing[${index}].price`
                          );
                          const priceError = getIn(
                            errors,
                            `datePricing[${index}].price`
                          );

                          return (
                            <div
                              key={index}
                              className="flex flex-wrap md:flex-nowrap items-start gap-3 sm:gap-4 transition-all"
                            >
                              {/* From Date */}
                              <div className="w-full md:w-auto md:flex-1">
                                <TextInputGroup
                                  id={`datePricing-${index}-fromDate`}
                                  name={`datePricing[${index}].fromDate`}
                                  type="date"
                                  min={todayStr}
                                  label={t("b2c.fromDateReadOnly")}
                                  labelClassName={subLabelCls}
                                  value={fromDateVal}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFieldValue(
                                      `datePricing[${index}].fromDate`,
                                      val
                                    );
                                    setFieldValue(
                                      `datePricing[${index}].date`,
                                      val
                                    );
                                    if (val && item.toDate && val > item.toDate) {
                                      setFieldValue(
                                        `datePricing[${index}].toDate`,
                                        val
                                      );
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  touched={fromTouched || isFromPast}
                                  errors={
                                    isFromPast
                                      ? t("validations.pastDateError")
                                      : fromError
                                  }
                                />
                              </div>

                              {/* To Date */}
                              <div className="w-full md:w-auto md:flex-1">
                                <TextInputGroup
                                  id={`datePricing-${index}-toDate`}
                                  name={`datePricing[${index}].toDate`}
                                  type="date"
                                  min={fromDateVal || todayStr}
                                  label={t("b2c.toDateReadOnly")}
                                  labelClassName={subLabelCls}
                                  value={toDateVal}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `datePricing[${index}].toDate`,
                                      e.target.value
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  touched={toTouched || isToPast || isToBeforeFrom}
                                  errors={
                                    isToPast
                                      ? t("validations.pastDateError")
                                      : isToBeforeFrom
                                      ? t("validations.endDateAfterStartDate")
                                      : toError
                                  }
                                />
                              </div>

                              {/* Price */}
                              <div className="w-full md:w-auto md:flex-1">
                                <TextInputGroup
                                  id={`datePricing-${index}-price`}
                                  name={`datePricing[${index}].price`}
                                  type="number"
                                  min="0"
                                  label={t("b2c.priceInSar")}
                                  labelClassName={subLabelCls}
                                  value={item.price ?? ""}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `datePricing[${index}].price`,
                                      e.target.value
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  placeholder="60"
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  endAdornment={newSarSmall}
                                  touched={priceTouched}
                                  errors={priceError}
                                />
                              </div>

                              {/* Delete Button (Shown on all rows when more than 1 row exists) */}
                              {datePricingList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer flex-shrink-0 mb-0.5 mt-6"
                                  title={isAr ? "حذف" : "Delete"}
                                >
                                  <DeleteOutlineIcon className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                }}
              </FieldArray>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                Dedicated B2C Branch Customization Section (Strictly Individuals)
            ───────────────────────────────────────────────────────────── */}
            {isCustomizedActive && (
              <div
                aria-labelledby="branch-pricing-b2c-title"
                className="bg-white rounded-2xl border border-border p-5 sm:p-7 transition-all duration-200 text-start shadow-none space-y-4 mt-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <h3
                      id="branch-pricing-b2c-title"
                      className="font-somar text-lg sm:text-xl font-bold text-titleColor"
                    >
                      {t("b2cBranchSectionTitle") || "تخصيص أسعار الفروع للأفراد"}
                    </h3>
                    <p className="font-somar text-xs sm:text-sm text-textLight mt-1">
                      {t("b2cBranchSectionSubtitle") || "تحديد أسعار وفئات وخصومات مخصصة للأفراد لكل فرع"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{t("editBranchesBtn")}</span>
                  </button>
                </div>

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
                    const branchData = values.branchPricing?.[branch.id] || {};

                    return (
                      <div
                        key={branch.id}
                        className="rounded-2xl border border-border overflow-hidden transition-all duration-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleBranch(branch.id)}
                          className="w-full p-4 sm:p-5 bg-gray-50/60 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors"
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

                        {isOpen && (
                          <div className="p-4 sm:p-6 bg-white border-t border-border space-y-6">
                            {/* 1. Market Price & Discounted Price for Branch */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <TextInputGroup
                                  type="number"
                                  min="0"
                                  label={t("b2c.marketPrice")}
                                  labelClassName={labelCls}
                                  value={branchData.price ?? ""}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `branchPricing.${branch.id}.price`,
                                      e.target.value
                                    )
                                  }
                                  placeholder={t("b2c.marketPricePlaceholder")}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  endAdornment={newSarSmall}
                                />
                              </div>

                              <div>
                                <TextInputGroup
                                  type="number"
                                  min="0"
                                  label={t("b2c.discountedPrice")}
                                  labelClassName={labelCls}
                                  value={branchData.discountedPrice ?? ""}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `branchPricing.${branch.id}.discountedPrice`,
                                      e.target.value
                                    )
                                  }
                                  placeholder={t("b2c.discountedPricePlaceholder")}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  endAdornment={newSarSmall}
                                />
                              </div>
                            </div>

                            {/* 2. Target Audience Pricing Section for Branch (Matching Screenshot 1) */}
                            <div className="bg-gray-50/70 p-4 sm:p-5 rounded-xl border border-border space-y-4">
                              <div className="border-b border-border pb-3 text-start">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
                                    <GroupsOutlinedIcon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h6 className="font-somar font-bold text-sm text-titleColor">
                                      {t("b2c.targetAudiencesTitle")}
                                    </h6>
                                    <p className="font-somar text-xs text-textLight">
                                      {t("b2c.targetAudiencesSubtitle")}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <FieldArray name={`branchPricing.${branch.id}.targetAudiences`}>
                                {({ push: pushBranchAudience, remove: removeBranchAudience }) => {
                                  const audiencesList =
                                    Array.isArray(branchData.targetAudiences) &&
                                    branchData.targetAudiences.length > 0
                                      ? branchData.targetAudiences
                                      : [{ targetAudience: "", price: "" }];

                                  return (
                                    <div className="space-y-3">
                                      {audiencesList.map((item, audIdx) => {
                                        const audId =
                                          typeof item.targetAudience === "object" && item.targetAudience !== null
                                            ? item.targetAudience._id || item.targetAudience.id
                                            : item.targetAudience || "";

                                        return (
                                          <div
                                            key={audIdx}
                                            className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border border-border shadow-xs transition-all hover:border-mainColor/30"
                                          >
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                                              {/* Category Dropdown */}
                                              <div>
                                                <SelectionGroup
                                                  name={`branchPricing.${branch.id}.targetAudiences[${audIdx}].targetAudience`}
                                                  value={audId}
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      `branchPricing.${branch.id}.targetAudiences[${audIdx}].targetAudience`,
                                                      e.target.value
                                                    );
                                                  }}
                                                  onBlur={handleBlur}
                                                  touched={getIn(
                                                    touched,
                                                    `branchPricing.${branch.id}.targetAudiences[${audIdx}].targetAudience`
                                                  )}
                                                  errors={getIn(
                                                    errors,
                                                    `branchPricing.${branch.id}.targetAudiences[${audIdx}].targetAudience`
                                                  )}
                                                  label={t("b2c.category")}
                                                  labelClassName="block text-xs font-somar font-medium text-textLight text-start"
                                                  placeholder={t("b2c.selectCategory")}
                                                  list={targetAudienceList}
                                                  border="1px solid var(--color-border)"
                                                />
                                              </div>

                                              {/* Price */}
                                              <div>
                                                <TextInputGroup
                                                  type="number"
                                                  min="0"
                                                  name={`branchPricing.${branch.id}.targetAudiences[${audIdx}].price`}
                                                  value={item.price ?? ""}
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      `branchPricing.${branch.id}.targetAudiences[${audIdx}].price`,
                                                      e.target.value
                                                    );
                                                  }}
                                                  onBlur={handleBlur}
                                                  touched={getIn(
                                                    touched,
                                                    `branchPricing.${branch.id}.targetAudiences[${audIdx}].price`
                                                  )}
                                                  errors={getIn(
                                                    errors,
                                                    `branchPricing.${branch.id}.targetAudiences[${audIdx}].price`
                                                  )}
                                                  label={t("b2c.price")}
                                                  labelClassName="block text-xs font-somar font-medium text-textLight text-start"
                                                  placeholder={t("b2c.pricePlaceholder")}
                                                  borderClassName={inputBorderCls}
                                                  inputClassName={inputFieldCls}
                                                  endAdornment={newSarSmall}
                                                />
                                              </div>
                                            </div>

                                            {/* Delete Button (Shown on all rows when more than 1 row exists) */}
                                            {audiencesList.length > 1 && (
                                              <button
                                                type="button"
                                                onClick={() => removeBranchAudience(audIdx)}
                                                className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer self-center"
                                                title={isAr ? "حذف" : "Delete"}
                                              >
                                                <DeleteOutlineIcon className="w-5 h-5" />
                                              </button>
                                            )}
                                          </div>
                                        );
                                      })}

                                      <button
                                        type="button"
                                        onClick={() =>
                                          pushBranchAudience({
                                            targetAudience: "",
                                            price: branchData.price || values.price || "",
                                          })
                                        }
                                        className="w-full py-3 rounded-xl border border-mainColor text-mainColor font-somar font-bold text-sm sm:text-base hover:bg-mainColor/5 transition-colors cursor-pointer text-center mt-2"
                                      >
                                        {t("b2c.addAudiencePriceBtn")}
                                      </button>
                                    </div>
                                  );
                                }}
                              </FieldArray>
                            </div>

                            {/* 3. Date / Seasonal Pricing for Branch */}
                            <div className="bg-gray-50/70 p-4 sm:p-5 rounded-xl border border-border space-y-4">
                              {(() => {
                                const branchKey =
                                  branchData.key || values.key || "INCREASE";
                                const branchPercent =
                                  branchData.conditionRuleValue ??
                                  values.conditionRuleValue ??
                                  15;
                                const defaultPrice = calculateRulePrice(
                                  branchData.price || values.price,
                                  branchKey,
                                  branchPercent
                                );
                                const branchDatePricingList =
                                  Array.isArray(branchData.datePricing) &&
                                  branchData.datePricing.length > 0
                                    ? branchData.datePricing
                                    : [
                                        {
                                          date: "",
                                          fromDate: "",
                                          toDate: "",
                                          key: branchKey,
                                          percentage: branchPercent,
                                          price:
                                            defaultPrice !== ""
                                              ? defaultPrice
                                              : "",
                                        },
                                      ];

                                return (
                                  <>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
                                      <div className="text-start">
                                        <h6 className="font-somar font-bold text-sm sm:text-base text-titleColor">
                                          {t("branchDatePricingTitle") ||
                                            "التسعير الموسمي للفرع"}
                                        </h6>
                                        <p className="font-somar text-xs sm:text-sm text-textLight mt-1">
                                          {t("branchDatePricingSubtitle") ||
                                            t("b2c.weekdayPricingSubtitle")}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setFieldValue(
                                            `branchPricing.${branch.id}.datePricing`,
                                            [
                                              ...branchDatePricingList,
                                              {
                                                date: "",
                                                fromDate: "",
                                                toDate: "",
                                                key: branchKey,
                                                percentage: branchPercent,
                                                price:
                                                  defaultPrice !== ""
                                                    ? defaultPrice
                                                    : "",
                                              },
                                            ]
                                          );
                                        }}
                                        className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap"
                                      >
                                        <span>{t("b2c.addRuleBtn")}</span>
                                      </button>
                                    </div>

                                    {/* Condition Builder Row: السعر بـ [زيادة/تخفيض] [%15] */}
                                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-somar text-textDark">
                                      <span className="font-medium text-textDark flex-shrink-0">
                                        {t("b2c.priceByLabel")}
                                      </span>

                                      {/* Dropdown: زيادة / تخفيض (key) */}
                                      <div className="w-28 sm:w-32">
                                        <SelectionGroup
                                          name={`branchPricing.${branch.id}.key`}
                                          value={branchKey}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `branchPricing.${branch.id}.key`,
                                              e.target.value,
                                              true
                                            );
                                          }}
                                          placeholder={t("b2c.increase")}
                                          list={changeTypeList}
                                          border="1px solid var(--color-border)"
                                        />
                                      </div>

                                      {/* Input: %15 with matching 52px height */}
                                      <div className="w-24 sm:w-28">
                                        <TextInputGroup
                                          type="number"
                                          min="1"
                                          max={branchKey === "DECREASE" ? "100" : undefined}
                                          name={`branchPricing.${branch.id}.conditionRuleValue`}
                                          value={branchPercent}
                                          onChange={(e) => {
                                            let val = e.target.value;
                                            if (branchKey === "DECREASE" && Number(val) > 100) {
                                              val = "100";
                                            }
                                            setFieldValue(
                                              `branchPricing.${branch.id}.conditionRuleValue`,
                                              val,
                                              true
                                            );
                                          }}
                                          onBlur={handleBlur}
                                          touched={getIn(touched, `branchPricing.${branch.id}.conditionRuleValue`)}
                                          errors={getIn(errors, `branchPricing.${branch.id}.conditionRuleValue`)}
                                          placeholder="15"
                                          borderClassName={inputBorderCls}
                                          inputClassName="!h-[52px] !py-0 px-2 text-center font-somar text-xs sm:text-sm text-textDark"
                                          endAdornment={
                                            <span className="text-textLight font-somar text-sm">
                                              %
                                            </span>
                                          }
                                        />
                                      </div>
                                    </div>

                                    {/* Date Pricing Rows */}
                                    <div className="space-y-4 pt-2">
                                      {branchDatePricingList.map((rule, rIdx) => {
                                        const fromDateVal =
                                          rule.fromDate || rule.fromDay || rule.date || "";
                                        const toDateVal =
                                          rule.toDate || rule.toDay || fromDateVal || "";

                                        const isFromPast = Boolean(
                                          fromDateVal && fromDateVal < todayStr
                                        );
                                        const isToPast = Boolean(
                                          toDateVal && toDateVal < todayStr
                                        );
                                        const isToBeforeFrom = Boolean(
                                          toDateVal &&
                                            fromDateVal &&
                                            toDateVal < fromDateVal
                                        );

                                        const fromTouched = getIn(
                                          touched,
                                          `branchPricing.${branch.id}.datePricing[${rIdx}].fromDate`
                                        );
                                        const toTouched = getIn(
                                          touched,
                                          `branchPricing.${branch.id}.datePricing[${rIdx}].toDate`
                                        );
                                        const fromError = getIn(
                                          errors,
                                          `branchPricing.${branch.id}.datePricing[${rIdx}].fromDate`
                                        );
                                        const toError = getIn(
                                          errors,
                                          `branchPricing.${branch.id}.datePricing[${rIdx}].toDate`
                                        );
                                        const priceTouched = getIn(
                                          touched,
                                          `branchPricing.${branch.id}.datePricing[${rIdx}].price`
                                        );
                                        const priceError = getIn(
                                          errors,
                                          `branchPricing.${branch.id}.datePricing[${rIdx}].price`
                                        );

                                        return (
                                          <div
                                            key={rIdx}
                                            className="flex flex-wrap md:flex-nowrap items-start gap-3 sm:gap-4 transition-all"
                                          >
                                            {/* From Date */}
                                            <div className="w-full md:w-auto md:flex-1">
                                              <TextInputGroup
                                                id={`branchPricing-${branch.id}-datePricing-${rIdx}-fromDate`}
                                                name={`branchPricing.${branch.id}.datePricing[${rIdx}].fromDate`}
                                                type="date"
                                                min={todayStr}
                                                label={t("b2c.fromDateReadOnly")}
                                                labelClassName={subLabelCls}
                                                value={fromDateVal}
                                                onChange={(e) => {
                                                  const val = e.target.value;
                                                  setFieldValue(
                                                    `branchPricing.${branch.id}.datePricing[${rIdx}].fromDate`,
                                                    val
                                                  );
                                                  setFieldValue(
                                                    `branchPricing.${branch.id}.datePricing[${rIdx}].date`,
                                                    val
                                                  );
                                                  if (
                                                    val &&
                                                    rule.toDate &&
                                                    val > rule.toDate
                                                  ) {
                                                    setFieldValue(
                                                      `branchPricing.${branch.id}.datePricing[${rIdx}].toDate`,
                                                      val
                                                    );
                                                  }
                                                }}
                                                onBlur={handleBlur}
                                                borderClassName={inputBorderCls}
                                                inputClassName={inputFieldCls}
                                                touched={fromTouched || isFromPast}
                                                errors={
                                                  isFromPast
                                                    ? t("validations.pastDateError")
                                                    : fromError
                                                }
                                              />
                                            </div>

                                            {/* To Date */}
                                            <div className="w-full md:w-auto md:flex-1">
                                              <TextInputGroup
                                                id={`branchPricing-${branch.id}-datePricing-${rIdx}-toDate`}
                                                name={`branchPricing.${branch.id}.datePricing[${rIdx}].toDate`}
                                                type="date"
                                                min={fromDateVal || todayStr}
                                                label={t("b2c.toDateReadOnly")}
                                                labelClassName={subLabelCls}
                                                value={toDateVal}
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    `branchPricing.${branch.id}.datePricing[${rIdx}].toDate`,
                                                    e.target.value
                                                  );
                                                }}
                                                onBlur={handleBlur}
                                                borderClassName={inputBorderCls}
                                                inputClassName={inputFieldCls}
                                                touched={
                                                  toTouched ||
                                                  isToPast ||
                                                  isToBeforeFrom
                                                }
                                                errors={
                                                  isToPast
                                                    ? t("validations.pastDateError")
                                                    : isToBeforeFrom
                                                    ? t("validations.endDateAfterStartDate")
                                                    : toError
                                                }
                                              />
                                            </div>

                                            {/* Price */}
                                            <div className="w-full md:w-auto md:flex-1">
                                              <TextInputGroup
                                                id={`branchPricing-${branch.id}-datePricing-${rIdx}-price`}
                                                name={`branchPricing.${branch.id}.datePricing[${rIdx}].price`}
                                                type="number"
                                                min="0"
                                                label={t("b2c.priceInSar")}
                                                labelClassName={subLabelCls}
                                                value={rule.price ?? ""}
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    `branchPricing.${branch.id}.datePricing[${rIdx}].price`,
                                                    e.target.value
                                                  );
                                                }}
                                                onBlur={handleBlur}
                                                placeholder={String(
                                                  defaultPrice || "60"
                                                )}
                                                borderClassName={inputBorderCls}
                                                inputClassName={inputFieldCls}
                                                endAdornment={newSarSmall}
                                                touched={priceTouched}
                                                errors={priceError}
                                              />
                                            </div>

                                            {/* Delete Button (Shown on all rows when more than 1 row exists) */}
                                            {branchDatePricingList.length > 1 && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const updated =
                                                    branchDatePricingList.filter(
                                                      (_, i) => i !== rIdx
                                                    );
                                                  setFieldValue(
                                                    `branchPricing.${branch.id}.datePricing`,
                                                    updated
                                                  );
                                                }}
                                                className="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer flex-shrink-0 mb-0.5 mt-6"
                                                title={isAr ? "حذف" : "Delete"}
                                              >
                                                <DeleteOutlineIcon className="w-5 h-5" />
                                              </button>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            TAB 2 CONTENT: B2B (للمدارس - Schools) EXACT MATCH TO FIGMA & SCREENSHOT 1
        ═════════════════════════════════════════════════════════════ */}
        {activeTab === "schools" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border space-y-6 shadow-none text-start">
            {/* Header: السعر الافتراضي للشركات والمدارس */}
            <div>
              <h3 className="font-somar font-bold text-lg sm:text-xl text-titleColor">
                {t("b2b.basePriceTitle")}
              </h3>
              <p className="font-somar text-xs sm:text-sm text-textLight mt-1">
                {t("b2b.basePriceSubtitle")}
              </p>
            </div>

            {/* 4-column Base Price Fields: سعر السوق & السعر بعد الخصم & تكلفة المنتج الأساسي & مشرف مجاني لكل (MATCHING BRANCH CUSTOMIZATION STYLE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-start">
              {/* 1. Market Price (سعر السوق) */}
              <div>
                <TextInputGroup
                  id="b2bPrice"
                  name="b2bPrice.price"
                  type="number"
                  min="0"
                  required={true}
                  label={t("b2b.marketPrice")}
                  labelClassName={labelCls}
                  value={
                    values.b2bPrice?.price ??
                    values.b2bPricing?.schoolsPrice ??
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldValue("b2bPrice.price", val);
                    setFieldValue("b2bPricing.schoolsPrice", val);
                    if (!isB2CEnabled) {
                      setFieldValue("price", val);
                      setFieldValue("b2cPrice.price", val);
                    }
                  }}
                  onBlur={handleBlur}
                  touched={b2bPriceTouched}
                  errors={b2bPriceErr}
                  placeholder={t("b2b.marketPricePlaceholder")}
                  borderClassName={inputBorderCls}
                  inputClassName={inputFieldCls}
                  endAdornment={newSarSmall}
                />
              </div>

              {/* 2. Discounted Price (السعر بعد الخصم) */}
              <div>
                <TextInputGroup
                  id="b2bDiscountedPrice"
                  name="b2bPrice.finalPrice"
                  type="number"
                  min="0"
                  label={t("b2b.discountedPrice")}
                  labelClassName={labelCls}
                  value={
                    values.b2bPrice?.finalPrice ??
                    values.b2bPrice?.discountedPrice ??
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldValue("b2bPrice.finalPrice", val);
                    setFieldValue("b2bPrice.discountedPrice", val);
                    if (!isB2CEnabled) {
                      setFieldValue("discountedPrice", val);
                    }
                  }}
                  onBlur={handleBlur}
                  touched={b2bDiscountedPriceTouched}
                  errors={b2bDiscountedPriceErr}
                  placeholder={t("b2b.discountedPricePlaceholder")}
                  borderClassName={inputBorderCls}
                  inputClassName={inputFieldCls}
                  endAdornment={newSarSmall}
                />
              </div>

              {/* 3. Product Cost (تكلفة المنتج الأساسي) */}
              <div>
                <TextInputGroup
                  id="productCost"
                  name="productCost"
                  type="number"
                  min="0"
                  label={t("b2b.productCost")}
                  labelClassName={labelCls}
                  value={values.productCost ?? values.b2bPrice?.productCost ?? ""}
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue("b2bPrice.productCost", e.target.value);
                  }}
                  onBlur={handleBlur}
                  touched={productCostTouched}
                  errors={productCostErr}
                  placeholder={t("b2b.productCostPlaceholder")}
                  borderClassName={inputBorderCls}
                  inputClassName={inputFieldCls}
                  endAdornment={newSarSmall}
                />
              </div>

              {/* 4. Free Supervisor (مشرف مجاني لكل) */}
              <div>
                <TextInputGroup
                  id="studentsPerSupervisor"
                  name="studentsPerSupervisor"
                  type="number"
                  min="1"
                  label={t("b2b.freeSupervisorLabel")}
                  labelClassName={labelCls}
                  value={
                    values.studentsPerSupervisor ??
                    values.b2bPrice?.studentsPerSupervisor ??
                    values.b2bPricing?.studentsPerSupervisor ??
                    values.b2bPricing?.supervisorRatio ??
                    ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldValue("studentsPerSupervisor", val);
                    setFieldValue("b2bPrice.studentsPerSupervisor", val);
                    setFieldValue("b2bPricing.studentsPerSupervisor", val);
                    setFieldValue("b2bPricing.supervisorRatio", val);
                    setFieldValue(
                      "b2bPricing.freeSupervisor",
                      Boolean(val && Number(val) > 0)
                    );
                  }}
                  onBlur={handleBlur}
                  touched={studentsPerSupervisorTouched}
                  errors={studentsPerSupervisorErr}
                  placeholder="10"
                  borderClassName={inputBorderCls}
                  inputClassName={inputFieldCls}
                  endAdornment={
                    <span className="text-xs text-textLight font-somar font-medium pointer-events-none select-none">
                      {t("b2b.studentUnit")}
                    </span>
                  }
                />
                {!(studentsPerSupervisorTouched && studentsPerSupervisorErr) && (
                  <p className="text-xs text-subtitleColor mt-1.5 font-somar flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-mainColor/70 shrink-0" />
                    <span>
                      {(values.studentsPerSupervisor ??
                        values.b2bPrice?.studentsPerSupervisor ??
                        values.b2bPricing?.studentsPerSupervisor ??
                        values.b2bPricing?.supervisorRatio) &&
                      Number(
                        values.studentsPerSupervisor ??
                          values.b2bPrice?.studentsPerSupervisor ??
                          values.b2bPricing?.studentsPerSupervisor ??
                          values.b2bPricing?.supervisorRatio
                      ) > 0
                        ? t("b2b.supervisorRatioCalculation", {
                            students:
                              values.studentsPerSupervisor ??
                              values.b2bPrice?.studentsPerSupervisor ??
                              values.b2bPricing?.studentsPerSupervisor ??
                              values.b2bPricing?.supervisorRatio,
                            supervisors: 1,
                          })
                        : t("b2b.freeSupervisorHint")}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* 2. Quantity Discount Tiers for Schools (شرائح الخصم الكمي للمدارس) */}
            <div className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4">
              <div className="border-b border-border pb-3 text-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
                    <LocalOfferOutlinedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-somar font-bold text-base text-titleColor">
                      {t("b2b.quantityDiscountTitle")}
                    </h3>
                    <p className="font-somar text-xs text-textLight">
                      {t("b2b.quantityDiscountSubtitle")}
                    </p>
                  </div>
                </div>
              </div>

              <FieldArray name="b2bPrice.quantityDiscountTiers">
                {({ push, remove }) => {
                  const bulkList =
                    Array.isArray(values.b2bPrice?.quantityDiscountTiers) &&
                    values.b2bPrice.quantityDiscountTiers.length > 0
                      ? values.b2bPrice.quantityDiscountTiers
                      : Array.isArray(values.bulkPricing) &&
                        values.bulkPricing.length > 0
                      ? values.bulkPricing
                      : [];

                  return (
                    <div className="space-y-3">
                      {bulkList.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border border-border shadow-xs transition-all hover:border-mainColor/30"
                        >
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                            <div>
                              <TextInputGroup
                                type="number"
                                min="1"
                                name={`b2bPrice.quantityDiscountTiers[${index}].minQuantity`}
                                value={item.minQuantity ?? item.minCount ?? ""}
                                onChange={(e) => {
                                  setFieldValue(
                                    `b2bPrice.quantityDiscountTiers[${index}].minQuantity`,
                                    e.target.value
                                  );
                                  setFieldValue(
                                    `b2bPrice.quantityDiscountTiers[${index}].minCount`,
                                    e.target.value
                                  );
                                  if (!item.discountType) {
                                    setFieldValue(
                                      `b2bPrice.quantityDiscountTiers[${index}].discountType`,
                                      "PERCENTAGE"
                                    );
                                  }
                                }}
                                onBlur={handleBlur}
                                label={t("b2b.minQuantity")}
                                labelClassName="block text-xs font-somar font-medium text-textLight text-start"
                                placeholder={t("b2b.minQuantityPlaceholder")}
                                borderClassName={inputBorderCls}
                                inputClassName={inputFieldCls}
                              />
                            </div>

                            <div>
                              <SelectionGroup
                                name={`b2bPrice.quantityDiscountTiers[${index}].discountType`}
                                value={item.discountType || "PERCENTAGE"}
                                onChange={(e) => {
                                  const newType = e.target.value;
                                  setFieldValue(
                                    `b2bPrice.quantityDiscountTiers[${index}].discountType`,
                                    newType
                                  );
                                  if (newType === "PERCENTAGE" && Number(item.discountValue) > 100) {
                                    setFieldValue(
                                      `b2bPrice.quantityDiscountTiers[${index}].discountValue`,
                                      "100"
                                    );
                                  }
                                }}
                                onBlur={handleBlur}
                                label={t("b2b.discountType")}
                                labelClassName="block text-xs font-somar font-medium text-textLight text-start"
                                list={discountTypeList}
                                border="1px solid var(--color-border)"
                              />
                            </div>

                            <div>
                              {(() => {
                                const isPercentage = (item.discountType || "PERCENTAGE") === "PERCENTAGE";
                                return (
                                  <TextInputGroup
                                    type="number"
                                    min="0"
                                    max={isPercentage ? "100" : undefined}
                                    name={`b2bPrice.quantityDiscountTiers[${index}].discountValue`}
                                    value={item.discountValue ?? ""}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      if (isPercentage && Number(val) > 100) {
                                        val = "100";
                                      }
                                      setFieldValue(
                                        `b2bPrice.quantityDiscountTiers[${index}].discountValue`,
                                        val
                                      );
                                      if (!item.discountType) {
                                        setFieldValue(
                                          `b2bPrice.quantityDiscountTiers[${index}].discountType`,
                                          "PERCENTAGE"
                                        );
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    touched={getIn(
                                      touched,
                                      `b2bPrice.quantityDiscountTiers[${index}].discountValue`
                                    )}
                                    errors={getIn(
                                      errors,
                                      `b2bPrice.quantityDiscountTiers[${index}].discountValue`
                                    )}
                                    label={t("b2b.discountValue")}
                                    labelClassName="block text-xs font-somar font-medium text-textLight text-start"
                                    placeholder={t("b2b.discountValuePlaceholder")}
                                    borderClassName={inputBorderCls}
                                    inputClassName={inputFieldCls}
                                    endAdornment={
                                      !isPercentage ? (
                                        newSarSmall
                                      ) : (
                                        <span className="text-textLight font-somar text-sm">%</span>
                                      )
                                    }
                                  />
                                );
                              })()}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer self-center"
                            title="Delete"
                          >
                            <DeleteOutlineIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          push({
                            minQuantity: "",
                            discountType: "PERCENTAGE",
                            discountValue: "",
                          })
                        }
                        className="w-full py-3 rounded-xl border border-mainColor text-mainColor font-somar font-bold text-sm sm:text-base hover:bg-mainColor/5 transition-colors cursor-pointer text-center mt-2"
                      >
                        {t("b2b.addTierBtn")}
                      </button>
                    </div>
                  );
                }}
              </FieldArray>
            </div>

            {/* 3. B2B Date & Season Pricing Rules (MATCHING INDIVIDUALS B2C) */}
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-border space-y-6 shadow-none">
              <FieldArray name="b2bPrice.datePricing">
                {({ push, remove }) => {
                  const b2bDatePricingList =
                    Array.isArray(values.b2bPrice?.datePricing) &&
                    values.b2bPrice.datePricing.length > 0
                      ? values.b2bPrice.datePricing
                      : [{ date: "", price: "" }];

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                        <div className="text-start">
                          <h3 className="font-somar font-bold text-base sm:text-lg text-titleColor">
                            {t("b2b.datePricingTitle")}
                          </h3>
                          <p className="font-somar text-xs sm:text-sm text-textLight mt-1">
                            {t("b2b.datePricingSubtitle")}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const bPrice =
                              values.b2bPrice?.price ||
                              values.b2bPricing?.schoolsPrice ||
                              values.price ||
                              0;
                            const defaultPrice = calculateRulePrice(
                              bPrice,
                              values.b2bPrice?.key || "DECREASE",
                              values.b2bPrice?.conditionRuleValue || 10
                            );
                            push({
                              date: "",
                              fromDate: "",
                              toDate: "",
                              key: values.b2bPrice?.key || "DECREASE",
                              percentage: values.b2bPrice?.conditionRuleValue || 10,
                              price: defaultPrice !== "" ? defaultPrice : "",
                            });
                          }}
                          className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <span>{t("b2b.addRuleBtn")}</span>
                        </button>
                      </div>

                      {/* Condition Builder Row for B2B */}
                      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-somar text-textDark">
                        <span className="font-medium text-textDark flex-shrink-0">
                          {t("b2b.priceByLabel")}
                        </span>

                        {/* Dropdown: زيادة / تخفيض */}
                        <div className="w-28 sm:w-32">
                          <SelectionGroup
                            name="b2bPrice.key"
                            value={values.b2bPrice?.key || "DECREASE"}
                            onChange={(e) => {
                              setFieldValue("b2bPrice.key", e.target.value, true);
                            }}
                            placeholder={t("b2b.decrease")}
                            list={changeTypeList}
                            border="1px solid var(--color-border)"
                          />
                        </div>

                        {/* Input: %10 with matching 52px height */}
                        <div className="w-24 sm:w-28">
                          <TextInputGroup
                            type="number"
                            min="1"
                            max={(values.b2bPrice?.key || "DECREASE") === "DECREASE" ? "100" : undefined}
                            name="b2bPrice.conditionRuleValue"
                            value={values.b2bPrice?.conditionRuleValue ?? "10"}
                            onChange={(e) => {
                              let val = e.target.value;
                              const isDiscount = (values.b2bPrice?.key || "DECREASE") === "DECREASE";
                              if (isDiscount && Number(val) > 100) {
                                val = "100";
                              }
                              setFieldValue(
                                "b2bPrice.conditionRuleValue",
                                val,
                                true
                              );
                            }}
                            onBlur={handleBlur}
                            touched={getIn(touched, "b2bPrice.conditionRuleValue")}
                            errors={getIn(errors, "b2bPrice.conditionRuleValue")}
                            placeholder="10"
                            borderClassName={inputBorderCls}
                            inputClassName="!h-[52px] !py-0 px-2 text-center font-somar text-xs sm:text-sm text-textDark"
                            endAdornment={
                              <span className="text-textLight font-somar text-sm">
                                %
                              </span>
                            }
                          />
                        </div>
                      </div>

                      {/* Date Pricing Rows for B2B */}
                      <div className="space-y-4 pt-2">
                        {b2bDatePricingList.map((item, index) => {
                          const fromDateVal = item.fromDate || item.date || "";
                          const toDateVal = item.toDate || fromDateVal || "";

                          const isFromPast = Boolean(
                            fromDateVal && fromDateVal < todayStr
                          );
                          const isToPast = Boolean(
                            toDateVal && toDateVal < todayStr
                          );
                          const isToBeforeFrom = Boolean(
                            toDateVal && fromDateVal && toDateVal < fromDateVal
                          );

                          const fromTouched = getIn(
                            touched,
                            `b2bPrice.datePricing[${index}].fromDate`
                          );
                          const toTouched = getIn(
                            touched,
                            `b2bPrice.datePricing[${index}].toDate`
                          );
                          const fromError = getIn(
                            errors,
                            `b2bPrice.datePricing[${index}].fromDate`
                          );
                          const toError = getIn(
                            errors,
                            `b2bPrice.datePricing[${index}].toDate`
                          );
                          const priceTouched = getIn(
                            touched,
                            `b2bPrice.datePricing[${index}].price`
                          );
                          const priceError = getIn(
                            errors,
                            `b2bPrice.datePricing[${index}].price`
                          );

                          return (
                            <div
                              key={index}
                              className="flex flex-wrap md:flex-nowrap items-start gap-3 sm:gap-4 transition-all"
                            >
                              {/* From Date */}
                              <div className="w-full md:w-auto md:flex-1">
                                <TextInputGroup
                                  id={`b2bDatePricing-${index}-fromDate`}
                                  name={`b2bPrice.datePricing[${index}].fromDate`}
                                  type="date"
                                  min={todayStr}
                                  label={t("b2b.fromDateReadOnly")}
                                  labelClassName={subLabelCls}
                                  value={fromDateVal}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFieldValue(
                                      `b2bPrice.datePricing[${index}].fromDate`,
                                      val
                                    );
                                    setFieldValue(
                                      `b2bPrice.datePricing[${index}].date`,
                                      val
                                    );
                                    if (val && item.toDate && val > item.toDate) {
                                      setFieldValue(
                                        `b2bPrice.datePricing[${index}].toDate`,
                                        val
                                      );
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  touched={fromTouched || isFromPast}
                                  errors={
                                    isFromPast
                                      ? t("validations.pastDateError")
                                      : fromError
                                  }
                                />
                              </div>

                              {/* To Date */}
                              <div className="w-full md:w-auto md:flex-1">
                                <TextInputGroup
                                  id={`b2bDatePricing-${index}-toDate`}
                                  name={`b2bPrice.datePricing[${index}].toDate`}
                                  type="date"
                                  min={fromDateVal || todayStr}
                                  label={t("b2b.toDateReadOnly")}
                                  labelClassName={subLabelCls}
                                  value={toDateVal}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `b2bPrice.datePricing[${index}].toDate`,
                                      e.target.value
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  touched={
                                    toTouched || isToPast || isToBeforeFrom
                                  }
                                  errors={
                                    isToPast
                                      ? t("validations.pastDateError")
                                      : isToBeforeFrom
                                      ? t("validations.endDateAfterStartDate")
                                      : toError
                                  }
                                />
                              </div>

                              {/* Price */}
                              <div className="w-full md:w-auto md:flex-1">
                                <TextInputGroup
                                  id={`b2bDatePricing-${index}-price`}
                                  name={`b2bPrice.datePricing[${index}].price`}
                                  type="number"
                                  min="0"
                                  label={t("b2b.priceInSar")}
                                  labelClassName={subLabelCls}
                                  value={item.price ?? ""}
                                  onChange={(e) => {
                                    setFieldValue(
                                      `b2bPrice.datePricing[${index}].price`,
                                      e.target.value
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  placeholder="30"
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  endAdornment={newSarSmall}
                                  touched={priceTouched}
                                  errors={priceError}
                                />
                              </div>

                              {/* Delete Button (Shown only when more than 1 row exists) */}
                              {b2bDatePricingList.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer flex-shrink-0 mb-0.5 mt-6"
                                  title={isAr ? "حذف" : "Delete"}
                                >
                                  <DeleteOutlineIcon className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                }}
              </FieldArray>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                Dedicated B2B Branch Customization Section (Strictly Schools)
            ───────────────────────────────────────────────────────────── */}
            {isCustomizedActive && (
              <div
                aria-labelledby="branch-pricing-b2b-title"
                className="bg-white rounded-2xl border border-border p-5 sm:p-7 transition-all duration-200 text-start shadow-none space-y-4 mt-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <h3
                      id="branch-pricing-b2b-title"
                      className="font-somar text-lg sm:text-xl font-bold text-titleColor"
                    >
                      {t("b2bBranchSectionTitle") || "تخصيص أسعار الفروع للمدارس والجهات"}
                    </h3>
                    <p className="font-somar text-xs sm:text-sm text-textLight mt-1">
                      {t("b2bBranchSectionSubtitle") || "تحديد أسعار وتكاليف وخصومات كمية مخصصة للمدارس لكل فرع"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{t("editBranchesBtn")}</span>
                  </button>
                </div>

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
                    const branchData = values.branchPricing?.[branch.id] || {};

                    return (
                      <div
                        key={branch.id}
                        className="rounded-2xl border border-border overflow-hidden transition-all duration-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleBranch(branch.id)}
                          className="w-full p-4 sm:p-5 bg-gray-50/60 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors"
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

                        {isOpen && (
                          <div className="p-4 sm:p-6 bg-white border-t border-border space-y-6">
                            {/* 1. Base 4 inputs for B2B Branch */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
                              <div>
                                <TextInputGroup
                                  type="number"
                                  min="0"
                                  label={t("b2b.marketPrice")}
                                  labelClassName={labelCls}
                                  value={branchData.schoolsPrice ?? ""}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `branchPricing.${branch.id}.schoolsPrice`,
                                      e.target.value
                                    )
                                  }
                                  placeholder={t("b2b.marketPricePlaceholder")}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  endAdornment={newSarSmall}
                                />
                              </div>

                              <div>
                                <TextInputGroup
                                  type="number"
                                  min="0"
                                  label={t("b2b.discountedPrice")}
                                  labelClassName={labelCls}
                                  value={branchData.b2bDiscountedPrice ?? ""}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `branchPricing.${branch.id}.b2bDiscountedPrice`,
                                      e.target.value
                                    )
                                  }
                                  placeholder={t("b2b.discountedPricePlaceholder")}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  endAdornment={newSarSmall}
                                />
                              </div>

                              <div>
                                <TextInputGroup
                                  type="number"
                                  min="0"
                                  label={t("b2b.productCost")}
                                  labelClassName={labelCls}
                                  value={branchData.productCost ?? ""}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `branchPricing.${branch.id}.productCost`,
                                      e.target.value
                                    )
                                  }
                                  placeholder={t("b2b.productCostPlaceholder")}
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  endAdornment={newSarSmall}
                                />
                              </div>

                              <div>
                                <TextInputGroup
                                  type="number"
                                  min="1"
                                  label={t("b2b.freeSupervisorLabel")}
                                  labelClassName={labelCls}
                                  value={branchData.studentsPerSupervisor ?? ""}
                                  onChange={(e) =>
                                    setFieldValue(
                                      `branchPricing.${branch.id}.studentsPerSupervisor`,
                                      e.target.value
                                    )
                                  }
                                  placeholder="10"
                                  borderClassName={inputBorderCls}
                                  inputClassName={inputFieldCls}
                                  endAdornment={
                                    <span className="text-xs text-textLight font-somar font-medium pointer-events-none select-none">
                                      {t("b2b.studentUnit")}
                                    </span>
                                  }
                                />
                                {!(
                                  getIn(
                                    touched,
                                    `branchPricing.${branch.id}.studentsPerSupervisor`
                                  ) &&
                                  getIn(
                                    errors,
                                    `branchPricing.${branch.id}.studentsPerSupervisor`
                                  )
                                ) && (
                                  <p className="text-xs text-subtitleColor mt-1.5 font-somar flex items-center gap-1.5">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-mainColor/70 shrink-0" />
                                    <span>
                                      {branchData.studentsPerSupervisor &&
                                      Number(branchData.studentsPerSupervisor) > 0
                                        ? t("b2b.supervisorRatioCalculation", {
                                            students:
                                              branchData.studentsPerSupervisor,
                                            supervisors: 1,
                                          })
                                        : t("b2b.freeSupervisorHint")}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* 2. Quantity Discount Tiers for B2B Branch (التسعير الكمي) */}
                            <div className="bg-gray-50/70 p-4 sm:p-5 rounded-xl border border-border space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                                <div>
                                  <h6 className="font-somar font-bold text-sm text-titleColor">
                                    {t("branchQuantityDiscountsTitle") || t("b2b.quantityDiscountTitle")}
                                  </h6>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentTiers = Array.isArray(
                                      branchData.b2bQuantityDiscountTiers
                                    )
                                      ? branchData.b2bQuantityDiscountTiers
                                      : [];
                                    setFieldValue(
                                      `branchPricing.${branch.id}.b2bQuantityDiscountTiers`,
                                      [
                                        ...currentTiers,
                                        {
                                          minQuantity: "",
                                          discountType: "PERCENTAGE",
                                          discountValue: "",
                                        },
                                      ]
                                    );
                                  }}
                                  className="px-3 py-1.5 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
                                >
                                  + {t("b2b.addTierBtn")}
                                </button>
                              </div>

                              <div className="space-y-3">
                                {(Array.isArray(branchData.b2bQuantityDiscountTiers)
                                  ? branchData.b2bQuantityDiscountTiers
                                  : []
                                ).map((tier, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className="flex items-center gap-3 bg-white p-3 rounded-xl border border-border"
                                  >
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                                      <TextInputGroup
                                        type="number"
                                        min="1"
                                        label={t("b2b.minQuantity")}
                                        value={tier.minQuantity ?? ""}
                                        onChange={(e) => {
                                          setFieldValue(
                                            `branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].minQuantity`,
                                            e.target.value
                                          );
                                          if (!tier.discountType) {
                                            setFieldValue(
                                              `branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].discountType`,
                                              "PERCENTAGE"
                                            );
                                          }
                                        }}
                                        borderClassName={inputBorderCls}
                                        inputClassName="!h-[44px] !py-0 px-3 font-somar text-xs text-textDark"
                                      />
                                      <SelectionGroup
                                        label={t("b2b.discountType")}
                                        value={tier.discountType || "PERCENTAGE"}
                                        onChange={(e) => {
                                          const newType = e.target.value;
                                          setFieldValue(
                                            `branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].discountType`,
                                            newType
                                          );
                                          if (newType === "PERCENTAGE" && Number(tier.discountValue) > 100) {
                                            setFieldValue(
                                              `branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].discountValue`,
                                              "100"
                                            );
                                          }
                                        }}
                                        list={discountTypeList}
                                        border="1px solid var(--color-border)"
                                        className="[&_.MuiSelect-select]:!h-[44px] [&_.MuiSelect-select]:!min-h-[44px]"
                                      />
                                      {(() => {
                                        const isPercentage = (tier.discountType || "PERCENTAGE") === "PERCENTAGE";
                                        return (
                                          <TextInputGroup
                                            type="number"
                                            min="0"
                                            max={isPercentage ? "100" : undefined}
                                            name={`branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].discountValue`}
                                            label={t("b2b.discountValue")}
                                            value={tier.discountValue ?? ""}
                                            onChange={(e) => {
                                              let val = e.target.value;
                                              if (isPercentage && Number(val) > 100) {
                                                val = "100";
                                              }
                                              setFieldValue(
                                                `branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].discountValue`,
                                                val
                                              );
                                              if (!tier.discountType) {
                                                setFieldValue(
                                                  `branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].discountType`,
                                                  "PERCENTAGE"
                                                );
                                              }
                                            }}
                                            onBlur={handleBlur}
                                            touched={getIn(
                                              touched,
                                              `branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].discountValue`
                                            )}
                                            errors={getIn(
                                              errors,
                                              `branchPricing.${branch.id}.b2bQuantityDiscountTiers[${tIdx}].discountValue`
                                            )}
                                            borderClassName={inputBorderCls}
                                            inputClassName="!h-[44px] !py-0 px-3 font-somar text-xs text-textDark"
                                            endAdornment={
                                              !isPercentage ? (
                                                newSarSmall
                                              ) : (
                                                <span className="text-textLight font-somar text-xs">%</span>
                                              )
                                            }
                                          />
                                        );
                                      })()}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = (
                                          branchData.b2bQuantityDiscountTiers || []
                                        ).filter((_, i) => i !== tIdx);
                                        setFieldValue(
                                          `branchPricing.${branch.id}.b2bQuantityDiscountTiers`,
                                          updated
                                        );
                                      }}
                                      className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer self-center"
                                    >
                                      <DeleteOutlineIcon className="w-5 h-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 3. Date / Seasonal Pricing for B2B Branch */}
                            <div className="bg-gray-50/70 p-4 sm:p-5 rounded-xl border border-border space-y-4">
                              {(() => {
                                const b2bBranchKey =
                                  branchData.b2bKey ||
                                  values.b2bPrice?.key ||
                                  "DECREASE";
                                const b2bBranchPercent =
                                  branchData.b2bConditionRuleValue ??
                                  values.b2bPrice?.conditionRuleValue ??
                                  10;
                                const defaultB2bPrice = calculateRulePrice(
                                  branchData.schoolsPrice ||
                                    values.b2bPrice?.price ||
                                    values.price,
                                  b2bBranchKey,
                                  b2bBranchPercent
                                );
                                const branchB2bDatePricingList =
                                  Array.isArray(branchData.b2bDatePricing) &&
                                  branchData.b2bDatePricing.length > 0
                                    ? branchData.b2bDatePricing
                                    : [
                                        {
                                          date: "",
                                          fromDate: "",
                                          toDate: "",
                                          key: b2bBranchKey,
                                          percentage: b2bBranchPercent,
                                          price:
                                            defaultB2bPrice !== ""
                                              ? defaultB2bPrice
                                              : "",
                                        },
                                      ];

                                return (
                                  <>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
                                      <div className="text-start">
                                        <h6 className="font-somar font-bold text-sm sm:text-base text-titleColor">
                                          {t("branchDatePricingTitle") ||
                                            t("b2b.datePricingTitle")}
                                        </h6>
                                        <p className="font-somar text-xs sm:text-sm text-textLight mt-1">
                                          {t("branchDatePricingSubtitle") ||
                                            t("b2b.datePricingSubtitle")}
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setFieldValue(
                                            `branchPricing.${branch.id}.b2bDatePricing`,
                                            [
                                              ...branchB2bDatePricingList,
                                              {
                                                date: "",
                                                fromDate: "",
                                                toDate: "",
                                                key: b2bBranchKey,
                                                percentage: b2bBranchPercent,
                                                price:
                                                  defaultB2bPrice !== ""
                                                    ? defaultB2bPrice
                                                    : "",
                                              },
                                            ]
                                          );
                                        }}
                                        className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap"
                                      >
                                        <span>{t("b2b.addRuleBtn")}</span>
                                      </button>
                                    </div>

                                    {/* Condition Builder Row for B2B Branch */}
                                    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-somar text-textDark">
                                      <span className="font-medium text-textDark flex-shrink-0">
                                        {t("b2b.priceByLabel")}
                                      </span>

                                      <div className="w-28 sm:w-32">
                                        <SelectionGroup
                                          name={`branchPricing.${branch.id}.b2bKey`}
                                          value={b2bBranchKey}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `branchPricing.${branch.id}.b2bKey`,
                                              e.target.value,
                                              true
                                            );
                                          }}
                                          placeholder={t("b2b.decrease")}
                                          list={changeTypeList}
                                          border="1px solid var(--color-border)"
                                        />
                                      </div>

                                      <div className="w-24 sm:w-28">
                                        <TextInputGroup
                                          type="number"
                                          min="1"
                                          max={(b2bBranchKey || "DECREASE") === "DECREASE" ? "100" : undefined}
                                          name={`branchPricing.${branch.id}.b2bConditionRuleValue`}
                                          value={b2bBranchPercent}
                                          onChange={(e) => {
                                            let val = e.target.value;
                                            const isDiscount = (b2bBranchKey || "DECREASE") === "DECREASE";
                                            if (isDiscount && Number(val) > 100) {
                                              val = "100";
                                            }
                                            setFieldValue(
                                              `branchPricing.${branch.id}.b2bConditionRuleValue`,
                                              val,
                                              true
                                            );
                                          }}
                                          onBlur={handleBlur}
                                          touched={getIn(
                                            touched,
                                            `branchPricing.${branch.id}.b2bConditionRuleValue`
                                          )}
                                          errors={getIn(
                                            errors,
                                            `branchPricing.${branch.id}.b2bConditionRuleValue`
                                          )}
                                          placeholder="10"
                                          borderClassName={inputBorderCls}
                                          inputClassName="!h-[52px] !py-0 px-2 text-center font-somar text-xs sm:text-sm text-textDark"
                                          endAdornment={
                                            <span className="text-textLight font-somar text-sm">
                                              %
                                            </span>
                                          }
                                        />
                                      </div>
                                    </div>

                                    {/* Date Pricing Rows for B2B Branch */}
                                    <div className="space-y-4 pt-2">
                                      {branchB2bDatePricingList.map(
                                        (rule, rIdx) => {
                                          const fromDateVal =
                                            rule.fromDate ||
                                            rule.fromDay ||
                                            rule.date ||
                                            "";
                                          const toDateVal =
                                            rule.toDate ||
                                            rule.toDay ||
                                            fromDateVal ||
                                            "";

                                          const isFromPast = Boolean(
                                            fromDateVal &&
                                              fromDateVal < todayStr
                                          );
                                          const isToPast = Boolean(
                                            toDateVal && toDateVal < todayStr
                                          );
                                          const isToBeforeFrom = Boolean(
                                            toDateVal &&
                                              fromDateVal &&
                                              toDateVal < fromDateVal
                                          );

                                          const fromTouched = getIn(
                                            touched,
                                            `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].fromDate`
                                          );
                                          const toTouched = getIn(
                                            touched,
                                            `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].toDate`
                                          );
                                          const fromError = getIn(
                                            errors,
                                            `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].fromDate`
                                          );
                                          const toError = getIn(
                                            errors,
                                            `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].toDate`
                                          );
                                          const priceTouched = getIn(
                                            touched,
                                            `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].price`
                                          );
                                          const priceError = getIn(
                                            errors,
                                            `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].price`
                                          );

                                          return (
                                            <div
                                              key={rIdx}
                                              className="flex flex-wrap md:flex-nowrap items-start gap-3 sm:gap-4 transition-all"
                                            >
                                              {/* From Date */}
                                              <div className="w-full md:w-auto md:flex-1">
                                                <TextInputGroup
                                                  id={`branchPricing-${branch.id}-b2bDatePricing-${rIdx}-fromDate`}
                                                  name={`branchPricing.${branch.id}.b2bDatePricing[${rIdx}].fromDate`}
                                                  type="date"
                                                  min={todayStr}
                                                  label={t(
                                                    "b2b.fromDateReadOnly"
                                                  )}
                                                  labelClassName={subLabelCls}
                                                  value={fromDateVal}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFieldValue(
                                                      `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].fromDate`,
                                                      val
                                                    );
                                                    setFieldValue(
                                                      `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].date`,
                                                      val
                                                    );
                                                    if (
                                                      val &&
                                                      rule.toDate &&
                                                      val > rule.toDate
                                                    ) {
                                                      setFieldValue(
                                                        `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].toDate`,
                                                        val
                                                      );
                                                    }
                                                  }}
                                                  onBlur={handleBlur}
                                                  borderClassName={
                                                    inputBorderCls
                                                  }
                                                  inputClassName={inputFieldCls}
                                                  touched={
                                                    fromTouched || isFromPast
                                                  }
                                                  errors={
                                                    isFromPast
                                                      ? t(
                                                          "validations.pastDateError"
                                                        )
                                                      : fromError
                                                  }
                                                />
                                              </div>

                                              {/* To Date */}
                                              <div className="w-full md:w-auto md:flex-1">
                                                <TextInputGroup
                                                  id={`branchPricing-${branch.id}-b2bDatePricing-${rIdx}-toDate`}
                                                  name={`branchPricing.${branch.id}.b2bDatePricing[${rIdx}].toDate`}
                                                  type="date"
                                                  min={fromDateVal || todayStr}
                                                  label={t(
                                                    "b2b.toDateReadOnly"
                                                  )}
                                                  labelClassName={subLabelCls}
                                                  value={toDateVal}
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].toDate`,
                                                      e.target.value
                                                    );
                                                  }}
                                                  onBlur={handleBlur}
                                                  borderClassName={
                                                    inputBorderCls
                                                  }
                                                  inputClassName={inputFieldCls}
                                                  touched={
                                                    toTouched ||
                                                    isToPast ||
                                                    isToBeforeFrom
                                                  }
                                                  errors={
                                                    isToPast
                                                      ? t(
                                                          "validations.pastDateError"
                                                        )
                                                      : isToBeforeFrom
                                                      ? t(
                                                          "validations.endDateAfterStartDate"
                                                        )
                                                      : toError
                                                  }
                                                />
                                              </div>

                                              {/* Price */}
                                              <div className="w-full md:w-auto md:flex-1">
                                                <TextInputGroup
                                                  id={`branchPricing-${branch.id}-b2bDatePricing-${rIdx}-price`}
                                                  name={`branchPricing.${branch.id}.b2bDatePricing[${rIdx}].price`}
                                                  type="number"
                                                  min="0"
                                                  label={t("b2b.priceInSar")}
                                                  labelClassName={subLabelCls}
                                                  value={rule.price ?? ""}
                                                  onChange={(e) => {
                                                    setFieldValue(
                                                      `branchPricing.${branch.id}.b2bDatePricing[${rIdx}].price`,
                                                      e.target.value
                                                    );
                                                  }}
                                                  onBlur={handleBlur}
                                                  placeholder={String(
                                                    defaultB2bPrice || "60"
                                                  )}
                                                  borderClassName={
                                                    inputBorderCls
                                                  }
                                                  inputClassName={inputFieldCls}
                                                  endAdornment={newSarSmall}
                                                  touched={priceTouched}
                                                  errors={priceError}
                                                />
                                              </div>

                                              {/* Delete Button (Shown on all rows when more than 1 row exists) */}
                                              {branchB2bDatePricingList.length >
                                                1 && (
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    const updated =
                                                      branchB2bDatePricingList.filter(
                                                        (_, i) => i !== rIdx
                                                      );
                                                    setFieldValue(
                                                      `branchPricing.${branch.id}.b2bDatePricing`,
                                                      updated
                                                    );
                                                  }}
                                                  className="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer flex-shrink-0 mb-0.5 mt-6"
                                                  title={
                                                    isAr ? "حذف" : "Delete"
                                                  }
                                                >
                                                  <DeleteOutlineIcon className="w-5 h-5" />
                                                </button>
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Branch Customization Drawer / Sidebar
      ───────────────────────────────────────────────────────────── */}
      <BranchCustomizationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedBranchIds={customizedBranchIds}
        onSave={handleSaveSidebarBranches}
        branchGroups={branchGroups}
        allowedBranchIds={values.providerBranchs}
        title={t("sidebarTitle")}
        subtitle={t("sidebarSubtitle")}
        saveBtnText={t("saveBtn")}
      />
    </div>
  );
};

export default memo(Step8Pricing);
