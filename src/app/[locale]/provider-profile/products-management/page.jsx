"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProviderProductsTable from "@components/features/provider-profile/ProviderProductsTable";

const DUMMY_B2B_TRIPS = {
  pageInfo: {
    total: 4,
    currentPage: 1,
    perPage: 10,
    hasNextPage: false,
  },
  nodes: [
    {
      _id: "4afc8d5b3bf249a0b4054606",
      slug: "five-senses",
      orderId: "cd2cad",
      price: 1000,
      createdAt: "2026-07-28T12:10:19.419Z",
      name: "Five Senses",
      cities: [
        { _id: "6b5c4c32d62d7cd01ba5ddec", name: "Dammam" },
        { _id: "62e60f7326a23d949dcdccba", name: "Riyadh" },
      ],
    },
    {
      _id: "6a5e867b6e30d7cabac5dd11",
      slug: "provider2",
      orderId: "MP-12377",
      price: 500,
      createdAt: "2026-07-20T20:35:07.280Z",
      name: "Provider2",
      cities: [{ _id: "98fafa508fd56ac9da83d5a6", name: "Makkah" }],
    },
    {
      _id: "6a5d33181ebcbfba4e71b446",
      slug: "provider",
      orderId: "MP-14389",
      price: 600,
      createdAt: "2026-07-19T20:27:04.322Z",
      name: "Provider",
      cities: [{ _id: "771ac36f6da96c09d9125de5", name: "Al-Qassim" }],
    },
    {
      _id: "6a58bbfaaaf7cd4942c0ab39",
      slug: "fouad-trip3-1784199857732",
      orderId: "MP-16690",
      price: 500,
      createdAt: "2026-07-16T11:09:46.513Z",
      name: "Fouad Trip3-( AlFouad Language School)",
      cities: [{ _id: "98fafa508fd56ac9da83d5a6", name: "Makkah" }],
    },
  ],
};

const DUMMY_B2C_TRIPS = {
  pageInfo: {
    total: 2,
    currentPage: 1,
    perPage: 10,
    hasNextPage: false,
  },
  nodes: [
    {
      _id: "7b5c8d5b3bf249a0b4054607",
      slug: "desert-safari-b2c",
      orderId: "B2C-98212",
      price: 350,
      createdAt: "2026-07-25T10:00:00.000Z",
      name: "Desert Safari Experience",
      cities: [{ _id: "62e60f7326a23d949dcdccba", name: "Riyadh" }],
    },
    {
      _id: "8a5e867b6e30d7cabac5dd12",
      slug: "red-sea-diving-b2c",
      orderId: "B2C-44129",
      price: 750,
      createdAt: "2026-07-22T14:30:00.000Z",
      name: "Red Sea Diving Adventure",
      cities: [{ _id: "12fafa508fd56ac9da83d5a1", name: "Jeddah" }],
    },
  ],
};

const ProviderProductsManagementPage = () => {
  const t = useTranslations();
  const locale = useLocale();

  // B2B Table State
  const [b2bPage, setB2bPage] = useState(1);
  const [b2bSearchTerm, setB2bSearchTerm] = useState("");

  // B2C Table State
  const [b2cPage, setB2cPage] = useState(1);
  const [b2cSearchTerm, setB2cSearchTerm] = useState("");

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.productsManagement"
    )}`;
  }, [t]);

  // Fetch B2B Trips
  const { data: b2bData, isLoading: b2bLoading } = useFetchData(
    `${B2B_END_POINTS.PROVIDER_PROFILE.B2B_TRIPS}?page=${b2bPage}&perPage=10${
      b2bSearchTerm ? `&searchTerm=${b2bSearchTerm}` : ""
    }`,
    {},
    {
      lang: locale,
      enabled: false,
    },
    [b2bPage, b2bSearchTerm]
  );

  // Fetch B2C Trips
  const { data: b2cData, isLoading: b2cLoading } = useFetchData(
    `${B2B_END_POINTS.PROVIDER_PROFILE.B2C_TRIPS}?page=${b2cPage}&perPage=10${
      b2cSearchTerm ? `&searchTerm=${b2cSearchTerm}` : ""
    }`,
    {},
    {
      lang: locale,
      enabled: false,
    },
    [b2cPage, b2cSearchTerm]
  );

  const finalB2bData = b2bData || DUMMY_B2B_TRIPS;
  const finalB2cData = b2cData || DUMMY_B2C_TRIPS;

  return (
    <main className="flex flex-col gap-8 min-h-screen">
      {/* Page Header */}
      <div className="pb-2 border-b border-border">
        <h1 className="text-xl lg:text-2xl font-bold text-titleColor">
          {t("providerProfile.products.title")}
        </h1>
      </div>

      {/* 1. B2B Trips Table Section */}
      <ProviderProductsTable
        title={t("providerProfile.products.tabs.b2b")}
        data={finalB2bData}
        currentPage={b2bPage}
        setCurrentPage={setB2bPage}
        searchTerm={b2bSearchTerm}
        setSearchTerm={setB2bSearchTerm}
        loading={b2bLoading && !b2bData}
      />

      {/* 2. B2C Trips Table Section */}
      <ProviderProductsTable
        title={t("providerProfile.products.tabs.b2c")}
        data={finalB2cData}
        currentPage={b2cPage}
        setCurrentPage={setB2cPage}
        searchTerm={b2cSearchTerm}
        setSearchTerm={setB2cSearchTerm}
        loading={b2cLoading && !b2cData}
      />
    </main>
  );
};

export default ProviderProductsManagementPage;
