"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import TransferMethodSelector from "./TransferMethodSelector";
import STCPayForm from "./STCPayForm";
import BankTransferForm from "./BankTransferForm";

const WithdrawForm = ({ balance, balanceLoading, refetchBalance }) => {
  const t = useTranslations("profile.myWallet.withdrawPage");

  // Form state
  const [transferMethod, setTransferMethod] = useState("stc");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [clientName, setClientName] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");
  const [withdrawNotes, setWithdrawNotes] = useState("");

  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      newErrors.amount = t("validation.amountRequired");
    } else if (parseFloat(withdrawAmount) > balance.availableBalance) {
      newErrors.amount = t("validation.amountExceedsBalance", {
        balance: balance.availableBalance.toLocaleString("ar-SA"),
      });
    } else if (parseFloat(withdrawAmount) < 50) {
      newErrors.amount = t("validation.minAmount");
    }

    // STC Pay validation
    if (transferMethod === "stc") {
      if (!phoneNumber) {
        newErrors.phone = t("validation.phoneRequired");
      } else if (!/^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(phoneNumber)) {
        newErrors.phone = t("validation.phoneInvalid");
      }
    }

    // Bank transfer validation
    if (transferMethod === "bank") {
      if (!bankName) {
        newErrors.bankName = t("validation.bankNameRequired");
      }
      if (!clientName) {
        newErrors.clientName = t("validation.clientNameRequired");
      }
      if (!ibanNumber) {
        newErrors.iban = t("validation.ibanRequired");
      } else if (!/^SA[0-9]{22}$/.test(ibanNumber.replace(/\s/g, ""))) {
        newErrors.iban = t("validation.ibanInvalid");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        trip: {},
        amount: parseFloat(withdrawAmount),
        type: transferMethod === "stc" ? "STC_PAY" : "BANK_TRANSFER",
        note: withdrawNotes || "",
        ...(transferMethod === "stc" && {
          stcPay: {
            phone: phoneNumber,
          },
        }),
        ...(transferMethod === "bank" && {
          bankTransfer: {
            bankName: bankName,
            clientName: clientName,
            iban: ibanNumber.replace(/\s/g, ""),
          },
        }),
      };

      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          lang: "ar",
        },
        body: JSON.stringify({
          path: B2B_END_POINTS.PROFILE.WITHDRAWALS,
          body: requestBody,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        alert(t("success.message"));
        // Reset form
        setWithdrawAmount("");
        setPhoneNumber("");
        setBankName("");
        setClientName("");
        setIbanNumber("");
        setWithdrawNotes("");
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
      setIsSubmitting(false);
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

  // Format IBAN input
  const formatIBAN = (value) => {
    const cleaned = value.replace(/\s/g, "").toUpperCase();
    if (cleaned.startsWith("SA")) {
      return (
        cleaned.slice(0, 2) +
        " " +
        cleaned.slice(2, 6) +
        " " +
        cleaned.slice(6, 10) +
        " " +
        cleaned.slice(10, 14) +
        " " +
        cleaned.slice(14, 18) +
        " " +
        cleaned.slice(18, 22) +
        " " +
        cleaned.slice(22, 26)
      );
    }
    return value.toUpperCase();
  };

  // Render error message
  const renderError = (field) => {
    return errors[field] ? (
      <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      {/* STC Pay Form */}
      {transferMethod === "stc" && (
        <STCPayForm
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          withdrawNotes={withdrawNotes}
          setWithdrawNotes={setWithdrawNotes}
          balance={balance}
          errors={errors}
          renderError={renderError}
          formatPhoneNumber={formatPhoneNumber}
        />
      )}

      {/* Bank Transfer Form */}
      {transferMethod === "bank" && (
        <BankTransferForm
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          bankName={bankName}
          setBankName={setBankName}
          clientName={clientName}
          setClientName={setClientName}
          ibanNumber={ibanNumber}
          setIbanNumber={setIbanNumber}
          withdrawNotes={withdrawNotes}
          setWithdrawNotes={setWithdrawNotes}
          balance={balance}
          errors={errors}
          renderError={renderError}
          formatIBAN={formatIBAN}
        />
      )}

      {/* Transfer Method Selection */}
      <TransferMethodSelector
        transferMethod={transferMethod}
        setTransferMethod={setTransferMethod}
      />

      {/* Submit Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || balanceLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-base transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-4 transform hover:-translate-y-1 ${
            isSubmitting || balanceLoading
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
    </form>
  );
};

export default WithdrawForm;
