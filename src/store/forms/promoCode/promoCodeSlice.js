import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promoCodeData: {},
};

const promoCodeSlice = createSlice({
  name: "promoCode",
  initialState,
  reducers: {
    setPromoCodeData: (state, action) => {
      state.promoCodeData = action.payload;
    },

    resetPromoCode: () => initialState,
  },
});

export const {
  setPromoCodeData,

  resetPromoCode,
} = promoCodeSlice.actions;
export default promoCodeSlice.reducer;
