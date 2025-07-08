import { createSlice } from "@reduxjs/toolkit";

import { USERS } from "@constants/users";

const initialState = {
  userType: USERS.VISITOR,
  loading: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userType = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setUserLoading: (state) => {
      state.loading = "loading";
    },
    setUserError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },
  },
});

export const { setUser, setUserLoading, setUserError } = userSlice.actions;
export default userSlice.reducer;
