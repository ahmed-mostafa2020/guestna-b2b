import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],

  serverItems: [],
  loading: "idle",
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Reducer to add an item to favorites
    addToFavorites: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((i) => i === itemId);

      if (!existingItem) {
        state.items.push(itemId);
      }
    },

    removeFromFavorites: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item !== itemId);

      // server
      // state.serverItems = state.serverItems.filter(
      //   (trip) => trip._id !== action.payload
      // );
    },

    // Add a trip to serverItems
    addFavorite: (state, action) => {
      // Check if trip already exists to avoid duplicates
      const exists = state.serverItems.some(
        (trip) => trip._id === action.payload._id
      );
      if (!exists) {
        state.serverItems.push({ ...action.payload, isFavorite: true });
      }
    },
    // Remove a trip from favorites
    removeFavorite: (state, action) => {
      state.serverItems = state.serverItems.filter(
        (trip) => trip._id !== action.payload
      );
    },
    // Set all favorites (useful when initializing from API)
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,

  // serverItems
  addFavorite,
  removeFavorite,
  setFavorites,
} = favoritesSlice.actions;
export default favoritesSlice.reducer;
