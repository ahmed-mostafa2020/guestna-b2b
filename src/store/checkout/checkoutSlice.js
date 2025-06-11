import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tripId: null,
  tripSlug: null,
  tripDate: null,
  firstAvailableDate: null,
  firstDayDate: null,
  tripName: null,
  isCustomizable: false,

  tripGuests: {
    families: 0,
    couples: 0,
    olds: 0,
    adults: 0,
    individuals: 0,
    teenagers: 0,
    children: 0,
    babies: 0,
    male: 0,
    female: 0,
    employees: 0,
    disabled: 0,
  },

  loading: "idle",
  error: null,
};

const checkoutDataSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setTripId: (state, action) => {
      state.tripId = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setTripSlug: (state, action) => {
      state.tripSlug = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    // setTripDetailsDataLoading: (state) => {
    //   state.loading = "loading";
    // },
    // setTripDetailsDataError: (state, action) => {
    //   state.loading = "failed";
    //   state.error = action.payload;
    // },

    setTripDate: (state, action) => {
      state.tripDate = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },

    setFirstAvailableDate: (state, action) => {
      state.firstAvailableDate = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setFirstDayDate: (state, action) => {
      state.firstDayDate = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setTripName: (state, action) => {
      state.tripName = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setTripCustomization: (state, action) => {
      state.isCustomizable = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    // setTripDetailsDataLoading: (state) => {
    //   state.loading = "loading";
    // },
    // setTripDetailsDataError: (state, action) => {
    //   state.loading = "failed";
    //   state.error = action.payload;
    // },
    updateTripGuests: (state, action) => {
      const { type, count } = action.payload;
      state.tripGuests[type] = Math.max(0, count);
      state.loading = "succeeded";
      state.error = null;
    },

    clearTripGuests: (state) => {
      state.tripGuests = initialState.tripGuests;
    },
    setTripGuestsLoading: (state) => {
      state.loading = "loading";
    },
    setTripGuestsError: (state, action) => {
      state.loading = "failed";
      state.error = {
        message: action.payload.message,
        name: action.payload.name,
        // Extract only serializable properties
        code: action.payload.code || null,
        status: action.payload.response?.status || null,
      };
    },
  },
});

export const {
  setTripId,
  setTripSlug,
  setTripDate,
  setFirstAvailableDate,
  setFirstDayDate,
  setTripName,
  setTripCustomization,
  updateTripGuests,
  clearTripGuests,
  setTripGuestsLoading,
  setTripGuestsError,
} = checkoutDataSlice.actions;
export default checkoutDataSlice.reducer;
