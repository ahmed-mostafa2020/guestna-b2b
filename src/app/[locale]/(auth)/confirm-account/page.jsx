"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import AuthFormsFrame from "@components/ui/AuthFormsFrame";
import VerificationCodeForm from "@components/forms/auth/confirmAccount";
import { CONSTANT_VALUES } from "@constants/constantValues";

import { Container } from "@mui/material";
import Cookies from "js-cookie";

const ConfirmAccount = () => {
  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  // Check for token
  useEffect(() => {
    const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

    if (token) {
      router.push(`/${locale}`);
    }
  }, [router, locale]);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.confirmAccount"
    )}`;
  }, [t]);

  return (
    <Container className="py-5 lg:py-10 centered">
      <AuthFormsFrame title={t("forms.auth.confirmAccount.name")}>
        <VerificationCodeForm />
      </AuthFormsFrame>
    </Container>
  );
};

export default ConfirmAccount;
