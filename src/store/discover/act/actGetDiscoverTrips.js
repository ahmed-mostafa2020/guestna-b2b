import { createAsyncThunk } from "@reduxjs/toolkit";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";

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
        url: getProxyUrl(B2B_END_POINTS.DISCOVER),
        data: body,
        headers,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
