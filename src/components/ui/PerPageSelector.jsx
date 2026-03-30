import { memo } from "react";
import { useTranslations } from "next-intl";

const PerPageSelector = ({
  currentPerPage,
  onPerPageChange,
  options = [10, 25, 50, 100],
  className = "",
}) => {
  const t = useTranslations("profile.myWallet.transactionsPage.table");

  return (
    <div className={`flex items-center space-x-2 space-x-reverse ${className}`}>
      <span className="text-sm text-gray-700">{t("show")}</span>
      <select
        value={currentPerPage}
        onChange={(e) => onPerPageChange(parseInt(e.target.value))}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-700">{t("itemsPerPage")}</span>
    </div>
  );
};

export default memo(PerPageSelector);
