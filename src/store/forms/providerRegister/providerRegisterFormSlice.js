import { createSlice } from "@reduxjs/toolkit";

const initialFormData = {
  name: { ar: "", en: "" },
  legalName: { ar: "", en: "" },
  about: { ar: "", en: "" },
  crNumber: "",
  taxNumber: "",
  businessType: "",
  services: [],
  email: "",
  phone: "",
  city: "",
  district: "",
  address: "",
  location: { lat: null, lng: null },
  businessHoursFrom: "",
  businessHoursTo: "",
};

const initialState = {
  formData: initialFormData,
  activeStep: 0,
  maxVisitedStep: 0,
  isSubmitted: false,
  isSuccess: false,
};

const providerRegisterFormSlice = createSlice({
  name: "providerRegisterForm",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },

    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },

    setMaxVisitedStep: (state, action) => {
      state.maxVisitedStep = Math.max(state.maxVisitedStep, action.payload);
    },

    submitForm: (state, action) => {
      state.formData = action.payload;
      state.isSubmitted = true;
      state.isSuccess = true;
    },

    setIsSuccess: (state, action) => {
      state.isSuccess = Boolean(action.payload);
    },

    resetForm: () => initialState,
  },
});

export const {
  updateField,
  updateFormData,
  setActiveStep,
  setMaxVisitedStep,
  submitForm,
  setIsSuccess,
  resetForm,
} = providerRegisterFormSlice.actions;

export default providerRegisterFormSlice.reducer;
