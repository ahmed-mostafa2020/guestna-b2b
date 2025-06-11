import { createSlice } from "@reduxjs/toolkit";

import { actGetCustomizedTrips } from "./act/actGetCustomizedTrips";

const initialState = {
  info: {},
  userId: null,
  selectedActivityDay: null,
  selectedActivityId: null,
  selectedActivityStartTime: null,
  selectedActivityEndTime: null,
  activityDayNumber: 1,

  activityData: null,
  loading: "idle",
  error: null,
};

const customizationDataSlice = createSlice({
  name: "customization",
  initialState,
  reducers: {
    setCustomizationData: (state, action) => {
      state.info = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setCustomizationDataLoading: (state) => {
      state.loading = "loading";
    },
    setCustomizationDataError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },

    setUserId: (state, action) => {
      state.userId = action.payload;
    },

    // Set activity selected day
    setActivityDay: (state, action) => {
      state.selectedActivityDay = action.payload;
    },

    // Set activity selected id
    setActivityId: (state, action) => {
      state.selectedActivityId = action.payload;
    },

    resetActivityDay: (state) => {
      state.selectedActivityDay = null;
    },

    // Handle activity time range
    setActivityTimeRange: (state, action) => {
      const { from, to } = action.payload;
      state.selectedActivityStartTime = from;
      state.selectedActivityEndTime = to;
    },
    resetActivityTimeRange: (state) => {
      state.selectedActivityStartTime = null;
      state.selectedActivityEndTime = null;
    },

    // Handle activity day number
    setActivityDayNumber: (state, action) => {
      state.activityDayNumber = action.payload;
    },
    resetActivityTimeRange: (state) => {
      state.selectedActivityStartTime = null;
      state.selectedActivityEndTime = null;
    },

    // Set all activity data
    setActivityData: (state, action) => {
      state.activityData = action.payload;
    },

    // Reset error
    resetError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actGetCustomizedTrips.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(actGetCustomizedTrips.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.info = action.payload;
      })
      .addCase(actGetCustomizedTrips.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setCustomizationData,
  setCustomizationDataLoading,
  setCustomizationDataError,
  setUserId,
  setActivityDay,
  setActivityId,
  resetActivityDay,
  setActivityTimeRange,
  resetActivityTimeRange,
  setActivityDayNumber,
  setActivityData,
  resetError,
} = customizationDataSlice.actions;
export default customizationDataSlice.reducer;
