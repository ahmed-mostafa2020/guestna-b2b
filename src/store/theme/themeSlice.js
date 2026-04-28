import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTheme: "original", // 'original' or 'customized'
  colorPreferences: null,
  customLogo: null,
  logoSubtext: null,
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
    setLogoSubtext: (state, action) => {
      state.logoSubtext = action.payload;
    },
  },
});

export const { setTheme, setColorPreferences, setCustomLogo, setLogoSubtext } =
  themeSlice.actions;
export default themeSlice.reducer;
