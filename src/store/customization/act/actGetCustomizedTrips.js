import { createAsyncThunk } from "@reduxjs/toolkit";

import { END_POINTS } from "@constants/APIs";

import axios from "axios";

// Create async thunk for fetching data
export const actGetCustomizedTrips = createAsyncThunk(
  "customization/actGetCustomizedTrips",
  async (
    {
      customTripReqType,
      targetAudiences = [],
      activity = {},
      services = {},
      bookingDay,
      locale,
    },
    { rejectWithValue, getState }
  ) => {
    const state = getState();
    const userId = state.customizationData.userId;
    const tripSlug = state.customizationData.info.custom?.slug;

    const body = {
      customTripReqType,
      targetAudiences,
      activity,
      services,
      bookingDay,
    };

    // Filter out empty values
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(([, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0; // Keep if array is not empty
        } else if (typeof value === "object" && value !== null) {
          return Object.keys(value).length > 0; // Keep if object is not empty
        } else {
          return value !== undefined && value !== null && value !== ""; // Keep if value is not empty
        }
      })
    );

    try {
      const response = await axios({
        method: "POST",
        url: `${END_POINTS.MAIN}${END_POINTS.CUSTOMIZATION_WITH_USERID}/${tripSlug}`,
        data: filteredBody,
        headers: {
          "Accept-Language": locale || "ar",
          devicespecificid: userId,
        },
      });
      return response.data;
    } catch (error) {
      // Check specifically for 409 status code
      if (error.response?.data?.statusCode === 409 || 405 || 404 || 400) {
        return rejectWithValue({
          ...error.response.data,
        });
      }
      return rejectWithValue(error.response.data);
    }
  }
);
