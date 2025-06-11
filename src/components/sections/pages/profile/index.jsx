"use client";

import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import VerifyEmailButton from "./actionsButtons/VerifyEmailButton";
import EditEmailButton from "./actionsButtons/EditEmailButton";
import EditPersonalInfoButton from "./actionsButtons/EditPersonalInfoButton";

const ProfileInformation = () => {
  const profileData = useSelector((state) => state.profileData.data);
  const userInfo = profileData?.userInfo || {};

  const locale = useLocale();
  const t = useTranslations();

  // Helper function to safely extract display value
  const getDisplayValue = (value) => {
    if (!value) return "-";
    if (typeof value === "object") return value.name || "-";
    return value;
  };

  const data = [
    {
      key: t("profile.information.personalInformation.name"),
      value: profileData?.name,
    },
    {
      key: t("profile.information.personalInformation.birthDay"),
      value: getDisplayValue(userInfo?.birthDay),
    },
    {
      key: t("profile.information.personalInformation.phoneNumber"),
      value: profileData?.phone,
    },
    {
      key: t("profile.information.personalInformation.gender"),
      value:
        getDisplayValue(userInfo?.gender) === "FEMALE"
          ? t("common.FEMALE")
          : t("common.MALE"),
    },
    {
      key: t("profile.information.personalInformation.nationality"),
      value: getDisplayValue(userInfo?.nationality),
    },
    {
      key: t("profile.information.personalInformation.countryOfResidence"),
      value: getDisplayValue(userInfo?.countryOfResidence),
    },
    {
      key: t("profile.information.personalInformation.city"),
      value: getDisplayValue(userInfo?.city),
    },
  ];

  const renderedData = data.map((info, index) => (
    <div
      key={index}
      className={`flex flex-col gap-1 py-4 ${
        index !== data.length - 1 && "border-b border-accordionBorder"
      }`}
    >
      <h4 className="text-black">{info.key}</h4>
      <h5
        className={`text-[#777] text-sm  ${
          info.key ===
            t("profile.information.personalInformation.phoneNumber") &&
          locale === "ar"
            ? "text-end"
            : ""
        }`}
        dir={
          info.key === t("profile.information.personalInformation.phoneNumber")
            ? "ltr"
            : undefined
        }
      >
        {info.value}
      </h5>
    </div>
  ));

  return (
    <section className="flex flex-col gap-6 lg:gap-12">
      {/* Email Section */}
      <div className="p-4 border rounded-lg border-accordionBorder">
        <h3 className="pb-2 text-xl font-medium text-black">
          {t("profile.information.accountData")}
        </h3>
        <h4 className="text-black">
          {profileData?.isEmailConfirmed
            ? t("profile.information.verifiedMail")
            : t("profile.information.unverifiedMail")}
        </h4>
        <div className="flex items-center justify-between">
          <h5 className="text-[#777] text-sm">{profileData?.email || "-"}</h5>
          <div className="gap-3 centered">
            {!profileData?.isEmailConfirmed && <VerifyEmailButton />}
            <EditEmailButton />
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="p-4 border rounded-lg border-accordionBorder">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-black">
            {t("profile.information.personalInformation.title")}
          </h3>
          <EditPersonalInfoButton />
        </div>
        <div className="flex flex-col">{renderedData}</div>
      </div>
    </section>
  );
};

export default ProfileInformation;
