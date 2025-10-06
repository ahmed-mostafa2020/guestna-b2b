import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  isPaymentMethodsShown: false,
  loading: "idle",
  error: null,
};

const finalTripDetailsSlice = createSlice({
  name: "finalTripDetails",
  initialState,
  reducers: {
    setFinalTripDetailsData: (state, action) => {
      state.data = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setFinalTripDetailsDataLoading: (state) => {
      state.loading = "loading";
    },
    setFinalTripDetailsDataError: (state, action) => {
      state.loading = "failed";
      state.error = {
        message: action.payload?.message,
        name: action.payload?.name,
        // Extract only serializable properties
        code: action.payload?.code || null,
        status: action.payload?.response?.status || null,
      };
    },

    showPaymentMethods: (state) => {
      state.isPaymentMethodsShown = true;
    },
    hidePaymentMethods: (state) => {
      state.isPaymentMethodsShown = false;
    },
    clearFinalTripDetailsData: (state) => {
      state.data = {};
      state.isPaymentMethodsShown = false;
      state.loading = "idle";
      state.error = null;
    },
  },
});

export const {
  setFinalTripDetailsData,
  setFinalTripDetailsDataLoading,
  setFinalTripDetailsDataError,
  showPaymentMethods,
  hidePaymentMethods,
  clearFinalTripDetailsData,
} = finalTripDetailsSlice.actions;
export default finalTripDetailsSlice.reducer;
