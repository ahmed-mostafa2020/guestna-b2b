import { Fragment, memo } from "react";

import GuestCounter from "./GuestCounter";
import { agesIdsList } from "@constants/targetAudiencesIds";

const GuestsButtonMenu = ({
  targetAudiences,
  countState,
  updateCountAction,
}) => {
  const renderedAgesList = targetAudiences?.map((age, index) => (
    <Fragment key={index}>
      <GuestCounter
        type={agesIdsList[age._id]}
        title={age.name}
        subTitle={age.description}
        showBorder={index !== targetAudiences?.length - 1}
        countState={countState}
        updateCountAction={updateCountAction}
      />
    </Fragment>
  ));

  return (
    <div className="flex flex-col lg-min-w-fit lg:max-w-[350px]">
      {renderedAgesList}
    </div>
  );
};

export default memo(GuestsButtonMenu);
