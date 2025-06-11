"use client";

import Cookies from "js-cookie";
import { nanoid } from "nanoid";

const USER_ID_COOKIE = "user_id";
const COOKIE_MAX_AGE = 7; // 7 days

export function getUserId() {
  return Cookies.get(USER_ID_COOKIE);
}

export function createUserId() {
  const newUserId = nanoid();
  Cookies.set(USER_ID_COOKIE, newUserId, {
    expires: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return newUserId;
}

export function ensureUserId() {
  const existingUserId = getUserId();
  if (existingUserId) {
    return existingUserId;
  }
  return createUserId();
}
