"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTranslations, useLocale } from "next-intl";

import { useSelector } from "react-redux";

import { useState } from "react";

import SettingsButton from "./SettingsButton";
// import ProfileImage from "../../features/profile/ProfileImage";
import Logo from "../../common/Logo";
import ServicesDropdown from "./ServicesDropdown";
import AuthToggleButton from "./AuthToggleButton";
import OrganizationSelector from "../../common/OrganizationSelector";
import Notifications from "./Notifications";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

import MenuIcon from "@mui/icons-material/Menu";
import { aboutUsIcon, discoverIcon, greenPhoneIcon } from "@assets/svg";

const TemporaryDrawer = () => {
  const [open, setOpen] = useState(false);
  const userToken = useSelector((state) => state.users.userToken);

  const t = useTranslations();

  const pathname = usePathname();

  const locale = useLocale();
  const anchor = locale === "ar" ? "right" : "left";

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const navLinks = [
    {
      name: t("header.home"),
      link: `/${locale}`,
      isDisabled: false,
      isBlank: false,
      icon: discoverIcon,
    },
    {
      name: t("header.aboutUs"),
      link: `${
        locale === "ar" ? "https://guestna.app" : "https://guestna.app/en"
      }`,
      isDisabled: false,
      isBlank: true,
      icon: aboutUsIcon,
    },
    {
      name: t("header.contactUs"),
      link: "https://api.whatsapp.com/send?phone=966547534666",
      isDisabled: false,
      isBlank: true,
      icon: greenPhoneIcon,
    },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <Logo />

        {navLinks.map((navLink, index) => {
          const pathnameWithoutLocale =
            pathname.replace(`/${locale}`, "") || "/";
          const linkWithoutLocale =
            navLink.link.replace(`/${locale}`, "") || "/";

          const isActive = navLink.link.startsWith("http")
            ? false
            : pathnameWithoutLocale === linkWithoutLocale;

          return (
            <ListItem key={navLink.name} disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ minWidth: "fit-content" }}>
                  {navLink.icon}
                </ListItemIcon>
                {navLink.isDisabled ? (
                  <span className="px-4 py-3 text-lg font-medium leading-8 tracking-tight text-gray-400 capitalize border-b border-transparent border-solid cursor-not-allowed">
                    {navLink.name}
                  </span>
                ) : (
                  <Link
                    href={navLink.link}
                    key={index}
                    target={navLink.isBlank ? "_blank" : "_self"}
                    className={`px-4 py-3 text-lg font-medium leading-8 tracking-tight capitalize transition-all duration-200 ease-in-out hover:text-mainColor ${
                      isActive ? "text-mainColor" : ""
                    }`}
                  >
                    {navLink.name}
                  </Link>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
        <div className="px-4" onClick={(e) => e.stopPropagation()}>
          <ServicesDropdown />
        </div>
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

          {userToken && <Notifications />}

          {/* Organization Selector Header */}
          <OrganizationSelector />

          <AuthToggleButton />
        </div>
      </Drawer>
    </>
  );
};

export default TemporaryDrawer;
