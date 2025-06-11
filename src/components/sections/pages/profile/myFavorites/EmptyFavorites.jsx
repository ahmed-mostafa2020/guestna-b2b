import Image from "next/image";

import { useTranslations } from "next-intl";

import EmptyProfileResponse from "../EmptyProfileResponse";

import emptyFavorites from "@assets/gif/emptyFavorites.gif";
import arrow from "@assets/arrow.svg";

import { favoriteIcon, heartIcon } from "@assets/svg";

const EmptyFavorites = () => {
  const t = useTranslations();

  return (
    <>
      <EmptyProfileResponse
        image={emptyFavorites}
        title={t("profile.myFavorites.emptyFavorites.title")}
        subTitle={
          <>
            {t("profile.myFavorites.emptyFavorites.subTitle1")} {favoriteIcon}{" "}
            {t("profile.myFavorites.emptyFavorites.subTitle2")}
          </>
        }
        hasLink={false}
      />

      <div className="mx-auto p-3 w-[300px] h-[280px] lg:w-[400px] lg:h-[380px] relative bg-gradient-to-b from-[#007473] via-[rgba(0,157,155,0.16)] to-[rgba(0,218,216,0.01)]">
        <Image
          src={arrow}
          alt="arrow"
          width={90}
          height={55}
          priority="true"
          className="absolute top-[-45px] end-[-70px] lg:block hidden rotate-[-7deg]"
        />
        <button className="gap-1 centered bg-[#04040473] h-11 w-11 absolute top-5 rounded-full end-5 ">
          {heartIcon}
        </button>
      </div>
    </>
  );
};

export default EmptyFavorites;
