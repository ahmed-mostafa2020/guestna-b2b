import { memo } from "react";

import FilterAccordion from "@components/filtersBox/FilterAccordion";
import ServicesListing from "./ServicesListing";
import AccommodationListing from "./AccommodationListing";

const ServiceCategory = ({
  title,
  list = [],
  action,
  state,
  accommodation = false,
}) => {
  if (!list) return null;

  return (
    <FilterAccordion title={title} summaryColor="#1F2626" summaryFontSize={22}>
      {accommodation ? (
        <AccommodationListing list={list} action={action} state={state} />
      ) : Array.isArray(list) && list[0]?.list ? (
        <div className="flex flex-col gap-8">
          {list.map((service, index) => (
            <div className="flex flex-col gap-5" key={index}>
              {service.subTitle && (
                <h3 className="text-xl font-semibold">{service.subTitle}</h3>
              )}

              <ServicesListing
                list={service.list || []}
                action={service.action}
                state={service.state}
              />
            </div>
          ))}
        </div>
      ) : (
        <ServicesListing list={list} action={action} state={state} />
      )}
    </FilterAccordion>
  );
};

export default memo(ServiceCategory);
