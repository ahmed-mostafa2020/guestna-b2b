"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

const WithdrawPage = () => {
  const t = useTranslations();

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

  // API data fetching for balance
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.INVOICES,
    {},
    {
      method: "GET",
      cacheTime: 300000,
      staleTime: 300000,
    }
  );

  // Local balance state
  const [balance, setBalance] = useState({
    totalBalance: 0,
    availableBalance: 0,
    holdBalance: 0,
  });

  // Process balance data when it arrives
  useEffect(() => {
    if (balanceData) {
      if (
        balanceData.availableBalance !== undefined ||
        balanceData.totalRevenue !== undefined ||
        balanceData.pendingBalance !== undefined
      ) {
        setBalance({
          totalBalance: balanceData.totalRevenue || 0,
          availableBalance: balanceData.availableBalance || 0,
          holdBalance: balanceData.pendingBalance || 0,
        });
      }
    }
  }, [balanceData]);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      newErrors.amount = "يرجى إدخال مبلغ صحيح";
    } else if (parseFloat(withdrawAmount) > balance.availableBalance) {
      newErrors.amount = `المبلغ المطلوب يتجاوز الرصيد المتاح (${balance.availableBalance.toLocaleString(
        "ar-SA"
      )} ريال)`;
    } else if (parseFloat(withdrawAmount) < 50) {
      newErrors.amount = "الحد الأدنى للسحب هو 50 ريال";
    }

    // STC Pay validation
    if (transferMethod === "stc") {
      if (!phoneNumber) {
        newErrors.phone = "يرجى إدخال رقم الهاتف";
      } else if (!/^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/.test(phoneNumber)) {
        newErrors.phone = "يرجى إدخال رقم هاتف صحيح (مثال: 0501234567)";
      }
    }

    // Bank transfer validation
    if (transferMethod === "bank") {
      if (!bankName) {
        newErrors.bankName = "يرجى إدخال اسم البنك";
      }
      if (!clientName) {
        newErrors.clientName = "يرجى إدخال اسم صاحب الحساب";
      }
      if (!ibanNumber) {
        newErrors.iban = "يرجى إدخال رقم الآيبان";
      } else if (!/^SA[0-9]{22}$/.test(ibanNumber.replace(/\s/g, ""))) {
        newErrors.iban =
          "يرجى إدخال رقم آيبان صحيح (مثال: SA1234567890123456789012)";
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
        alert("تم تقديم طلب السحب بنجاح");
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
        throw new Error(result.message || "حدث خطأ أثناء تقديم طلب السحب");
      }
    } catch (error) {
      console.error("Withdrawal error:", error);
      alert(error.message || "حدث خطأ أثناء تقديم طلب السحب");
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

  // Render balance card
  const renderBalanceCard = (title, balance, loading = false) => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="text-center sm:text-right">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-lg mx-auto sm:mr-0"></div>
          ) : (
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {balance.toLocaleString("ar-SA")} ريال
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render error message
  const renderError = (field) => {
    return errors[field] ? (
      <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Page Title */}
        <div className="text-center sm:text-right bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            سحب الأموال
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto sm:mr-0">
            اختر وسيلة السحب المفضلة لديك وسحب أموالك بسهولة وأمان
          </p>
        </div>

        {/* Spacer */}

        {/* Balance Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {renderBalanceCard(
            "إجمالي الرصيد",
            balance.totalBalance,
            balanceLoading
          )}
          {renderBalanceCard(
            "الرصيد المتاح",
            balance.availableBalance,
            balanceLoading
          )}
          {renderBalanceCard(
            "الرصيد المعلق",
            balance.holdBalance,
            balanceLoading
          )}
        </div>

        {/* Error Display */}
        {balanceError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
            <div className="text-center">
              <p className="text-red-800 font-medium text-base mb-3">
                حدث خطأ في تحميل بيانات الرصيد
              </p>
              <button
                onClick={() => refetchBalance()}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Withdrawal Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          {/* STC Pay Form */}
          {transferMethod === "stc" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
                    مبلغ السحب *
                  </label>
                  <input
                    type="number"
                    placeholder="أدخل المبلغ"
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
                  />
                  {renderError("amount")}
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    الحد الأدنى: 50 ريال | الحد الأقصى:{" "}
                    {balance.availableBalance.toLocaleString("ar-SA")} ريال
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    placeholder="0501234567"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(formatPhoneNumber(e.target.value))
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    maxLength="10"
                  />
                  {renderError("phone")}
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    رقم هاتف سعودي صحيح
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  placeholder="أضف أي ملاحظات أو تعليمات خاصة بعملية السحب..."
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
          )}

          {/* Bank Transfer Form */}
          {transferMethod === "bank" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
                    مبلغ السحب *
                  </label>
                  <input
                    type="number"
                    placeholder="أدخل المبلغ"
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
                  />
                  {renderError("amount")}
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    الحد الأدنى: 50 ريال | الحد الأقصى:{" "}
                    {balance.availableBalance.toLocaleString("ar-SA")} ريال
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
                    اسم البنك *
                  </label>
                  <input
                    type="text"
                    placeholder="أدخل اسم البنك"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
                      errors.bankName
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {renderError("bankName")}
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    مثال: البنك الأهلي السعودي، بنك الراجحي
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
                    اسم صاحب الحساب *
                  </label>
                  <input
                    type="text"
                    placeholder="اسم صاحب الحساب كما يظهر في البنك"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
                      errors.clientName
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {renderError("clientName")}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
                    رقم الآيبان *
                  </label>
                  <input
                    type="text"
                    placeholder="SA1234567890123456789012"
                    value={ibanNumber}
                    onChange={(e) => setIbanNumber(formatIBAN(e.target.value))}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base transition-all duration-200 ${
                      errors.iban
                        ? "border-red-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    maxLength="34"
                  />
                  {renderError("iban")}
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    رقم آيبان سعودي صحيح
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-base mb-2 text-right">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  placeholder="أضف أي ملاحظات أو تعليمات خاصة بعملية السحب..."
                  value={withdrawNotes}
                  onChange={(e) => setWithdrawNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
          )}

          {/* Transfer Method Selection */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center sm:text-right">
              وسيلة التحويل
            </h3>
            <div className="flex flex-col gap-4 mt-4">
              <label
                className={`flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  transferMethod === "stc"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="transferMethod"
                  value="stc"
                  checked={transferMethod === "stc"}
                  onChange={(e) => setTransferMethod(e.target.value)}
                  className="w-5 h-5 me-2 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 checked:bg-green-600 checked:border-green-600"
                />
                <div className="text-right flex-1">
                  <span className="text-gray-900 font-bold text-base block mb-1">
                    STC Pay
                  </span>
                  <span className="text-gray-600 text-xs">
                    سحب فوري إلى رقم الهاتف
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center space-x-3 cursor-pointer p-4 border-2 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  transferMethod === "bank"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <input
                  type="radio"
                  name="transferMethod"
                  value="bank"
                  checked={transferMethod === "bank"}
                  onChange={(e) => setTransferMethod(e.target.value)}
                  className="w-5 h-5 me-2 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 checked:border-green-600"
                />
                <div className="text-right flex-1">
                  <span className="text-gray-900 font-bold text-base block mb-1">
                    تحويل بنكي
                  </span>
                  <span className="text-gray-600 text-xs">
                    تحويل إلى الحساب البنكي
                  </span>
                </div>
              </label>
            </div>
          </div>

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
                  جاري التقديم...
                </div>
              ) : (
                "تقديم طلب السحب"
              )}
            </button>

            {balanceLoading && (
              <p className="text-center text-gray-500 mt-2 text-base">
                جاري تحميل بيانات الرصيد...
              </p>
            )}
          </div>
        </form>

        {/* Information Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
          <div className="text-center sm:text-right">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              معلومات مهمة
            </h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li className="flex items-center justify-center sm:justify-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
                الحد الأدنى للسحب: 50 ريال
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
                الحد الأقصى للسحب: الرصيد المتاح
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
                STC Pay: سحب فوري خلال دقائق
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
                التحويل البنكي: 1-3 أيام عمل
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
                سيتم خصم رسوم بنكية حسب البنك
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
