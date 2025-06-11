"use client";

import { useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { toggleRememberMe } from "@store/forms/auth/login/loginFormSlice";

import CheckboxGroup from "../../CheckboxGroup";

const RememberMe = () => {
  const rememberMe = useSelector((state) => state.loginForm.rememberMe);

  const t = useTranslations();

  const dispatch = useDispatch();

  return (
    <CheckboxGroup
      label={t("forms.auth.login.rememberMe")}
      fontSize="14px"
      hoveringAction={false}
      isChecked={rememberMe}
      onChangeFunction={() => {
        dispatch(toggleRememberMe());
      }}
    />
  );
};

export default RememberMe;
