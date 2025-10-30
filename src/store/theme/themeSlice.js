import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTheme: "original", // 'original' or 'customized'
  colorPreferences: null,
  customLogo: null
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
      // Apply the theme immediately
          const root = document.documentElement;

          if (state.currentTheme === "customized" && state.colorPreferences) {
            // Apply customized theme colors
            root.style.setProperty("--color-main", state.colorPreferences.color_main);
            root.style.setProperty(
              "--color-secondary",
              state.colorPreferences.color_secondary
            );
            root.style.setProperty(
              "--color-title",
              state.colorPreferences.color_title
            );
            root.style.setProperty(
              "--color-text-dark",
              state.colorPreferences.color_text_dark
            );
            root.style.setProperty(
              "--color-text-light",
              state.colorPreferences.color_text_light
            );
            root.style.setProperty(
              "--color-bg-home",
              state.colorPreferences.color_bg_home
            );
            root.style.setProperty(
              "--color-bg-package-details",
              state.colorPreferences.color_bg_package_details
            );
            root.style.setProperty(
              "--color-buttons-hover",
              state.colorPreferences.color_buttons_hover
            );
            root.style.setProperty(
              "--color-badge",
              state.colorPreferences.color_badge
            );
            root.style.setProperty(
              "--color-error",
              state.colorPreferences.color_error
            );
            root.style.setProperty(
              "--color-success",
              state.colorPreferences.color_success
            );
            root.style.setProperty(
              "--color-border",
              state.colorPreferences.color_border
            );
            root.style.setProperty(
              "--color-footer-link",
              state.colorPreferences.color_footer_link
            );
          } else {
            // Apply original theme colors
            root.style.setProperty("--color-main", "#007473");
            root.style.setProperty("--color-secondary", "#F09814");
            root.style.setProperty("--color-title", "#008F8F");
            root.style.setProperty("--color-text-dark", "#1F2626");
            root.style.setProperty("--color-text-light", "#737373");
            root.style.setProperty("--color-bg-home", "#eeeeee");
            root.style.setProperty("--color-bg-package-details", "#F3F3F3");
            root.style.setProperty("--color-buttons-hover", "#E1F5F5");
            root.style.setProperty("--color-badge", "#1858A5");
            root.style.setProperty("--color-error", "#bf0000");
            root.style.setProperty("--color-success", "#5cb85c");
            root.style.setProperty("--color-border", "#ECECEC");
            root.style.setProperty("--color-footer-link", "#00000099");
          }
        
    },
    setColorPreferences: (state, action) => {
      state.colorPreferences = action.payload;
    },

    setCustomLogo: (state, action) => {
      state.customLogo = action.payload;
    }
  },
});

export const { setTheme , setColorPreferences , setCustomLogo } = themeSlice.actions;
export default themeSlice.reducer;
