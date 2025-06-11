"use client";

import { plusIcon, minusIcon } from "@assets/svg";
import { useDispatch } from "react-redux";

import { memo } from "react";

const GuestCounter = ({
  type,
  title,
  subTitle,
  showBorder,
  countState,
  updateCountAction,
}) => {
  const dispatch = useDispatch();

  return (
    <div
      className={`flex items-center gap-6 justify-between py-5 ${
        showBorder && "border-border border-b"
      } `}
    >
      <div className="flex-1 font-ibm ">
        <h3 className="pb-1 text-lg font-semibold text-mainColor lg:text-xl">
          {title}
        </h3>
        <h4 className="text-base font-normal opacity-60">{subTitle}</h4>
      </div>

      <div className="flex items-center justify-end flex-1 gap-4 ">
        <button
          onClick={() =>
            dispatch(
              updateCountAction({
                type,
                count: countState[type] + 1,
              })
            )
          }
          className="w-10 h-10 rounded-full lg:w-12 lg:h-12 centered"
        >
          {plusIcon}
        </button>

        <h3 className="w-6 text-lg font-semibold text-center lg:text-2xl">
          {countState[type]}
        </h3>

        <button
          onClick={() =>
            dispatch(
              updateCountAction({
                type,
                count: countState[type] - 1,
              })
            )
          }
          disabled={countState[type] === 0}
          className={`w-10 lg:w-12 h-10 lg:h-12 rounded-full centered transition-all duration-200 ease-in-out ${
            countState[type] === 0
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          }`}
        >
          {minusIcon}
        </button>
      </div>
    </div>
  );
};

export default memo(GuestCounter);
