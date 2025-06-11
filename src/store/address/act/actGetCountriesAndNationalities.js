import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosErrorHandler from "@utils/axiosErrorHandler";
import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";

import axios from "axios";
import Cookies from "js-cookie";

const actGetCountriesAndNationalities = createAsyncThunk(
  "address/actGetCountriesAndNationalities",
  async (locale, thunkAPI) => {
    const { rejectWithValue, signal } = thunkAPI;

    try {
      const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

      const response = await axios.get(
        `${END_POINTS.MAIN}${END_POINTS.ADDRESS.COUNTRIES_AND_NATIONALITIES}`,
        {
          signal,
          headers: {
            locale: locale,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
