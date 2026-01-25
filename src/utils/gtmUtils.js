/**
 * GTM (Google Tag Manager) utility functions for tracking interactive elements
 * Use these utilities to add data attributes for GTM click tracking
 */

/**
 * Get GTM data attributes for an element
 * Use by spreading the returned object onto any interactive element
 * @param {string} tagName - Tag name for GTM tracking (e.g., "login_button", "add_to_cart")
 * @param {string} category - Optional category for grouping (e.g., "auth", "cart", "profile")
 * @returns {Object} Object with data-gtm and data-gtm-category attributes
 * @example
 * <button {...getGtmTag("login_button", "auth")}>Login</button>
 * // Output: <button data-gtm="login_button" data-gtm-category="auth">Login</button>
 */
export const getGtmTag = (tagName, category = "general") => {
  if (!tagName) return {};

  return {
    "data-gtm": tagName,
    "data-gtm-category": category,
  };
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
  },
  // Profile related
  PROFILE: {
    EDIT_INFO: "profile_edit_info",
    EDIT_EMAIL: "profile_edit_email",
    VIEW_BOOKINGS: "profile_view_bookings",
    VIEW_TRANSACTIONS: "profile_view_transactions",
    VIEW_FAVORITES: "profile_view_favorites",
    EXPORT_REPORT: "profile_export_report",
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
  },
  // Bookings
  BOOKINGS: {
    VIEW_DETAILS: "bookings_view_details",
    PRINT_INVOICE: "bookings_print_invoice",
    RESEND_BOOKING: "bookings_resend_booking",
    CANCEL: "bookings_cancel",
    EXPORT_STUDENTS: "bookings_export_students",
  },
  // Orders
  ORDERS: {
    CREATE_NEW: "orders_create_new",
    VIEW_DETAILS: "orders_view_details",
    UPDATE: "orders_update",
    REMIND_GUESTNA: "orders_remind_guestna",
  },
  // Users/Roles
  USERS: {
    ADD_USER: "users_add_user",
    BULK_IMPORT: "users_bulk_import",
    EDIT: "users_edit",
    DELETE: "users_delete",
    EDIT_PERMISSIONS: "users_edit_permissions",
  },
  ROLES: {
    ADD_ROLE: "roles_add_role",
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
  },
  // Forms
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
