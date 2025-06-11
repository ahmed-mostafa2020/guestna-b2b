"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { useEffect } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import AuthFormsFrame from "@components/common/AuthFormsFrame";
import ResetPasswordByEmail from "@components/forms/auth/forgetPassword/ResetPasswordByEmail";
import ResetPasswordByPhone from "@components/forms/auth/forgetPassword/ResetPasswordByPhone";

import { Container } from "@mui/material";
import Cookies from "js-cookie";

const ForgetPassword = () => {
  const { resetPasswordBy } = useSelector((state) => state.loginForm);

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.forgetPassword"
    )}`;
  }, [t]);

  // Check for token
  useEffect(() => {
    const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

    if (token) {
      router.push(`/${locale}`);
    }
  }, [router, locale]);

  return (
    <Container className="py-5 lg:py-10 centered">
      <AuthFormsFrame title={t("forms.auth.forgetPassword.name")}>
        {resetPasswordBy === "email" ? (
          <ResetPasswordByEmail />
        ) : (
          <ResetPasswordByPhone />
        )}
      </AuthFormsFrame>
    </Container>
  );
};

export default ForgetPassword;
