import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  actions: [],
  menuItems: [],
};

const permissionsSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state, action) => {
      state.actions = action.payload.ACTION || [];
      state.menuItems = action.payload.MENU_ITEM || [];
    },
    clearPermissions: (state) => {
      state.actions = [];
      state.menuItems = [];
    },
  },
});

export const { setPermissions, clearPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
