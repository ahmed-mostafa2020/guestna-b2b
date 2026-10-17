import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: "idle",
  error: null,
};

export const onboardingStatusSlice = createSlice({
  name: "onboardingStatus",
  initialState,
  reducers: {
    setOnboardingStatus: (state, action) => {
      state.data = action.payload?.data ?? action.payload ?? null;
      state.loading = "succeeded";
      state.error = null;
    },
    setOnboardingStatusLoading: (state) => {
      state.loading = "loading";
    },
    setOnboardingStatusError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setOnboardingStatus,
  setOnboardingStatusLoading,
  setOnboardingStatusError,
} = onboardingStatusSlice.actions;

export default onboardingStatusSlice.reducer;
