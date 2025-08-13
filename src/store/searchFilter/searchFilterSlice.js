import { createSlice } from "@reduxjs/toolkit";

import { CONSTANT_VALUES } from "@constants/constantValues";

// Initial state
const initialState = {
  tripsType: null,
  allTripsTypes: [],
  guests: {
    families: 0,
    couples: 0,
    olds: 0,
    adults: 0,
    individuals: 0,
    teenagers: 0,
    children: 0,
    babies: 0,
    male: 0,
    female: 0,
    employees: 0,
    disabled: 0,
  },
  cities: [],
  budgetRange: {
    min: CONSTANT_VALUES.MIN_BUDGET,
    max: CONSTANT_VALUES.MAX_BUDGET,
  },
  checkInDate: {
    day: null,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  checkOutDate: {
    day: null,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  activityDayDate: {
    day: null,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },

  categories: [],
  languages: [],
  rate: null,

  otherFilters: {},

  // B2B
  tripDuration: [],
  tripType: [],
  academicStage: [],
};

const searchFilterSlice = createSlice({
  name: "searchFilter",
  initialState,
  reducers: {
    // Trips Type
    switchTripsType: (state, action) => {
      state.tripsType = action.payload;
    },

    // Update guests count
    updateGuestCount: (state, action) => {
      const { type, count } = action.payload;
      state.guests[type] = Math.max(0, count);
    },

    // Toggle guests count
    toggleGuestCount: (state, action) => {
      const type = action.payload;
      state.guests[type] = state.guests[type] === 0 ? 1 : 0;
    },

    // City selection adding
    addCity: (state, action) => {
      const cityId = action.payload;
      const cityIndex = state.cities.indexOf(cityId);
      if (cityIndex === -1) {
        state.cities.push(cityId);
      } else {
        return;
      }
    },
    // City selection toggle
    toggleCity: (state, action) => {
      const cityId = action.payload;
      const cityIndex = state.cities.indexOf(cityId);
      if (cityIndex === -1) {
        state.cities.push(cityId);
      } else {
        state.cities.splice(cityIndex, 1);
      }
    },

    // Budget range update
    updateBudgetRange: (state, action) => {
      state.budgetRange = {
        min: action.payload[0],
        max: action.payload[1],
      };
    },

    // Check-in Date Update
    updateCheckInDate: (state, action) => {
      const { day, month, year } = action.payload;
      state.checkInDate = { day, month, year };
    },

    navigateMonthCheckIn: (state, action) => {
      const { direction } = action.payload;

      if (direction === "prev") {
        state.checkInDate.month--; // Decrement month
        if (state.checkInDate.month < 0) {
          // Changed from 1 to 0
          state.checkInDate.year--; // Go to previous year
          state.checkInDate.month = 11; // Set month to December (11)
        }
      } else if (direction === "next") {
        state.checkInDate.month++; // Increment month
        if (state.checkInDate.month > 11) {
          state.checkInDate.month = 0; // Reset to January (0)
          state.checkInDate.year++; // Increment year
        }
      }

      // Reset selected day when changing month
      state.checkInDate.day = null;

      // Optional: Handle cases where year goes below a certain value (e.g., 1900)
      if (state.checkInDate.year < 1900) {
        state.checkInDate.year = 1900; // Prevent going to a year before 1900
      }
    },

    // Check-out Date Update
    updateCheckOutDate: (state, action) => {
      const { day, month, year } = action.payload;
      state.checkOutDate = { day, month, year };
    },
    // Month Navigation
    navigateMonthCheckOut: (state, action) => {
      const { direction } = action.payload;

      if (direction === "prev") {
        state.checkOutDate.month--; // Decrement month
        if (state.checkOutDate.month < 0) {
          // Changed from 1 to 0
          state.checkOutDate.year--; // Go to previous year
          state.checkOutDate.month = 11; // Set month to December (11)
        }
      } else if (direction === "next") {
        state.checkOutDate.month++; // Increment month
        if (state.checkOutDate.month > 11) {
          state.checkOutDate.month = 0; // Reset to January (0)
          state.checkOutDate.year++; // Increment year
        }
      }

      state.checkOutDate.day = null;
    },

    resetCheckOutDate: (state) => {
      state.checkOutDate = initialState.checkOutDate;
    },

    // Activity Day Date Update
    updateActivityDayDate: (state, action) => {
      const { day, month, year } = action.payload;
      state.activityDayDate = { day, month, year };
    },
    // Month Navigation
    navigateMonthActivityDay: (state, action) => {
      const { direction } = action.payload;

      if (direction === "prev") {
        state.activityDayDate.month--;
        if (state.activityDayDate.month < 0) {
          state.activityDayDate.year--;
          state.activityDayDate.month = 11; // December
        }
      } else if (direction === "next") {
        state.activityDayDate.month++;
        if (state.activityDayDate.month > 11) {
          state.activityDayDate.year++;
          state.activityDayDate.month = 0; // January
        }
      }

      state.activityDayDate.day = null;
    },

    resetActivityDayDate: (state) => {
      state.activityDayDate = initialState.activityDayDate;
    },

    // Set guestna trips selection
    setTripsTypes: (state, action) => {
      const tripType = action.payload;
      const tripTypeIndex = state.allTripsTypes.indexOf(tripType);
      if (tripTypeIndex === -1) {
        state.allTripsTypes.push(tripType);
      }
    },

    // Toggle guestna trips selection
    toggleTripsTypes: (state, action) => {
      const tripType = action.payload;
      const tripTypeIndex = state.allTripsTypes.indexOf(tripType);
      if (tripTypeIndex === -1) {
        state.allTripsTypes.push(tripType);
      } else {
        state.allTripsTypes.splice(tripTypeIndex, 1);
      }
    },

    // Category selection adding
    addCategory: (state, action) => {
      const categoryId = action.payload;
      const categoryIndex = state.categories.indexOf(categoryId);
      if (categoryIndex === -1) {
        state.categories.push(categoryId);
      } else {
        return;
      }
    },
    // Category selection toggle
    toggleCategory: (state, action) => {
      const categoryId = action.payload;
      const categoryIndex = state.categories.indexOf(categoryId);
      if (categoryIndex === -1) {
        state.categories.push(categoryId);
      } else {
        state.categories.splice(categoryIndex, 1);
      }
    },

    // Language selection adding
    addLanguage: (state, action) => {
      const languageId = action.payload;
      const languageIndex = state.languages.indexOf(languageId);
      if (languageIndex === -1) {
        state.languages.push(languageId);
      } else {
        return;
      }
    },
    // Language selection toggle
    toggleLanguage: (state, action) => {
      const languageId = action.payload;
      const languageIndex = state.languages.indexOf(languageId);
      if (languageIndex === -1) {
        state.languages.push(languageId);
      } else {
        state.languages.splice(languageIndex, 1);
      }
    },

    // Set rate
    setRate: (state, action) => {
      state.rate = action.payload;
    },

    // Generic filter update
    updateFilter: (state, action) => {
      const { key, value } = action.payload;
      state.otherFilters[key] = value;
    },

    clearCheckInDate: (state) => {
      state.checkInDate = initialState.checkInDate;
    },
    clearCheckOutDate: (state) => {
      state.checkOutDate = initialState.checkOutDate;
    },

    clearActivityDayDate: (state) => {
      state.activityDayDate = initialState.activityDayDate;
    },

    // Reset all filters
    resetFilters: () => initialState,

    // B2B
    // Add tripDuration
    addTripDuration: (state, action) => {
      const tripDurationId = action.payload;
      const tripDurationIndex = state.tripDuration.indexOf(tripDurationId);
      if (tripDurationIndex === -1) {
        state.tripDuration.push(tripDurationId);
      } else {
        return;
      }
    },

    // Trip duration selection toggle
    toggleTripDuration: (state, action) => {
      const tripDuration_id = action.payload;
      const tripDurationIndex = state.tripDuration.indexOf(tripDuration_id);
      if (tripDurationIndex === -1) {
        state.tripDuration.push(tripDuration_id);
      } else {
        state.tripDuration.splice(tripDurationIndex, 1);
      }
    },

    // Add Trip type
    addTripType: (state, action) => {
      const tripTypeId = action.payload;
      const tripTypeIndex = state.tripType.indexOf(tripTypeId);
      if (tripTypeIndex === -1) {
        state.tripType.push(tripTypeId);
      } else {
        return;
      }
    },

    // Trip type selection toggle
    toggleTripType: (state, action) => {
      const tripTypeId = action.payload;
      const tripTypeIndex = state.tripType.indexOf(tripTypeId);
      if (tripTypeIndex === -1) {
        state.tripType.push(tripTypeId);
      } else {
        state.tripType.splice(tripTypeIndex, 1);
      }
    },

    // academic stage selection toggle
    // Add academic stage
    addAcademicStage: (state, action) => {
      const academicStageId = action.payload;
      const academicStageIndex = state.academicStage.indexOf(academicStageId);
      if (academicStageIndex === -1) {
        state.academicStage.push(academicStageId);
      } else {
        return;
      }
    },

    toggleAcademicStage: (state, action) => {
      const academicStageId = action.payload;
      const academicStageIndex = state.academicStage.indexOf(academicStageId);
      if (academicStageIndex === -1) {
        state.academicStage.push(academicStageId);
      } else {
        state.academicStage.splice(academicStageIndex, 1);
      }
    },
  },
});

export const {
  switchTripsType,
  setTripsTypes,
  toggleTripsTypes,
  updateGuestCount,
  toggleGuestCount,
  addCity,
  toggleCity,
  updateBudgetRange,
  updateCheckInDate,
  updateCheckOutDate,
  updateActivityDayDate,
  navigateMonthCheckIn,
  navigateMonthCheckOut,
  navigateMonthActivityDay,
  resetCheckInDate,
  resetCheckOutDate,
  resetActivityDayDate,
  addCategory,
  toggleCategory,
  addLanguage,
  toggleLanguage,
  setRate,
  updateFilter,
  clearCheckInDate,
  clearCheckOutDate,
  clearActivityDayDate,
  resetFilters,

  // B2B
  addTripDuration,
  toggleTripDuration,
  addTripType,
  toggleTripType,
  addAcademicStage,
  toggleAcademicStage,
} = searchFilterSlice.actions;

export default searchFilterSlice.reducer;
