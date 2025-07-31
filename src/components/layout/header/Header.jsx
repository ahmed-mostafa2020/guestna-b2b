"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

// import { useDispatch } from "react-redux";
// import actGetNavbarData from "@store/navbarData/act/actGetNavbarData";

import { Fragment } from "react";

// import { getHeaders } from "@utils/getHeaders";
import Logo from "../../common/Logo";
import TemporaryDrawer from "./TemporaryDrawer";
import SettingsButton from "./SettingsButton";
// import ProfileImage from "../../sections/pages/profile/ProfileImage";
import ServicesDropdown from "./ServicesDropdown";
import Notifications from "./Notifications";
import AuthToggleButton from "./AuthToggleButton";

import { Container } from "@mui/material";

const Header = () => {
  const userToken = useSelector((state) => state.users.userToken);

  const locale = useLocale();
  const t = useTranslations();

  // const dispatch = useDispatch();

  // const headers = getHeaders();

  const navLinks = [
    {
      name: t("header.home"),
      link: `/${locale}`,
      isDisabled: false,
      isBlank: false,
    },
    {
      name: t("header.aboutUs"),
      link: `${
        locale === "ar"
          ? "https://about.guestna.app"
          : "https://about.guestna.app/en"
      }`,
      isDisabled: false,
      isBlank: true,
    },
    {
      name: t("header.contactUs"),
      link: `/${locale}/contact-us`,
      // link: "https://api.whatsapp.com/send?phone=966547534666",
      isDisabled: false,
      isBlank: false,
    },
  ];

  const renderedNavLinks = navLinks.map((navLink, index) => (
    <Fragment key={index}>
      <div>
        {navLink.isDisabled ? (
          <span className="px-4 py-3 text-lg font-medium leading-8 tracking-tight text-gray-400 capitalize border-b border-transparent border-solid cursor-not-allowed font-ibm">
            {navLink.name}
          </span>
        ) : (
          <Link
            href={navLink.link}
            target={navLink.isBlank ? "_blank" : "_self"}
            className="px-4 py-3 text-lg font-medium leading-8 tracking-tight capitalize transition-all duration-200 ease-in-out border-b border-transparent border-solid font-ibm hover:border-mainColor hover:text-mainColor"
          >
            {navLink.name}
          </Link>
        )}
      </div>
      {/* Insert ServicesDropdown after the first item */}
      {index === 0 && <ServicesDropdown />}
    </Fragment>
  ));

  // useEffect(() => {
  //   dispatch(actGetNavbarData(headers));
  // }, [dispatch, headers]);

  return (
    <>
      <div className="text-sm bg-yellow-100 centered">
        <span>GuestNa B2B beta version</span>
        <span className="m-2">|</span>
        <span>جستنا للمدارس نسخة تجريبية</span>
      </div>

      <header className="py-2">
        <Container maxWidth="lg" className="flex items-center justify-between">
          <Logo />

          <nav className="items-center hidden gap-4 lg:flex">
            {renderedNavLinks}
          </nav>

          <div className="hidden gap-4 centered lg:flex">
            <SettingsButton />

            {userToken && <Notifications />}

            <AuthToggleButton />
          </div>

          <div className="lg:hidden">
            <TemporaryDrawer />
          </div>
        </Container>
      </header>
    </>
  );
};

export default Header;
