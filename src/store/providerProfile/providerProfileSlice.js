import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: "idle",
  error: null,
};

export const providerProfileSlice = createSlice({
  name: "providerProfile",
  initialState,
  reducers: {
    setProviderProfile: (state, action) => {
      state.data = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setProviderProfileLoading: (state) => {
      state.loading = "loading";
    },
    setProviderProfileError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
    setProviderProfileImage: (state, action) => {
      if (!state.data) {
        state.data = { image: action.payload };
      } else {
        state.data.image = action.payload;
      }
      state.loading = "succeeded";
      state.error = null;
    },
    updateProviderProfileData: (state, action) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      } else {
        state.data = action.payload;
      }
      state.loading = "succeeded";
      state.error = null;
    },
    clearProviderProfile: (state) => {
      state.data = null;
      state.loading = "idle";
      state.error = null;
    },
  },
});

export const {
  setProviderProfile,
  setProviderProfileLoading,
  setProviderProfileError,
  setProviderProfileImage,
  updateProviderProfileData,
  clearProviderProfile,
} = providerProfileSlice.actions;

export default providerProfileSlice.reducer;
