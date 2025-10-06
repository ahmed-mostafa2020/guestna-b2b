import { createSlice } from "@reduxjs/toolkit";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { SORTING_TYPE } from "@constants/sorting";
import { actGetDiscoverTrips } from "./act/actGetDiscoverTrips";

const initialState = {
  trips: {},
  sortBy: SORTING_TYPE.NEWEST,
  searchTerm: "",
  currentPage: 1,
  lastPage: 0,
  totalItems: 0,
  loading: "idle",
  error: null,
};

const discoverSlice = createSlice({
  name: "discover",
  initialState,
  reducers: {
    setDiscoverData: (state, action) => {
      state.loading = "succeeded";
      state.error = null;
      state.trips = action.payload;
      
      // Handle both old and new pageInfo structures
      const pageInfo = action.payload.pageInfo || {};
      const total = pageInfo.total || 0;
      const perPage = pageInfo.perPage || CONSTANT_VALUES.PER_PAGE;
      
      state.lastPage = Math.ceil(total / perPage);
      state.totalItems = total;
    },

    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },

    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },

    cleanDiscoverTrips: (state) => {
      state.trips = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetDiscoverTrips.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(actGetDiscoverTrips.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.trips = action.payload;
        
        // Handle both old and new pageInfo structures
        const pageInfo = action.payload.pageInfo || {};
        const total = pageInfo.total || 0;
        const perPage = pageInfo.perPage || CONSTANT_VALUES.PER_PAGE;
        
        state.lastPage = Math.ceil(total / perPage);
        state.totalItems = total;
        // state.currentPage = action.payload.pageInfo.currentPage;
      })
      .addCase(actGetDiscoverTrips.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setDiscoverData,
  setSearchTerm,
  setSortBy,
  setCurrentPage,
  cleanDiscoverTrips,
} = discoverSlice.actions;
export default discoverSlice.reducer;
