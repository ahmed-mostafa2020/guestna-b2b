import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  parentData: {},
  isSubmitted: false,

  // loggedEmail: null,
  // loggedPhone: null,

  // Forget password data
  // resetPasswordBy: "email",
  // email: null,
  // phone: null,
  // forgetPasswordId: null,
};

const parentLoginFormSlice = createSlice({
  name: "parentLoginForm",
  initialState,
  reducers: {
    submitParentData: (state, action) => {
      state.parentData = action.payload;
      state.isSubmitted = true;
    },

    // setSendingOtpOption: (state, action) => {
    //   state.sendingOtpOption = action.payload;
    // },

    // setResetPasswordBy: (state, action) => {
    //   state.resetPasswordBy = action.payload;
    // },

    // setLoggedEmail: (state, action) => {
    //   state.loggedEmail = action.payload;
    // },

    // setLoggedPhone: (state, action) => {
    //   state.loggedPhone = action.payload;
    // },

    // setEmail: (state, action) => {
    //   state.email = action.payload;
    // },

    // setPhone: (state, action) => {
    //   state.phone = action.payload;
    // },

    // setForgetPasswordId: (state, action) => {
    //   state.forgetPasswordId = action.payload;
    // },

    resetLoginData: () => initialState,
  },
});

export const {
  submitParentData,
  // setSendingOtpOption,
  // setResetPasswordBy,
  // setLoggedEmail,
  // setLoggedPhone,
  // setEmail,
  // setPhone,
  // setForgetPasswordId,
  resetLoginData,
} = parentLoginFormSlice.actions;
export default parentLoginFormSlice.reducer;
