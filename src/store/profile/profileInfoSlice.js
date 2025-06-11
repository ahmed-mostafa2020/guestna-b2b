import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: "idle",
  error: null,
};

export const profileInfoSlice = createSlice({
  name: "profileInfo",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.data = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setProfileLoading: (state) => {
      state.loading = "loading";
    },
    setProfileError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
    setProfileImage: (state, action) => {
      // If data doesn't exist yet, create a basic structure
      if (!state.data) {
        state.data = { image: action.payload };
      } else {
        // Otherwise just update the image property
        state.data.image = action.payload;
      }
      state.loading = "succeeded";
      state.error = null;
    },

    updateProfileData: (state, action) => {
      // Update the profile data with the new information
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      } else {
        // If data doesn't exist yet, initialize it with the payload
        state.data = action.payload;
      }
      state.loading = "succeeded";
      state.error = null;
    },

    updateEmail: (state, action) => {
      if (state.data) {
        state.data = {
          ...state.data,
          email: action.payload.email,
        };
      } else {
        state.data = { email: action.payload.email };
      }
      state.loading = "succeeded";
      state.error = null;
    },

    clearProfile: (state) => {
      state.data = null;
    },
  },
});

export const {
  setProfile,
  setProfileLoading,
  setProfileError,
  setProfileImage,
  updateProfileData,
  updateEmail,
  clearProfile,
} = profileInfoSlice.actions;

export default profileInfoSlice.reducer;
