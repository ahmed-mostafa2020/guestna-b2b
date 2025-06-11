import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signUpData: {
    confirmTermsAndConditions: true,
    isMarketingEmails: false,
  },
  isSubmitted: false,
};

const signUpFormSlice = createSlice({
  name: "signUpForm",
  initialState,
  reducers: {
    toggleCheckbox: (state, action) => {
      const type = action.payload;
      if (type === "confirmTermsAndConditions") {
        state.signUpData.confirmTermsAndConditions =
          !state.signUpData.confirmTermsAndConditions;
      } else {
        state.signUpData.isMarketingEmails =
          !state.signUpData.isMarketingEmails;
      }
    },

    submitForm: (state, action) => {
      state.signUpData = {
        ...state.signUpData, // Keep existing values
        ...action.payload, // Override only fields present in payload
      };
      state.isSubmitted = true;
    },

    resetSignUpData: () => initialState,
  },
});

export const { toggleCheckbox, submitForm, resetSignUpData } =
  signUpFormSlice.actions;
export default signUpFormSlice.reducer;
