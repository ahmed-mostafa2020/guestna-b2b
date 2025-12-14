"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";
import { usePermissions } from "@hooks/usePermissions";

import React, { useState, useMemo } from "react";

import { PERMISSIONS } from "@constants/permissions";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  Box,
} from "@mui/material";
import {
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  TravelExplore as TravelIcon,
  People as PeopleIcon,
  BookOnline as BookingIcon,
  Storefront as StorefrontIcon,
  Wallet,
  Analytics,
} from "@mui/icons-material";

import { CalendarIcon } from "@mui/x-date-pickers";

const NavigationDropdown = () => {
  const [expanded, setExpanded] = useState(false);

  const pathname = usePathname();

  const locale = useLocale();
  const t = useTranslations();
  const { hasMenuItem } = usePermissions();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Check if any sub-item path matches the current pathname
  const isAccordionExpanded = (item) => {
    if (expanded === item.id) return true;
    if (item.hasDropdown && item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.path);
    }
    return false;
  };

  const profileBasePath = `/${locale}/profile`;

  // Define all navigation items with their permission keys
  const allNavigationItems = [
    {
      id: "home",
      title: t("profile.aside.main"),
      icon: <HomeIcon />,
      path: `${profileBasePath}`,
      hasDropdown: false,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_MAIN_TAB,
    },
    {
      id: "activities-market",
      title: t("profile.aside.activitiesMarket"),
      icon: <StorefrontIcon />,
      path: `${profileBasePath}/activities-market`,
      hasDropdown: false,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_ACTIVITIES_MARKET_TAB,
    },
    {
      id: "trips-management",
      title: t("profile.aside.tripsManagement.title"),
      icon: <TravelIcon />,
      path: `${profileBasePath}/trips-activities-management`,
      hasDropdown: false,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_TRIPS_MANAGEMENT_TAB,
    },
    {
      id: "bookings-management",
      title: t("profile.aside.bookingsManagement.title"),
      icon: <BookingIcon />,
      hasDropdown: true,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_ORDER_MANAGEMENT_TAB,
      subItems: [
        {
          title: t("profile.aside.bookingsManagement.ordersManagement"),
          path: `${profileBasePath}/bookings-management/orders`,
          permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_ORDER_MANAGEMENT_TAB,
        },
        {
          title: t("profile.aside.bookingsManagement.bookings"),
          path: `${profileBasePath}/bookings-management/bookings`,
          permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_BOOKINGS_TAB,
        },
      ],
    },
    {
      id: "school-team-management",
      title: t("profile.aside.schoolTeamManagement.title"),
      icon: <PeopleIcon />,
      hasDropdown: true,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_USERS_TAB,
      subItems: [
        {
          title: t("profile.aside.schoolTeamManagement.users"),
          path: `${profileBasePath}/school-team-management/users`,
          permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_USERS_TAB,
        },
        {
          title: t("profile.aside.schoolTeamManagement.students"),
          path: `${profileBasePath}/school-team-management/students`,
          permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_USERS_TAB,
        },
      ],
    },
    {
      id: "my-wallet",
      title: t("profile.myWallet.title"),
      icon: <Wallet />,
      hasDropdown: true,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_TRANSACTIONS_LOG_TAB, // Parent permission
      subItems: [
        {
          title: t("profile.myWallet.transactions"),
          path: `${profileBasePath}/my-wallet/transactions`,
          permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_TRANSACTIONS_LOG_TAB,
        },
        {
          title: t("profile.myWallet.withdraw"),
          path: `${profileBasePath}/my-wallet/withdraw`,
          permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_WITHDRAW_TAB,
        },
      ],
    },
    {
      id: "calendar",
      title: t("profile.calendar.title"),
      icon: <CalendarIcon />,
      path: `${profileBasePath}/calendar`,
      hasDropdown: false,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_CALENDAR_TAB,
    },
    {
      id: "reports-and-analytics",
      title: t("profile.aside.reportsAndAnalytics.title"),
      icon: <Analytics />,
      hasDropdown: true,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_INTEGRATED_BOOKINGS_TAB,
      subItems: [
        {
          title: t(
            "profile.aside.bookingsManagement.integratedBookingsManagement"
          ),
          path: `${profileBasePath}/reports-and-analytics/integrated-bookings`,
          permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_INTEGRATED_BOOKINGS_TAB,
        },
      ],
    },
    {
      id: "roles-permissions",
      title: t("profile.aside.rolesPermissions.title"),
      icon: <PeopleIcon />,
      path: `${profileBasePath}/roles-permissions`,
      hasDropdown: false,
      permission: PERMISSIONS.MENU_ITEM.B2B_PROFILE_ROLES_PERMISSIONS_TAB,
    },
  ];

  // Filter navigation items based on user permissions
  const navigationItems = useMemo(() => {
    return allNavigationItems.filter((item) => {
      // If item has dropdown, check child permissions first
      if (item.hasDropdown && item.subItems) {
        // Filter sub-items based on permissions
        item.subItems = item.subItems.filter((subItem) =>
          hasMenuItem(subItem.permission)
        );
        // Show parent if user has ANY child permission (at least one visible sub-item)
        return item.subItems.length > 0;
      }

      // For non-dropdown items, check parent permission
      return hasMenuItem(item.permission);
    });
  }, [hasMenuItem]);

  return (
    <Box className="w-full max-w-md overflow-hidden">
      {/* Navigation Items */}
      <List className="p-0 space-y-1 sm:space-y-2">
        {navigationItems.map((item) => (
          <Box key={item.id} className="flex flex-col w-full">
            {!item.hasDropdown ? (
              <Link
                href={item.path}
                className={`border border-border sm:text-sm lg:text-base flex items-center w-full gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 mb-2 sm:mb-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? "text-white bg-mainColor"
                    : "text-textDark hover:text-mainColor"
                }`}
              >
                {React.cloneElement(item.icon, {
                  sx: {
                    color:
                      pathname === item.path ? "white" : "var(--color-title)",
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
            ) : (
              <Accordion
                expanded={isAccordionExpanded(item)}
                onChange={handleChange(item.id)}
                elevation={0}
                className="border-none shadow-none"
                sx={{
                  "&.MuiAccordion-rounded": {
                    borderRadius: "8px",
                    marginBottom: { xs: "8px", sm: "12px" },
                    overflow: "hidden",
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:before": {
                    display: "none",
                  },
                  "&.Mui-expanded": {
                    margin: 0,
                    color: "white",
                    marginBottom: { xs: "8px", sm: "12px" },
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: isAccordionExpanded(item)
                          ? "white"
                          : "var(--color-main)",
                        fontSize: { xs: "18px", sm: "20px", lg: "24px" },
                        flexShrink: 0,
                      }}
                    />
                  }
                  className="min-h-0 px-2 sm:px-4 py-2 sm:py-3"
                  sx={{
                    boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.02)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    "&:hover:not(.Mui-expanded)": {
                      color: "var(--color-main)",
                    },
                    minHeight: { xs: "40px", sm: "48px" },
                    "&.Mui-expanded": {
                      minHeight: { xs: "40px", sm: "48px" },
                      background: "var(--color-main)",
                      color: "white",
                      boxShadow: "none",
                    },
                    "& .MuiAccordionSummary-content": {
                      margin: { xs: "8px 0", sm: "12px 0" },
                      minWidth: 0,
                      overflow: "hidden",
                      "&.Mui-expanded": {
                        margin: { xs: "8px 0", sm: "12px 0" },
                      },
                    },
                    "& .MuiAccordionSummary-expandIconWrapper": {
                      flexShrink: 0,
                    },
                  }}
                >
                  <Box className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
                    {React.cloneElement(item.icon, {
                      sx: {
                        color: isAccordionExpanded(item)
                          ? "white"
                          : "var(--color-title)",
                        transition: "color 0.2s",
                        fontSize: { xs: "18px", sm: "20px", lg: "24px" },
                        display: {
                          xs: "none",
                          md: "none",
                          lg: "block",
                        },
                        flexShrink: 0,
                      },
                    })}
                    <span
                      className={`font-medium md:text-sm xl:text-base truncate block min-w-0 max-w-full  ${
                        isAccordionExpanded(item)
                          ? "text-white"
                          : "text-textDark hover:text-mainColor"
                      }`}
                      title={item.title}
                    >
                      {item.title}
                    </span>
                  </Box>
                </AccordionSummary>

                <AccordionDetails
                  className="p-0 bg-transparent"
                  sx={{
                    backgroundColor: "transparent",
                  }}
                >
                  <List className="py-0">
                    {item.subItems?.map((subItem, index) => (
                      <ListItem key={index} className="p-0">
                        <ListItemButton
                          className="w-full py-1 sm:py-2 ps-8 sm:ps-12"
                          sx={{
                            backgroundColor: "transparent",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <Link
                            href={subItem.path}
                            title={subItem.title}
                            className={`w-full text-start hover:text-mainColor sm:text-sm lg:text-base truncate ${
                              pathname === subItem.path
                                ? "text-mainColor"
                                : "text-textDark"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default NavigationDropdown;
