import { useTranslations } from "next-intl";
import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";

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

  // Transform trips data for DropdownGroup
  const tripsMenuItems = completedTrips.map((trip) => ({
    _id: trip._id,
    name: trip.name,
  }));

  return (
    <div className="space-y-6">
      {/* Trips Dropdown */}
      <div>
        <DropdownGroup
          label={t("trips.label")}
          placeholder={
            tripsLoading
              ? t("trips.loading")
              : completedTrips.length === 0
              ? t("trips.noTrips")
              : t("trips.placeholder")
          }
          value={values.selectedTripId || ""}
          onChange={(e) => onTripSelection(e.target.value, setFieldValue)}
          menuItemsList={tripsMenuItems}
          required={true}
          disabled={tripsLoading}
        />
        {tripsError && (
          <p className="text-red-600 text-sm mt-1">{t("trips.error")}</p>
        )}
        {!tripsLoading && !tripsError && completedTrips.length === 0 && (
          <p className="text-amber-600 text-sm mt-1">{t("trips.noTrips")}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextInputGroup
            label={t("amount.label")}
            type="number"
            name="withdrawAmount"
            placeholder={t("amount.placeholder")}
            value={values.withdrawAmount}
            errors={errors.withdrawAmount}
            touched={touched.withdrawAmount}
            onChange={(e) => setFieldValue("withdrawAmount", e.target.value)}
            onBlur={() => setFieldValue("withdrawAmount", values.withdrawAmount)}
            min="50"
            max={balance?.availableBalance}
            readOnly={true}
            required={true}
            textAlign="right"
          />
          <p className="text-xs text-gray-500 mt-2 text-right">
            {selectedTrip
              ? t("amount.autoFilled")
              : t("amount.selectTripFirst")}
          </p>
        </div>

        <div>
          <TextInputGroup
            label={t("phone.label")}
            type="tel"
            name="phoneNumber"
            placeholder={t("phone.placeholder")}
            value={values.phoneNumber}
            errors={errors.phoneNumber}
            touched={touched.phoneNumber}
            onChange={(e) =>
              setFieldValue("phoneNumber", formatPhoneNumber(e.target.value))
            }
            onBlur={() => setFieldValue("phoneNumber", values.phoneNumber)}
            maxLength="10"
            required={true}
            textAlign="right"
          />
          <p className="text-xs text-gray-500 mt-2 text-right">
            {t("phone.hint")}
          </p>
        </div>
      </div>

      <div>
        <TextInputGroup
          label={t("notes.label")}
          name="withdrawNotes"
          placeholder={t("notes.placeholder")}
          value={values.withdrawNotes}
          errors={errors.withdrawNotes}
          touched={touched.withdrawNotes}
          onChange={(e) => setFieldValue("withdrawNotes", e.target.value)}
          onBlur={() => setFieldValue("withdrawNotes", values.withdrawNotes)}
          textarea={true}
          rows={3}
          textAlign="right"
        />
      </div>
    </div>
  );
};

export default STCPayForm;
