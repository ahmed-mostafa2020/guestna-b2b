/**
 * Click tracking for interactive elements.
 * Spread getGtmTag() on any element — AnalyticsClickTracker sends the click to
 * GA4 + GTM as a "ui_click" event (see @utils/tracking/analytics).
 */

/**
 * Get GTM data attributes for an element
 * Use by spreading the returned object onto any interactive element
 * @param {string} tagName - Tag name for GTM tracking (e.g., "login_button", "add_to_cart")
 * @param {string} category - Optional category for grouping (e.g., "auth", "cart", "profile")
 * @param {string} uniqueId - Optional unique identifier for list items (e.g., slug, id, name)
 * @returns {Object} Object with data-gtm, data-gtm-category, and optionally data-gtm-id attributes
 * @example
 * <button {...getGtmTag("login_button", "auth")}>Login</button>
 * // Output: <button data-gtm="login_button" data-gtm-category="auth">Login</button>
 * <Link {...getGtmTag("schools_view_details", "schools", school.slug)}>View</Link>
 * // Output: <a data-gtm="schools_view_details" data-gtm-category="schools" data-gtm-id="school-slug">View</a>
 */
export const getGtmTag = (tagName, category = "general", uniqueId) => {
  if (!tagName) return {};

  const attrs = {
    "data-gtm": tagName,
    "data-gtm-category": category,
  };

  if (uniqueId) {
    attrs["data-gtm-id"] = uniqueId;
  }

  return attrs;
};

/**
 * Pre-defined GTM tag constants for consistent naming across the app
 * Use these constants with getGtmTag for consistent tracking
 */
