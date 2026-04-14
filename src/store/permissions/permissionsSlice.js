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
      state.elements = action.payload.ELEMENT || [];
      state.menuItems = action.payload.MENU_ITEM || [];
      state.pages = action.payload.PAGE || [];
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
