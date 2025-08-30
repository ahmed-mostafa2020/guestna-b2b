"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const WithdrawPage = () => {
  const t = useTranslations();
  const [transferMethod, setTransferMethod] = useState("stc");
  const [withdrawValue, setWithdrawValue] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [ibanNumber, setIbanNumber] = useState("");
  const [selectedAccountHolder, setSelectedAccountHolder] = useState("");
  const [withdrawNotes, setWithdrawNotes] = useState("");

  // Mock data for balances
  const balanceData = {
    totalBalance: 1250,
    availableBalance: 1250,
    holdBalance: 1250,
  };

  // Mock data for banks and account holders
  const banks = [
    "البنك الأهلي السعودي",
    "بنك الراجحي",
    "بنك سامبا",
    "بنك الرياض",
    "بنك الجزيرة",
    "بنك الإنماء",
  ];

  const accountHolders = [
    "أحمد محمد",
    "فاطمة علي",
    "محمد عبدالله",
    "سارة أحمد",
    "علي حسن",
  ];

  const _renderBalanceCard = (title, balance) => {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-right">
          <h3 className="text-lg font-medium text-gray-600 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{balance}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Balance Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance Card */}
          {_renderBalanceCard(
            t("profile.myWallet.totalBalance"),
            balanceData.totalBalance.toLocaleString("ar-SA")
          )}

          {/* Available Balance Card */}
          {_renderBalanceCard(
            t("profile.myWallet.availableBalance"),
            balanceData.availableBalance.toLocaleString("ar-SA")
          )}

          {/* Hold Balance Card */}
          {_renderBalanceCard(
            t("profile.myWallet.holdBalance"),
            balanceData.holdBalance.toLocaleString("ar-SA")
          )}
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col gap-2">
            {/* STC Pay form */}
            {transferMethod === "stc" && (
              <div className="mb-6">
                <div className="flex flex-col gap-2">
                  <p className="text-gray-700 mb-2">مبلغ السحب</p>
                  <input
                    type="text"
                    placeholder="مبلغ السحب"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007473] focus:border-transparent"
                  />
                </div>
                <p className="text-gray-700 mb-2">الحد الأقصى: 125,000 ريال</p>
              </div>
            )}

            {/* Bank Transfer form */}
            {transferMethod === "bank" && (
              <div className="mt-6 space-y-6">
                {/* First row: Withdraw value + Bank name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-700 mb-2">مبلغ السحب</p>
                    <input
                      type="text"
                      placeholder="مبلغ السحب"
                      value={withdrawValue}
                      onChange={(e) => setWithdrawValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-700 mb-2">اسم البنك</p>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">اختر البنك</option>
                      {banks.map((bank, index) => (
                        <option key={index} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Second row: IBAN + Account holder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-700 mb-2">رقم الآيبان</p>
                    <input
                      type="text"
                      placeholder="SA1234567890123456789012"
                      value={ibanNumber}
                      onChange={(e) => setIbanNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-gray-700 mb-2">اسم صاحب الحساب</p>
                    <select
                      value={selectedAccountHolder}
                      onChange={(e) => setSelectedAccountHolder(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">اختر صاحب الحساب</option>
                      {accountHolders.map((holder, index) => (
                        <option key={index} value={holder}>
                          {holder}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Third row: Optional notes (full width) */}
                <div className="flex flex-col gap-2">
                  <p className="text-gray-700 mb-2">ملاحظات السحب (اختياري)</p>
                  <textarea
                    placeholder="أضف أي ملاحظات أو تعليمات خاصة بعملية السحب..."
                    value={withdrawNotes}
                    onChange={(e) => setWithdrawNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            <div>
              <p>وسيلة التحويل</p>
              <div className="mt-4 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="transferMethod"
                    value="stc"
                    checked={transferMethod === "stc"}
                    onChange={(e) => setTransferMethod(e.target.value)}
                    className="w-4 h-4 me-2 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 checked:bg-green-600 checked:border-green-600"
                  />
                  <span className="text-gray-700">STC Pay</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="transferMethod"
                    value="bank"
                    checked={transferMethod === "bank"}
                    onChange={(e) => setTransferMethod(e.target.value)}
                    className="w-4 h-4 me-2 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 checked:bg-green-600 checked:border-green-600"
                  />
                  <span className="text-gray-700">تحويل بنكي</span>
                </label>
              </div>

              {/* Submit button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#007473] text-white py-3 px-6 rounded-md  focus:ring-offset-2 transition-colors"
                >
                  تقديم طلب السحب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
