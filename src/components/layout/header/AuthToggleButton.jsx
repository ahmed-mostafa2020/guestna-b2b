"use client";

import { useSelector } from "react-redux";

import { USERS } from "@constants/users";
import LoginButton from "./LoginButton";
import ProfileDropdown from "./ProfileDropdown";

const AuthToggleButton = () => {
  const userToken = useSelector((state) => state.users.userToken);
  const userType = useSelector((state) => state.users.userType);

  return userToken &&
    userType !== USERS.B2B_PARENT &&
    userType !== USERS.VISITOR ? (
    <ProfileDropdown />
  ) : (
    <LoginButton />
  );
};

export default AuthToggleButton;
