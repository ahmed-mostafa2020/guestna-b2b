/**
 * GA4 + GTM event tracking — the single entry point for analytics in the app.
 *
 * Two ways to track, both end up in trackEvent():
 * 1. Clicks: spread getGtmTag() from @utils/tracking/gtmUtils on the element.
 *    AnalyticsClickTracker (root layout) sends it as a "ui_click" event — no onClick needed.
 * 2. Outcomes (form success, link created, …): call trackEvent() with a named event below.
 *
 * Never pass PII (names, emails, phones) in params — GA4 terms forbid it.
 */

export const ANALYTICS_EVENTS = {
  // Any element marked with getGtmTag()
  UI_CLICK: "ui_click",

  // GA4 recommended events — keep these exact names so GA4 reports pick them up
  LOGIN: "login",
  SIGN_UP: "sign_up",
  GENERATE_LEAD: "generate_lead",
  PURCHASE: "purchase",
  PAYMENT_FAILED: "payment_failed",

  // School register → trip link funnel
  SCHOOL_REGISTER_CTA_CLICK: "school_register_cta_click",
  SCHOOL_REGISTER_FORM_VIEW: "school_register_form_view",
  SCHOOL_REGISTER_STEP_COMPLETE: "school_register_step_complete",
  SCHOOL_REGISTER_COMPLETE: "school_register_complete",
  SCHOOL_REGISTER_ERROR: "school_register_error",
  CREATE_TRIP_LINK_CTA_CLICK: "create_trip_link_cta_click",
  TRIP_LINK_CREATED: "trip_link_created",
  TRIP_LINK_SHARE: "trip_link_share",
};

// Where the register CTA was clicked
export const REGISTER_SOURCES = {
  HOME: "home",
  ACTIVITIES_MARKET: "activities_market",
  TRIP_DETAILS: "trip_details",
};

// new_school = visitor creating a school account; existing_account = logged-in org user
export const REGISTER_FORM_TYPES = {
  NEW_SCHOOL: "new_school",
  EXISTING_ACCOUNT: "existing_account",
};

/**
 * Sends an event to GA4 (gtag.js) and GTM (dataLayer custom event).
 * Safe to call anywhere — no-op on the server or when analytics is blocked.
 * @param {string} name - event name from ANALYTICS_EVENTS
 * @param {Object} params - event parameters (no PII)
 */
export const trackEvent = (name, params = {}) => {
  if (typeof window === "undefined" || !name) return;

  // Drop empty params so GA4 doesn't record "undefined" values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  try {
    window.gtag?.("event", name, cleanParams);
    window.dataLayer?.push({ event: name, ...cleanParams });
  } catch {
    // Analytics must never break the UI
  }
};

/**
 * Sets GA4 user properties (attached to every following event) and exposes
 * them to GTM as data layer variables. No PII.
 * @param {Object} properties - e.g. { user_type: "school" }
 */
export const setUserProperties = (properties = {}) => {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("set", "user_properties", properties);
    window.dataLayer?.push(properties);
  } catch {
    // Analytics must never break the UI
  }
};
