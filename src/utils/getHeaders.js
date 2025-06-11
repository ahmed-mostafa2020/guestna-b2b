import { CONSTANT_VALUES } from "@constants/constantValues";

import Cookies from "js-cookie";
export const getHeaders = (locale) => {
  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  // const userId = Cookies.get(CONSTANT_VALUES.USER_ID);

  return {
    lang: locale || "ar",
    "Content-Type": "application/json",
    ...(token && { authorization: `Bearer ${token}` }),
    // ...(userId && { devicespecificid: userId }),
  };
};
