"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import React, { useState } from "react";

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
  // LocationOn as LocationIcon,
  // Receipt as ReceiptIcon,
  // LocalOffer as OfferIcon,
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

  const navigationItems = [
    {
      id: "home",
      title: t("profile.aside.main"),
      icon: <HomeIcon />,
      path: `${profileBasePath}`,
      hasDropdown: false,
    },
    {
      id: "activities-market",
      title: t("profile.aside.activitiesMarket"),
      icon: <StorefrontIcon />,
      path: `${profileBasePath}/activities-market`,
      hasDropdown: false,
    },
    {
      id: "trips-management",
      title: t("profile.aside.tripsManagement.title"),
      icon: <TravelIcon />,
      path: `${profileBasePath}/trips-activities-management`,
      hasDropdown: false,
    },
    {
      id: "bookings-management",
      title: t("profile.aside.bookingsManagement.title"),
      icon: <BookingIcon />,
      hasDropdown: true,
      subItems: [
        {
          title: t("profile.aside.bookingsManagement.ordersManagement"),
          path: `${profileBasePath}/bookings-management/orders`,
        },
        {
          title: t("profile.aside.bookingsManagement.bookings"),
          path: `${profileBasePath}/bookings-management/bookings`,
        },
      ],
    },
    {
      id: "school-team-management",
      title: t("profile.aside.schoolTeamManagement.title"),
      icon: <PeopleIcon />,
      hasDropdown: true,
      subItems: [
        {
          title: t("profile.aside.schoolTeamManagement.users"),
          path: `${profileBasePath}/school-team-management/users`,
        },
        // {
        //   title: t("profile.aside.schoolTeamManagement.students"),
        //   path: `${profileBasePath}/school-team-management/students`,
        // },
      ],
    },

    {
      id: "my-wallet",
      title: t("profile.myWallet.title"),
      icon: <Wallet />,
      hasDropdown: true,
      subItems: [
        {
          title: t("profile.myWallet.transactions"),
          path: `${profileBasePath}/my-wallet/transactions`,
        },
        {
          title: t("profile.myWallet.withdraw"),
          path: `${profileBasePath}/my-wallet/withdraw`,
        },
      ],
    },
    {
      id: "calendar",
      title: t("profile.calendar.title"),
      icon: <CalendarIcon />,
      path: `${profileBasePath}/calendar`,
      hasDropdown: false,
    },
    {
      id: "reports-and-analytics",
      title: t("profile.aside.reportsAndAnalytics.title"),
      icon: <Analytics />,
      hasDropdown: true,
      subItems: [
        {
          title: t(
            "profile.aside.bookingsManagement.integratedBookingsManagement"
          ),
          path: `${profileBasePath}/reports-and-analytics/integrated-bookings`,
        },
      ],
    },
  ];

  return (
    <Box className="w-full max-w-md overflow-hidden">
      {/* Navigation Items */}
      <List className="p-0 space-y-1 sm:space-y-2">
        {navigationItems.map((item, _) => (
          <Box key={item.id} className="flex flex-col w-full">
            {!item.hasDropdown ? (
              <Link
                href={item.path}
                className={`border border-border text-xs sm:text-sm lg:text-base flex items-center w-full gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 mb-2 sm:mb-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? "text-white bg-mainColor"
                    : "hover:text-mainColor"
                }`}
              >
                {React.cloneElement(item.icon, {
                  sx: {
                    color: pathname === item.path ? "white" : "var(--color-title)",
                    transition: "color 0.2s",
                    fontSize: {
                      xs: "18px",
                      sm: "20px",
                      lg: "24px",
                    },
                    display: { xs: "none", md: "none", lg: "block" },
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
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: isAccordionExpanded(item) ? "white" : "var(--color-main)",
                        fontSize: { xs: "18px", sm: "20px", lg: "24px" },
                        flexShrink: 0,
                      }}
                    />
                  }
                  className="min-h-0 px-2 sm:px-4 py-2 sm:py-3"
                  sx={{
                    boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.02)",
                    border: "1px solid #E5E5E5",
                    borderRadius: "8px",
                    "&.Mui-expanded": {
                      minHeight: 48,
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
                  <Box className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {React.cloneElement(item.icon, {
                      sx: {
                        color: isAccordionExpanded(item) ? "white" : "var(--color-title)",
                        transition: "color 0.2s",
                        fontSize: { xs: "18px", sm: "20px", lg: "24px" },
                        display: { xs: "none", md: "none", lg: "block" },
                        flexShrink: 0,
                      },
                    })}
                    <span
                      className="font-medium text-xs sm:text-sm lg:text-base truncate min-w-0"
                      title={item.title}
                    >
                      {item.title}
                    </span>
                  </Box>
                </AccordionSummary>

                <AccordionDetails className="p-0">
                  <List className="py-0">
                    {item.subItems.map((subItem, _) => (
                      <ListItem key={subItem.title} disablePadding>
                        <ListItemButton
                          className="w-full py-1 sm:py-2 ps-8 sm:ps-12"
                          // onClick={() =>
                          //   handleSubItemClick(item.title, subItem)
                          // }
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
                            className={`w-full text-start hover:text-mainColor text-xs sm:text-sm lg:text-base truncate ${
                              pathname === subItem.path
                                ? "text-mainColor"
                                : "text-black"
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
