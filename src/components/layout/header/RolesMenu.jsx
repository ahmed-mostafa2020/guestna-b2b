"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { USERS } from "@constants/users";

import schools from "@assets/schools.png";
import individuals from "@assets/individuals.png";
import servicesProviders from "@assets/servicesProviders.png";
import organizations from "@assets/organizations.png";

const RolesMenu = ({ handleClose }) => {
  const locale = useLocale();
  const t = useTranslations();

  const searchParams = useSearchParams();
  const currentUserType = searchParams.get("userType");

  const rolesList = [
    {
      name: t("forms.auth.login.rolesMenu.schools"),
      image: schools,
      link: `/${locale}/login?userType=${USERS.B2B_STAFF_MANAGER}`,
      userType: USERS.B2B_STAFF_MANAGER, // Add userType directly
    },
    {
      name: t("forms.auth.login.rolesMenu.individuals"),
      image: individuals,
      link: `/${locale}/login?userType=${USERS.B2B_STAFF_STMS}`,
      userType: USERS.B2B_STAFF_STMS,
    },
    {
      name: t("forms.auth.login.rolesMenu.servicesProviders"),
      image: servicesProviders,
      link: `/${locale}/login?userType=${USERS.B2B_STAFF_FINANCE}`,
      userType: `${USERS.B2B_STAFF_FINANCE}`,
    },
    {
      name: t("forms.auth.login.rolesMenu.organizations"),
      image: organizations,
      link: `/${locale}/login?userType=${USERS.B2B_ADMINISTRATION}`,
      userType: USERS.B2B_ADMINISTRATION,
    },
  ];

  const renderedRolesList = rolesList.map((role, index) => (
    <Link
      key={index}
      href={role.link}
      onClick={handleClose}
      className="flex-col lg:flex-1 lg:min-w-[45%] gap-4 centered group"
    >
      <Image src={role.image} alt={role.name} width={90} height={90} />

      <h3
        className={`text-lg font-semibold text-center transition-all duration-200 ease-in-out  font-ibm
     group-hover:text-textDark 
        ${
          role.userType == currentUserType ? "text-secColor" : "text-titleColor"
        }
        `}
      >
        {role.name}
      </h3>
    </Link>
  ));

  return (
    <div className="flex-col flex-wrap gap-4 lg:flex-row centered lg:gap-9">
      {renderedRolesList}
    </div>
  );
};

export default RolesMenu;
