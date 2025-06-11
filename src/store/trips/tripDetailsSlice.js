import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  loading: "idle",
  error: null,
};

const tripDetailsDataSlice = createSlice({
  name: "tripDetails",
  initialState,
  reducers: {
    setTripDetailsData: (state, action) => {
      state.data = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setTripDetailsDataLoading: (state) => {
      state.loading = "loading";
    },
    setTripDetailsDataError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setTripDetailsData,
  setTripDetailsDataLoading,
  setTripDetailsDataError,
} = tripDetailsDataSlice.actions;
export default tripDetailsDataSlice.reducer;
