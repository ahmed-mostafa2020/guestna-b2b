"use client";

import { useTranslations } from "next-intl";

/**
 * Orders Settings Tab Content
 * This component displays the settings section for orders management
 */
const OrdersSettings = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-2xl p-4 lg:p-8 shadow-card">
      <h2 className="text-lg font-medium lg:text-3xl mb-4 lg:mb-8">
        {t("profile.tables.orders.tabs.settings")}
      </h2>

      <div className="p-8 text-center">
        <p className="text-gray-600">Settings content will be added here</p>
      </div>
    </div>
  );
};

export default OrdersSettings;
