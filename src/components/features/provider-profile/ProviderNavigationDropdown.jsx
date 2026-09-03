"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Box, List } from "@mui/material";
import {
  Home as HomeIcon,
  TravelExplore as TravelIcon,
  Storefront as StorefrontIcon,
  ListAlt as ListAltIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import React from "react";
import { CONSTANT_VALUES } from "@constants/constantValues";

const ProviderNavigationDropdown = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

  const providerProfileData = useSelector(
    (state) => state.providerProfile?.data
  );
  const loginData = useSelector((state) => state.loginForm?.loginData);

  const providerSlug =
    providerProfileData?.providerSlug ||
    providerProfileData?.user?.providerSlug ||
    loginData?.providerSlug ||
    loginData?.user?.providerSlug ||
    Cookies.get("providerSlug");

  const b2cVercelUrl =
    CONSTANT_VALUES?.URLS?.VERCEL_URL ||
    process.env.NEXT_PUBLIC_B2C_VERCEL ||
    "https://guestan-b2c.netlify.app";

  const ourProductsUrl = providerSlug
    ? `${b2cVercelUrl.replace(/\/$/, "")}/${providerSlug}`
    : "#";

  const providerBasePath = `/${locale}/provider-profile`;

  const navigationItems = [
    {
      id: "main",
      title: t("providerProfile.aside.main"),
      icon: <HomeIcon />,
      path: providerBasePath,
    },
    {
      id: "products-management",
      title: t("providerProfile.aside.productsManagement"),
      icon: <TravelIcon />,
      path: `${providerBasePath}/products-management`,
    },
    {
      id: "orders-management",
      title: t("providerProfile.aside.ordersManagement"),
      icon: <ListAltIcon />,
      path: `${providerBasePath}/orders-management`,
    },
    {
      id: "branches",
      title: t("providerProfile.aside.branches"),
      icon: <BusinessIcon />,
      path: `${providerBasePath}/branches`,
    },
    {
      id: "our-products",
      title: t("providerProfile.aside.ourProducts"),
      icon: <StorefrontIcon />,
      path: ourProductsUrl,
      isExternal: true,
      target: "_blank",
    },
  ];

  return (
    <Box className="w-full max-w-md overflow-hidden">
      <List className="p-0 space-y-1 sm:space-y-2">
        {navigationItems.map((item) => {
          const isActive =
            !item.isExternal &&
            (item.path === providerBasePath
              ? pathname === providerBasePath
              : pathname.startsWith(item.path));

          return (
            <Box key={item.id} className="flex flex-col w-full">
              <Link
                href={item.path}
                target={item.target || "_self"}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className={`border border-border sm:text-sm lg:text-base flex items-center w-full gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 mb-2 sm:mb-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-white bg-mainColor"
                    : "text-textDark hover:text-mainColor"
                }`}
              >
                {React.cloneElement(item.icon, {
                  sx: {
                    color: isActive ? "white" : "var(--color-title)",
                    transition: "color 0.2s",
                    fontSize: {
                      xs: "18px",
                      sm: "20px",
                      lg: "24px",
                    },
                    display: {
                      xs: "none",
                      md: "none",
                      lg: "block",
                    },
                  },
                })}
                <span className="truncate" title={item.title}>
                  {item.title}
                </span>
              </Link>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default ProviderNavigationDropdown;
