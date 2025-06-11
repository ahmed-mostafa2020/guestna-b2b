"use client";

import { useDispatch } from "react-redux";

import formatCurrency from "@utils/FormatCurrency";
import CheckboxGroup from "@components/forms/CheckboxGroup";

const AccommodationListing = ({ list, action, state }) => {
  const dispatch = useDispatch();

  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }

  const renderedList = list.map((option) => (
    <div key={option._id} className="flex flex-col gap-4 accommodationList">
      <div className="flex items-center justify-between">
        <CheckboxGroup
          label={option.name}
          isChecked={state.some((item) => item.service === option._id)}
          onChangeFunction={(e) => {
            dispatch(
              action({
                serviceId: option._id,
                quantity: 1,
                price: option.price,
                isChecked: e.target.checked,
              })
            );
          }}
          hoveringAction={false}
        />

        <span>{formatCurrency(option.price)}</span>
      </div>
    </div>
  ));
  return <>{renderedList}</>;
};

export default AccommodationListing;
