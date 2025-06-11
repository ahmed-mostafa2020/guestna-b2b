import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  faq: [],
  loading: "idle",
  error: null,
};

export const faqSlice = createSlice({
  name: "faqData",
  initialState,
  reducers: {
    setFaq: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length === 0) {
        return initialState;
      }
      state.faq = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setFaqLoading: (state) => {
      state.loading = "loading";
    },
    setFaqError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
    clearFaq: () => initialState,
  },
});

export const { setFaq, setFaqLoading, setFaqError, clearFaq } =
  faqSlice.actions;

export default faqSlice.reducer;
