import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cities: [],
  services: [],
  lang: null,
  loading: "idle",
  error: null,
};

const providerRegisterSelectionsSlice = createSlice({
  name: "providerRegisterSelections",
  initialState,
  reducers: {
    setProviderRegisterSelections: (state, action) => {
      const payload = action.payload?.data || action.payload || {};
      state.cities = Array.isArray(payload.cities) ? payload.cities : [];
      state.services = Array.isArray(payload.services) ? payload.services : [];
      if (payload.lang) state.lang = payload.lang;
      state.loading = "succeeded";
      state.error = null;
    },
    setProviderRegisterSelectionsLoading: (state) => {
      state.loading = "loading";
    },
    setProviderRegisterSelectionsError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
    clearProviderRegisterSelections: () => initialState,
  },
});

export const {
  setProviderRegisterSelections,
  setProviderRegisterSelectionsLoading,
  setProviderRegisterSelectionsError,
  clearProviderRegisterSelections,
} = providerRegisterSelectionsSlice.actions;

export default providerRegisterSelectionsSlice.reducer;