export const GTM_TAGS = {
  // Auth related
  AUTH: {
    LOGIN_BUTTON: "auth_login_button",
    SIGNUP_BUTTON: "auth_signup_button",
    LOGOUT_BUTTON: "auth_logout_button",
    FORGOT_PASSWORD: "auth_forgot_password",
    VERIFY_EMAIL: "auth_verify_email",
    RESEND_OTP: "auth_resend_otp",
    LOGIN_EMAIL_SUBMIT: "auth_login_email_submit",
    LOGIN_PHONE_SUBMIT: "auth_login_phone_submit",
    STAFF_LOGIN_SUBMIT: "auth_staff_login_submit",
    PARENT_LOGIN_SUBMIT: "auth_parent_login_submit",
    FORGOT_PASSWORD_EMAIL_SUBMIT: "auth_forgot_password_email_submit",
    FORGOT_PASSWORD_PHONE_SUBMIT: "auth_forgot_password_phone_submit",
    RESET_PASSWORD_SUBMIT: "auth_reset_password_submit",
  },
  // Header/Navigation
  NAV: {
    LOGO: "nav_logo",
    HOME: "nav_home",
    DISCOVER: "nav_discover",
    SERVICES: "nav_services",
    CONTACT: "nav_contact",
    ABOUT: "nav_about",
    FAQ: "nav_faq",
    LANGUAGE_SWITCH: "nav_language_switch",
    PROFILE_MENU: "nav_profile_menu",
    TERMS_AND_CONDITIONS: "nav_terms_and_conditions",
    LOGIN: "nav_login",
  },
  // Discover / FAQ search
  DISCOVER: {
    SEARCH: "discover_search",
    FILTERS_APPLY: "discover_filters_apply",
    FILTERS_RESET: "discover_filters_reset",
  },
  FAQ: {
    SEARCH: "faq_search",
  },
  // Footer links
  FOOTER: {
    ABOUT_US: "footer_company_about_us",
    CALL_US: "footer_support_call_us",
    TERMS: "footer_legal_terms",
  },
  // Contact us
  CONTACT: {
    SUBMIT: "contact_us_submit",
  },
  // Profile related
  PROFILE: {
    EDIT_INFO: "profile_edit_info",
    EDIT_EMAIL: "profile_edit_email",
    VIEW_BOOKINGS: "profile_view_bookings",
    VIEW_TRANSACTIONS: "profile_view_transactions",
    VIEW_FAVORITES: "profile_view_favorites",
    EXPORT_REPORT: "profile_export_report",
    NAVIGATE: "profile_navigate",
    EDIT_INFO_CANCEL: "profile_edit_info_cancel",
    EDIT_EMAIL_CANCEL: "profile_edit_email_cancel",
  },
  // Trips/Activities
  TRIPS: {
    VIEW_DETAILS: "trips_view_details",
    ADD_TO_FAVORITES: "trips_add_to_favorites",
    REMOVE_FROM_FAVORITES: "trips_remove_from_favorites",
    REQUEST_QUOTE: "trips_request_quote",
    BOOK_NOW: "trips_book_now",
    SHARE: "trips_share",
    DOWNLOAD_GALLERY: "trips_download_gallery",
    MANAGEMENT: "trips_management",
    SHOW_ALL_IMAGES: "trips_show_all_images",
    FEATURE_CONTACT: "feature_trip_contact",
    SETTINGS_SAVE: "trips_settings_save",
    SETTINGS_CANCEL: "trips_settings_cancel",
  },
  // Custom trip request wizard
  CUSTOM_TRIP: {
    NEXT_STEP: "custom_trip_next_step",
    PREV_STEP: "custom_trip_prev_step",
    SUBMIT: "custom_trip_submit",
  },
  // Bookings
  BOOKINGS: {
    VIEW_DETAILS: "bookings_view_details",
    PRINT_INVOICE: "bookings_print_invoice",
    RESEND_BOOKING: "bookings_resend_booking",
    CANCEL: "bookings_cancel",
    EXPORT_STUDENTS: "bookings_export_students",
    ADMINISTRATIVE_COMMENT: "bookings_administrative_comment",
    ADMINISTRATIVE_COMMENT_SUBMIT: "bookings_administrative_comment_submit",
    ADMINISTRATIVE_COMMENT_CANCEL: "bookings_administrative_comment_cancel",
    DOWNLOAD_TERMS: "bookings_download_terms",
    SEARCH: "bookings_search",
    SEARCH_CLEAR: "bookings_search_clear",
  },
  ORGANIZATIONS: {
    SEARCH: "organizations_search",
    SEARCH_CLEAR: "organizations_search_clear",
  },
  // Orders
  ORDERS: {
    CREATE_NEW: "orders_create_new",
    VIEW_DETAILS: "orders_view_details",
    UPDATE: "orders_update",
    REMIND_GUESTNA: "orders_remind_guestna",
    APPROVE: "orders_approve",
    REJECT: "orders_reject",
    EDIT_SETTINGS: "orders_edit_settings",
    APPROVE_CANCEL: "orders_approve_cancel",
    REJECT_CANCEL: "orders_reject_cancel",
    UPDATE_CANCEL: "orders_update_cancel",
  },
  // Users/Roles
  USERS: {
    ADD_USER: "users_add_user",
    BULK_IMPORT: "users_bulk_import",
    EDIT: "users_edit",
    DELETE: "users_delete",
    EDIT_PERMISSIONS: "users_edit_permissions",
    SHOW_MORE: "users_show_more",
    BULK_IMPORT_SUBMIT: "users_bulk_import_submit",
    BULK_IMPORT_CANCEL: "users_bulk_import_cancel",
    SEARCH: "users_search",
    SEARCH_CLEAR: "users_search_clear",
  },
  ROLES: {
    ADD_ROLE: "roles_add_role",
    ADD_ROLE_CANCEL: "roles_add_role_cancel",
    DELETE_ROLE: "roles_delete_role",
    SAVE_PERMISSIONS: "roles_save_permissions",
    RESET_PERMISSIONS: "roles_reset_permissions",
  },
  // Calendar
  CALENDAR: {
    ADD_EVENT: "calendar_add_event",
    EDIT_EVENT: "calendar_edit_event",
    VIEW_EVENT: "calendar_view_event",
    PREV_MONTH: "calendar_prev_month",
    NEXT_MONTH: "calendar_next_month",
    UPLOAD_CALENDAR: "calendar_upload_calendar",
    MODAL_CONFIRM: "calendar_modal_confirm",
    MODAL_CANCEL: "calendar_modal_cancel",
  },
  SURVEY: {
    SUBMIT: "survey_submit",
    CANCEL: "survey_cancel",
  },
  WALLET: {
    WITHDRAW_SUBMIT: "wallet_withdraw_submit",
  },
  // Generic — prefer a feature-specific name above so reports can tell buttons apart
  FORMS: {
    SUBMIT: "forms_submit",
    CANCEL: "forms_cancel",
    RESET: "forms_reset",
    NEXT_STEP: "forms_next_step",
    PREV_STEP: "forms_prev_step",
  },
  // Filters
  FILTERS: {
    APPLY: "filters_apply",
    RESET: "filters_reset",
    SEARCH: "filters_search",
  },
  // Pagination
  PAGINATION: {
    NEXT: "pagination_next",
    PREV: "pagination_prev",
    PAGE: "pagination_page",
  },
  // Modal/Dialog
  MODAL: {
    CLOSE: "modal_close",
    CONFIRM: "modal_confirm",
    CANCEL: "modal_cancel",
  },
  // Payment
  PAYMENT: {
    PROCEED: "payment_proceed",
    CONTACT_CONTINUE: "payment_contact_continue",
    REGISTER_STUDENT_CONTINUE: "payment_register_student_continue",
    APPLY_COUPON: "payment_apply_coupon",
    SELECT_METHOD: "payment_select_method",
  },
  // Trip Details
  TRIP_DETAILS: {
    SHARE: "trip_details_share",
    DOWNLOAD_FILE: "trip_details_download_file",
    REQUEST_QUOTE: "trip_details_request_quote",
    CONTACT_WHATSAPP: "trip_details_contact_whatsapp",
    REGISTER: "trip_details_register",
    CUSTOMIZE_PACKAGE: "trip_details_customize_package",
    LOGIN_POPUP: "trip_details_login_popup",
    CONTINUE_GUEST: "trip_details_continue_guest",
  },
  // Schools
  SCHOOLS: {
    VIEW_DETAILS: "schools_view_details",
    REGISTER_SUBMIT: "schools_register_submit",
  },
  // Students
  STUDENTS: {
    PRINT_INVOICE: "students_print_invoice",
    RESEND_BOOKING: "students_resend_booking",
    DOWNLOAD_CONSENT: "students_download_consent",
    UPLOAD_IMAGE_SUBMIT: "students_upload_image_submit",
  },
  // Customization
  CUSTOMIZATION: {
    ADD_ACTIVITY: "customization_add_activity",
    MORE_SERVICES: "customization_more_services",
    ADD_DAY: "customization_add_day",
    EDIT_EVENT: "customization_edit_event",
    DELETE_EVENT: "customization_delete_event",
  },
  // Header
  HEADER: {
    MENU_TOGGLE: "header_menu_toggle",
    SETTINGS: "header_settings",
    COUNTRY_SELECT: "header_country_select",
  },
};

export default getGtmTag;

// onClick={() => {
//   sendGTMEvent({
//     event: "buttonClicked",
//     value: "xyz",
//     page: "home",
//     product_id: "12345",
//     product_name: "Premium Package",
//     price: 99.99,
//     currency: "USD",
//     userInfo: token,
//     });
// }}
