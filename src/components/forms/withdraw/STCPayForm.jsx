import { useTranslations } from "next-intl";

const STCPayForm = ({
  values,
  errors,
  touched,
  setFieldValue,
  balance,
  formatPhoneNumber,
}) => {
  const t = useTranslations("profile.myWallet.withdrawPage.stcPay");

  // Render error message
  const renderError = (field) => {
    return errors[field] && touched[field] ? (
      <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
            {t("amount.label")} *
          </label>
          <input
            type="number"
            placeholder={t("amount.placeholder")}
            value={values.withdrawAmount}
            onChange={(e) => setFieldValue("withdrawAmount", e.target.value)}
            onBlur={() =>
              setFieldValue("withdrawAmount", values.withdrawAmount)
            }
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.withdrawAmount && touched.withdrawAmount
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            min="50"
            max={balance?.availableBalance}
            step="0.01"
            id="withdraw-amount"
            name="withdrawAmount"
          />
          {renderError("withdrawAmount")}
          <p className="text-xs text-gray-500 mt-2 text-right">
            {t("amount.limits", {
              min: "50",
              max: balance?.availableBalance?.toLocaleString("ar-SA") || 0,
            })}
          </p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
            {t("phone.label")} *
          </label>
          <input
            type="tel"
            placeholder={t("phone.placeholder")}
            value={values.phoneNumber}
            onChange={(e) =>
              setFieldValue("phoneNumber", formatPhoneNumber(e.target.value))
            }
            onBlur={() => setFieldValue("phoneNumber", values.phoneNumber)}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.phoneNumber && touched.phoneNumber
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            maxLength="10"
            id="phone-number"
            name="phoneNumber"
          />
          {renderError("phoneNumber")}
          <p className="text-xs text-gray-500 mt-2 text-right">
            {t("phone.hint")}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
          {t("notes.label")}
        </label>
        <textarea
          placeholder={t("notes.placeholder")}
          value={values.withdrawNotes}
          onChange={(e) => setFieldValue("withdrawNotes", e.target.value)}
          onBlur={() => setFieldValue("withdrawNotes", values.withdrawNotes)}
          rows={3}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base transition-all duration-200 hover:border-gray-400"
          id="withdraw-notes"
          name="withdrawNotes"
        />
      </div>
    </div>
  );
};

export default STCPayForm;
