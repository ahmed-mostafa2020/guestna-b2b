"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import AuthFormsFrame from "@components/ui/AuthFormsFrame";
import ResetNewPassword from "@components/forms/auth/forgetPassword/ResetNewPassword";

import { Container } from "@mui/material";
import Cookies from "js-cookie";

const ResetPassword = () => {
  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.resetPassword"
    )}`;
  }, [t]);

  // Check for token
  // useEffect(() => {
  //   const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

  //   if (token) {
  //     router.push(`/${locale}`);
  //   }
  // }, [router, locale]);

  return (
    <Container className="py-5 lg:py-10 centered">
      <AuthFormsFrame title={t("forms.auth.resetPassword.name")}>
        <ResetNewPassword />
      </AuthFormsFrame>
    </Container>
  );
};

export default ResetPassword;
