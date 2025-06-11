import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sideFilters: {},
  loading: "idle",
  error: null,
};

const discoverSideFiltersSlice = createSlice({
  name: "discoverSideFilters",
  initialState,
  reducers: {
    setDiscoverSideFiltersData: (state, action) => {
      state.loading = "succeeded";
      state.error = null;
      state.sideFilters = action.payload;
    },
    setDiscoverSideFiltersDataLoading: (state) => {
      state.loading = "loading";
    },
    setDiscoverSideFiltersDataError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setDiscoverSideFiltersData,
  setDiscoverSideFiltersDataLoading,
  setDiscoverSideFiltersDataError,
} = discoverSideFiltersSlice.actions;
export default discoverSideFiltersSlice.reducer;
