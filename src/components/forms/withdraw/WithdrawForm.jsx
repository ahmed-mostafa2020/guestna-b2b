"use client";

import { useTranslations, useLocale } from "next-intl";

import { useMemo, useState } from "react";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import TransferMethodSelector from "./TransferMethodSelector";
import STCPayForm from "./STCPayForm";
import BankTransferForm from "./BankTransferForm";

import { Formik, Form } from "formik";
import { createWithdrawValidationSchema } from "@utils/validators/validationSchemas";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";

const WithdrawForm = ({ balance, balanceLoading, refetchBalance }) => {
  const locale = useLocale();
  const t = useTranslations("profile.myWallet.withdrawPage");
  const queryClient = useQueryClient();

  const [transferMethod, setTransferMethod] = useState("bank");
  const [selectedTrips, setSelectedTrips] = useState([]);

  const {
    data: invoicesData,
    isLoading: tripsLoading,
    error: tripsError,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.TRIPS,
    {},
    {
      method: "GET",
      lang: locale,
    }
  );

  // Fetch default bank transfer account
  const { data: defaultBankData, isLoading: defaultBankLoading } = useFetchData(
    B2B_END_POINTS.PROFILE.BANK_TRANSFER_DEFAULT,
    {},
    {
      method: "GET",
      lang: locale,
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
        schoolName:
          trip.organizationName ||
          trip.schoolName ||
          trip.organization?.name ||
          "",
      }));
    }

    return [];
  }, [invoicesData]);

  const hasDefaultBank = !!(
    defaultBankData?.bankName ||
    defaultBankData?.iban ||
    defaultBankData?.clientName
  );

  const initialValues = useMemo(
    () => ({
      selectedTripIds: [],
      withdrawAmount: "",
      phoneNumber: "",
      bankName: defaultBankData?.bankName || "",
      clientName: defaultBankData?.clientName || "",
      ibanNumber: defaultBankData?.iban || "",
      withdrawNotes: "",
    }),
    [
      defaultBankData?.bankName,
      defaultBankData?.clientName,
      defaultBankData?.iban,
    ]
  );

  const isBankTransfer = transferMethod === "bank";

  const withdrawalValidationSchema = createWithdrawValidationSchema(
    t,
    isBankTransfer
  );

  const { enqueueSnackbar } = useSnackbar();

  // Handle multi-trip selection
  const handleTripSelection = (tripIds, setFieldValue, validateForm) => {
    setFieldValue("selectedTripIds", tripIds);

    // Find all selected trips
    const trips = completedTrips.filter((t) => tripIds.includes(t._id));
    setSelectedTrips(trips);

    // Auto-fill the withdrawal amount with the sum of selected trips' amounts
    const totalAmount = trips.reduce((sum, trip) => sum + trip.amount, 0);
    setFieldValue(
      "withdrawAmount",
      totalAmount > 0 ? totalAmount.toString() : ""
    );

    // Force validation to run after setting values
    setTimeout(() => validateForm(), 0);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const requestBody = {
        trips: selectedTrips.map((trip) => trip._id),
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
        setSelectedTrips([]);
        refetchBalance();
        // Refetch trips list to update available trips for withdrawal
        queryClient.invalidateQueries({
          queryKey: ["fetchData", B2B_END_POINTS.PROFILE.TRIPS],
        });
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
      validateOnMount={true}
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
        validateForm,
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
              // Reset selected trips when switching methods
              setSelectedTrips([]);
              setFieldValue("selectedTripIds", []);
              setFieldValue("withdrawAmount", "");
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
              selectedTrips={selectedTrips}
              onTripSelection={handleTripSelection}
              validateForm={validateForm}
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
              selectedTrips={selectedTrips}
              onTripSelection={handleTripSelection}
              hasDefaultBank={hasDefaultBank}
              defaultBankLoading={defaultBankLoading}
              validateForm={validateForm}
            />
          )}

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                balanceLoading ||
                selectedTrips.length === 0 ||
                Object.keys(errors).length > 0
              }
              className={`w-full py-4 px-6 rounded-lg font-bold text-white text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4 transform ${
                isSubmitting ||
                balanceLoading ||
                selectedTrips.length === 0 ||
                Object.keys(errors).length > 0
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
            {selectedTrips.length === 0 && (
              <p className="text-center text-secColor pt-2 text-sm">
                {t("debug.selectTrip")}
              </p>
            )}
            {selectedTrips.length > 0 && !isValid && (
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
