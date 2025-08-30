"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { KeyboardArrowDown, Print } from "@mui/icons-material";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

const TransactionsPage = () => {
  const t = useTranslations();

  // API data fetching
  const {
    data: invoicesData,
    isLoading,
    error,
    refetch,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.INVOICES,
    {},
    {
      method: "GET",
      cacheTime: 300000, // 5 minutes
      staleTime: 300000,
    }
  );

  // State for transactions and balances
  const [transactions, setTransactions] = useState([]);
  const [balanceData, setBalanceData] = useState({
    totalBalance: 0,
    availableBalance: 0,
    holdBalance: 0,
  });

  // Process API data when it arrives
  useEffect(() => {
    if (invoicesData) {
      console.log("Raw API response:", invoicesData); // Debug log
      try {
        // Handle balance response structure
        if (
          invoicesData.availableBalance !== undefined ||
          invoicesData.totalRevenue !== undefined ||
          invoicesData.pendingBalance !== undefined
        ) {
          // This is a balance response, not individual invoices
          setBalanceData({
            totalBalance: invoicesData.totalRevenue || 0,
            availableBalance: invoicesData.availableBalance || 0,
            holdBalance: invoicesData.pendingBalance || 0,
          });

          // Since we don't have individual transactions, we'll show a message
          setTransactions([]);
        } else {
          // Handle different API response structures for individual invoices
          const data =
            invoicesData.data || invoicesData.invoices || invoicesData;

          if (Array.isArray(data)) {
            // Transform API data to match our component structure
            const processedTransactions = data.map((invoice, index) => ({
              id: invoice.id || invoice.invoiceId || index + 1,
              operationName:
                invoice.tripName ||
                invoice.operationName ||
                invoice.tripTitle ||
                "رحلة",
              date: invoice.createdAt
                ? new Date(invoice.createdAt).toLocaleDateString("ar-SA")
                : invoice.date
                ? new Date(invoice.date).toLocaleDateString("ar-SA")
                : "غير محدد",
              referenceNumber:
                invoice.referenceNumber ||
                invoice.invoiceNumber ||
                invoice.bookingReference ||
                `INV${index + 1}`,
              amount: parseFloat(
                invoice.amount || invoice.totalAmount || invoice.price || 0
              ),
              status: mapInvoiceStatus(invoice.status || invoice.paymentStatus),
            }));

            setTransactions(processedTransactions);

            // Calculate balance data from transactions
            const totalAmount = processedTransactions.reduce(
              (sum, t) => sum + t.amount,
              0
            );
            const completedAmount = processedTransactions
              .filter((t) => t.status === "completed")
              .reduce((sum, t) => sum + t.amount, 0);
            const pendingAmount = processedTransactions
              .filter(
                (t) => t.status === "pending" || t.status === "processing"
              )
              .reduce((sum, t) => sum + t.amount, 0);

            setBalanceData({
              totalBalance: totalAmount,
              availableBalance: completedAmount,
              holdBalance: pendingAmount,
            });
          } else {
            console.warn("API response is not an array:", data);
            setTransactions([]);
            setBalanceData({
              totalBalance: 0,
              availableBalance: 0,
              holdBalance: 0,
            });
          }
        }
      } catch (error) {
        console.error("Error processing invoice data:", error);
        setTransactions([]);
        setBalanceData({
          totalBalance: 0,
          availableBalance: 0,
          holdBalance: 0,
        });
      }
    } else if (invoicesData === null && !isLoading) {
      // Handle case when API returns null/undefined
      console.warn("API returned null/undefined data");
      setTransactions([]);
      setBalanceData({ totalBalance: 0, availableBalance: 0, holdBalance: 0 });
    }
  }, [invoicesData, isLoading]);

  // Map API status to component status
  const mapInvoiceStatus = (apiStatus) => {
    if (!apiStatus) return "pending";

    const statusMap = {
      paid: "completed",
      completed: "completed",
      success: "completed",
      approved: "completed",
      pending: "pending",
      processing: "processing",
      in_progress: "processing",
      cancelled: "pending",
      failed: "pending",
      rejected: "pending",
      declined: "pending",
    };

    const normalizedStatus = apiStatus.toLowerCase().replace(/[_\s]/g, "");
    return statusMap[normalizedStatus] || "pending";
  };

  // Filter states
  const [filters, setFilters] = useState({
    operationName: "",
    transactionDate: "",
    status: "",
  });

  // Status configuration
  const statusConfig = {
    completed: {
      label: "مكتمل",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    processing: {
      label: "قيد المعالجة",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    pending: {
      label: "معلقة",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  // Format currency
  const formatCurrency = (amount) => {
    const formattedAmount = Math.abs(amount).toLocaleString("ar-SA");
    return `${amount < 0 ? "-" : ""}${formattedAmount} ريال`;
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesOperationName =
      !filters.operationName ||
      transaction.operationName === filters.operationName;

    const matchesDate =
      !filters.transactionDate || transaction.date === filters.transactionDate;

    const matchesStatus =
      !filters.status || transaction.status === filters.status;

    return matchesOperationName && matchesDate && matchesStatus;
  });

  // Handle print report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("profile.myWallet.title")}
          </h1>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center">
              <p className="text-red-800 font-medium">
                حدث خطأ في تحميل البيانات
              </p>
              <p className="text-red-600 mt-2">يرجى المحاولة مرة أخرى</p>
              <button
                onClick={() => refetch()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Balance Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-right">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("profile.myWallet.totalBalance")}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
                ) : (
                  `${balanceData.totalBalance.toLocaleString("ar-SA")} ريال`
                )}
              </p>
            </div>
          </div>

          {/* Available Balance Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-right">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("profile.myWallet.availableBalance")}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
                ) : (
                  `${balanceData.availableBalance.toLocaleString("ar-SA")} ريال`
                )}
              </p>
            </div>
          </div>

          {/* Hold Balance Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-right">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("profile.myWallet.holdBalance")}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
                ) : (
                  `${balanceData.holdBalance.toLocaleString("ar-SA")} ريال`
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Actions and Filters Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Action Buttons */}
            <div className="lg:flex-shrink-0 flex gap-3">
              <button
                onClick={() => refetch()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                تحديث
              </button>
              <button
                onClick={handlePrintReport}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Print className="w-5 h-5" />
                {t("profile.myWallet.printReport")}
              </button>
            </div>

            {/* Filters Section - Only show when we have transactions */}
            {transactions.length > 0 && (
              <div className="flex-1 lg:flex lg:flex-col lg:items-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-right">
                  {t("profile.myWallet.filterTransactions")}
                </h3>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  {/* Operation Name Filter */}
                  <div className="relative flex-1">
                    <select
                      value={filters.operationName}
                      onChange={(e) =>
                        handleFilterChange("operationName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">
                        {t("profile.myWallet.transactionName")}
                      </option>
                      {Array.from(
                        new Set(transactions.map((t) => t.operationName))
                      ).map((name, index) => (
                        <option key={index} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Transaction Date Filter */}
                  <div className="relative flex-1">
                    <select
                      value={filters.transactionDate}
                      onChange={(e) =>
                        handleFilterChange("transactionDate", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">
                        {t("profile.myWallet.transactionDate")}
                      </option>
                      {Array.from(new Set(transactions.map((t) => t.date))).map(
                        (date, index) => (
                          <option key={index} value={date}>
                            {date}
                          </option>
                        )
                      )}
                    </select>
                    <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative flex-1">
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">
                        {t("profile.myWallet.transactionStatus")}
                      </option>
                      <option value="completed">مكتمل</option>
                      <option value="processing">قيد المعالجة</option>
                      <option value="pending">معلقة</option>
                    </select>
                    <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(filters.operationName ||
                  filters.transactionDate ||
                  filters.status) && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() =>
                        setFilters({
                          operationName: "",
                          transactionDate: "",
                          status: "",
                        })
                      }
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200"
                    >
                      مسح الفلاتر
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {invoicesData &&
                (invoicesData.availableBalance !== undefined ||
                  invoicesData.totalRevenue !== undefined) ? (
                  <>
                    إجمالي الإيرادات:{" "}
                    <span className="font-medium text-gray-900">
                      {balanceData.totalBalance.toLocaleString("ar-SA")} ريال
                    </span>
                  </>
                ) : (
                  <>
                    إجمالي المعاملات:{" "}
                    <span className="font-medium text-gray-900">
                      {transactions.length}
                    </span>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {invoicesData &&
                (invoicesData.availableBalance !== undefined ||
                  invoicesData.totalRevenue !== undefined) ? (
                  <>
                    الرصيد المتاح:{" "}
                    <span className="font-medium text-gray-900">
                      {balanceData.availableBalance.toLocaleString("ar-SA")}{" "}
                      ريال
                    </span>
                  </>
                ) : (
                  <>
                    المعاملات المفلترة:{" "}
                    <span className="font-medium text-gray-900">
                      {filteredTransactions.length}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 text-right">
              {t("profile.myWallet.transactions")}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.transactionName")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.transactionDate")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.referenceNumber")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.transactionAmount")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.transactionStatus")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.operationName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          {transaction.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          {transaction.referenceNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div
                          className={`text-sm font-medium ${
                            transaction.amount < 0
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {formatCurrency(transaction.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                            statusConfig[transaction.status].className
                          }`}
                        >
                          {statusConfig[transaction.status].label}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <span className="ml-2">جاري التحميل...</span>
                          </div>
                        ) : transactions.length === 0 ? (
                          <div>
                            <p className="text-lg font-medium mb-2">
                              {invoicesData &&
                              (invoicesData.availableBalance !== undefined ||
                                invoicesData.totalRevenue !== undefined)
                                ? "ملخص الرصيد متاح"
                                : "لا توجد معاملات"}
                            </p>
                            <p className="text-sm">
                              {invoicesData &&
                              (invoicesData.availableBalance !== undefined ||
                                invoicesData.totalRevenue !== undefined)
                                ? "تم تحميل معلومات الرصيد بنجاح. تفاصيل المعاملات الفردية غير متوفرة حالياً."
                                : "لم يتم العثور على أي معاملات في الوقت الحالي"}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-lg font-medium mb-2">
                              لا توجد نتائج
                            </p>
                            <p className="text-sm">
                              يرجى تعديل الفلاتر للحصول على نتائج
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
