import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTheme: "original", // 'original' or 'customized'
  colorPreferences: null,
  customThemeLabel: null
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

    setCustomThemeLabel: (state, action) => {
      state.customThemeLabel = action.payload;
    }
  },
});

export const { setTheme , setColorPreferences , setCustomThemeLabel } = themeSlice.actions;
export default themeSlice.reducer;
