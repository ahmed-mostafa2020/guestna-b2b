import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  page: 1,
  loading: "idle",
  error: null,
};

export const onboardingDocumentsSlice = createSlice({
  name: "onboardingDocuments",
  initialState,
  reducers: {
    setOnboardingDocuments: (state, action) => {
      state.data = action.payload?.data ?? action.payload ?? {};
      state.loading = "succeeded";
      state.error = null;
    },
    setOnboardingDocumentsLoading: (state) => {
      state.loading = "loading";
    },
    setOnboardingDocumentsError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
    setOnboardingDocumentsPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  setOnboardingDocuments,
  setOnboardingDocumentsLoading,
  setOnboardingDocumentsError,
  setOnboardingDocumentsPage,
} = onboardingDocumentsSlice.actions;

export default onboardingDocumentsSlice.reducer;
