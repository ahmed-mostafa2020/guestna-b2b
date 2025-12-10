"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import homeData from "./home/homeDataSlice";
import searchFilter from "./searchFilter/searchFilterSlice";
import tripDetailsData from "./trips/tripDetailsSlice";
import checkoutData from "./checkout/checkoutSlice";
import finalTripDetailsData from "./checkout/finalTripDetailsSlice";
import checkoutFormData from "./forms/checkoutForm/checkoutFormSlice";
import discoverData from "./discover/discoverSlice";
import discoverSideFilters from "./searchFilter/discoverSideFiltersSlice";
import customizationData from "./customization/customizationSlice";
import servicesData from "./services/servicesSlice";
import signUpForm from "./forms/auth/signUp/signUpFormSlice";
import loginForm from "./forms/auth/login/loginFormSlice";
import parentLoginForm from "./forms/auth/parentLogin/parentLoginFormSlice";
import profileData from "./profile/profileInfoSlice";
import selectedOrganizations from "./profile/selectedOrganizationsSlice";
import faqData from "./faq/faqSlice";

import favorites from "./favorites/favoritesSlice";
import promoCode from "./forms/promoCode/promoCodeSlice";

import address from "./address/addressSlice";

import navbar from "./navbarData/navbarDataSlice";

import users from "./users/usersSlice";

import theme from "./theme/themeSlice";

import permissions from "./permissions/permissionsSlice";

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: [
    "checkoutData",
    "finalTripDetailsData",
    // "customizationData",
    "signUpForm",
    "loginForm",
    "parentLoginForm",
    "favorites",
    "address",
    "navbar",
    "users",
    "theme",
    "permissions",
    "selectedOrganizations",
  ],
};

// merge all reducers
const rootReducer = combineReducers({
  homeData,
  searchFilter,
  tripDetailsData,
  checkoutData,
  finalTripDetailsData,
  checkoutFormData,
  discoverData,
  discoverSideFilters,
  customizationData,
  servicesData,
  signUpForm,
  loginForm,
  parentLoginForm,
  profileData,
  selectedOrganizations,
  faqData,

  favorites,
  promoCode,

  address,
  navbar,
  users,
  theme,
  permissions,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,

  // to prevent serialization error "an error occurred because redux persist not compatible with redux toolkit"
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
const persistor = persistStore(store);

export { store, persistor };
