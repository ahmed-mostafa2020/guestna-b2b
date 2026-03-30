"use client";

import { CONSTANT_VALUES } from "@constants/constantValues";

import Cookies from "js-cookie";

const setToken = (token, rememberMe = true) => {
  const expirationTime = rememberMe
    ? CONSTANT_VALUES.LONG_TIME_SAVING_TOKEN // 30 days
    : CONSTANT_VALUES.SHORT_TIME_SAVING_TOKEN; // 1 day

  Cookies.set(CONSTANT_VALUES.AUTH_TOKEN, token, {
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
    expires: expirationTime,
    path: "/",
  });
};

export default setToken;
