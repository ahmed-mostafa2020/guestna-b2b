import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  servicesResponse: {},

  meals: [],

  photography: null,
  translator: null,
  transportation: null,

  accommodation: [],

  loading: "idle",
  error: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.servicesResponse = action.payload;
      state.loading = "succeeded";
      state.error = null;
    },
    setServicesLoading: (state) => {
      state.loading = "loading";
    },
    setServicesError: (state, action) => {
      state.loading = "failed";
      state.error = action.payload;
    },

    // Handling meals

    // Add or increment
    addOrIncrementMeal: (state, action) => {
      const { mealId, price } = action.payload;
      const existingMeal = state.meals.find((meal) => meal.service === mealId);

      if (existingMeal) {
        existingMeal.quantity += 1;
        existingMeal.price = price;
      } else {
        state.meals.push({ service: mealId, quantity: 1, price: price });
      }
    },

    // Decrement meals
    decreaseMeal: (state, action) => {
      const mealId = action.payload;
      const existingMeal = state.meals.find((meal) => meal.service === mealId);

      if (existingMeal) {
        if (existingMeal.quantity > 1) {
          existingMeal.quantity -= 1;
        } else {
          // Remove the meal if quantity is 1
          state.meals = state.meals.filter((meal) => meal.service !== mealId);
        }
      }
    },

    // Set photography
    setPhotography: (state, action) => {
      const { serviceId, quantity, price } = action.payload;

      if (!serviceId || typeof quantity !== "number" || quantity <= 0) {
        console.warn("Invalid payload for photography:", action.payload);
        return;
      }

      state.photography = { serviceId, quantity, price };
    },

    // Set translator
    setTranslator: (state, action) => {
      const { serviceId, quantity, price } = action.payload;

      if (!serviceId || typeof quantity !== "number" || quantity <= 0) {
        console.warn("Invalid payload for translator:", action.payload);
        return;
      }

      state.translator = { serviceId, quantity, price };
    },

    // Set transportation
    setTransportation: (state, action) => {
      const { serviceId, quantity, price } = action.payload;

      if (!serviceId || typeof quantity !== "number" || quantity <= 0) {
        console.warn("Invalid payload for transportation:", action.payload);
        return;
      }

      state.transportation = { serviceId, quantity, price };
    },

    // Set accommodation
    setAccommodation: (state, action) => {
      const { serviceId, quantity, price, isChecked } = action.payload;

      if (!serviceId || typeof quantity !== "number" || quantity <= 0) {
        console.warn("Invalid payload for accommodation:", action.payload);
        return;
      }

      if (isChecked) {
        // Add the selection to the array if it doesn't exist
        const exists = state.accommodation.some(
          (item) => item.service === serviceId
        );
        if (!exists) {
          state.accommodation.push({ service: serviceId, quantity, price });
        } else {
          // Update the existing item if needed
          state.accommodation = state.accommodation.map((item) =>
            item.service === serviceId ? { ...item, quantity, price } : item
          );
        }
      } else {
        // Remove the selection from the array
        state.accommodation = state.accommodation.filter(
          (item) => item.service !== serviceId
        );
      }
    },
  },
});

export const {
  setServices,
  setServicesLoading,
  setServicesError,
  addOrIncrementMeal,
  decreaseMeal,
  setPhotography,
  setTranslator,
  setTransportation,
  setAccommodation,
} = servicesSlice.actions;
export default servicesSlice.reducer;
