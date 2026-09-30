/**
 * Transforms the API product details response into Formik initial values
 * compatible with the add/edit product form structure.
 */
import { initialAddProductValues } from "@components/forms/addProductForm";
import { formatTimeForInput } from "@utils/formatters/formatTimeForInput";

const formatDatePricingList = (list, defaultKey = "INCREASE") => {
  if (!Array.isArray(list) || list.length === 0) return [];
  return list.map((dp) => {
    const fromVal = dp.fromDate
      ? String(dp.fromDate).split("T")[0]
      : dp.fromDay
      ? String(dp.fromDay).split("T")[0]
      : dp.date
      ? String(dp.date).split("T")[0]
      : "";
    const toVal = dp.toDate
      ? String(dp.toDate).split("T")[0]
      : dp.toDay
      ? String(dp.toDay).split("T")[0]
      : fromVal;
    return {
      date: fromVal,
      fromDate: fromVal,
      toDate: toVal,
      fromDay: fromVal,
      toDay: toVal,
      price: dp.price ?? "",
      percentage: dp.percentage ?? "",
      key: dp.key || defaultKey,
      title: {
        en: dp.title?.en || "",
        ar: dp.title?.ar || "",
      },
    };
  });
};

const transformProductToFormValues = (product, fixedSelectionLocation) => {
  if (!product) return null;

  const actualProduct = product.trip || product.product || product;
  const b2b = actualProduct.b2bTrip || {};
  const b2c = actualProduct.b2cTrip || {};

  // ─── 1. Determine System Types ─────────────────────────────────
  let systemTypes = [];
  if (Array.isArray(actualProduct.systemTypes) && actualProduct.systemTypes.length > 0) {
    systemTypes = actualProduct.systemTypes.map((t) =>
      typeof t === "string" ? t.trim().toUpperCase() : t
    );
  } else {
    if (actualProduct.b2bTrip || actualProduct.b2bPrice || actualProduct.productCost) systemTypes.push("B2B");
    if (actualProduct.b2cTrip || actualProduct.b2cPrice || actualProduct.price) systemTypes.push("B2C");
    if (systemTypes.length === 0) systemTypes.push("B2C");
  }

  // ─── 2. Branches Extraction ────────────────────────────────────
  const branchIdSet = new Set();
  const rawBranches =
    actualProduct.providerBranchs ||
    actualProduct.providerBranches ||
    actualProduct.branches ||
    [];

  if (Array.isArray(rawBranches)) {
    rawBranches.forEach((item) => {
      if (!item) return;
      if (typeof item === "string" && item.trim()) {
        branchIdSet.add(item.trim());
      } else if (Array.isArray(item.branches)) {
        item.branches.forEach((b) => {
          const bId = typeof b === "object" ? b?._id || b?.id : b;
          if (bId && typeof bId === "string" && bId.trim()) {
            branchIdSet.add(bId.trim());
          }
        });
      } else {
        const bId = item._id || item.id;
        if (bId && typeof bId === "string" && bId.trim()) {
          branchIdSet.add(bId.trim());
        }
      }
    });
  }

  const allBranchTripsRaw = [
    ...(Array.isArray(actualProduct.branchTrips) ? actualProduct.branchTrips : []),
    ...(Array.isArray(actualProduct.branch_trips) ? actualProduct.branch_trips : []),
    ...(Array.isArray(actualProduct.branchesTrips) ? actualProduct.branchesTrips : []),
    ...(Array.isArray(b2b.branchTrips) ? b2b.branchTrips : []),
    ...(Array.isArray(b2b.branch_trips) ? b2b.branch_trips : []),
    ...(Array.isArray(b2c.branchTrips) ? b2c.branchTrips : []),
    ...(Array.isArray(b2c.branch_trips) ? b2c.branch_trips : []),
  ];

  // Merge any branch customization from providerBranchs / branches if they contain branchTrips-like properties
  if (Array.isArray(rawBranches)) {
    rawBranches.forEach((item) => {
      if (!item || typeof item !== "object") return;
      if (
        item.b2cPrice ||
        item.b2bPrice ||
        item.price != null ||
        item.availableSeats ||
        item.services ||
        item.fromDay ||
        item.availableTimes
      ) {
        allBranchTripsRaw.push({
          ...item,
          branch: item,
        });
      }
    });
  }

  // Deduplicate and merge by clean branch ID
  const branchTripMap = new Map();
  allBranchTripsRaw.forEach((bt) => {
    if (!bt) return;
    const rawBranch = bt?.branch || bt?.providerBranch || bt?.branchId || bt?._id;
    const bId =
      typeof rawBranch === "object" && rawBranch !== null
        ? String(rawBranch._id || rawBranch.id || "")
        : String(rawBranch || "");
    const cleanBranchId = bId.trim();
    if (!cleanBranchId) return;

    branchIdSet.add(cleanBranchId);

    if (!branchTripMap.has(cleanBranchId)) {
      branchTripMap.set(cleanBranchId, { ...bt });
    } else {
      const existing = branchTripMap.get(cleanBranchId);
      branchTripMap.set(cleanBranchId, {
        ...existing,
        ...bt,
        branch: bt.branch || existing.branch,
        b2cPrice: bt.b2cPrice || existing.b2cPrice,
        b2bPrice: bt.b2bPrice || existing.b2bPrice,
        services:
          Array.isArray(bt.services) && bt.services.length > 0
            ? bt.services
            : existing.services,
        availableTimes:
          Array.isArray(bt.availableTimes) && bt.availableTimes.length > 0
            ? bt.availableTimes
            : existing.availableTimes,
      });
    }
  });

  const allBranchTrips = Array.from(branchTripMap.values());
  const providerBranchs = Array.from(branchIdSet);

  // ─── 3. Target Audiences Extraction ────────────────────────────
  const rawTargetAudiences =
    Array.isArray(actualProduct.targetAudiences) && actualProduct.targetAudiences.length > 0
      ? actualProduct.targetAudiences
      : Array.isArray(b2c.targetAudiences) && b2c.targetAudiences.length > 0
      ? b2c.targetAudiences
      : Array.isArray(actualProduct.b2cTargetAudiences) && actualProduct.b2cTargetAudiences.length > 0
      ? actualProduct.b2cTargetAudiences
      : Array.isArray(b2c.b2cTargetAudiences) && b2c.b2cTargetAudiences.length > 0
      ? b2c.b2cTargetAudiences
      : [];

  const b2cTargetAudiences = [];
  const targetAudiences = [];

  rawTargetAudiences.forEach((ta) => {
    if (!ta) return;
    let audId = "";
    let price = "";

    if (typeof ta === "string") {
      audId = ta.trim();
    } else if (typeof ta === "object") {
      if (ta.targetAudience) {
        audId =
          typeof ta.targetAudience === "object"
            ? ta.targetAudience?._id || ta.targetAudience?.id || ""
            : ta.targetAudience || "";
      } else {
        audId = ta._id || ta.id || "";
      }
      price = ta.price ?? "";
    }

    if (audId) {
      if (!b2cTargetAudiences.includes(audId)) {
        b2cTargetAudiences.push(audId);
      }
      targetAudiences.push({
        targetAudience: audId,
        price: price,
      });
    }
  });

  const finalTargetAudiences =
    targetAudiences.length > 0
      ? targetAudiences
      : [{ targetAudience: "", price: "" }];

  // ─── 4. Academic Stages Extraction (B2B) ───────────────────────
  const rawAcademicStages =
    Array.isArray(actualProduct.academicStages) && actualProduct.academicStages.length > 0
      ? actualProduct.academicStages
      : Array.isArray(b2b.academicStages) && b2b.academicStages.length > 0
      ? b2b.academicStages
      : [];

  const academicStages = rawAcademicStages
    .map((s) => (typeof s === "object" ? s?._id || s?.id || "" : s))
    .filter(Boolean);

  // ─── 5. Services Extraction ────────────────────────────────────
  const rawServices = actualProduct.services || [];
  const services =
    Array.isArray(rawServices) && rawServices.length > 0
      ? rawServices.map((s) => ({
          service:
            typeof s.service === "object"
              ? s.service?._id || s.service?.id || ""
              : s.service || s._id || s.id || "",
          serviceType: s.servicesType || s.serviceType || "",
          price: s.price ?? "",
          note: {
            en: s.note?.en || "",
            ar: s.note?.ar || "",
          },
        }))
      : [{ service: "", price: "", note: { en: "", ar: "" } }];

  // ─── 6. Branch Customizations (branchTrips) ───────────────────
  const branchCapacities = {};
  const branchDates = {};
  const customizedBranchDateIds = [];
  const branchServices = {};
  const customizedBranchIds = [];
  const branchPricing = {};
  const customizedPricingBranches = [];

  allBranchTrips.forEach((bt) => {
    if (!bt) return;
    const rawBranch = bt.branch || bt.providerBranch || bt.branchId || bt._id;
    const bId =
      typeof rawBranch === "object" && rawBranch !== null
        ? String(rawBranch._id || rawBranch.id || "")
        : String(rawBranch || "");
    const cleanBranchId = bId.trim();
    if (!cleanBranchId) return;

    // Capacity (Step 2)
    const capSource = bt.availableSeats || bt.guestRange;
    if (capSource && typeof capSource === "object") {
      if (capSource.min != null || capSource.max != null) {
        branchCapacities[cleanBranchId] = {
          min: capSource.min ?? "",
          max: capSource.max ?? "",
        };
      }
    } else if (typeof bt.availableSeats === "number") {
      branchCapacities[cleanBranchId] = {
        min: 1,
        max: bt.availableSeats,
      };
    }

    // Dates (Step 4)
    if (
      bt.fromDay ||
      bt.toDay ||
      (Array.isArray(bt.availableTimes) && bt.availableTimes.length > 0) ||
      bt.recurrencePattern ||
      (Array.isArray(bt.selectedDays) && bt.selectedDays.length > 0) ||
      (Array.isArray(bt.monthDay) && bt.monthDay.length > 0) ||
      bt.fromHour ||
      bt.toHour ||
      bt.bookingBefore != null
    ) {
      branchDates[cleanBranchId] = {
        recurrencePattern: bt.recurrencePattern || "WEEKLY",
        monthDay: Array.isArray(bt.monthDay) ? bt.monthDay : [],
        selectedDays: Array.isArray(bt.selectedDays) ? bt.selectedDays : [],
        fromDay: bt.fromDay ? String(bt.fromDay).split("T")[0] : "",
        toDay: bt.toDay ? String(bt.toDay).split("T")[0] : "",
        fromHour: formatTimeForInput(bt.fromHour) || "",
        toHour: formatTimeForInput(bt.toHour) || "",
        availableTimes:
          Array.isArray(bt.availableTimes) && bt.availableTimes.length > 0
            ? bt.availableTimes.map((slot) => ({
                from: formatTimeForInput(slot.from) || "",
                to: formatTimeForInput(slot.to) || "",
              }))
            : [{ from: "", to: "" }],
        bookingBefore: bt.bookingBefore ?? "",
      };
      if (!customizedBranchDateIds.includes(cleanBranchId)) {
        customizedBranchDateIds.push(cleanBranchId);
      }
    }

    // Services (Step 5)
    if (Array.isArray(bt.services) && bt.services.length > 0) {
      branchServices[cleanBranchId] = bt.services.map((s) => ({
        service:
          typeof s.service === "object"
            ? s.service?._id || s.service?.id || ""
            : s.service || s._id || s.id || "",
        serviceType: s.servicesType || s.serviceType || "",
        price: s.price ?? "",
        note: {
          en: s.note?.en || "",
          ar: s.note?.ar || "",
        },
      }));
      if (!customizedBranchIds.includes(cleanBranchId)) {
        customizedBranchIds.push(cleanBranchId);
      }
    }

    // Pricing (Step 8)
    const btB2c = bt.b2cPrice || bt.b2cTrip || bt.b2c || {};
    const btB2b = bt.b2bPrice || bt.b2bTrip || bt.b2b || {};
    const hasBranchPricing =
      btB2c.price != null ||
      btB2c.discountedPrice != null ||
      btB2b.price != null ||
      btB2b.productCost != null ||
      btB2b.discountedPrice != null ||
      bt.price != null ||
      bt.discountedPrice != null ||
      bt.productCost != null ||
      bt.schoolsPrice != null ||
      (Array.isArray(btB2c.targetAudiences) && btB2c.targetAudiences.length > 0) ||
      (Array.isArray(bt.targetAudiences) && bt.targetAudiences.length > 0) ||
      (Array.isArray(btB2c.weekdayPricing) && btB2c.weekdayPricing.length > 0) ||
      (Array.isArray(btB2b.weekdayPricing) && btB2b.weekdayPricing.length > 0) ||
      (Array.isArray(bt.weekdayPricing) && bt.weekdayPricing.length > 0) ||
      (Array.isArray(btB2c.datePricing) && btB2c.datePricing.length > 0) ||
      (Array.isArray(btB2b.datePricing) && btB2b.datePricing.length > 0) ||
      (Array.isArray(bt.datePricing) && bt.datePricing.length > 0) ||
      (Array.isArray(btB2b.quantityDiscountTiers) && btB2b.quantityDiscountTiers.length > 0);

    if (hasBranchPricing) {
      // 1. Target audiences for branch
      const rawBtAudiences =
        Array.isArray(btB2c.targetAudiences) && btB2c.targetAudiences.length > 0
          ? btB2c.targetAudiences
          : Array.isArray(bt.targetAudiences) && bt.targetAudiences.length > 0
          ? bt.targetAudiences
          : [];
      const btTargetAudiences = rawBtAudiences.map((ta) => ({
        targetAudience:
          typeof ta.targetAudience === "object"
            ? ta.targetAudience?._id || ta.targetAudience?.id || ""
            : ta.targetAudience || ta._id || ta.id || "",
        price: ta.price ?? "",
      }));

      // 2. Weekday pricing for branch
      const b2cWeekday = Array.isArray(btB2c.weekdayPricing)
        ? btB2c.weekdayPricing.map((w) => ({ day: w.day, price: w.price ?? "" }))
        : Array.isArray(bt.weekdayPricing)
        ? bt.weekdayPricing.map((w) => ({ day: w.day, price: w.price ?? "" }))
        : [];
      const b2bWeekday = Array.isArray(btB2b.weekdayPricing)
        ? btB2b.weekdayPricing.map((w) => ({ day: w.day, price: w.price ?? "" }))
        : [];

      // 3. Date pricing (B2C) for branch
      const rawB2cDatePricing =
        Array.isArray(btB2c.datePricing) && btB2c.datePricing.length > 0
          ? btB2c.datePricing
          : Array.isArray(bt.datePricing) && bt.datePricing.length > 0
          ? bt.datePricing
          : [];
      const b2cDatePricingMapped = formatDatePricingList(
        rawB2cDatePricing,
        btB2c.key || "INCREASE"
      );

      // 4. Date pricing (B2B) for branch
      const rawB2bDatePricing = Array.isArray(btB2b.datePricing)
        ? btB2b.datePricing
        : [];
      const b2bDatePricingMapped = formatDatePricingList(
        rawB2bDatePricing,
        btB2b.key || "DECREASE"
      );

      // 5. Quantity discount tiers (B2B) for branch
      const rawB2bTiers =
        Array.isArray(btB2b.quantityDiscountTiers) && btB2b.quantityDiscountTiers.length > 0
          ? btB2b.quantityDiscountTiers
          : Array.isArray(bt.quantityDiscountTiers) && bt.quantityDiscountTiers.length > 0
          ? bt.quantityDiscountTiers
          : [];
      const b2bQuantityDiscountTiers = rawB2bTiers.map((t) => ({
        minQuantity: t.minQuantity ?? "",
        discountType: t.discountType || "PERCENTAGE",
        discountValue: t.discountValue ?? "",
      }));

      branchPricing[cleanBranchId] = {
        price: btB2c.price ?? bt.price ?? "",
        discountedPrice: btB2c.discountedPrice ?? bt.discountedPrice ?? "",
        schoolsPrice: btB2b.price ?? btB2b.schoolsPrice ?? bt.schoolsPrice ?? btB2b.productCost ?? "",
        b2bDiscountedPrice: btB2b.discountedPrice ?? bt.b2bDiscountedPrice ?? "",
        productCost: btB2b.productCost ?? bt.productCost ?? "",
        studentsPerSupervisor: String(btB2b.studentsPerSupervisor ?? bt.studentsPerSupervisor ?? "10"),
        conditionRuleValue: btB2c.conditionRuleValue ?? btB2c.percentage ?? "15",
        b2bConditionRuleValue: btB2b.conditionRuleValue ?? btB2b.percentage ?? "10",
        key: btB2c.key || "INCREASE",
        b2bKey: btB2b.key || "DECREASE",
        targetAudiences: btTargetAudiences.length > 0 ? btTargetAudiences : [{ targetAudience: "", price: "" }],
        weekdayPricing: b2cWeekday,
        b2bWeekdayPricing: b2bWeekday,
        datePricing: b2cDatePricingMapped.length > 0 ? b2cDatePricingMapped : [{ date: "", fromDate: "", toDate: "", price: "", key: "INCREASE", percentage: 15 }],
        b2bDatePricing: b2bDatePricingMapped.length > 0 ? b2bDatePricingMapped : [{ date: "", fromDate: "", toDate: "", price: "", key: "DECREASE", percentage: 10 }],
        b2bQuantityDiscountTiers,
      };

      if (!customizedPricingBranches.includes(cleanBranchId)) {
        customizedPricingBranches.push(cleanBranchId);
      }
    }
  });

  // ─── 7. Available Times, Dates & Recurrence ────────────────────
  const rawTimes =
    Array.isArray(actualProduct.availableTimes) && actualProduct.availableTimes.length > 0
      ? actualProduct.availableTimes
      : Array.isArray(b2c.availableTimes) && b2c.availableTimes.length > 0
      ? b2c.availableTimes
      : Array.isArray(b2b.availableTimes) && b2b.availableTimes.length > 0
      ? b2b.availableTimes
      : [];

  const availableTimes =
    rawTimes.length > 0
      ? rawTimes.map((slot) => ({
          from: formatTimeForInput(slot.from) || "",
          to: formatTimeForInput(slot.to) || "",
        }))
      : [{ from: "", to: "" }];

  const rawFromDay = actualProduct.fromDay || b2c.fromDay || b2b.fromDay || "";
  const rawToDay = actualProduct.toDay || b2c.toDay || b2b.toDay || "";
  const fromDay = rawFromDay ? String(rawFromDay).split("T")[0] : "";
  const toDay = rawToDay ? String(rawToDay).split("T")[0] : "";

  const fromHour =
    formatTimeForInput(actualProduct.fromHour || b2c.fromHour || b2b.fromHour || availableTimes[0]?.from) || "";
  const toHour =
    formatTimeForInput(actualProduct.toHour || b2c.toHour || b2b.toHour || availableTimes[0]?.to) || "";

  const recurrencePattern =
    actualProduct.recurrencePattern || b2c.recurrencePattern || b2b.recurrencePattern || "WEEKLY";

  const selectedDays =
    Array.isArray(actualProduct.selectedDays) && actualProduct.selectedDays.length > 0
      ? actualProduct.selectedDays
      : Array.isArray(b2c.selectedDays) && b2c.selectedDays.length > 0
      ? b2c.selectedDays
      : Array.isArray(b2b.selectedDays) && b2b.selectedDays.length > 0
      ? b2b.selectedDays
      : [];

  const monthDay =
    Array.isArray(actualProduct.monthDay) && actualProduct.monthDay.length > 0
      ? actualProduct.monthDay
      : Array.isArray(b2c.monthDay) && b2c.monthDay.length > 0
      ? b2c.monthDay
      : Array.isArray(b2b.monthDay) && b2b.monthDay.length > 0
      ? b2b.monthDay
      : [];

  const bookingBefore =
    actualProduct.bookingBefore ?? b2c.bookingBefore ?? b2b.bookingBefore ?? "";

  const duration =
    actualProduct.duration ?? b2c.duration ?? b2b.duration ?? 1;

  // ─── 8. Available Seats & Guests ──────────────────────────────
  const minSeats =
    actualProduct.availableSeats?.min ??
    b2b.availableSeats?.min ??
    (typeof b2c.availableSeats === "object" ? b2c.availableSeats?.min : "") ??
    (typeof actualProduct.availableSeats === "number" ? 1 : "");

  const maxSeats =
    actualProduct.availableSeats?.max ??
    b2b.availableSeats?.max ??
    (typeof b2c.availableSeats === "number"
      ? b2c.availableSeats
      : typeof b2c.availableSeats === "object"
      ? b2c.availableSeats?.max
      : typeof actualProduct.availableSeats === "number"
      ? actualProduct.availableSeats
      : "");

  // ─── 9. Gallery & Thumbnail ────────────────────────────────────
  const gallary = Array.isArray(actualProduct.gallary)
    ? actualProduct.gallary.map((g) => (typeof g === "object" ? g.url : g)).filter(Boolean)
    : Array.isArray(actualProduct.gallery)
    ? actualProduct.gallery.map((g) => (typeof g === "object" ? g.url : g)).filter(Boolean)
    : [];

  const thumbnail =
    actualProduct.thumbnail?.web ||
    actualProduct.thumbnail?.app ||
    (typeof actualProduct.thumbnail === "string" ? actualProduct.thumbnail : null);

  // ─── 10. Pricing & Discounts ───────────────────────────────────
  const b2cWeekdayPricing = Array.isArray(b2c.weekdayPricing)
    ? b2c.weekdayPricing.map((wp) => ({ day: wp.day, price: wp.price ?? "" }))
    : Array.isArray(actualProduct.weekdayPricing)
    ? actualProduct.weekdayPricing.map((wp) => ({ day: wp.day, price: wp.price ?? "" }))
    : [];

  const b2bWeekdayPricing = Array.isArray(b2b.weekdayPricing)
    ? b2b.weekdayPricing.map((wp) => ({ day: wp.day, price: wp.price ?? "" }))
    : [];

  const weekdayPricing =
    b2cWeekdayPricing.length > 0
      ? b2cWeekdayPricing
      : b2bWeekdayPricing.length > 0
      ? b2bWeekdayPricing
      : [];

  const rawTiers =
    Array.isArray(b2b.quantityDiscountTiers) && b2b.quantityDiscountTiers.length > 0
      ? b2b.quantityDiscountTiers
      : Array.isArray(actualProduct.quantityDiscountTiers) && actualProduct.quantityDiscountTiers.length > 0
      ? actualProduct.quantityDiscountTiers
      : [];

  const quantityDiscountTiers =
    rawTiers.length > 0
      ? rawTiers.map((t) => ({
          minQuantity: t.minQuantity ?? "",
          discountType: t.discountType || "PERCENTAGE",
          discountValue: t.discountValue ?? "",
        }))
      : [{ minQuantity: "", discountType: "PERCENTAGE", discountValue: "" }];

  const rawB2cDatePricing =
    Array.isArray(b2c.datePricing) && b2c.datePricing.length > 0
      ? b2c.datePricing
      : Array.isArray(actualProduct.datePricing) && actualProduct.datePricing.length > 0
      ? actualProduct.datePricing
      : [];

  const b2cDatePricing = formatDatePricingList(rawB2cDatePricing, "INCREASE");
  const b2bDatePricing = formatDatePricingList(
    Array.isArray(b2b.datePricing) ? b2b.datePricing : [],
    "DECREASE"
  );

  // ─── 11. Locations ─────────────────────────────────────────────
  const locSource = actualProduct.location || b2c.location || b2b.location;
  const location =
    locSource && locSource.lat != null && locSource.lng != null
      ? {
          lat: Number(locSource.lat),
          lng: Number(locSource.lng),
          address: locSource.address || "",
        }
      : fixedSelectionLocation
      ? {
          lat: Number(fixedSelectionLocation.lat),
          lng: Number(fixedSelectionLocation.lng),
          address: fixedSelectionLocation.address || "",
        }
      : { lat: 24.7136, lng: 46.6753, address: "" };

  const gLocSource = actualProduct.gatheringLocation || locSource;
  const gatheringLocation =
    gLocSource && gLocSource.lat != null && gLocSource.lng != null
      ? {
          lat: Number(gLocSource.lat),
          lng: Number(gLocSource.lng),
          address: gLocSource.address || "",
        }
      : location;

  // ─── 12. Text Lists (Items, Exemptions, Benefits) ──────────────
  const mustHaveItems = {
    en:
      Array.isArray(actualProduct.mustHaveItems?.en) && actualProduct.mustHaveItems.en.length > 0
        ? actualProduct.mustHaveItems.en
        : [""],
    ar:
      Array.isArray(actualProduct.mustHaveItems?.ar) && actualProduct.mustHaveItems.ar.length > 0
        ? actualProduct.mustHaveItems.ar
        : [""],
  };

  const exemptedFromTrip = {
    en:
      Array.isArray(actualProduct.exemptedFromTrip?.en) && actualProduct.exemptedFromTrip.en.length > 0
        ? actualProduct.exemptedFromTrip.en
        : [""],
    ar:
      Array.isArray(actualProduct.exemptedFromTrip?.ar) && actualProduct.exemptedFromTrip.ar.length > 0
        ? actualProduct.exemptedFromTrip.ar
        : [""],
  };

  const benefits = {
    en:
      Array.isArray(actualProduct.benefits?.en) && actualProduct.benefits.en.length > 0
        ? actualProduct.benefits.en
        : [""],
    ar:
      Array.isArray(actualProduct.benefits?.ar) && actualProduct.benefits.ar.length > 0
        ? actualProduct.benefits.ar
        : [""],
  };

  // ─── 13. Categories & Cities ───────────────────────────────────
  const cities = Array.isArray(actualProduct.cities)
    ? actualProduct.cities.map((c) => (typeof c === "object" ? c._id || c.id || c : c)).filter(Boolean)
    : [];

  const rawSupCategories = actualProduct.supCategories || actualProduct.subCategories || [];
  const supCategories = Array.isArray(rawSupCategories)
    ? rawSupCategories.map((sc) => (typeof sc === "object" ? sc._id || sc.id || sc : sc)).filter(Boolean)
    : [];

  const categorySource = actualProduct.category || actualProduct.categories;
  const categories =
    typeof categorySource === "object" && categorySource !== null
      ? categorySource._id || categorySource.id || ""
      : categorySource || "";

  // ─── 14. Age Range ─────────────────────────────────────────────
  const ageSource = actualProduct.ageRange || b2c.ageRange || b2b.ageRange || {};
  const ageRange = {
    from: ageSource.from ?? "",
    to: ageSource.to ?? "",
  };

  return {
    ...initialAddProductValues,
    name: {
      en: actualProduct.name?.en || "",
      ar: actualProduct.name?.ar || "",
    },
    tripType: actualProduct.tripType || "ACTIVITY",
    tripsType: actualProduct.tripType || "ACTIVITY",
    description: {
      en: actualProduct.description?.en || "",
      ar: actualProduct.description?.ar || "",
    },
    categories,
    supCategories,
    systemTypes,
    conditionRuleValue: "15",
    ageRange,
    location,
    gatheringLocation,
    cities,
    providerBranchs,
    branchCapacities,
    branchDates,
    customizedBranchDateIds,
    branchServices,
    customizedBranchIds,
    fromDay,
    toDay,
    fromHour,
    toHour,
    availableTimes,
    recurrencePattern,
    selectedDays,
    monthDay,
    bookingBefore,
    duration,
    availableSeats: {
      min: minSeats,
      max: maxSeats,
    },
    guestRange: {
      min: minSeats,
      max: maxSeats,
    },
    services,
    mustHaveItems,
    exemptedFromTrip,
    benefits,
    gallary,
    gallery: gallary,
    thumbnail,
    thumbnailWeb: thumbnail,
    detailsFile: null,
    mediaFile: null,
    video: null,
    youtubeUrl: actualProduct.videoUrl || "",
    videoUrl: actualProduct.videoUrl || "",
    // B2C pricing
    price: b2c.price ?? actualProduct.price ?? "",
    b2cPrice: {
      price: b2c.price ?? actualProduct.price ?? "",
      discountedPrice: b2c.discountedPrice ?? "",
      finalPrice: b2c.finalPrice ?? "",
      hasTax: b2c.hasTax ?? false,
      depositRatio: b2c.depositRatio ?? 0,
      depositValue: b2c.depositValue ?? 0,
      finalDepositValue: b2c.finalDepositValue ?? 0,
      targetAudiences: finalTargetAudiences,
      weekdayPricing: b2cWeekdayPricing,
      datePricing: b2cDatePricing,
    },
    // B2B pricing
    b2bPrice: {
      price: b2b.price ?? b2b.productCost ?? actualProduct.productCost ?? "",
      discountedPrice: b2b.discountedPrice ?? "",
      finalPrice: b2b.finalPrice ?? "",
      hasTax: b2b.hasTax ?? false,
      depositRatio: b2b.depositRatio ?? 0,
      depositValue: b2b.depositValue ?? 0,
      finalDepositValue: b2b.finalDepositValue ?? 0,
      productCost: b2b.productCost ?? b2b.price ?? actualProduct.productCost ?? "",
      studentsPerSupervisor: String(b2b.studentsPerSupervisor ?? "10"),
      weekdayPricing: b2bWeekdayPricing,
      quantityDiscountTiers,
      datePricing: b2bDatePricing,
    },
    productCost: b2b.productCost ?? b2b.price ?? actualProduct.productCost ?? "",
    studentsPerSupervisor: String(b2b.studentsPerSupervisor ?? "10"),
    b2cSeats: typeof b2c.availableSeats === "number" ? b2c.availableSeats : maxSeats,
    weekdayPricing,
    targetAudiences: finalTargetAudiences,
    b2cTargetAudiences,
    academicStages,
    allowedAges: [],
    datePricing: b2cDatePricing.length > 0 ? b2cDatePricing : [{ date: "", price: "" }],
    bulkPricing: [{ minCount: "", price: "" }],
    branchPricing,
    customizedPricingBranches,
    itinerary:
      Array.isArray(actualProduct.itinerary) && actualProduct.itinerary.length > 0
        ? actualProduct.itinerary.map((item, idx) => ({
            day: item.day || idx + 1,
            toDo: {
              en: item.toDo?.en || "",
              ar: item.toDo?.ar || "",
            },
          }))
        : [{ day: 1, toDo: { en: "", ar: "" } }],
    branchTrips: allBranchTrips,
    bookingDay:
      Array.isArray(b2b.bookingDay)
        ? b2b.bookingDay
        : Array.isArray(actualProduct.bookingDay)
        ? actualProduct.bookingDay
        : [],
  };
};

export default transformProductToFormValues;
