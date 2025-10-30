import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTheme: "original", // 'original' or 'customized'
  colorPreferences: null,
  customLogo: null,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    setColorPreferences: (state, action) => {
      state.colorPreferences = action.payload;
    },

    setCustomLogo: (state, action) => {
      state.customLogo = action.payload;
    },
  },
});

export const { setTheme, setColorPreferences, setCustomLogo } =
  themeSlice.actions;
export default themeSlice.reducer;
