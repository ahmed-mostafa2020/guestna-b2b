"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import { useFetchData } from "@hooks/useFetchData";
import TransferMethodSelector from "./TransferMethodSelector";
import STCPayForm from "./STCPayForm";
import BankTransferForm from "./BankTransferForm";
import { useLocale } from "next-intl";

const WithdrawForm = ({
  invoicesData,
  balanceData,
  balanceLoading,
  refetchBalance,
}) => {
const WithdrawForm = ({ balance, balanceLoading, refetchBalance }) => {
  const locale = useLocale();
  const t = useTranslations("profile.myWallet.withdrawPage");

  // Form state
  const [transferMethod, setTransferMethod] = useState("stc");
  const [selectedTrip, setSelectedTrip] = useState(null);
  // Filter invoices to only show DONE status trips
  const completedTrips =
    invoicesData?.nodes?.filter((invoice) => invoice.status === "DONE") || [];

  // Initial form values
  const initialValues = {
    selectedTripId: "",
    withdrawAmount: "",
    phoneNumber: "",
    bankName: "",
    clientName: "",
    ibanNumber: "",
    withdrawNotes: "",
  };

  // Yup validation schema
  const getValidationSchema = () => {
    return Yup.object().shape({
      selectedTripId: Yup.string().required(t("validation.tripRequired")),

      phoneNumber:
        transferMethod === "stc"
          ? Yup.string()
              .required(t("validation.phoneRequired"))
              .matches(
                /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/,
                t("validation.phoneInvalid")
              )
          : Yup.string().notRequired(),
      bankName:
        transferMethod === "bank"
          ? Yup.string().required(t("validation.bankNameRequired"))
          : Yup.string().notRequired(),
      clientName:
        transferMethod === "bank"
          ? Yup.string()
              .required(t("validation.clientNameRequired"))
              .matches(/^[a-zA-Z\s]+$/, t("validation.clientNameInvalid"))
              .min(2, t("validation.clientNameMin"))
              .max(50, t("validation.clientNameMax"))
          : Yup.string().notRequired(),
      ibanNumber:
        transferMethod === "bank"
          ? Yup.string().required(t("validation.ibanRequired"))
          : Yup.string().notRequired(),
      withdrawNotes: Yup.string(),
    });
  };

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

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const requestBody = {
        trip: selectedTrip ? { id: selectedTrip._id } : {},
        amount: parseFloat(values.withdrawAmount),
        type: transferMethod === "stc" ? "STC_PAY" : "BANK_TRANSFER",
        note: values.withdrawNotes || "",
        ...(transferMethod === "stc" && {
          stcPay: {
            phone: values.phoneNumber,
          },
        }),
        ...(transferMethod === "bank" && {
          bankTransfer: {
            bankName: values.bankName,
            clientName: values.clientName,
            iban: values.ibanNumber.replace(/\s/g, ""),
          },
        }),
      };

      const response = await fetch(
        `/api/proxy?path=${B2B_END_POINTS.PROFILE.WITHDRAWALS}`,
        {
          method: "POST",
          headers: getHeaders(locale),
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Success
        alert(t("success.message"));
        // Reset form
        resetForm();
        // Refresh balance
        refetchBalance();
      } else {
        // API error
        throw new Error(result.message || t("error.submission"));
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert(error.message || t("error.submission"));
    } finally {
      setSubmitting(false);
    }
  };

  // Format phone number input
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
    const cleaned = value.replace(/\s/g, "").toUpperCase();
    // Format with spaces every 4 characters for better readability
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  // Format client name input (only allow letters A-Z, a-z and spaces)
  const formatClientName = (value) => {
    // Remove any characters that are not letters (A-Z, a-z) or spaces
    return value.replace(/[^a-zA-Z\s]/g, "");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, isSubmitting }) => (
        <Form className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          {/* STC Pay Form */}
          {transferMethod === "stc" && (
            <STCPayForm
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              balance={balanceData}
              formatPhoneNumber={formatPhoneNumber}
              completedTrips={completedTrips}
              tripsLoading={false}
              tripsError={null}
              selectedTrip={selectedTrip}
              onTripSelection={handleTripSelection}
            />
          )}

          {/* Bank Transfer Form */}
          {transferMethod === "bank" && (
            <BankTransferForm
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              balance={balanceData}
              formatIBAN={formatIBAN}
              formatClientName={formatClientName}
              completedTrips={completedTrips}
              tripsLoading={false}
              tripsError={null}
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
