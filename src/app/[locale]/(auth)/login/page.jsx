"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import AuthFormsFrame from "@components/common/AuthFormsFrame";
import RolesLoginForm from "@components/forms/auth/rolesLogin";

import { Container } from "@mui/material";
import Cookies from "js-cookie";

const Login = () => {
  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.login"
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
    <Container className="py-5 centered lg:py-10">
      <AuthFormsFrame title={t("forms.auth.login.name")}>
        <RolesLoginForm />
      </AuthFormsFrame>
    </Container>
  );
};

export default Login;
