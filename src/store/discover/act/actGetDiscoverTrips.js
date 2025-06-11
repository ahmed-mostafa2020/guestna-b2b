import { createAsyncThunk } from "@reduxjs/toolkit";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { getHeaders } from "@utils/getHeaders";

import axios from "axios";

// Create async thunk for fetching data
export const actGetDiscoverTrips = createAsyncThunk(
  "discover/actGetDiscoverTrips",
  async ({ page = 1, sortType, filter, locale }, { rejectWithValue }) => {
    const body = {
      perPage: CONSTANT_VALUES.PER_PAGE,
      page,
      sort: sortType,
      filter,
    };

    try {
      const headers = getHeaders(locale);

      const response = await axios({
        method: "POST",
        url: `${END_POINTS.TRIPS}${END_POINTS.ALL_TRIPS}`,
        data: body,
        headers,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);
