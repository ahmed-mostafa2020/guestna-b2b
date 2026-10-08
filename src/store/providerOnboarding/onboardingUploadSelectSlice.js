import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  options: [],
  loading: "idle",
  error: null,
};

export const onboardingUploadSelectSlice = createSlice({
  name: "onboardingUploadSelect",
  initialState,
  reducers: {
    setOnboardingUploadSelect: (state, action) => {
      const payload = action.payload?.data ?? action.payload ?? [];
      state.options = Array.isArray(payload) ? payload : [];
      state.loading = "succeeded";
      state.error = null;
    },
    setOnboardingUploadSelectLoading: (state) => {
      state.loading = "loading";
    },
    setOnboardingUploadSelectError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setOnboardingUploadSelect,
  setOnboardingUploadSelectLoading,
  setOnboardingUploadSelectError,
} = onboardingUploadSelectSlice.actions;

export default onboardingUploadSelectSlice.reducer;
