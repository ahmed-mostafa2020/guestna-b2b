"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { useFormikContext, FieldArray, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SelectionGroup from "@components/forms/SelectionGroup";
import formatCurrency from "@utils/formatters/FormatCurrency";
import { newSarSmall } from "@assets/svg";
import { cn } from "@utils/helpers/cn";
import BranchCustomizationSidebar from "./BranchCustomizationSidebar";
import { buildBranchGroups, getItemName } from "../branchConstants";

const Step8Pricing = ({
  formSelectionData = null,
  isSelectionsLoading: _isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.stepPricing");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  // Active pricing tab: only "individual" (B2C) and "schools" (B2B)
  const [activeTab, setActiveTab] = useState(() => {
    const systems = Array.isArray(values.systemTypes) ? values.systemTypes : [];
    if (!systems.includes("B2C") && systems.includes("B2B")) {
      return "schools";
    }
    return "individual";
  });

  // Branch customization states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openBranches, setOpenBranches] = useState({});

  // Local state for temporary inputs in B2C discounts
  const [tempDiscount, setTempDiscount] = useState({
    type: "percentage",
    value: "",
    code: "",
  });

  // Local state for rule condition builder
  const [conditionRule, setConditionRule] = useState({
    type: "SEASON",
    season: "RIYADH_SEASON",
    changeType: "INCREASE",
    value: "15",
  });

  // Date pricing rows state
  const [datePricingRows, setDatePricingRows] = useState(() => [
    {
      id: 1,
      fromDate: values.fromDay || "10",
      toDate: values.toDay || "60",
      price: values.seasonPrice || "60",
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
      { id: "adults", name: { ar: "كبار", en: "Adults" } },
      { id: "children", name: { ar: "أطفال", en: "Children" } },
      { id: "families", name: { ar: "عائلات", en: "Families" } },
      { id: "seniors", name: { ar: "كبار السن", en: "Seniors" } },
      { id: "vip", name: { ar: "شخصيات هامة (VIP)", en: "VIP" } },
    ];
  }, [formSelectionData?.targetAudiences]);

  // Target audience options mapped for SelectionGroup list prop
  const targetAudienceList = useMemo(() => {
    return targetAudienceOptions.map((opt) => ({
      value: opt._id || opt.id,
      label: getItemName(opt, locale),
    }));
  }, [targetAudienceOptions, locale]);

  // Academic stages options
  const academicStageOptions = useMemo(() => {
    if (
      Array.isArray(formSelectionData?.academicStages) &&
      formSelectionData.academicStages.length > 0
    ) {
      return formSelectionData.academicStages;
    }
    return [
      { id: "kindergarten", name: { ar: "رياض الأطفال", en: "Kindergarten" } },
      { id: "primary", name: { ar: "المرحلة الابتدائية", en: "Primary School" } },
      { id: "middle", name: { ar: "المرحلة المتوسطة", en: "Middle School" } },
      { id: "secondary", name: { ar: "المرحلة الثانوية", en: "High School" } },
      { id: "university", name: { ar: "المرحلة الجامعية", en: "University" } },
    ];
  }, [formSelectionData?.academicStages]);

  const academicStageList = useMemo(() => {
    return academicStageOptions.map((opt) => ({
      value: opt._id || opt.id,
      label: getItemName(opt, locale),
    }));
  }, [academicStageOptions, locale]);

  // Season condition lists for SelectionGroup
  const seasonTypeList = useMemo(
    () => [
      { value: "SEASON", label: t("b2c.seasons.season") },
      { value: "DAY", label: t("b2c.day") },
    ],
    [t]
  );

  const seasonOptionsList = useMemo(
    () => [
      { value: "RIYADH_SEASON", label: t("b2c.seasons.riyadhSeason") },
      { value: "JEDDAH_SEASON", label: t("b2c.seasons.jeddahSeason") },
      { value: "DIRIYAH_SEASON", label: t("b2c.seasons.diriyahSeason") },
      { value: "SUMMER", label: t("b2c.seasons.summer") },
      { value: "WEEKEND", label: t("b2c.seasons.weekend") },
      { value: "NATIONAL_DAY", label: t("b2c.seasons.nationalDay") },
    ],
    [t]
  );

  const changeTypeList = useMemo(
    () => [
      { value: "INCREASE", label: t("b2c.increase") },
      { value: "DECREASE", label: t("b2c.decrease") },
    ],
    [t]
  );

  const discountTypeList = useMemo(
    () => [
      { value: "percentage", label: t("b2c.discountTypes.percentage") },
      { value: "fixed", label: t("b2c.discountTypes.fixed") },
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
    [setFieldValue, values.price, values.discountedPrice, values.productCost, values.bulkPricing, values.branchPricing]
  );

  // Cancel branch customization
  const handleCancelCustomization = useCallback(() => {
    setFieldValue("customizedPricingBranches", []);
    setFieldValue("branchPricing", {});
    setOpenBranches({});
  }, [setFieldValue]);

  // Read-only booking dates from Step 4
  const bookingStartDate = values.fromDay || "";
  const bookingEndDate = values.toDay || "";

  // Validation error helpers
  const priceErr = getIn(errors, "price");
  const priceTouched = getIn(touched, "price");
  const hasPriceErr = Boolean(priceErr && priceTouched);

  const discountedPriceErr = getIn(errors, "discountedPrice");
  const discountedPriceTouched = getIn(touched, "discountedPrice");
  const hasDiscountedPriceErr = Boolean(discountedPriceErr && discountedPriceTouched);

  const productCostErr = getIn(errors, "productCost");
  const productCostTouched = getIn(touched, "productCost");
  const hasProductCostErr = Boolean(productCostErr && productCostTouched);

  // Common CSS styles
  const labelCls =
    "font-somar text-sm sm:text-base font-medium text-textDark text-start block mb-1.5";
  const fieldContainerCls =
    "relative flex items-center bg-white rounded-xl border border-border hover:border-mainColor focus-within:border-mainColor px-3.5 py-2.5 transition-all duration-200";

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

        {/* ── 2 TABS: سعر الفرد & للمدارس (MATCHING SCREENSHOT 3) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
          {/* Tab 1: سعر الفرد (Individual / B2C) */}
          <button
            type="button"
            onClick={() => setActiveTab("individual")}
            className={cn(
              "flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-start",
              activeTab === "individual"
                ? "border-mainColor bg-[#EBF7F5] shadow-xs"
                : "border-border bg-white hover:border-gray-300"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                activeTab === "individual"
                  ? "bg-[#D4F2EB] text-mainColor"
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
                <span>{formatCurrency(values.price || 15000)}</span>
                <span className="text-sm font-medium text-gray-600">
                  / {t("tabs.perPerson")}
                </span>
              </div>
            </div>
          </button>

          {/* Tab 2: للمدارس (Schools / B2B) */}
          <button
            type="button"
            onClick={() => setActiveTab("schools")}
            className={cn(
              "flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-start",
              activeTab === "schools"
                ? "border-mainColor bg-[#EBF7F5] shadow-xs"
                : "border-border bg-white hover:border-gray-300"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                activeTab === "schools"
                  ? "bg-[#D4F2EB] text-mainColor"
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
                  {formatCurrency(
                    values.b2bPricing?.schoolsPrice || values.price || 15000
                  )}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  / {t("tabs.perPerson")}
                </span>
              </div>
            </div>
          </button>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Market Price (سعر السوق) */}
                <div>
                  <label htmlFor="price" className={labelCls}>
                    {t("b2c.marketPrice")} <span className="text-error ms-1">*</span>
                  </label>
                  <div
                    className={cn(
                      fieldContainerCls,
                      hasPriceErr
                        ? "border-error focus-within:border-error"
                        : "hover:border-mainColor/60"
                    )}
                  >
                    <input
                      id="price"
                      type="number"
                      min="0"
                      name="price"
                      value={values.price ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("b2c.marketPricePlaceholder")}
                      className="w-full bg-transparent outline-none font-somar text-sm sm:text-base text-textDark placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                      {newSarSmall}
                    </span>
                  </div>
                  {hasPriceErr && (
                    <p className="mt-1 font-somar text-xs text-error">
                      {priceErr}
                    </p>
                  )}
                </div>

                {/* Discounted Price (السعر بعد التخفيض) */}
                <div>
                  <label htmlFor="discountedPrice" className={labelCls}>
                    {t("b2c.discountedPrice")}
                  </label>
                  <div
                    className={cn(
                      fieldContainerCls,
                      hasDiscountedPriceErr
                        ? "border-error focus-within:border-error"
                        : "hover:border-mainColor/60"
                    )}
                  >
                    <input
                      id="discountedPrice"
                      type="number"
                      min="0"
                      name="discountedPrice"
                      value={values.discountedPrice ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("b2c.discountedPricePlaceholder")}
                      className="w-full bg-transparent outline-none font-somar text-sm sm:text-base text-textDark placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                      {newSarSmall}
                    </span>
                  </div>
                  {hasDiscountedPriceErr && (
                    <p className="mt-1 font-somar text-xs text-error">
                      {discountedPriceErr}
                    </p>
                  )}
                </div>

                {/* Available Seats (عدد المقاعد المتاحة للحجز) */}
                <div>
                  <label htmlFor="b2cSeats" className={labelCls}>
                    {t("b2c.availableSeats")}
                  </label>
                  <div className={fieldContainerCls}>
                    <input
                      id="b2cSeats"
                      type="number"
                      min="1"
                      name="b2cSeats"
                      value={values.b2cSeats ?? values.availableSeats?.max ?? ""}
                      onChange={(e) => {
                        setFieldValue("b2cSeats", e.target.value);
                        if (!values.availableSeats?.max) {
                          setFieldValue("availableSeats.max", e.target.value);
                        }
                      }}
                      onBlur={handleBlur}
                      placeholder={t("b2c.availableSeatsPlaceholder")}
                      className="w-full bg-transparent outline-none font-somar text-sm sm:text-base text-textDark placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Discounts Section with Toggle */}
            <div className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2 text-start">
                  <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
                    <LocalOfferOutlinedIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-somar font-bold text-base text-titleColor">
                    {t("b2c.discountsTitle")}
                  </h3>
                </div>

                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <span className="font-somar text-xs sm:text-sm font-medium text-textDark">
                    {t("b2c.enableDiscounts")}
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(values.enableDiscounts)}
                    onChange={(e) =>
                      setFieldValue("enableDiscounts", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mainColor"></div>
                </label>
              </div>

              {values.enableDiscounts && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {/* Discount Type using SelectionGroup */}
                    <div>
                      <SelectionGroup
                        name="discountTypeSelect"
                        value={tempDiscount.type}
                        onChange={(e) =>
                          setTempDiscount((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        label={t("b2c.discountType")}
                        labelClassName={labelCls}
                        placeholder={t("b2c.selectDiscountType")}
                        list={discountTypeList}
                        border="1px solid var(--color-border)"
                      />
                    </div>

                    <div>
                      <label className={labelCls}>
                        {t("b2c.discountValue")}
                      </label>
                      <div className={fieldContainerCls}>
                        <input
                          type="number"
                          min="0"
                          value={tempDiscount.value}
                          onChange={(e) =>
                            setTempDiscount((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          placeholder={t("b2c.discountValuePlaceholder")}
                          className="w-full bg-transparent outline-none font-somar text-sm text-textDark placeholder:text-gray-400"
                        />
                        <span className="ms-1 flex-shrink-0 inline-flex items-center">
                          {tempDiscount.type === "percentage" ? "%" : newSarSmall}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>
                        {t("b2c.discountCode")}
                      </label>
                      <div className={fieldContainerCls}>
                        <input
                          type="text"
                          value={tempDiscount.code}
                          onChange={(e) =>
                            setTempDiscount((prev) => ({
                              ...prev,
                              code: e.target.value.toUpperCase(),
                            }))
                          }
                          placeholder={t("b2c.discountCodePlaceholder")}
                          className="w-full bg-transparent outline-none font-somar text-sm text-textDark uppercase placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!tempDiscount.value) return;
                        const currentList = values.discountsList || [];
                        setFieldValue("discountsList", [
                          ...currentList,
                          { ...tempDiscount, id: Date.now() },
                        ]);
                        setTempDiscount({
                          type: "percentage",
                          value: "",
                          code: "",
                        });
                      }}
                      className="w-full py-3 rounded-xl border border-mainColor text-mainColor font-somar font-bold text-sm sm:text-base hover:bg-mainColor/5 transition-colors cursor-pointer text-center"
                    >
                      {t("b2c.addDiscountBtn")}
                    </button>
                  </div>

                  {Array.isArray(values.discountsList) &&
                    values.discountsList.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {values.discountsList.map((disc, idx) => (
                          <div
                            key={disc.id || idx}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-xl text-xs font-somar text-textDark shadow-xs"
                          >
                            <span className="font-bold text-mainColor">
                              {disc.code || `#${idx + 1}`}:
                            </span>
                            <span className="inline-flex items-center gap-1">
                              {disc.type === "percentage" ? (
                                `${disc.value}%`
                              ) : (
                                formatCurrency(disc.value)
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = values.discountsList.filter(
                                  (_, i) => i !== idx
                                );
                                setFieldValue("discountsList", updated);
                              }}
                              className="text-error hover:bg-error/10 p-0.5 rounded cursor-pointer transition-colors"
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
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
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
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
                                labelClassName="block mb-1 text-xs font-somar font-medium text-gray-500"
                                placeholder={t("b2c.selectCategory")}
                                list={targetAudienceList}
                                border="1px solid var(--color-border)"
                              />
                            </div>

                            {/* Price */}
                            <div>
                              <label className="block mb-1 text-xs font-somar font-medium text-gray-500">
                                {t("b2c.price")}
                              </label>
                              <div className="relative flex items-center bg-gray-50/50 rounded-lg border border-border px-3 py-2.5 focus-within:border-mainColor">
                                <input
                                  type="number"
                                  min="0"
                                  name={`targetAudiences[${index}].price`}
                                  value={item.price ?? ""}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder={t("b2c.pricePlaceholder")}
                                  className="w-full bg-transparent outline-none font-somar text-xs sm:text-sm text-textDark"
                                />
                                <span className="ms-2 flex-shrink-0 inline-flex items-center">
                                  {newSarSmall}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delete Button (Hidden on first row) */}
                          {index > 0 ? (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer self-center"
                              title="Delete"
                            >
                              <DeleteOutlineIcon className="w-5 h-5" />
                            </button>
                          ) : audiencesList.length > 1 ? (
                            <div className="w-9 h-9 flex-shrink-0" aria-hidden="true" />
                          ) : null}
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

            {/* 4. Bulk / Quantity Tier Pricing Section */}
            <div className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4">
              <div className="border-b border-border pb-3 text-start">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
                    <LocalOfferOutlinedIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-somar font-bold text-base text-titleColor">
                      {t("b2c.bulkPricingTitle")}
                    </h3>
                    <p className="font-somar text-xs text-gray-500">
                      {t("b2c.bulkPricingSubtitle")}
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
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block mb-1 text-xs font-somar font-medium text-gray-500">
                                {t("b2c.minCount")}
                              </label>
                              <input
                                type="number"
                                min="1"
                                name={`bulkPricing[${index}].minCount`}
                                value={item.minCount ?? ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder={t("b2c.minCountPlaceholder")}
                                className="w-full bg-gray-50/50 rounded-lg border border-border px-3 py-2 text-xs sm:text-sm font-somar text-textDark outline-none focus:border-mainColor"
                              />
                            </div>

                            <div>
                              <label className="block mb-1 text-xs font-somar font-medium text-gray-500">
                                {t("b2c.perPersonPrice")}
                              </label>
                              <div className="relative flex items-center bg-gray-50/50 rounded-lg border border-border px-3 py-2 focus-within:border-mainColor">
                                <input
                                  type="number"
                                  min="0"
                                  name={`bulkPricing[${index}].price`}
                                  value={item.price ?? ""}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder={t("b2c.perPersonPricePlaceholder")}
                                  className="w-full bg-transparent outline-none font-somar text-xs sm:text-sm text-textDark"
                                />
                                <span className="ms-2 flex-shrink-0 inline-flex items-center">
                                  {newSarSmall}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Delete Button (Hidden on first row) */}
                          {index > 0 ? (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer self-center"
                              title="Delete"
                            >
                              <DeleteOutlineIcon className="w-5 h-5" />
                            </button>
                          ) : bulkList.length > 1 ? (
                            <div className="w-9 h-9 flex-shrink-0" aria-hidden="true" />
                          ) : null}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => push({ minCount: "", price: "" })}
                        className="w-full py-3 rounded-xl border border-mainColor text-mainColor font-somar font-bold text-sm sm:text-base hover:bg-mainColor/5 transition-colors cursor-pointer text-center mt-2"
                      >
                        {t("b2c.addBulkTierBtn")}
                      </button>
                    </div>
                  );
                }}
              </FieldArray>
            </div>

            {/* 5. Weekday & Season Pricing Rules (MATCHING FIGMA & SCREENSHOT 1) */}
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
                        fromDate: bookingStartDate || "10",
                        toDate: bookingEndDate || "60",
                        price: "60",
                      },
                    ]);
                  }}
                  className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer self-start sm:self-auto flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{t("b2c.addRuleBtn")}</span>
                </button>
              </div>

              {/* Condition Builder Row with SelectionGroup */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-somar text-textDark">
                <span className="font-medium text-gray-700 flex-shrink-0">
                  {t("b2c.ifLabel")}
                </span>

                {/* Dropdown 1: الموسم */}
                <div className="w-28 sm:w-32">
                  <SelectionGroup
                    name="conditionRuleType"
                    value={conditionRule.type}
                    onChange={(e) =>
                      setConditionRule((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    placeholder={t("b2c.seasons.season")}
                    list={seasonTypeList}
                    border="1px solid var(--color-border)"
                  />
                </div>

                <span className="font-medium text-gray-700 flex-shrink-0">
                  {t("b2c.thenLabel")}
                </span>

                {/* Dropdown 2: موسم الرياض */}
                <div className="w-36 sm:w-44">
                  <SelectionGroup
                    name="conditionRuleSeason"
                    value={conditionRule.season}
                    onChange={(e) =>
                      setConditionRule((prev) => ({
                        ...prev,
                        season: e.target.value,
                      }))
                    }
                    placeholder={t("b2c.seasons.riyadhSeason")}
                    list={seasonOptionsList}
                    border="1px solid var(--color-border)"
                  />
                </div>

                <span className="font-medium text-gray-700 flex-shrink-0">
                  {t("b2c.priceByLabel")}
                </span>

                {/* Dropdown 3: زيادة */}
                <div className="w-28 sm:w-32">
                  <SelectionGroup
                    name="conditionRuleChangeType"
                    value={conditionRule.changeType}
                    onChange={(e) =>
                      setConditionRule((prev) => ({
                        ...prev,
                        changeType: e.target.value,
                      }))
                    }
                    placeholder={t("b2c.increase")}
                    list={changeTypeList}
                    border="1px solid var(--color-border)"
                  />
                </div>

                {/* Input: %15 */}
                <div className="relative flex items-center bg-white rounded-xl border border-gray-200 px-3 py-2 w-24 sm:w-28 focus-within:border-mainColor shadow-2xs">
                  <input
                    type="number"
                    min="1"
                    value={conditionRule.value}
                    onChange={(e) =>
                      setConditionRule((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="15"
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-center"
                  />
                  <span className="text-gray-400 ms-1">%</span>
                </div>
              </div>

              {/* Date Range Rows Matching Screenshot 1 */}
              <div className="space-y-4 pt-2">
                {datePricingRows.map((row, index) => (
                  <div
                    key={row.id || index}
                    className="flex items-end gap-3 sm:gap-4 transition-all"
                  >
                    <div className="flex-1">
                      <label className="block mb-1.5 text-xs sm:text-sm font-somar font-medium text-gray-700 text-start">
                        {t("b2c.fromDateReadOnly")}
                      </label>
                      <div className="relative flex items-center bg-white rounded-xl border border-gray-200 px-3.5 py-2.5 shadow-2xs">
                        <CalendarMonthOutlinedIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 me-2" />
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={bookingStartDate || row.fromDate}
                          className="w-full bg-transparent outline-none font-somar text-sm text-textDark cursor-default text-end"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block mb-1.5 text-xs sm:text-sm font-somar font-medium text-gray-700 text-start">
                        {t("b2c.toDateReadOnly")}
                      </label>
                      <div className="relative flex items-center bg-white rounded-xl border border-gray-200 px-3.5 py-2.5 shadow-2xs">
                        <CalendarMonthOutlinedIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 me-2" />
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={bookingEndDate || row.toDate}
                          className="w-full bg-transparent outline-none font-somar text-sm text-textDark cursor-default text-end"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <label className="block mb-1.5 text-xs sm:text-sm font-somar font-medium text-gray-700 text-start">
                        {t("b2c.priceInSar")}
                      </label>
                      <div className="relative flex items-center bg-white rounded-xl border border-gray-200 hover:border-mainColor focus-within:border-mainColor px-3.5 py-2.5 transition-all shadow-2xs">
                        <input
                          type="number"
                          min="0"
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
                          className="w-full bg-transparent outline-none font-somar text-sm text-textDark text-end"
                        />
                        <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                          {newSarSmall}
                        </span>
                      </div>
                    </div>

                    {/* Delete Button (Hidden on first row) */}
                    {index > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDatePricingRows((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                        className="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer flex-shrink-0 mb-0.5"
                        title="حذف"
                      >
                        <DeleteOutlineIcon className="w-5 h-5" />
                      </button>
                    ) : datePricingRows.length > 1 ? (
                      <div className="w-10 h-10 flex-shrink-0 mb-0.5" aria-hidden="true" />
                    ) : null}
                  </div>
                ))}
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

            {/* 2-column Base Price Fields: تكلفة المنتج الأساسي (Right) & سعر السوق (Left) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Product Cost (تكلفة المنتج الأساسي - Right Column in RTL) */}
              <div>
                <label htmlFor="productCost" className={labelCls}>
                  {t("b2b.productCost")}
                </label>
                <div
                  className={cn(
                    fieldContainerCls,
                    hasProductCostErr
                      ? "border-error focus-within:border-error"
                      : "hover:border-mainColor/60"
                  )}
                >
                  <input
                    id="productCost"
                    type="number"
                    min="0"
                    name="productCost"
                    value={values.productCost ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("b2b.productCostPlaceholder")}
                    className="w-full bg-transparent outline-none font-somar text-sm sm:text-base text-textDark placeholder:text-gray-400"
                  />
                  <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                    {newSarSmall}
                  </span>
                </div>
                {hasProductCostErr && (
                  <p className="mt-1 font-somar text-xs text-error">
                    {productCostErr}
                  </p>
                )}
              </div>

              {/* Market Price (سعر السوق - Left Column in RTL) */}
              <div>
                <label htmlFor="b2bPrice" className={labelCls}>
                  {t("b2b.marketPrice")}
                </label>
                <div className={fieldContainerCls}>
                  <input
                    id="b2bPrice"
                    type="number"
                    min="0"
                    name="b2bPrice"
                    value={values.b2bPricing?.schoolsPrice ?? values.price ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFieldValue("b2bPricing.schoolsPrice", val);
                      if (!values.price) {
                        setFieldValue("price", val);
                      }
                    }}
                    onBlur={handleBlur}
                    placeholder={t("b2b.marketPricePlaceholder")}
                    className="w-full bg-transparent outline-none font-somar text-sm sm:text-base text-textDark placeholder:text-gray-400"
                  />
                  <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                    {newSarSmall}
                  </span>
                </div>
              </div>
            </div>

            {/* Inner Card 1: الخصومات */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-none">
              <div className="flex items-center justify-between">
                <div className="text-start">
                  <h4 className="font-somar font-bold text-base sm:text-lg text-titleColor">
                    {t("b2b.discountsTitle")}
                  </h4>
                  <p className="font-somar text-xs sm:text-sm text-gray-500 mt-0.5">
                    {t("b2b.discountsSubtitle")}
                  </p>
                </div>

                {/* Toggle Switch in Teal */}
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(values.b2bEnableDiscounts)}
                    onChange={(e) =>
                      setFieldValue("b2bEnableDiscounts", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mainColor"></div>
                </label>
              </div>

              {values.b2bEnableDiscounts && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* نوع الخصم -> SelectionGroup */}
                    <div>
                      <SelectionGroup
                        name="b2bDiscountStage"
                        value={values.b2bPricing?.selectedStage || ""}
                        onChange={(e) =>
                          setFieldValue("b2bPricing.selectedStage", e.target.value)
                        }
                        label={t("b2b.discountType")}
                        labelClassName={labelCls}
                        placeholder={t("b2b.selectAcademicStage")}
                        list={academicStageList}
                        border="1px solid var(--color-border)"
                      />
                    </div>

                    {/* قيمة الخصم */}
                    <div>
                      <label className={labelCls}>
                        {t("b2b.discountValue")}
                      </label>
                      <div className={fieldContainerCls}>
                        <input
                          type="number"
                          min="0"
                          value={values.b2bPricing?.discountValue ?? ""}
                          onChange={(e) =>
                            setFieldValue("b2bPricing.discountValue", e.target.value)
                          }
                          placeholder={t("b2b.discountValuePlaceholder")}
                          className="w-full bg-transparent outline-none font-somar text-sm sm:text-base text-textDark placeholder:text-gray-400"
                        />
                        <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                          {newSarSmall}
                        </span>
                      </div>
                    </div>

                    {/* البرومو كود */}
                    <div>
                      <label className={labelCls}>
                        {t("b2b.promoCode")}
                      </label>
                      <div className={fieldContainerCls}>
                        <input
                          type="text"
                          value={values.b2bPricing?.promoCode ?? ""}
                          onChange={(e) =>
                            setFieldValue(
                              "b2bPricing.promoCode",
                              e.target.value.toUpperCase()
                            )
                          }
                          placeholder={t("b2b.promoCodePlaceholder")}
                          className="w-full bg-transparent outline-none font-somar text-sm sm:text-base text-textDark uppercase placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* اضف الخصومات Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (values.b2bPricing?.discountValue) {
                        const currentList = values.b2bDiscountsList || [];
                        setFieldValue("b2bDiscountsList", [
                          ...currentList,
                          {
                            stage: values.b2bPricing?.selectedStage,
                            value: values.b2bPricing?.discountValue,
                            code: values.b2bPricing?.promoCode,
                            id: Date.now(),
                          },
                        ]);
                      }
                    }}
                    className="w-full py-3 rounded-xl border border-mainColor text-mainColor font-somar font-bold text-sm sm:text-base hover:bg-mainColor/5 transition-colors cursor-pointer text-center"
                  >
                    {t("b2b.addDiscountsBtn")}
                  </button>

                  {/* Added B2B discounts badges */}
                  {Array.isArray(values.b2bDiscountsList) &&
                    values.b2bDiscountsList.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {values.b2bDiscountsList.map((disc, idx) => (
                          <div
                            key={disc.id || idx}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-xl text-xs font-somar text-textDark shadow-xs"
                          >
                            <span className="font-bold text-mainColor">
                              {disc.code || `#${idx + 1}`}:
                            </span>
                            <span className="inline-flex items-center gap-1">
                              {formatCurrency(disc.value)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = values.b2bDiscountsList.filter(
                                  (_, i) => i !== idx
                                );
                                setFieldValue("b2bDiscountsList", updated);
                              }}
                              className="text-error hover:bg-error/10 p-0.5 rounded cursor-pointer transition-colors"
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Inner Card 2: المشرف / المعلم مجاناً */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-border space-y-4 shadow-none">
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(values.b2bPricing?.freeSupervisor)}
                  onChange={(e) =>
                    setFieldValue(
                      "b2bPricing.freeSupervisor",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded border border-gray-300 peer-checked:border-mainColor peer-checked:bg-mainColor flex items-center justify-center transition-colors">
                  <svg
                    className={cn(
                      "w-3.5 h-3.5 text-white stroke-current stroke-2 fill-none transition-opacity",
                      values.b2bPricing?.freeSupervisor ? "opacity-100" : "opacity-0"
                    )}
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-somar font-bold text-base text-titleColor">
                  {t("b2b.freeSupervisorTitle")}
                </span>
              </label>

              {values.b2bPricing?.freeSupervisor && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className={labelCls}>
                      {t("b2b.freeSupervisorLabel")}
                    </label>
                    <div className={fieldContainerCls}>
                      <input
                        type="number"
                        min="1"
                        value={values.b2bPricing?.supervisorRatio ?? "10"}
                        onChange={(e) =>
                          setFieldValue(
                            "b2bPricing.supervisorRatio",
                            e.target.value
                          )
                        }
                        placeholder={t("b2b.studentsCountPlaceholder")}
                        className="w-full bg-transparent outline-none font-somar text-sm sm:text-base text-textDark placeholder:text-gray-400"
                      />
                      <span className="ms-2 text-xs font-somar text-gray-500 flex-shrink-0">
                        {t("b2b.students")}
                      </span>
                    </div>
                  </div>

                  {/* Helper calculation: لكل 20 طالب ← 2 مشرف مجاني */}
                  <p className="font-somar font-medium text-sm text-mainColor flex items-center gap-1">
                    {t("b2b.supervisorRatioCalculation", {
                      students:
                        (Number(values.b2bPricing?.supervisorRatio) || 10) * 2,
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
                          <label className={labelCls}>
                            {t("b2c.marketPrice")}
                          </label>
                          <div className={fieldContainerCls}>
                            <input
                              type="number"
                              min="0"
                              value={branchData.price ?? ""}
                              onChange={(e) =>
                                setFieldValue(
                                  `branchPricing.${branch.id}.price`,
                                  e.target.value
                                )
                              }
                              placeholder={t("b2c.marketPricePlaceholder")}
                              className="w-full bg-transparent outline-none font-somar text-sm text-textDark"
                            />
                            <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                              {newSarSmall}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>
                            {t("b2c.discountedPrice")}
                          </label>
                          <div className={fieldContainerCls}>
                            <input
                              type="number"
                              min="0"
                              value={branchData.discountedPrice ?? ""}
                              onChange={(e) =>
                                setFieldValue(
                                  `branchPricing.${branch.id}.discountedPrice`,
                                  e.target.value
                                )
                              }
                              placeholder={t("b2c.discountedPricePlaceholder")}
                              className="w-full bg-transparent outline-none font-somar text-sm text-textDark"
                            />
                            <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                              {newSarSmall}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>
                            {t("b2b.productCost")}
                          </label>
                          <div className={fieldContainerCls}>
                            <input
                              type="number"
                              min="0"
                              value={branchData.productCost ?? ""}
                              onChange={(e) =>
                                setFieldValue(
                                  `branchPricing.${branch.id}.productCost`,
                                  e.target.value
                                )
                              }
                              placeholder={t("b2b.productCostPlaceholder")}
                              className="w-full bg-transparent outline-none font-somar text-sm text-textDark"
                            />
                            <span className="ms-2 flex-shrink-0 inline-flex items-center justify-center">
                              {newSarSmall}
                            </span>
                          </div>
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
        title={t("sidebarTitle")}
        subtitle={t("sidebarSubtitle")}
        saveBtnText={t("saveBtn")}
      />
    </div>
  );
};

export default memo(Step8Pricing);
