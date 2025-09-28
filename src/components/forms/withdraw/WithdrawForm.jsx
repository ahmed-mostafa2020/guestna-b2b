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

const WithdrawForm = ({ balance, balanceLoading, refetchBalance }) => {
  const locale = useLocale();
  const t = useTranslations("profile.myWallet.withdrawPage");

  const [transferMethod, setTransferMethod] = useState("stc");
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
        enqueueSnackbar(t("forms.validation.success"), {
          variant: "success",
        });
        resetForm();
        refetchBalance();
      } else {
        throw new Error(result.message || t("error.submission"));
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      const errorMessage = getErrorMessage(error, t);
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
      {({ values, errors, touched, setFieldValue, handleBlur, isSubmitting }) => (
        <Form className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || balanceLoading || !selectedTrip}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4 transform hover:-translate-y-1 ${
                isSubmitting || balanceLoading || !selectedTrip
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default WithdrawForm;
