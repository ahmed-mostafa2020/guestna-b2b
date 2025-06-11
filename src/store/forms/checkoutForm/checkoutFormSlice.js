import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    name: "",
    email: "",
    mobile: "",
    isSMSupdates: false,
  },

  isSubmitted: false,
};

const checkoutFormSlice = createSlice({
  name: "checkoutForm",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },

    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    toggleCheckbox: (state) => {
      state.formData.isSMSupdates = !state.formData.isSMSupdates;
    },

    submitForm: (state, action) => {
      state.formData = action.payload;
      state.isSubmitted = true;
    },

    resetForm: () => initialState,
  },
});

export const {
  updateField,
  updateFormData,
  toggleCheckbox,
  submitForm,
  resetForm,
} = checkoutFormSlice.actions;
export default checkoutFormSlice.reducer;
