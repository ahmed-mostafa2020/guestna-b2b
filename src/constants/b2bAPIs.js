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
  STUDENTS_GRADES: "grades/booking",

  SIDE_FILTERS: "filtratinDetails",
  ALL_TRIPS: "all",
  CUSTOMIZATION: "tripCustomizableInfo",
  CUSTOMIZATION_WITH_USERID: "customTrips/initiateCustomTrip",
  SERVICES: "services/customizableservice",
  PACKAGE_INFO: "packageImageInfo",
  ADD_ACTIVITY: "tripActivitiesCustomizable",
  REQUEST_QUOTE: "asks/new",
  PAYMENT: "bookings/initiation",
  CHECK_BOOKING: "bookings/checkBooking",

  PROMO_CODE: "promoCodeDiscounts/validCode",
  CHECKOUT: "finalTripBookingDetails",
  CONFIRM_STC_PAYMENT: "confirmSTCPayment",
  APPLE_BOOKING: {
    INITIATE: "initiationguestnaAppleTripBooking",
    CONFIRM: "guestnaTripConfermedAppleBooking",
    CALLBACK: "confermedAppleBooking",
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
  },

  FAVORITE: "favorite",

  PROFILE: {
    INFORMATION: "auth/userInfo", //MAIN

    INFO: "profile/users/management/info",

    TRIPS: {
      ACTIVITIES: "profile/organizationTrips/activity/all",
      PACKAGES: "profile/organizationTrips/package/all",
    },

    BOOKINGS_MANAGEMENT: {
      BOOKINGS: "profile/organizationTrips/all",
      BOOKING_DETAILS: "profile/bookings/info",

      RPORTS: "profile/organizationTrips/report/all",
      SURVEY: "surveys/new",
      ORDERS: {
        NORMAL: "profile/askTrips/normal/all",
        CUSTOMIZABLE: "profile/askTrips/custom/all",
        ADD_NEW_ACTIVITY: {
          FORM_SELECTION: "profile/askTrips/form/selections",
          CUSTOM_TRIP: "profile/askTrips/custom/new",
        },
      },
    },
    CREATE_TRIP_LINK: "profile/organizationTrips/poster",

    BOOKINGS: "profile/bookings/all",

    UPLOAD_PHOTO: "users/avatar", //MAIN
    VERIFIED_EMAIL: "users/sendConfirmed", //MAIN
    FAVORITES: "myLovers", // TRIPS

    EDIT_PERSONAL_INFO: "users/modify", //MAIN
  },

  CONFIRM_REQUEST: "profile/askTrips/new",

  ADDRESS: {
    COUNTRIES_AND_NATIONALITIES: "profile/editFields", //MAIN
    CITIES: "profile/cities", //MAIN
  },

  CONTACT_US: "supportMessage/massage",
  FAQ: "faqs/all",
};
