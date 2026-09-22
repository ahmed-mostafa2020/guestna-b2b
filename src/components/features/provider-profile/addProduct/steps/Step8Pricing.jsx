"use client";

import { memo, useMemo, useState, useCallback, useEffect } from "react";
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

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

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

  // Branch customization states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openBranches, setOpenBranches] = useState({});

  // Local state for rule condition builder
  const [conditionRule, setConditionRule] = useState(() => ({
    changeType: values.key || values.conditionRuleChangeType || "INCREASE",
    value: values.conditionRuleValue || "15",
  }));

  // Current date formatted as YYYY-MM-DD for min date validation
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const defaultStartDate =
    values.fromDay && values.fromDay >= todayStr ? values.fromDay : todayStr;
  const defaultEndDate =
    values.toDay && values.toDay >= defaultStartDate
      ? values.toDay
      : defaultStartDate;

  // Date pricing rows state
  const [datePricingRows, setDatePricingRows] = useState(() => [
    {
      id: 1,
      fromDate: defaultStartDate,
      toDate: defaultEndDate,
      price: values.seasonPrice || "",
    },
  ]);

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
          updatedBranchPricing[id] = {
            price: values.price || "",
            discountedPrice: values.discountedPrice || "",
            productCost: values.productCost || "",
            bulkPricing: values.bulkPricing ? [...values.bulkPricing] : [],
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
      values.price,
      values.discountedPrice,
      values.productCost,
      values.bulkPricing,
      values.branchPricing,
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

  // Common CSS styles
  const labelCls =
    "font-somar text-sm sm:text-base font-medium text-textDark text-start block mb-1.5";
  const subLabelCls =
    "font-somar text-xs sm:text-sm font-medium text-gray-700 text-start block mb-1";
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
                  : "border-border bg-white hover:border-gray-300"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  activeTab === "individual"
                    ? "bg-[#D7ECE7] text-mainColor"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                <GroupsOutlinedIcon className="w-6 h-6" />
              </div>

              <div className="flex flex-col">
                <span className="font-somar font-medium text-sm sm:text-base text-gray-700">
                  {t("tabs.individual")}
                </span>
                <div className="font-somar font-bold text-base sm:text-lg text-mainColor flex items-center gap-1 mt-0.5">
                  <span>
                    {values.price && Number(values.price) > 0
                      ? formatCurrency(values.price)
                      : "-"}
                  </span>
                  <span className="text-sm font-medium text-gray-600">
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
                  : "border-border bg-white hover:border-gray-300"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                  activeTab === "schools"
                    ? "bg-[#D7ECE7] text-mainColor"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                <SchoolOutlinedIcon className="w-6 h-6" />
              </div>

              <div className="flex flex-col">
                <span className="font-somar font-medium text-sm sm:text-base text-gray-700">
                  {t("tabs.schools")}
                </span>
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
                  <span className="text-sm font-medium text-gray-600">
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
                  <p className="font-somar text-xs text-gray-500">
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
                    <p className="font-somar text-xs text-gray-500">
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
                          className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border border-border shadow-xs transition-all hover:border-gray-300"
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
                                labelClassName="block text-xs font-somar font-medium text-gray-500 text-start"
                                placeholder={t("b2c.selectCategory")}
                                list={targetAudienceList}
                                border="1px solid var(--color-border)"
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
                                labelClassName="block text-xs font-somar font-medium text-gray-500 text-start"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="text-start">
                  <h3 className="font-somar font-bold text-base sm:text-lg text-titleColor">
                    {t("b2c.weekdayPricingTitle")}
                  </h3>
                  <p className="font-somar text-xs sm:text-sm text-gray-500 mt-1">
                    {t("b2c.weekdayPricingSubtitle")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextId = Date.now();
                    setDatePricingRows((prev) => [
                      ...prev,
                      {
                        id: nextId,
                        fromDate: defaultStartDate,
                        toDate: defaultEndDate,
                        price: "",
                      },
                    ]);
                  }}
                  className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{t("b2c.addRuleBtn")}</span>
                </button>
              </div>

              {/* Condition Builder Row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-somar text-textDark">
                <span className="font-medium text-gray-700 flex-shrink-0">
                  {t("b2c.priceByLabel")}
                </span>

                {/* Dropdown: زيادة / تخفيض */}
                <div className="w-28 sm:w-32">
                  <SelectionGroup
                    name="key"
                    value={values.key || conditionRule.changeType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConditionRule((prev) => ({
                        ...prev,
                        changeType: val,
                      }));
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
                    name="conditionRuleValue"
                    value={conditionRule.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      setConditionRule((prev) => ({
                        ...prev,
                        value: val,
                      }));
                      setFieldValue("conditionRuleValue", val, true);
                    }}
                    placeholder="15"
                    borderClassName={inputBorderCls}
                    inputClassName="!h-[52px] !py-0 px-2 text-center font-somar text-xs sm:text-sm text-textDark"
                    endAdornment={
                      <span className="text-gray-400 font-somar text-sm">
                        %
                      </span>
                    }
                  />
                </div>
              </div>

              {/* Date Range Rows Matching Screenshot 1 */}
              <div className="space-y-4 pt-2">
                {datePricingRows.map((row, index) => {
                  const isFromPast = Boolean(
                    row.fromDate && row.fromDate < todayStr
                  );
                  const isToPast = Boolean(row.toDate && row.toDate < todayStr);
                  const isToBeforeFrom = Boolean(
                    row.toDate && row.fromDate && row.toDate < row.fromDate
                  );

                  return (
                    <div
                      key={row.id || index}
                      className="flex flex-wrap md:flex-nowrap items-start gap-3 sm:gap-4 transition-all"
                    >
                      {/* From Date */}
                      <div className="w-full md:w-auto md:flex-1">
                        <TextInputGroup
                          id={`fromDate-${row.id || index}`}
                          name={`fromDate-${row.id || index}`}
                          type="date"
                          min={todayStr}
                          label={t("b2c.fromDateReadOnly")}
                          labelClassName={subLabelCls}
                          value={row.fromDate || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDatePricingRows((prev) =>
                              prev.map((r, i) => {
                                if (i !== index) return r;
                                const updated = { ...r, fromDate: val };
                                if (val && r.toDate && val > r.toDate) {
                                  updated.toDate = val;
                                }
                                return updated;
                              })
                            );
                          }}
                          borderClassName={inputBorderCls}
                          inputClassName={inputFieldCls}
                          touched={isFromPast}
                          errors={
                            isFromPast
                              ? t("validations.pastDateError")
                              : undefined
                          }
                        />
                      </div>

                      {/* To Date */}
                      <div className="w-full md:w-auto md:flex-1">
                        <TextInputGroup
                          id={`toDate-${row.id || index}`}
                          name={`toDate-${row.id || index}`}
                          type="date"
                          min={row.fromDate || todayStr}
                          label={t("b2c.toDateReadOnly")}
                          labelClassName={subLabelCls}
                          value={row.toDate || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDatePricingRows((prev) =>
                              prev.map((r, i) =>
                                i === index ? { ...r, toDate: val } : r
                              )
                            );
                          }}
                          borderClassName={inputBorderCls}
                          inputClassName={inputFieldCls}
                          touched={isToPast || isToBeforeFrom}
                          errors={
                            isToPast
                              ? t("validations.pastDateError")
                              : isToBeforeFrom
                                ? t("validations.endDateAfterStartDate")
                                : undefined
                          }
                        />
                      </div>

                      {/* Price */}
                      <div className="flex-1 min-w-0 md:w-auto">
                        <TextInputGroup
                          id={`price-${row.id || index}`}
                          name={`price-${row.id || index}`}
                          type="number"
                          min="0"
                          label={t("b2c.priceInSar")}
                          labelClassName={subLabelCls}
                          value={row.price}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDatePricingRows((prev) =>
                              prev.map((r, i) =>
                                i === index ? { ...r, price: val } : r
                              )
                            );
                            setFieldValue("seasonPrice", val);
                          }}
                          placeholder="60"
                          borderClassName={inputBorderCls}
                          inputClassName={inputFieldCls}
                          endAdornment={newSarSmall}
                        />
                      </div>

                      {/* Delete Button (Shown on all rows when more than 1 row exists) */}
                      {datePricingRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setDatePricingRows((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer flex-shrink-0 mb-0.5 mt-6"
                          title="حذف"
                        >
                          <DeleteOutlineIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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
              <p className="font-somar text-xs sm:text-sm text-gray-500 mt-1">
                {t("b2b.basePriceSubtitle")}
              </p>
            </div>

            {/* 3-column Base Price Fields: تكلفة المنتج الأساسي & سعر السوق & السعر بعد الخصم */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Product Cost (تكلفة المنتج الأساسي) */}
              <div>
                <TextInputGroup
                  id="productCost"
                  name="productCost"
                  type="number"
                  min="0"
                  label={t("b2b.productCost")}
                  labelClassName={labelCls}
                  value={values.productCost ?? ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={productCostTouched}
                  errors={productCostErr}
                  placeholder={t("b2b.productCostPlaceholder")}
                  borderClassName={inputBorderCls}
                  inputClassName={inputFieldCls}
                  endAdornment={newSarSmall}
                />
              </div>

              {/* Market Price (سعر السوق) */}
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
                  touched={priceTouched}
                  errors={priceErr}
                  placeholder={t("b2b.marketPricePlaceholder")}
                  borderClassName={inputBorderCls}
                  inputClassName={inputFieldCls}
                  endAdornment={newSarSmall}
                />
              </div>

              {/* Discounted Price (السعر بعد الخصم) */}
              <div>
                <TextInputGroup
                  id="b2bDiscountedPrice"
                  name="b2bPrice.finalPrice"
                  type="number"
                  min="0"
                  label={t("b2b.discountedPrice")}
                  labelClassName={labelCls}
                  value={values.b2bPrice?.finalPrice ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFieldValue("b2bPrice.finalPrice", val);
                    if (!isB2CEnabled) {
                      setFieldValue("discountedPrice", val);
                    }
                  }}
                  onBlur={handleBlur}
                  placeholder={t("b2b.discountedPricePlaceholder")}
                  borderClassName={inputBorderCls}
                  inputClassName={inputFieldCls}
                  endAdornment={newSarSmall}
                />
              </div>
            </div>

            {/* Bulk / Quantity Tier Pricing Section (التسعير الكمي) */}
            <div className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4">
              <div className="border-b border-border pb-3 text-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
                    <LocalOfferOutlinedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-somar font-bold text-base text-titleColor">
                      {t("b2b.bulkPricingTitle")}
                    </h3>
                    <p className="font-somar text-xs text-gray-500">
                      {t("b2b.bulkPricingSubtitle")}
                    </p>
                  </div>
                </div>
              </div>

              <FieldArray name="bulkPricing">
                {({ push, remove }) => {
                  const bulkList =
                    Array.isArray(values.bulkPricing) &&
                    values.bulkPricing.length > 0
                      ? values.bulkPricing
                      : [{ minCount: "", price: "" }];

                  return (
                    <div className="space-y-3">
                      {bulkList.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-white p-3 sm:p-4 rounded-xl border border-border shadow-xs transition-all hover:border-gray-300"
                        >
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                            <div>
                              <TextInputGroup
                                type="number"
                                min="1"
                                name={`bulkPricing[${index}].minCount`}
                                value={item.minCount ?? ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label={t("b2b.minCount")}
                                labelClassName="block text-xs font-somar font-medium text-gray-500 text-start"
                                placeholder={t("b2b.minCountPlaceholder")}
                                borderClassName={inputBorderCls}
                                inputClassName={inputFieldCls}
                                touched={getIn(
                                  touched,
                                  `bulkPricing[${index}].minCount`
                                )}
                                errors={getIn(
                                  errors,
                                  `bulkPricing[${index}].minCount`
                                )}
                              />
                            </div>

                            <div>
                              <TextInputGroup
                                type="number"
                                min="0"
                                name={`bulkPricing[${index}].price`}
                                value={item.price ?? ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label={t("b2b.perPersonPrice")}
                                labelClassName="block text-xs font-somar font-medium text-gray-500 text-start"
                                placeholder={t("b2b.perPersonPricePlaceholder")}
                                borderClassName={inputBorderCls}
                                inputClassName={inputFieldCls}
                                endAdornment={newSarSmall}
                                touched={getIn(
                                  touched,
                                  `bulkPricing[${index}].price`
                                )}
                                errors={getIn(
                                  errors,
                                  `bulkPricing[${index}].price`
                                )}
                              />
                            </div>
                          </div>

                          {/* Delete Button (Shown on all rows when more than 1 row exists) */}
                          {bulkList.length > 1 && (
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
                        onClick={() => push({ minCount: "", price: "" })}
                        className="w-full py-3 rounded-xl border border-mainColor text-mainColor font-somar font-bold text-sm sm:text-base hover:bg-mainColor/5 transition-colors cursor-pointer text-center mt-2"
                      >
                        {t("b2b.addBulkTierBtn")}
                      </button>
                    </div>
                  );
                }}
              </FieldArray>
            </div>

            {/* Inner Card 2: المشرف / المعلم مجاناً */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-none">
              <div>
                <CheckboxGroup
                  label={t("b2b.freeSupervisorTitle")}
                  isChecked={Boolean(values.b2bPricing?.freeSupervisor)}
                  onChangeFunction={(e) =>
                    setFieldValue("b2bPricing.freeSupervisor", e.target.checked)
                  }
                  hoveringAction={false}
                  fontSize="16px"
                />
              </div>

              {values.b2bPricing?.freeSupervisor && (
                <div className="space-y-3 pt-1">
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
                        "10"
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("studentsPerSupervisor", val);
                        setFieldValue("b2bPrice.studentsPerSupervisor", val);
                        setFieldValue("b2bPricing.studentsPerSupervisor", val);
                        setFieldValue("b2bPricing.supervisorRatio", val);
                      }}
                      placeholder={t("b2b.studentsCountPlaceholder")}
                      borderClassName={inputBorderCls}
                      inputClassName={inputFieldCls}
                      endAdornment={
                        <span className="text-xs font-somar text-gray-500 flex-shrink-0">
                          {t("b2b.students")}
                        </span>
                      }
                    />
                  </div>

                  {/* Helper calculation: لكل 20 طالب ← 2 مشرف مجاني */}
                  <p className="font-somar font-medium text-sm text-mainColor flex items-center gap-1">
                    {t("b2b.supervisorRatioCalculation", {
                      students:
                        (Number(
                          values.studentsPerSupervisor ??
                            values.b2bPrice?.studentsPerSupervisor ??
                            values.b2bPricing?.studentsPerSupervisor ??
                            values.b2bPricing?.supervisorRatio
                        ) || 10) * 2,
                      supervisors: 2,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: Branch Specific Customization
      ───────────────────────────────────────────────────────────── */}
      {isCustomizedActive && (
        <section
          aria-labelledby="branch-pricing-customization-title"
          className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3
                id="branch-pricing-customization-title"
                className="font-somar text-xl font-medium text-textDark leading-6"
              >
                {t("branchSectionTitle")}
              </h3>
              <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
                {t("branchSectionSubtitle")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="px-4 py-2 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
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
              const branchData = values.branchPricing?.[branch.id] || {
                price: "",
                discountedPrice: "",
                productCost: "",
              };

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

                  {isOpen && (
                    <div className="p-4 sm:p-6 bg-white border-t border-border space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

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
