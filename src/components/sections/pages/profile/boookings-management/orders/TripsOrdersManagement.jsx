import { useTranslations } from "next-intl";

import { activitiesOrdersManagementIcon } from "@assets/svg";

const TripsOrdersManagement = () => {
  const t = useTranslations();
  return (
    <div className="flex items-center justify-between rounded-2xl shadow-card p-4 lg:p-8 mb-4 lg:mb-8 bg-white">
      <div className="flex items-center gap-2">
        <span className="bg-mainColor rounded-[13px] p-2">
          {activitiesOrdersManagementIcon}
        </span>

        <h2 className="text-lg font-medium lg:text-2xl text-titleColor">
          {t("profile.tables.orders.tripsOrdersManagement")}
        </h2>
      </div>

      <button className="flex text-sm lg:text-base items-center gap-2 rounded-lg text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-mainColor  text-lg">
          +
        </span>

        {t("links.requestNewActivity")}
      </button>
    </div>
  );
};

export default TripsOrdersManagement;
