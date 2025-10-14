import { useTranslations } from "next-intl";
import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";

const BankTransferForm = ({
  values,
  errors,
  touched,
  setFieldValue,
  handleBlur,
  balance,
  formatIBAN,
  formatClientName,
  completedTrips,
  tripsLoading,
  tripsError,
  selectedTrip,
  onTripSelection,
}) => {
  const t = useTranslations("profile.myWallet.withdrawPage.bankTransfer");

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
            onBlur={handleBlur}
            max={balance?.availableBalance}
            readOnly={true}
            required={true}
            textAlign="start"
          />
          <p className="text-xs text-gray-500 pt-2 text-start">
            {selectedTrip
              ? t("amount.autoFilled")
              : t("amount.selectTripFirst")}
          </p>
        </div>

        <div>
          <TextInputGroup
            label={t("bankName.label")}
            type="text"
            name="bankName"
            placeholder={t("bankName.placeholder")}
            value={values.bankName}
            errors={errors.bankName}
            touched={touched.bankName}
            onChange={(e) => setFieldValue("bankName", e.target.value)}
            onBlur={handleBlur}
            required={true}
            textAlign="start"
          />
          {/* <p className="text-xs text-gray-500 mt-2 text-start">
            {t("bankName.hint")}
          </p> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <TextInputGroup
            label={t("clientName.label")}
            type="text"
            name="clientName"
            placeholder={t("clientName.placeholder")}
            value={values.clientName}
            errors={errors.clientName}
            touched={touched.clientName}
            onChange={(e) =>
              setFieldValue("clientName", formatClientName(e.target.value))
            }
            onBlur={handleBlur}
            required={true}
            textAlign="start"
          />
        </div>

        <div>
          <TextInputGroup
            label={t("iban.label")}
            type="text"
            name="ibanNumber"
            placeholder="SA00 0000 0000 0000 0000 0000"
            value={values.ibanNumber}
            errors={errors.ibanNumber}
            touched={touched.ibanNumber}
            onChange={(e) =>
              setFieldValue("ibanNumber", formatIBAN(e.target.value))
            }
            onBlur={handleBlur}
            maxLength="34"
            required={true}
            textAlign="start"
          />
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
          onBlur={handleBlur}
          textarea={true}
          rows={3}
          textAlign="start"
        />
      </div>
    </div>
  );
};

export default BankTransferForm;
