import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {},
  loading: "idle",
  error: null,
};

const homeDataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setHomeData: (state, action) => {
      state.items = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setHomeDataLoading: (state) => {
      state.loading = "loading";
    },
    setHomeDataError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
  },
});

export const { setHomeData, setHomeDataLoading, setHomeDataError } =
  homeDataSlice.actions;
export default homeDataSlice.reducer;
