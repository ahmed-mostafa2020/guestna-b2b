import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  page: 1,
  loading: "idle",
  error: null,
};

export const onboardingContractsSlice = createSlice({
  name: "onboardingContracts",
  initialState,
  reducers: {
    setOnboardingContracts: (state, action) => {
      state.data = action.payload?.data ?? action.payload ?? {};
      state.loading = "succeeded";
      state.error = null;
    },
    setOnboardingContractsLoading: (state) => {
      state.loading = "loading";
    },
    setOnboardingContractsError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
    setOnboardingContractsPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  setOnboardingContracts,
  setOnboardingContractsLoading,
  setOnboardingContractsError,
  setOnboardingContractsPage,
} = onboardingContractsSlice.actions;

export default onboardingContractsSlice.reducer;
