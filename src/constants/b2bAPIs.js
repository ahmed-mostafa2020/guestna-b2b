// EndPoint paths
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const B2B_END_POINTS = {
  MAIN: BASE_URL,
  TRIPS: "guestnaTrips/",
  PAYMENTS: `${BASE_URL}bookings/`,
  HOME: "home/info",
  NAVBAR: "navebar",
  DISCOVER: "trips/all",
  DISCOVER_SIDE_FILTERS: "trips/filtratinDetails",
  TRIPDETAILS: "trips/info",
  PARENT_TRIPDETAILS: "organizationTrips/info",
  STUDENT_REGISTER: "organizationTrips/booking/info",
  STUDENTS_GRADES: "grades/booking",

  ALL_MARKET_PLACE_SLUGS: "home/slugs",

  SIDE_FILTERS: "filtratinDetails",
  ALL_TRIPS: "all",
  CUSTOMIZATION: "tripCustomizableInfo",
  CUSTOMIZATION_WITH_USERID: "customTrips/initiateCustomTrip",
  SERVICES: "services/customizableservice",
  PACKAGE_INFO: "packageImageInfo",
  ADD_ACTIVITY: "tripActivitiesCustomizable",
  REQUEST_QUOTE: "asks/new",
  PAYMENT: "bookings/initiation",
  FREE_BOOKING: "bookings/free/initiation",
  CHECK_BOOKING: "bookings/checkBooking",

  PROMO_CODE: "organizationTrips/promocode/booking/info",
  CHECKOUT: "finalTripBookingDetails",
  CONFIRM_STC_PAYMENT: "confirmSTCPayment",
  APPLE_BOOKING: {
    INITIATE: "bookings/initiation/apple",
    CONFIRM: "bookings/confermed/apple",
    CALLBACK: "confermed/trip/apple",
  },
  TEST_APPLE_BOOKING: {
    INITIATE: "bookings/initiation/appletest",
    CONFIRM: "bookings/confermed/appletest",
    CALLBACK: "confermed/trip/appletest",
  },

  AUTH: {
    PARENT_LOGIN: "auth/login/parent",
    ROLES_LOGIN: "auth/login",
    // ROLES_LOGIN: "auth/login/dash",
    RESET_PASSWORD: "auth/password",
    FORGET_PASSWORD: "auth/send/resetPassword",

    SIGNUP: "users/signup",
    CONFIRM_ACCOUNT: "accounts/confirm",
    LOGIN_PHONE: "auth/loginPhone",
    LOGIN_MAIL: "auth/loginEmail",
    OTP: "accounts/confirmForgetPassword",
    RESEND_OTP: "otps/resend",
    USER_DATA: "users/currentUser",
    LOGIN_AS: "auth/login-token",
  },

  FAVORITE: "favorite",

  PROFILE: {
    INFORMATION: "auth/userInfo",
    INFO: "profile/users/management/info",

    HEADER_FILTER_BY_ORGANIZATION: "profile/organizations/hover",
    BOOKINGS: "profile/organizationTrips/home/all",
    MOST_ACTIVE_ORGANIZATIONS: "profile/organizations/most-active",
    ADMINISTRATIVE_COMMENT: "profile/organizationTrips/administrative/comment",
    ALL_ORGANIZATIONS: "profile/organizations/company",

    // ORGANIZATIONS_CITIES_TRACKS: "profile/organizations/cities-tracks",
    ORGANIZATIONS: {
      ALL: "profile/organizations/all",
      CITIES_TRACKS: "profile/organizations/cities-tracks",
      ORGANIZATION_DETAILS: "profile/organizations/details",
    },

    ALL_TRIPS: {
      ACTIVITIES: "profile/organizationTrips/activity/all",
      PACKAGES: "profile/organizationTrips/package/all",
    },

    ACTIVITIES_MARKET: "profile/trips/all",

    HAPPENINGS: {
      NEW: "profile/happenings/new",
      CREATE: "profile/happenings/new",
      COUNTS: "profile/happenings/counts",
      ALL: "profile/happenings/all",
      UPDATE: "profile/happenings/edit",
    },

    BOOKINGS_MANAGEMENT: {
      BOOKINGS: "profile/organizationTrips/all",
      BOOKING_DETAILS: "profile/bookings/info",
      CHILD_INFO: "profile/bookings/reClintinfo",
      CHILD_IMAGE_UPLOAD: "profile/bookings/image",
      RESEND_BOOKING: "profile/bookings/resend",
      TRACKS_BY_ORG: "profile/settingsTrips/tracks", // GET with /{orgId}

      RPORTS: "profile/organizationTrips/report/all",
      SURVEY: "surveys/new",
      ORDERS: {
        ALL: "profile/askTrips/all",
        COUNTS: "profile/askTrips/counts",
        TRACKS: "profile/settingsTrips/tracks",
        ADD_NEW_ACTIVITY: {
          FORM_SELECTION: "profile/askTrips/form/selections",
          CUSTOM_TRIP: "profile/askTrips/custom/new",
        },
        UPDATE_ORDER: {
          INFO: "profile/askTrips/info",
          SUBMIT: "profile/askTrips/edit", // UpdateOrder
          CUSTOM_TRIP: "profile/trips/info", // Discover details info
          CUSTOM_TRIP_SUBMIT: "profile/askTrips/custom/edit", // AuthenticatedRequestQuote
          GRADES_BY_STAGES: "grades/stages/askTrip", // Get grades for selected academic stages
        },
        REMIND: "profile/askTrips/reminder/admin",

        SETTINGS: {
          ALL_TRIPS: "profile/settingsTrips/all", //post
          SUBMIT: "profile/settingsTrips/edit", // Item id - patch
        },
      },
    },

    SCHOOL_TEAM_MANAGEMENT: {
      USERS: {
        INFO: "profile/users/users/count/info",
        TABLE: "profile/users/company/all",
        NEW_USER: "profile/users/new",
        EDIT_USER: "profile/users/edit",
        DELETE_USER: "profile/users/delete",
        ROLES: "profile/users/roles",
      },
      STUDENTS: {
        ALL_STUDENTS: "profile/organizations/childs/info",
        GRADE_STUDENTS: "profile/students",
        STUDENT_DETAILS: "profile/students/info",
      },
    },
    CREATE_TRIP_LINK: "profile/organizationTrips/poster",
    UPDATE_TRIP_STATUS: "profile/organizationTrips/generate/url",

    // BOOKINGS: "profile/bookings/all",

    // check this end point
    // INVOICES: "profile/organizationTrips/invoices/all",
    INVOICES: "profile/askWithdrawals/invoices/all",
    BALANCE: "profile/organizations/invoices",

    ORGANIZATIONS_INVOICES: "profile/organizations/invoices",
    TRIPS: "profile/organizationTrips/invoices/trips/all",
    WITHDRAWALS: "profile/askWithdrawals/new",

    UPLOAD_PHOTO: "users/avatar", //MAIN
    VERIFIED_EMAIL: "users/sendConfirmed", //MAIN
    FAVORITES: "myLovers", // TRIPS

    EDIT_PERSONAL_INFO: "users/modify", //MAIN

    ROLES_PERMISSIONS: {
      GET_ROLES: "profile/roles/all",
      GET_PERMISSIONS: "profile/roles/permissions",
      GET_PERMISSIONS_BY_ROLE: "profile/roles/permision",
      ADD_ROLE: "profile/roles/new",
      UPDATE_PERMISSIONS: "profile/users/edit/permissions",
      GET_USER_PERMISSIONS: "profile/users/permissions",
      DELETE_ROLE: "profile/roles/remove",
    },
  },

  CONFIRM_REQUEST: "profile/askTrips/new",

  ADDRESS: {
    COUNTRIES_AND_NATIONALITIES: "profile/editFields", //MAIN
    CITIES: "profile/cities", //MAIN
  },

  SCHOOL_REGISTER: {
    PAGE: "home/cities-eduSystems-b2b-roles",
    ORGANIZATIONS_NAME: "organizations/search-by-name",
    ORGANIZATION_INFO: "organizations",
    SUBMIT: "organization-invitation",
  },

  CONTACT_US: "supportMessage/massage",
  FAQ: "faqs/all",
};
