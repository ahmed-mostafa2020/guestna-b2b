"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import {
  setProviderRegisterSelections,
  setProviderRegisterSelectionsError,
  setProviderRegisterSelectionsLoading,
} from "@store/forms/providerRegister/providerRegisterSelectionsSlice";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ProviderRegisterForm from "@components/forms/providerRegisterForm";

const ProviderRegisterPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const { loading } = useSelector((state) => state.providerRegisterSelections);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.providerRegister"
    )}`;
  }, [t]);

  const { isLoading, error } = useFetchData(
    B2B_END_POINTS.PROVIDER_REGISTER.SELECTIONS,
    {},
    {
      method: "GET",
      lang: locale,
      queryKeySuffix: locale,
      onSuccess: setProviderRegisterSelections,
      onError: setProviderRegisterSelectionsError,
      onLoading: setProviderRegisterSelectionsLoading,
    }
  );

  if (error) {
    console.error("Error fetching registration selections:", error);
  }

  const showLoading = isLoading || loading === "loading";

  return (
    <main className="py-8 lg:py-12 bg-packageDetailsBg">
      <Container maxWidth="xl">
        {showLoading ? (
          <FullScreenLoading status="pending" />
        ) : (
          <ProviderRegisterForm />
        )}
      </Container>
    </main>
  );
};

export default ProviderRegisterPage;
