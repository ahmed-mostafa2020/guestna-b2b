"use client";

import { useSelector } from "react-redux";

import LoginButton from "./LoginButton";
import ProfileDropdown from "./ProfileDropdown";

const AuthToggleButton = () => {
  const userToken = useSelector((state) => state.users.userToken);

  return userToken ? <ProfileDropdown /> : <LoginButton />;
};

export default AuthToggleButton;
