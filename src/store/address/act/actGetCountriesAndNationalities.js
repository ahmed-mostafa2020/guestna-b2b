import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosErrorHandler from "@utils/api/axiosErrorHandler";
import { END_POINTS } from "@constants/APIs";

import axios from "axios";

const actGetCountriesAndNationalities = createAsyncThunk(
  "address/actGetCountriesAndNationalities",
  async (headers, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;

    try {
      const response = await axios.get(
        `${END_POINTS.MAIN}${END_POINTS.ADDRESS.COUNTRIES_AND_NATIONALITIES}`,
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

export default actGetCountriesAndNationalities;
