"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleGuestCount } from "@store/searchFilter/searchFilterSlice";

import { Fragment, memo, useCallback, useMemo } from "react";

import { agesIdsList } from "@constants/targetAudiencesIds";
import CheckboxGroup from "@components/forms/CheckboxGroup";
import FilterAccordion from "@components/filtersBox/FilterAccordion";

const TargetAudiences = ({ targetAudiences, title }) => {
  const guests = useSelector((state) => state.searchFilter.guests);

  const dispatch = useDispatch();

  // First get non-zero keys
  const nonZeroKeys = useMemo(
    () => Object.keys(guests).filter((key) => guests[key] > 0),
    [guests]
  );

  // Then get IDs by finding matching keys in agesIdsList
  const getIds = useMemo(
    () =>
      nonZeroKeys.map((key) =>
        Object.keys(agesIdsList).find((id) => agesIdsList[id] === key)
      ),
    [nonZeroKeys]
  );

  // Memoize the check function
  const isTargetChecked = useCallback(
    (targetId) => {
      return getIds.includes(targetId);
    },
    [getIds]
  );

  const getNameById = (id) => {
    return agesIdsList[id] || null;
  };

  // Memoize the entire list
  const targetAudiencesList = useMemo(
    () =>
      targetAudiences?.map((target) => (
        <Fragment key={target._id}>
          <CheckboxGroup
            label={target.name}
            isChecked={isTargetChecked(target._id)}
            onChangeFunction={() =>
              dispatch(toggleGuestCount(getNameById(target._id)))
            }
          />
        </Fragment>
      )),
    [targetAudiences, isTargetChecked, dispatch]
  );

  return <FilterAccordion title={title}>{targetAudiencesList}</FilterAccordion>;
};

export default memo(TargetAudiences);
