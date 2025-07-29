import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginData: {},
  isSubmitted: false,
  confirmTermsAndConditions: false,

  loggedEmail: null,
  loggedPhone: null,

  rememberMe: false,

  sendingOtpOption: null,

  // Forget password data
  resetPasswordBy: "email",
  email: null,
  phone: null,
  forgetPasswordId: null,
};

const loginFormSlice = createSlice({
  name: "loginForm",
  initialState,
  reducers: {
    submitForm: (state, action) => {
      state.loginData = action.payload;
      state.isSubmitted = true;
    },

    toggleConfirmTermsAndConditions: (state) => {
      state.confirmTermsAndConditions = !state.confirmTermsAndConditions;
    },
    setConfirmTermsAndConditions: (state) => {
      state.confirmTermsAndConditions = true;
    },

    toggleRememberMe: (state) => {
      state.rememberMe = !state.rememberMe;
    },

    setSendingOtpOption: (state, action) => {
      state.sendingOtpOption = action.payload;
    },

    setResetPasswordBy: (state, action) => {
      state.resetPasswordBy = action.payload;
    },

    setLoggedEmail: (state, action) => {
      state.loggedEmail = action.payload;
    },

    setLoggedPhone: (state, action) => {
      state.loggedPhone = action.payload;
    },

    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setPhone: (state, action) => {
      state.phone = action.payload;
    },

    setForgetPasswordId: (state, action) => {
      state.forgetPasswordId = action.payload;
    },

    resetLoginData: () => initialState,
  },
});

export const {
  submitForm,
  toggleConfirmTermsAndConditions,
  setConfirmTermsAndConditions,
  toggleRememberMe,
  setSendingOtpOption,
  setResetPasswordBy,
  setLoggedEmail,
  setLoggedPhone,
  setEmail,
  setPhone,
  setForgetPasswordId,
  resetLoginData,
} = loginFormSlice.actions;
export default loginFormSlice.reducer;
