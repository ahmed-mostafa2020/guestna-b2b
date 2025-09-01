import { useTranslations } from "next-intl";

const STCPayForm = ({
  withdrawAmount,
  setWithdrawAmount,
  phoneNumber,
  setPhoneNumber,
  withdrawNotes,
  setWithdrawNotes,
  balance,
  errors,
  renderError,
  formatPhoneNumber,
}) => {
  const t = useTranslations("profile.myWallet.withdrawPage.stcPay");

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
            {t("phone.label")} *
          </label>
          <input
            type="tel"
            placeholder={t("phone.placeholder")}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
              errors.phone
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            maxLength="10"
            id="phone-number"
            name="phoneNumber"
          />
          {renderError("phone")}
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

export default STCPayForm;
