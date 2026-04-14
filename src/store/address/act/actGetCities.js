import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosErrorHandler from "@utils/api/axiosErrorHandler";
import { END_POINTS } from "@constants/APIs";

import axios from "axios";

const actGetCities = createAsyncThunk(
  "address/actGetCities",
  async ({ countryId, headers }, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;

    try {
      const response = await axios.get(
        `${END_POINTS.MAIN}${END_POINTS.ADDRESS.CITIES}/${countryId}`,
        {
          signal,
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return rejectWithValue("Request was cancelled");
      }
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetCities;
