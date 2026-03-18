"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import AuthFormsFrame from "@components/ui/AuthFormsFrame";
import SignupForm from "@components/forms/auth/signup";

import { Container } from "@mui/material";
import Cookies from "js-cookie";

const Signin = () => {
  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  if (Cookies.get(CONSTANT_VALUES.AUTH_TOKEN)) {
    router.push(`/${locale}`);
  }

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.signUp"
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
      <AuthFormsFrame title={t("forms.auth.signUp.name")}>
        <SignupForm />
      </AuthFormsFrame>
    </Container>
  );
};

export default Signin;
