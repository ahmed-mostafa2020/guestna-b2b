"use client";

import { useTranslations } from "next-intl";

const EmptyState = ({ title, description, icon = null }) => {
  const t = useTranslations();
  return (
    <div className="text-center py-16">
      <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
        {icon ? (
          icon
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-inner"></div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 mb-6 text-lg">{description}</p>
    </div>
  );
};

export default EmptyState;
