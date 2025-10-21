import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTheme: "original", // 'original' or 'customized'
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
