// EndPoint paths
const BASE_URL = "https://cultural-enrika-guestna-43d7043d.koyeb.app/b2b/";

export const B2B_END_POINTS = {
  MAIN: BASE_URL,
  TRIPS: `${BASE_URL}guestnaTrips/`,
  PAYMENTS: `${BASE_URL}bookings/`,
  HOME: "home/info",
  NAVBAR: "navebar",
  TRIPDETAILS: "trips/info",
  PARENT_TRIPDETAILS: "organizationTrips/info",
  STUDENT_REGISTER: "organizationTrips/booking/info",

  SIDE_FILTERS: "filtratinDetails",
  ALL_TRIPS: "all",
  CUSTOMIZATION: "tripCustomizableInfo",
  CUSTOMIZATION_WITH_USERID: "customTrips/initiateCustomTrip",
  SERVICES: "services/customizableservice",
  PACKAGE_INFO: "packageImageInfo",
  ADD_ACTIVITY: "tripActivitiesCustomizable",

  PROMO_CODE: "promoCodeDiscounts/validCode",
  CHECKOUT: "finalTripBookingDetails",
  PAYMENT: "initiationguestnaTripBooking",
  CONFIRM_STC_PAYMENT: "confirmSTCPayment",
  CHECK_BOOKING: "checkBooking",
  APPLE_BOOKING: {
    INITIATE: "initiationguestnaAppleTripBooking",
    CONFIRM: "guestnaTripConfermedAppleBooking",
    CALLBACK: "confermedAppleBooking",
  },

  AUTH: {
    PARENT_LOGIN: "auth/login/parent",

    SIGNUP: "users/signup",
    CONFIRM_ACCOUNT: "accounts/confirm",
    LOGIN_PHONE: "auth/loginPhone",
    LOGIN_MAIL: "auth/loginEmail",
    FORGET_PASSWORD: "auth/checkUserForgetPassword",
    OTP: "accounts/confirmForgetPassword",
    RESET_PASSWORD: "accounts/resetPasswordForget",
    RESEND_OTP: "otps/resend",
    USER_DATA: "users/currentUser",
  },

  FAVORITE: "favorite",

  PROFILE: {
    INFORMATION: "users/userInfo", //MAIN
    UPLOAD_PHOTO: "users/avatar", //MAIN
    VERIFIED_EMAIL: "users/sendConfirmed", //MAIN
    MY_BOOKINGS: "myTripBooking", //PAYMENTS
    FAVORITES: "myLovers", // TRIPS

    EDIT_PERSONAL_INFO: "users/modify", //MAIN
  },

  ADDRESS: {
    COUNTRIES_AND_NATIONALITIES: "profile/editFields", //MAIN
    CITIES: "profile/cities", //MAIN
  },

  CONTACT_US: "supportMessage/massage",
  FAQ: "faqs/all",
};
