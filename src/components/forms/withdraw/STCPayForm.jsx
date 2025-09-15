import { useTranslations } from "next-intl";

const STCPayForm = ({
  values,
  errors,
  touched,
  setFieldValue,
  balance,
  formatPhoneNumber,
  completedTrips,
  tripsLoading,
  tripsError,
  selectedTrip,
  onTripSelection,
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
      {/* Trips Dropdown */}
      <div>
        <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
          {t("trips.label")} *
        </label>
        <div className="relative">
          <select
            value={values.selectedTripId || ""}
            onChange={(e) => onTripSelection(e.target.value, setFieldValue)}
            className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 appearance-none cursor-pointer ${
              errors.selectedTripId && touched.selectedTripId
                ? "border-red-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
            id="selected-trip"
            name="selectedTripId"
            disabled={tripsLoading}
          >
            <option value="">
              {tripsLoading
                ? t("trips.loading")
                : completedTrips.length === 0
                ? t("trips.noTrips")
                : t("trips.placeholder")}
            </option>
            {completedTrips.map((trip) => (
              <option key={trip._id} value={trip._id}>
                {trip.name ||
                  trip.tripName ||
                  trip.operationName ||
                  trip.tripTitle ||
                  trip.organizationName ||
                  "رحلة"}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {renderError("selectedTripId")}
        {tripsError && (
          <p className="text-red-600 text-sm mt-1">{t("trips.error")}</p>
        )}
        {!tripsLoading && !tripsError && completedTrips.length === 0 && (
          <p className="text-amber-600 text-sm mt-1">{t("trips.noTrips")}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
            {t("amount.label")} *
          </label>
          <input
            type="number"
            placeholder={t("amount.placeholder")}
            value={values.withdrawAmount}
            readOnly
            className={`w-full px-4 py-3 border-2 rounded-xl text-right text-base transition-all duration-200 bg-gray-50 cursor-not-allowed ${
              errors.withdrawAmount && touched.withdrawAmount
                ? "border-red-500"
                : "border-gray-200"
            }`}
            min="50"
            max={balance?.availableBalance}
            step="0.01"
            id="withdraw-amount"
            name="withdrawAmount"
          />
          {renderError("withdrawAmount")}
          <p className="text-xs text-gray-500 mt-2 text-right">
            {selectedTrip
              ? t("amount.autoFilled")
              : t("amount.selectTripFirst")}
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
