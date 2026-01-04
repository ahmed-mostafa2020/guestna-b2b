import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Array of selected organization IDs (always contains IDs when organizations are loaded)
  selectedIds: [],
  // All organizations data from API
  organizations: [],
  // Flag to indicate if all organizations are selected
  allSelected: true,
  // Loading state
  loading: "idle",
  error: null,
};

export const selectedOrganizationsSlice = createSlice({
  name: "selectedOrganizations",
  initialState,
  reducers: {
    setOrganizations: (state, action) => {
      state.organizations = action.payload;
      // If allSelected is true or no IDs selected yet, select all organization IDs
      if (state.allSelected || state.selectedIds.length === 0) {
        state.selectedIds = action.payload.map((org) => org._id);
        state.allSelected = true;
      }
      state.loading = "succeeded";
      state.error = null;
    },
    setSelectedOrganizations: (state, action) => {
      state.selectedIds = action.payload;
      // Check if all are selected
      state.allSelected = action.payload.length === state.organizations.length;
    },
    toggleOrganization: (state, action) => {
      const orgId = action.payload;
      const index = state.selectedIds.indexOf(orgId);
      if (index === -1) {
        // Add organization
        state.selectedIds.push(orgId);
      } else {
        // Remove organization (but keep at least one)
        if (state.selectedIds.length > 1) {
          state.selectedIds.splice(index, 1);
        }
      }
      // Update allSelected flag
      state.allSelected =
        state.selectedIds.length === state.organizations.length;
    },
    selectAllOrganizations: (state) => {
      // Select all organization IDs
      state.selectedIds = state.organizations.map((org) => org._id);
      state.allSelected = true;
    },
    clearSelectedOrganizations: (state) => {
      state.selectedIds = [];
      state.organizations = [];
    },
    setOrganizationsLoading: (state) => {
      state.loading = "loading";
    },
    setOrganizationsError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  setOrganizations,
  setSelectedOrganizations,
  toggleOrganization,
  selectAllOrganizations,
  clearSelectedOrganizations,
  setOrganizationsLoading,
  setOrganizationsError,
} = selectedOrganizationsSlice.actions;

export default selectedOrganizationsSlice.reducer;
