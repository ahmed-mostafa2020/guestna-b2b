import { useTranslations } from "next-intl";

const BankTransferForm = ({
  withdrawAmount,
  setWithdrawAmount,
  bankName,
  setBankName,
  clientName,
  setClientName,
  ibanNumber,
  setIbanNumber,
  withdrawNotes,
  setWithdrawNotes,
  balance,
  errors,
  renderError,
  formatIBAN,
}) => {
  const t = useTranslations("profile.myWallet.withdrawPage.bankTransfer");

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
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.amount
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            min="50"
            max={balance.availableBalance}
            step="0.01"
            id="withdraw-amount"
            name="withdrawAmount"
          />
          {renderError("amount")}
          <p className="text-xs text-gray-500 mt-2 text-right">
            {t("amount.limits", {
              min: "50",
              max: balance.availableBalance.toLocaleString("ar-SA"),
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
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.bankName
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
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.clientName
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            id="client-name"
            name="clientName"
          />
          {renderError("clientName")}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
            {t("iban.label")} *
          </label>
          <input
            type="text"
            placeholder={t("iban.placeholder")}
            value={ibanNumber}
            onChange={(e) => setIbanNumber(formatIBAN(e.target.value))}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.iban
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            maxLength="34"
            id="iban-number"
            name="ibanNumber"
          />
          {renderError("iban")}
          <p className="text-xs text-gray-500 mt-2 text-right">
            {t("iban.hint")}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
          {t("notes.label")}
        </label>
        <textarea
          placeholder={t("notes.placeholder")}
          value={withdrawNotes}
          onChange={(e) => setWithdrawNotes(e.target.value)}
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
