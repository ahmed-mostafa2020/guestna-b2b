"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import LogoutButton from "./LogoutButton";

const ProfileTabs = () => {
  const pathname = usePathname();

  const locale = useLocale();
  const t = useTranslations();

  const profileBasePath = `/${locale}/profile`;

  const tabs = [
    { name: t("profile.aside.information"), path: `${profileBasePath}` },
    {
      name: t("profile.aside.activities"),
      path: `${profileBasePath}/activities-trips`,
    },
    {
      name: t("profile.aside.packages"),
      path: `${profileBasePath}/packages-trips`,
    },

    { name: t("profile.aside.messages"), path: `${profileBasePath}/messages` },
    {
      name: t("profile.aside.notifications"),
      path: `${profileBasePath}/notifications`,
    },
    { name: t("profile.aside.bookings"), path: `${profileBasePath}/bookings` },
    {
      name: t("profile.aside.favorites"),
      path: `${profileBasePath}/favorites`,
    },
  ];

  return (
    <aside className="flex flex-col space-y-4 ">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          className={`py-4 px-3 border-b font-ibm text-sm lg:text-lg transition-all duration-150 ease-in-out${
            pathname === tab.path
              ? " border-[#E9E9F2] text-white bg-mainColor rounded-lg"
              : `text-black hover:text-mainColor
                  "border-b border-accordionBorder"
                  `
          }`}
        >
          {tab.name}
        </Link>
      ))}

      <LogoutButton />
    </aside>
  );
};

export default ProfileTabs;
