"use client";

import { useSelector } from "react-redux";

import LogoutButton from "../../sections/pages/profile/LogoutButton";
import LoginButton from "./LoginButton";

const AuthToggleButton = () => {
  const userToken = useSelector((state) => state.users.userToken);

  return userToken ? <LogoutButton /> : <LoginButton />;
};

export default AuthToggleButton;
