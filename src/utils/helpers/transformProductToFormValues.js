/**
 * Transforms the API product details response into Formik initial values
 * compatible with the add/edit product form structure.
 */
import { initialAddProductValues } from "@components/forms/addProductForm";
import { formatTimeForInput } from "@utils/formatters/formatTimeForInput";

const transformProductToFormValues = (product, fixedSelectionLocation) => {
  if (!product) return null;

  const b2b = product.b2bTrip || {};
  const b2c = product.b2cTrip || {};

  // ─── 1. Determine System Types ─────────────────────────────────
  let systemTypes = [];
  if (Array.isArray(product.systemTypes) && product.systemTypes.length > 0) {
    systemTypes = product.systemTypes.map((t) =>
      typeof t === "string" ? t.trim().toUpperCase() : t
    );
  } else {
    if (product.b2bTrip || product.b2bPrice || product.productCost) systemTypes.push("B2B");
    if (product.b2cTrip || product.b2cPrice || product.price) systemTypes.push("B2C");
    if (systemTypes.length === 0) systemTypes.push("B2C");
  }

  // ─── 2. Branches Extraction ────────────────────────────────────
  // Handles nested city groups: [{ city, branches: [{ _id, name }] }]
  // Flat branch objects: [{ _id, name }]
  // Flat ID strings: ["id1", "id2"]
  // And branchTrips: [{ branch: "id" | { _id } }]
  const branchIdSet = new Set();
  const rawBranches =
    product.providerBranchs ||
    product.providerBranches ||
    product.branches ||
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

  const allBranchTrips = [
    ...(Array.isArray(product.branchTrips) ? product.branchTrips : []),
    ...(Array.isArray(b2b.branchTrips) ? b2b.branchTrips : []),
    ...(Array.isArray(b2c.branchTrips) ? b2c.branchTrips : []),
  ];

  allBranchTrips.forEach((bt) => {
    const bId =
      typeof bt?.branch === "object"
        ? bt?.branch?._id || bt?.branch?.id
        : bt?.branch;
    if (bId && typeof bId === "string" && bId.trim()) {
      branchIdSet.add(bId.trim());
    }
  });

  const providerBranchs = Array.from(branchIdSet);

  // ─── 3. Target Audiences Extraction ────────────────────────────
  // Supports product.targetAudiences, b2c.targetAudiences, product.b2cTargetAudiences
  const rawTargetAudiences =
    Array.isArray(product.targetAudiences) && product.targetAudiences.length > 0
      ? product.targetAudiences
      : Array.isArray(b2c.targetAudiences) && b2c.targetAudiences.length > 0
      ? b2c.targetAudiences
      : Array.isArray(product.b2cTargetAudiences) && product.b2cTargetAudiences.length > 0
      ? product.b2cTargetAudiences
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
    Array.isArray(product.academicStages) && product.academicStages.length > 0
      ? product.academicStages
      : Array.isArray(b2b.academicStages) && b2b.academicStages.length > 0
      ? b2b.academicStages
      : [];

  const academicStages = rawAcademicStages
    .map((s) => (typeof s === "object" ? s?._id || s?.id || "" : s))
    .filter(Boolean);

  // ─── 5. Services Extraction ────────────────────────────────────
  const rawServices = product.services || [];
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
    const bId =
      typeof bt.branch === "object"
        ? bt.branch?._id || bt.branch?.id
        : bt.branch;
    if (!bId || typeof bId !== "string") return;

    // Capacity
    if (
      bt.availableSeats &&
      (bt.availableSeats.min != null || bt.availableSeats.max != null)
    ) {
      branchCapacities[bId] = {
        min: bt.availableSeats.min ?? "",
        max: bt.availableSeats.max ?? "",
      };
    }

    // Dates
    if (
      bt.fromDay ||
      bt.toDay ||
      (Array.isArray(bt.availableTimes) && bt.availableTimes.length > 0) ||
      bt.recurrencePattern
    ) {
      branchDates[bId] = {
        recurrencePattern: bt.recurrencePattern || "WEEKLY",
        monthDay: Array.isArray(bt.monthDay) ? bt.monthDay : [],
        selectedDays: Array.isArray(bt.selectedDays) ? bt.selectedDays : [],
        fromDay: bt.fromDay ? bt.fromDay.split("T")[0] : "",
        toDay: bt.toDay ? bt.toDay.split("T")[0] : "",
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
      if (!customizedBranchDateIds.includes(bId)) {
        customizedBranchDateIds.push(bId);
      }
    }

    // Services
    if (Array.isArray(bt.services) && bt.services.length > 0) {
      branchServices[bId] = bt.services.map((s) => ({
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
      if (!customizedBranchIds.includes(bId)) {
        customizedBranchIds.push(bId);
      }
    }

    // Pricing
    const btB2c = bt.b2cPrice || {};
    const btB2b = bt.b2bPrice || {};
    if (
      btB2c.price != null ||
      btB2b.price != null ||
      bt.price != null ||
      bt.productCost != null
    ) {
      const btTargetAudiences = Array.isArray(btB2c.targetAudiences)
        ? btB2c.targetAudiences.map((ta) => ({
            targetAudience:
              typeof ta.targetAudience === "object"
                ? ta.targetAudience?._id || ta.targetAudience?.id || ""
                : ta.targetAudience || "",
            price: ta.price ?? "",
          }))
        : [];

      branchPricing[bId] = {
        price: btB2c.price ?? bt.price ?? "",
        discountedPrice: btB2c.discountedPrice ?? "",
        schoolsPrice: btB2b.price ?? btB2b.productCost ?? "",
        productCost: btB2b.productCost ?? "",
        conditionRuleValue: "15",
        b2bConditionRuleValue: "10",
        key: "INCREASE",
        b2bKey: "DECREASE",
        targetAudiences: btTargetAudiences,
        weekdayPricing: Array.isArray(btB2c.weekdayPricing)
          ? btB2c.weekdayPricing
          : [],
        datePricing:
          Array.isArray(btB2c.datePricing) && btB2c.datePricing.length > 0
            ? btB2c.datePricing
            : [{ date: "", price: "" }],
        b2bDatePricing:
          Array.isArray(btB2b.datePricing) && btB2b.datePricing.length > 0
            ? btB2b.datePricing
            : [{ date: "", price: "" }],
        b2bQuantityDiscountTiers: Array.isArray(btB2b.quantityDiscountTiers)
          ? btB2b.quantityDiscountTiers
          : [],
      };
      if (!customizedPricingBranches.includes(bId)) {
        customizedPricingBranches.push(bId);
      }
    }
  });

  // ─── 7. Available Times, Dates & Recurrence ────────────────────
  const rawTimes =
    Array.isArray(product.availableTimes) && product.availableTimes.length > 0
      ? product.availableTimes
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

  const rawFromDay = product.fromDay || b2c.fromDay || b2b.fromDay || "";
  const rawToDay = product.toDay || b2c.toDay || b2b.toDay || "";
  const fromDay = rawFromDay ? rawFromDay.split("T")[0] : "";
  const toDay = rawToDay ? rawToDay.split("T")[0] : "";

  const fromHour =
    formatTimeForInput(product.fromHour || b2c.fromHour || b2b.fromHour || availableTimes[0]?.from) || "";
  const toHour =
    formatTimeForInput(product.toHour || b2c.toHour || b2b.toHour || availableTimes[0]?.to) || "";

  const recurrencePattern =
    product.recurrencePattern || b2c.recurrencePattern || b2b.recurrencePattern || "WEEKLY";

  const selectedDays =
    Array.isArray(product.selectedDays) && product.selectedDays.length > 0
      ? product.selectedDays
      : Array.isArray(b2c.selectedDays) && b2c.selectedDays.length > 0
      ? b2c.selectedDays
      : Array.isArray(b2b.selectedDays) && b2b.selectedDays.length > 0
      ? b2b.selectedDays
      : [];

  const monthDay =
    Array.isArray(product.monthDay) && product.monthDay.length > 0
      ? product.monthDay
      : Array.isArray(b2c.monthDay) && b2c.monthDay.length > 0
      ? b2c.monthDay
      : Array.isArray(b2b.monthDay) && b2b.monthDay.length > 0
      ? b2b.monthDay
      : [];

  const bookingBefore =
    product.bookingBefore ?? b2c.bookingBefore ?? b2b.bookingBefore ?? "";

  const duration =
    product.duration ?? b2c.duration ?? b2b.duration ?? 1;

  // ─── 8. Available Seats & Guests ──────────────────────────────
  const minSeats =
    product.availableSeats?.min ??
    b2b.availableSeats?.min ??
    (typeof b2c.availableSeats === "object" ? b2c.availableSeats?.min : "") ??
    "";

  const maxSeats =
    product.availableSeats?.max ??
    b2b.availableSeats?.max ??
    (typeof b2c.availableSeats === "number"
      ? b2c.availableSeats
      : typeof b2c.availableSeats === "object"
      ? b2c.availableSeats?.max
      : "") ??
    "";

  // ─── 9. Gallery & Thumbnail ────────────────────────────────────
  const gallary = Array.isArray(product.gallary)
    ? product.gallary.map((g) => (typeof g === "object" ? g.url : g)).filter(Boolean)
    : Array.isArray(product.gallery)
    ? product.gallery.map((g) => (typeof g === "object" ? g.url : g)).filter(Boolean)
    : [];

  const thumbnail =
    product.thumbnail?.web ||
    product.thumbnail?.app ||
    (typeof product.thumbnail === "string" ? product.thumbnail : null);

  // ─── 10. Pricing & Discounts ───────────────────────────────────
  const b2cWeekdayPricing = Array.isArray(b2c.weekdayPricing)
    ? b2c.weekdayPricing.map((wp) => ({ day: wp.day, price: wp.price ?? "" }))
    : Array.isArray(product.weekdayPricing)
    ? product.weekdayPricing.map((wp) => ({ day: wp.day, price: wp.price ?? "" }))
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
      : Array.isArray(product.quantityDiscountTiers) && product.quantityDiscountTiers.length > 0
      ? product.quantityDiscountTiers
      : [];

  const quantityDiscountTiers =
    rawTiers.length > 0
      ? rawTiers.map((t) => ({
          minQuantity: t.minQuantity ?? "",
          discountType: t.discountType || "PERCENTAGE",
          discountValue: t.discountValue ?? "",
        }))
      : [{ minQuantity: "", discountType: "PERCENTAGE", discountValue: "" }];

  const b2cDatePricing =
    Array.isArray(b2c.datePricing) && b2c.datePricing.length > 0
      ? b2c.datePricing
      : Array.isArray(product.datePricing) && product.datePricing.length > 0
      ? product.datePricing
      : [];

  const b2bDatePricing = Array.isArray(b2b.datePricing) ? b2b.datePricing : [];

  // ─── 11. Locations ─────────────────────────────────────────────
  const locSource = product.location || b2c.location || b2b.location;
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

  const gLocSource = product.gatheringLocation || locSource;
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
      Array.isArray(product.mustHaveItems?.en) && product.mustHaveItems.en.length > 0
        ? product.mustHaveItems.en
        : [""],
    ar:
      Array.isArray(product.mustHaveItems?.ar) && product.mustHaveItems.ar.length > 0
        ? product.mustHaveItems.ar
        : [""],
  };

  const exemptedFromTrip = {
    en:
      Array.isArray(product.exemptedFromTrip?.en) && product.exemptedFromTrip.en.length > 0
        ? product.exemptedFromTrip.en
        : [""],
    ar:
      Array.isArray(product.exemptedFromTrip?.ar) && product.exemptedFromTrip.ar.length > 0
        ? product.exemptedFromTrip.ar
        : [""],
  };

  const benefits = {
    en:
      Array.isArray(product.benefits?.en) && product.benefits.en.length > 0
        ? product.benefits.en
        : [""],
    ar:
      Array.isArray(product.benefits?.ar) && product.benefits.ar.length > 0
        ? product.benefits.ar
        : [""],
  };

  // ─── 13. Categories & Cities ───────────────────────────────────
  const cities = Array.isArray(product.cities)
    ? product.cities.map((c) => (typeof c === "object" ? c._id || c.id || c : c)).filter(Boolean)
    : [];

  const rawSupCategories = product.supCategories || product.subCategories || [];
  const supCategories = Array.isArray(rawSupCategories)
    ? rawSupCategories.map((sc) => (typeof sc === "object" ? sc._id || sc.id || sc : sc)).filter(Boolean)
    : [];

  const categorySource = product.category || product.categories;
  const categories =
    typeof categorySource === "object" && categorySource !== null
      ? categorySource._id || categorySource.id || ""
      : categorySource || "";

  // ─── 14. Age Range ─────────────────────────────────────────────
  const ageSource = product.ageRange || b2c.ageRange || b2b.ageRange || {};
  const ageRange = {
    from: ageSource.from ?? "",
    to: ageSource.to ?? "",
  };

  return {
    ...initialAddProductValues,
    name: {
      en: product.name?.en || "",
      ar: product.name?.ar || "",
    },
    tripType: product.tripType || "ACTIVITY",
    tripsType: product.tripType || "ACTIVITY",
    description: {
      en: product.description?.en || "",
      ar: product.description?.ar || "",
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
    youtubeUrl: product.videoUrl || "",
    videoUrl: product.videoUrl || "",
    // B2C pricing
    price: b2c.price ?? product.price ?? "",
    b2cPrice: {
      price: b2c.price ?? product.price ?? "",
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
      price: b2b.price ?? b2b.productCost ?? product.productCost ?? "",
      discountedPrice: b2b.discountedPrice ?? "",
      finalPrice: b2b.finalPrice ?? "",
      hasTax: b2b.hasTax ?? false,
      depositRatio: b2b.depositRatio ?? 0,
      depositValue: b2b.depositValue ?? 0,
      finalDepositValue: b2b.finalDepositValue ?? 0,
      productCost: b2b.productCost ?? b2b.price ?? product.productCost ?? "",
      studentsPerSupervisor: String(b2b.studentsPerSupervisor ?? "10"),
      weekdayPricing: b2bWeekdayPricing,
      quantityDiscountTiers,
      datePricing: b2bDatePricing,
    },
    productCost: b2b.productCost ?? b2b.price ?? product.productCost ?? "",
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
      Array.isArray(product.itinerary) && product.itinerary.length > 0
        ? product.itinerary.map((item, idx) => ({
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
        : Array.isArray(product.bookingDay)
        ? product.bookingDay
        : [],
  };
};

export default transformProductToFormValues;
