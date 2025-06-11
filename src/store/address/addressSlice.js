import { createSlice } from "@reduxjs/toolkit";

import actGetCountriesAndNationalities from "./act/actGetCountriesAndNationalities";
import actGetCities from "./act/actGetCities";

const initialState = {
  list: [],
  cities: [],
  loading: "idle",
  error: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // Countries and nationalities
      .addCase(actGetCountriesAndNationalities.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(actGetCountriesAndNationalities.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.list = action.payload;
      })
      .addCase(actGetCountriesAndNationalities.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })

      // Cities
      .addCase(actGetCities.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(actGetCities.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.cities = action.payload;
      })
      .addCase(actGetCities.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

export default addressSlice.reducer;
