"use client";

import { useTranslations, useLocale } from "next-intl";

import { useMemo, useState } from "react";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import getErrorMessage from "@utils/getErrorMessage";
import TransferMethodSelector from "./TransferMethodSelector";
import STCPayForm from "./STCPayForm";
import BankTransferForm from "./BankTransferForm";

import { Formik, Form } from "formik";
import { createWithdrawValidationSchema } from "@utils/validationSchemas";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

const WithdrawForm = ({ balance, balanceLoading, refetchBalance }) => {
  const locale = useLocale();
  const t = useTranslations("profile.myWallet.withdrawPage");

  const [transferMethod, setTransferMethod] = useState("bank");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const {
    data: invoicesData,
    isLoading: tripsLoading,
    error: tripsError,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.TRIPS,
    {},
    {
      method: "GET",
    }
  );

  const completedTrips = useMemo(() => {
    if (!invoicesData) return [];

    const data =
      invoicesData.nodes ||
      invoicesData.data ||
      invoicesData.invoices ||
      invoicesData;

    if (Array.isArray(data)) {
      return data.map((trip) => ({
        _id: trip._id,
        name: trip.name,
        orderId: trip.orderId,
        amount: parseFloat(trip.amount || 0),
      }));
    }

    return [];
  }, [invoicesData]);

  const initialValues = {
    selectedTripId: "",
    withdrawAmount: "",
    phoneNumber: "",
    bankName: "",
    clientName: "",
    ibanNumber: "",
    withdrawNotes: "",
  };

  const isBankTransfer = transferMethod === "bank";

  const withdrawalValidationSchema = createWithdrawValidationSchema(
    t,
    isBankTransfer
  );

  const { enqueueSnackbar } = useSnackbar();

  // Handle trip selection
  const handleTripSelection = (tripId, setFieldValue) => {
    setFieldValue("selectedTripId", tripId);

    // Find the selected trip to get its details
    const trip = completedTrips.find((t) => t._id === tripId);

    if (trip) {
      setSelectedTrip(trip);
      // Auto-fill the withdrawal amount with the trip's amount
      setFieldValue("withdrawAmount", trip.amount.toString());
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const requestBody = {
        trip: selectedTrip._id,
        amount: parseFloat(values.withdrawAmount),
        type: transferMethod === "stc" ? "STC_PAY" : "BANK_TRANSFER",
        note: values.withdrawNotes || "",
        ...(transferMethod === "stc" && {
          stcPay: {
            phone: values.phoneNumber,
          },
        }),
        ...(isBankTransfer && {
          bankTransfer: {
            bankName: values.bankName,
            clientName: values.clientName,
            iban: values.ibanNumber.replace(/\s/g, "").toUpperCase(),
          },
        }),
      };

      const response = await fetch(
        getProxyUrl(B2B_END_POINTS.PROFILE.WITHDRAWALS),
        {
          method: "POST",
          headers: getHeaders(locale),
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (response.ok) {
        enqueueSnackbar(t("success.message"), {
          variant: "success",
        });
        resetForm();
        refetchBalance();
      } else {
        // Handle API error response
        const apiErrorMessage =
          result.message || result.error || t("error.submission");
        console.error("API Error:", result);
        enqueueSnackbar(apiErrorMessage, { variant: "error" });
        return; // Don't throw, just show the error and return
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      // Handle network or other errors
      const errorMessage =
        error.message || getErrorMessage(error, t) || t("error.submission");
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      return cleaned;
    } else if (cleaned.startsWith("966")) {
      return "0" + cleaned.slice(3);
    } else if (cleaned.startsWith("5")) {
      return "0" + cleaned;
    }
    return cleaned;
  };

  const formatIBAN = (value) => {
    let cleaned = value.replace(/\s/g, "").toUpperCase();

    cleaned = cleaned.replace(/[^A-Z0-9]/g, "");

    cleaned = cleaned.substring(0, 34);

    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatClientName = (value) => {
    return value.replace(/[^a-zA-Z\s]/g, "");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={withdrawalValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnBlur={true}
      validateOnChange={true}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        handleBlur,
        isSubmitting,
        isValid,
      }) => (
        <Form className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-medium pb-6 text-titleColor">
            {t("pageHeader.title")}
          </h3>

          {/* Transfer Method Selection */}
          <TransferMethodSelector
            transferMethod={transferMethod}
            setTransferMethod={(method) => {
              setTransferMethod(method);
              // Reset selected trip when switching methods
              setSelectedTrip(null);
              setFieldValue("selectedTripId", "");
            }}
          />

          {/* STC Pay Form */}
          {transferMethod === "stc" && (
            <STCPayForm
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              balance={balance}
              formatPhoneNumber={formatPhoneNumber}
              completedTrips={completedTrips}
              tripsLoading={tripsLoading}
              tripsError={tripsError}
              selectedTrip={selectedTrip}
              onTripSelection={handleTripSelection}
            />
          )}

          {/* Bank Transfer Form */}
          {isBankTransfer && (
            <BankTransferForm
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              balance={balance}
              formatIBAN={formatIBAN}
              formatClientName={formatClientName}
              completedTrips={completedTrips}
              tripsLoading={tripsLoading}
              tripsError={tripsError}
              selectedTrip={selectedTrip}
              onTripSelection={handleTripSelection}
            />
          )}

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={
                isSubmitting || balanceLoading || !selectedTrip || !isValid
              }
              className={`w-full py-4 px-6 rounded-lg font-bold text-white text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4 transform ${
                isSubmitting || balanceLoading || !selectedTrip || !isValid
                  ? "bg-mainColor cursor-not-allowed"
                  : "bg-mainColor hover:from-mainColor hover:to-mainColor focus:ring-mainColor shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <CircularProgress size={20} color="white" />

                  {t("submitting")}
                </div>
              ) : (
                t("submitButton")
              )}
            </button>

            {balanceLoading && (
              <p className="text-center text-gray-500 mt-2 text-base">
                {t("loadingBalance")}
              </p>
            )}

            {/* Debug info - remove in production */}
            {!selectedTrip && (
              <p className="text-center text-secColor pt-2 text-sm">
                {t("debug.selectTrip")}
              </p>
            )}
            {selectedTrip && !isValid && (
              <div className="text-center pt-2">
                <p className="text-error text-sm mb-2">
                  {t("debug.fillRequiredFields")}
                </p>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default WithdrawForm;
