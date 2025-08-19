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
  Typography,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  TravelExplore as TravelIcon,
  // People as PeopleIcon,
  BookOnline as BookingIcon,
  // LocationOn as LocationIcon,
  // Receipt as ReceiptIcon,
  // LocalOffer as OfferIcon,
  Storefront as StorefrontIcon,
} from "@mui/icons-material";
import { homeIcon } from "@assets/svg";

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

  // const handleSubItemClick = (item, subItem) => {
  //   console.log(`Clicked: ${item} -> ${subItem}`);
  // };

  const profileBasePath = `/${locale}/profile`;

  const navigationItems = [
    {
      id: "home",
      title: t("profile.aside.main"),
      icon: homeIcon,
      path: `${profileBasePath}`,
      hasDropdown: false,
    },
    {
      id: "tourism-programs",
      title: t("profile.aside.programs.title"),
      icon: <TravelIcon />,
      hasDropdown: true,
      subItems: [
        {
          title: t("profile.aside.programs.trips"),
          path: `${profileBasePath}/trips`,
        },
      ],
    },
    {
      id: "bookings-management",
      title: t("profile.aside.bookingsManagement.title"),
      icon: <BookingIcon />,
      hasDropdown: true,
      subItems: [
        {
          title: t("profile.aside.bookingsManagement.bookings"),
          path: `${profileBasePath}/bookings-management/bookings`,
        },
        {
          title: t(
            "profile.aside.bookingsManagement.integratedBookingsManagement"
          ),
          path: `${profileBasePath}/bookings-management/integrated-bookings`,
        },
      ],
    },
    {
      id: "activities-market",
      title: t("profile.aside.activitiesMarket"),
      icon: <StorefrontIcon />,
      path: `/${locale}/discover`,
      hasDropdown: false,
    },
    // {
    //   id: "user-management",
    //   title: "إدارة المستخدمين",
    //   icon: <PeopleIcon />,
    //   hasDropdown: true,
    //   subItems: [
    //     "المستخدمين النشطين",
    //     "المستخدمين المحظورين",
    //     "إضافة مستخدم جديد",
    //   ],
    // },
    // {
    //   id: "reservations",
    //   title: "إدارة الحجوزات",
    //   icon: <BookingIcon />,
    //   hasDropdown: true,
    //   subItems: ["الحجوزات الجديدة", "الحجوزات المؤكدة", "الحجوزات الملغية"],
    // },
    // {
    //   id: "regions",
    //   title: "إدارة المناطق",
    //   icon: <LocationIcon />,
    //   hasDropdown: true,
    //   subItems: ["المناطق السياحية", "إضافة منطقة جديدة", "تعديل المناطق"],
    // },
    // {
    //   id: "invoices",
    //   title: "الفواتير والمدفوعات",
    //   icon: <ReceiptIcon />,
    //   hasDropdown: true,
    //   subItems: ["الفواتير المدفوعة", "الفواتير المعلقة", "تقارير المدفوعات"],
    // },
    // {
    //   id: "promo-codes",
    //   title: "الأكواد الترويجية",
    //   icon: <OfferIcon />,
    //   hasDropdown: true,
    //   subItems: ["الأكواد النشطة", "الأكواد المنتهية", "إنشاء كود جديد"],
    // },
  ];

  return (
    <Box className="w-full max-w-md overflow-hidden">
      {/* Navigation Items */}
      <List className="p-0">
        {navigationItems.map((item, _) => (
          <Box key={item.id} className="flex flex-col w-full gap-2">
            {!item.hasDropdown ? (
              <Link
                href={item.path}
                className={`flex items-center w-full gap-1 px-4 py-3 mb-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? "text-white bg-mainColor"
                    : "hover:text-mainColor"
                }`}
              >
                {React.cloneElement(item.icon, {
                  sx: {
                    color: pathname === item.path ? "white" : "#008F8F",
                    transition: "color 0.2s",
                  },
                })}
                {item.title}
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
                    marginBottom: "12px",
                    overflow: "hidden",
                    backgroundColor: "transparent",
                    border: "none",
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
                        color: isAccordionExpanded(item) ? "white" : "#007473",
                      }}
                    />
                  }
                  className="min-h-0 px-4 py-3"
                  sx={{
                    background: "#FBFBFB",
                    boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.02)",
                    "&.Mui-expanded": {
                      minHeight: 48,
                      background: "#007473",
                      color: "white",
                      boxShadow: "none",
                    },
                    "& .MuiAccordionSummary-content": {
                      margin: "12px 0",
                      "&.Mui-expanded": {
                        margin: "12px 0",
                      },
                    },
                  }}
                >
                  <Box className="flex items-center w-full gap-1">
                    {React.cloneElement(item.icon, {
                      sx: {
                        color: isAccordionExpanded(item) ? "white" : "#008F8F",
                        transition: "color 0.2s",
                      },
                    })}
                    <Typography
                      className="font-medium"
                      sx={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails className="p-0">
                  <List className="py-0">
                    {item.subItems.map((subItem, _) => (
                      <ListItem key={subItem.name} disablePadding>
                        <ListItemButton
                          className="w-full py-2 ps-12"
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
                            className={`w-full text-start hover:text-mainColor ${
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
