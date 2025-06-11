"use client";

import { useTranslations } from "next-intl";

import { Fragment, memo } from "react";

import Place from "./Place";

const PlaceButtonMenu = ({ places }) => {
  const t = useTranslations();

  const renderedPlacesList = places?.map((place) => (
    <Fragment key={place._id}>
      <Place id={place._id} src={place.icon} name={place.name} />
    </Fragment>
  ));

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-lg font-semibold font-mulish text-mainColor">
        {t("filtersBox.searchByLocation")}
      </h3>

      <div className="flex flex-nowrap lg:flex-wrap py-2 gap-2 lg:max-w-[460px] overflow-x-auto">
        {renderedPlacesList}
      </div>
    </div>
  );
};

export default memo(PlaceButtonMenu);
