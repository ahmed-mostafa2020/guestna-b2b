import { createSlice } from "@reduxjs/toolkit";
import actGetNavbarData from "./act/actGetNavbarData";

const initialState = {
  data: {},
  loading: "idle",
  error: null,
};

const navbarDataSlice = createSlice({
  name: "navbarData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actGetNavbarData.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(actGetNavbarData.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.data = action.payload;
      })
      .addCase(actGetNavbarData.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export default navbarDataSlice.reducer;
