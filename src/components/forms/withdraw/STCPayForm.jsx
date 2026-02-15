import { useTranslations } from "next-intl";
import TextInputGroup from "../TextInputGroup";
import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const STCPayForm = ({
  values,
  errors,
  touched,
  setFieldValue,
  handleBlur,
  balance,
  formatPhoneNumber,
  completedTrips,
  tripsLoading,
  tripsError,
  selectedTrips,
  onTripSelection,
  validateForm,
}) => {
  const t = useTranslations("profile.myWallet.withdrawPage.stcPay");

  const handleTripsChange = (event) => {
    const selectedIds = event.target.value;
    onTripSelection(selectedIds, setFieldValue, validateForm);
  };

  const renderSelectedTrips = (selected) => {
    if (!selected || !Array.isArray(selected) || selected.length === 0) {
      return (
        <span className="text-textLight opacity-60 text-sm font-somar">
          {tripsLoading
            ? t("trips.loading")
            : completedTrips.length === 0
              ? t("trips.noTrips")
              : t("trips.placeholder")}
        </span>
      );
    }
    const names = selected
      .map((id) => {
        const trip = completedTrips.find((tr) => tr._id === id);
        return trip ? trip.name : "";
      })
      .filter(Boolean);
    return names.join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Multi-Select Trips */}
      <div>
        <FormControl className="w-full">
          <label className="block pb-2 font-medium text-textDark">
            {t("trips.label")}
            <span className="text-error ml-1">*</span>
          </label>
          <Select
            multiple
            value={values.selectedTripIds || []}
            onChange={handleTripsChange}
            displayEmpty
            disabled={tripsLoading || completedTrips.length === 0}
            IconComponent={KeyboardArrowDown}
            renderValue={renderSelectedTrips}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  fontFamily: "var(--font-somar-sans), sans-serif",
                  "& .MuiMenuItem-root": {
                    fontFamily: "var(--font-somar-sans), sans-serif",
                  },
                },
              },
            }}
            sx={{
              width: "100%",
              fontFamily: "var(--font-somar-sans), sans-serif",
              "& .MuiSelect-select": {
                paddingRight: "40px !important",
                border: "2px solid var(--color-border)",
                borderRadius: "8px",
                width: "100%",
                fontFamily: "var(--font-somar-sans), sans-serif",
                "&:hover": {
                  border: "2px solid var(--color-main)",
                },
                "&:focus": {
                  border: "2px solid var(--color-main)",
                },
              },
              "& .MuiSelect-icon": {
                right: "10px !important",
                left: "auto !important",
                color: "var(--color-text)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            {completedTrips.map((trip) => (
              <MenuItem key={trip._id} value={trip._id}>
                <Checkbox
                  checked={(values.selectedTripIds || []).includes(trip._id)}
                  sx={{
                    color: "var(--color-text)",
                    "&.Mui-checked": {
                      color: "var(--color-main)",
                    },
                  }}
                />
                <ListItemText
                  primary={
                    <span className="flex items-center justify-between w-full gap-2">
                      <span className="font-medium truncate">
                        {trip.name}
                        {trip.schoolName && (
                          <span className="text-xs text-textLight ms-1">
                            ({trip.schoolName})
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-bold text-mainColor shrink-0">
                        {trip.amount.toLocaleString()} {t("amount.currency")}
                      </span>
                    </span>
                  }
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {tripsError && (
          <p className="text-red-600 text-sm mt-1">{t("trips.error")}</p>
        )}
        {!tripsLoading && !tripsError && completedTrips.length === 0 && (
          <p className="text-amber-600 text-sm mt-1">{t("trips.noTrips")}</p>
        )}
      </div>

      {/* Selected Trips Summary */}
      {selectedTrips.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-textDark mb-2">
            {t("trips.selectedTrips")} ({selectedTrips.length})
          </p>
          <div className="space-y-2">
            {selectedTrips.map((trip) => (
              <div
                key={trip._id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-textDark truncate">
                  {trip.name}
                  {trip.schoolName && (
                    <span className="text-xs text-textLight ms-1">
                      ({trip.schoolName})
                    </span>
                  )}
                </span>
                <span className="font-bold text-mainColor shrink-0 ms-2">
                  {trip.amount.toLocaleString()} {t("amount.currency")}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-300 pt-2 flex items-center justify-between text-sm font-bold">
              <span className="text-textDark">{t("amount.total")}</span>
              <span className="text-mainColor">
                {selectedTrips
                  .reduce((sum, trip) => sum + trip.amount, 0)
                  .toLocaleString()}{" "}
                {t("amount.currency")}
              </span>
            </div>
          </div>
        </div>
      )}

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
            min="50"
            max={balance?.availableBalance}
            readOnly={true}
            required={true}
          />
          <p className="text-xs text-gray-500 pt-2 text-start">
            {selectedTrips.length > 0
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
            onBlur={handleBlur}
            maxLength="10"
            required={true}
            textAlign="end"
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
        />
      </div>
    </div>
  );
};

export default STCPayForm;
