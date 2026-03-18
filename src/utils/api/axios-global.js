import axios from "axios";
import { END_POINTS } from "@constants/APIs";
const API_BASE_URL = END_POINTS.TRIPS;

axios.defaults.baseURL = API_BASE_URL;
