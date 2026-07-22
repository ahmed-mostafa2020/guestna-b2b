"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Box, List } from "@mui/material";
import { Home as HomeIcon, TravelExplore as TravelIcon } from "@mui/icons-material";
import React from "react";

const ProviderNavigationDropdown = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();

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
  ];

  return (
    <Box className="w-full max-w-md overflow-hidden">
      <List className="p-0 space-y-1 sm:space-y-2">
        {navigationItems.map((item) => {
          const isActive =
            item.path === providerBasePath
              ? pathname === providerBasePath
              : pathname.startsWith(item.path);

          return (
            <Box key={item.id} className="flex flex-col w-full">
              <Link
                href={item.path}
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
