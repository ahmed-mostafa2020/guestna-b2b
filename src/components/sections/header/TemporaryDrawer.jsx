"use client";
import * as React from "react";

import Link from "next/link";

import { useTranslations, useLocale } from "next-intl";

import { CONSTANT_VALUES } from "@constants/constantValues";
import SettingsButton from "./SettingsButton";
import ProfileImage from "../pages/profile/ProfileImage";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";

import Cookies from "js-cookie";

const TemporaryDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations();

  const locale = useLocale();
  const anchor = locale === "ar" ? "right" : "left";

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const navLinks = [
    {
      name: t("header.discover"),
      link: `/${locale}/discover`,
      isDisabled: false,
      isBlank: false,
    },
    {
      name: t("header.schools"),
      link: `${
        locale === "ar"
          ? "https://gplusa.framer.ai/"
          : "https://gpluse.framer.ai/"
      }`,
      isDisabled: false,
      isBlank: true,
    },
    {
      name: t("header.companies"),
      link: "companies",
      isDisabled: true,
      isBlank: false,
    },
    {
      name: t("header.aboutUs"),
      link: `${
        locale === "ar" ? "https://guestna.app" : "https://guestna.app/en"
      }`,
      isDisabled: false,
      isBlank: true,
    },
    {
      name: t("header.contactUs"),
      link: "https://api.whatsapp.com/send?phone=966547534666",
      isDisabled: false,
      isBlank: true,
    },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {navLinks.map((navLink, index) => (
          <ListItem key={navLink.name} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              {/* <Link href={`/${locale}/${navLink.link}`}>{navLink.name}</Link> */}
              {navLink.isDisabled ? (
                <span className="px-4 py-3 text-lg font-medium leading-8 tracking-tight text-gray-400 capitalize border-b border-transparent border-solid cursor-not-allowed font-ibm">
                  {navLink.name}
                </span>
              ) : (
                <Link
                  href={navLink.link}
                  key={index}
                  target={navLink.isBlank ? "_blank" : "_self"}
                  className="px-4 py-3 text-lg font-medium leading-8 tracking-tight capitalize transition-all duration-200 ease-in-out border-b border-transparent border-solid font-ibm hover:border-mainColor hover:text-mainColor"
                >
                  {navLink.name}
                </Link>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        className="hover:text-white hover:bg-linksHover"
        sx={{ color: "black" }}
      >
        <MenuIcon />
      </Button>
      <Drawer anchor={anchor} open={open} onClose={toggleDrawer(false)}>
        {DrawerList}

        <div className="flex flex-col gap-3 px-3">
          <SettingsButton />

          {token ? (
            <Link
              href={`/${locale}/profile`}
              className="px-3 py-2 transition-all duration-200 ease-in-out border rounded-lg centered border-border"
            >
              <ProfileImage />
            </Link>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="px-4 py-2 font-bold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor hover:bg-linksHover hover:border-linksHover"
            >
              {t("header.login")}
            </Link>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default TemporaryDrawer;
