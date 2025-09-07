import { useTranslations } from "next-intl";

const BankTransferForm = ({
  values,
  errors,
  touched,
  setFieldValue,
  balance,
  formatIBAN,
  formatClientName,
}) => {
  const t = useTranslations("profile.myWallet.withdrawPage.bankTransfer");

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
            {t("bankName.label")} *
          </label>
          <input
            type="text"
            placeholder={t("bankName.placeholder")}
            value={values.bankName}
            onChange={(e) => setFieldValue("bankName", e.target.value)}
            onBlur={() => setFieldValue("bankName", values.bankName)}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.bankName && touched.bankName
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            id="bank-name"
            name="bankName"
          />
          {renderError("bankName")}
          <p className="text-xs text-gray-500 mt-2 text-right">
            {t("bankName.hint")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
            {t("clientName.label")} *
          </label>
          <input
            type="text"
            placeholder={t("clientName.placeholder")}
            value={values.clientName}
            onChange={(e) =>
              setFieldValue("clientName", formatClientName(e.target.value))
            }
            onBlur={() => setFieldValue("clientName", values.clientName)}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.clientName && touched.clientName
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            id="client-name"
            name="clientName"
          />
          {renderError("clientName")}
          <p className="text-xs text-gray-500 mt-2 text-right">
            {t("clientName.hint")}
          </p>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
            {t("iban.label")} *
          </label>
          <input
            type="text"
            value={values.ibanNumber}
            onChange={(e) =>
              setFieldValue("ibanNumber", formatIBAN(e.target.value))
            }
            onBlur={() => setFieldValue("ibanNumber", values.ibanNumber)}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.ibanNumber && touched.ibanNumber
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            maxLength="34"
            id="iban-number"
            name="ibanNumber"
          />
          {renderError("ibanNumber")}
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

export default BankTransferForm;
