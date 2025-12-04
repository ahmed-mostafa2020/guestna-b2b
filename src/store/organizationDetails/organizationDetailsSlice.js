import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organizationId: null,
  details: null,
  loading: "idle",
  error: null,
};

const organizationDetailsSlice = createSlice({
  name: "organizationDetails",
  initialState,
  reducers: {
    setOrganizationId: (state, action) => {
      state.organizationId = action.payload;
    },

    setOrganizationDetails: (state, action) => {
      state.details = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },

    setOrganizationDetailsError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },

    setOrganizationDetailsLoading: (state) => {
      state.loading = "loading";
    },
  },
});

export const {
  setOrganizationDetails,
  setOrganizationDetailsError,
  setOrganizationDetailsLoading,
  setOrganizationId,
} = organizationDetailsSlice.actions;
export default organizationDetailsSlice.reducer;
