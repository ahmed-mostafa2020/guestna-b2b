"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { CONSTANT_VALUES } from "@constants/constantValues";
import TemporaryDrawer from "./TemporaryDrawer";
import SettingsButton from "./SettingsButton";
import ProfileImage from "../pages/profile/ProfileImage";

import { Container } from "@mui/material";

import logo from "@assets/logo.png";

import Cookies from "js-cookie";

const Header = () => {
  const locale = useLocale();
  const t = useTranslations();

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

  const navLinks = [
    {
      name: t("header.discover"),
      link: `/${locale}/discover`,
      isDisabled: false,
      isBlank: false,
    },
    {
      name: t("header.schools"),
      link: "https://guestna-edu.com",
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
    <div key={index}>
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
    </div>
  ));

  return (
    <>
      <div className="text-sm bg-yellow-100 centered">
        <span>GuestNa 2.0 is out</span>
        <span className="m-2">|</span>
        <span>جستنا 2.0 بين يديك</span>
      </div>

      <header className="py-2">
        <Container maxWidth="lg" className="flex items-center justify-between">
          <Link href={`/${locale}`} className="w-fit">
            <Image
              src={logo}
              alt="logo"
              height={72}
              width={150}
              priority={true}
              className="object-contain"
            />
          </Link>

          <nav className="hidden gap-4 lg:flex">{renderedNavLinks}</nav>

          <div className="hidden gap-4 centered lg:flex">
            <SettingsButton />

            {token ? (
              <Link
                href={`/${locale}/profile`}
                className="px-3 py-2 transition-all duration-200 ease-in-out border rounded-lg border-border"
              >
                <ProfileImage />
              </Link>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="px-4 py-2 font-bold text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor hover:bg-linksHover hover:border-linksHover"
              >
                {t("header.login")}
              </Link>
            )}
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
