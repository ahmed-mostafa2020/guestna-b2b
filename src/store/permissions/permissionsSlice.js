import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  elements: [],
  menuItems: [],
  pages: [],
  isLoaded: false,
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state, action) => {
      const payload = action.payload || {};
      state.elements = payload.ELEMENT || [];
      state.menuItems = payload.MENU_ITEM || [];
      state.pages = payload.PAGE || [];
      state.isLoaded = true;
    },
    clearPermissions: (state) => {
      state.elements = [];
      state.menuItems = [];
      state.pages = [];
      state.isLoaded = false;
    },
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
